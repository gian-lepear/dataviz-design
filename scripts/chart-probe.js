// Render-time audit for charts and data surfaces. Runs in the page, returns a digest.
// Paste into javascript_tool, or serve it next to the page and call:
//   await import('http://127.0.0.1:PORT/chart-probe.js'); chartProbe()
// Options: chartProbe({ root: '#dashboard', width: 390, maxSamples: 8 })
// Full report stays in globalThis.__chartReport; the return value is a digest that fits
// the tool channel (~1 KB). Drill with __chartReport.findings[N].samples.

(() => {
  const CTX = (() => {
    const c = document.createElement('canvas');
    c.width = c.height = 1;
    return c.getContext('2d', { willReadFrequently: true });
  })();

  // Resolve any CSS colour (hex, rgb, oklch, computed currentColor) to [r,g,b,a].
  function rgba(str) {
    if (!str) return null;
    const s = String(str).trim();
    if (!s || s === 'none' || s === 'transparent') return null;
    CTX.fillStyle = '#000000';
    CTX.fillStyle = s;
    CTX.clearRect(0, 0, 1, 1);
    CTX.fillRect(0, 0, 1, 1);
    const d = CTX.getImageData(0, 0, 1, 1).data;
    return [d[0], d[1], d[2], d[3] / 255];
  }

  const lum = ([r, g, b]) => {
    const f = (v) => (v /= 255) <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const contrast = (a, b) => {
    const l1 = lum(a), l2 = lum(b);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  };
  const over = (fg, bg) => [0, 1, 2].map((i) => Math.round(fg[i] * fg[3] + bg[i] * (1 - fg[3])));
  const hex = ([r, g, b]) => '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('');

  const path = (el) => {
    const parts = [];
    for (let n = el; n && n.nodeType === 1 && parts.length < 4; n = n.parentElement) {
      parts.unshift(n.tagName.toLowerCase() + (n.id ? '#' + n.id : '') +
        (n.classList && n.classList.length ? '.' + [...n.classList].slice(0, 2).join('.') : ''));
    }
    return parts.join(' > ');
  };

  function scan(W, opts) {
    const D = W.document;
    const cs = (el) => W.getComputedStyle(el);
    const max = opts.maxSamples || 8;
    const root = opts.root ? D.querySelector(opts.root) : D.body;
    if (!root) return { error: 'root not found: ' + opts.root };

    const visible = (el) => {
      const r = el.getBoundingClientRect();
      if (r.width < 1 || r.height < 1) return false;
      const s = cs(el);
      return s.visibility !== 'hidden' && s.display !== 'none' && s.opacity !== '0';
    };

    // Composite every ancestor background down to an opaque colour.
    const bgOf = (el) => {
      const chain = [];
      for (let n = el; n && n.nodeType === 1; n = n.parentElement || (n.parentNode && n.parentNode.host)) chain.push(n);
      let bg = [255, 255, 255];
      for (let i = chain.length - 1; i >= 0; i--) {
        const c = rgba(cs(chain[i]).backgroundColor);
        if (c && c[3] > 0) bg = over(c, bg);
      }
      return bg;
    };

    const findings = [];
    const add = (check, severity, detail, samples) =>
      findings.push({ check, severity, detail, ...(samples && samples.length ? { samples: samples.slice(0, max) } : {}) });

    const svgs = [...root.querySelectorAll('svg')].filter(visible);
    const canvases = [...root.querySelectorAll('canvas')].filter(visible);
    const de = D.documentElement;

    // 1. Horizontal page scroll is a bug; a scroll container of its own is not.
    if (de.scrollWidth > de.clientWidth + 1) {
      const wide = [...root.querySelectorAll('*')].filter((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.right > de.clientWidth + 1 && cs(el).position !== 'fixed';
      });
      add('page-overflow-x', 'error',
        `page scrolls horizontally (${de.scrollWidth}px content in ${de.clientWidth}px viewport)`,
        wide.map((el) => path(el) + ` right=${Math.round(el.getBoundingClientRect().right)}`));
    }

    // 2. Text clipped by its own box, or spilling out of the chart viewport.
    const clipped = [];
    for (const el of root.querySelectorAll('*')) {
      if (el.children.length || !el.textContent.trim() || !visible(el)) continue;
      if (el.scrollWidth > el.clientWidth + 1 && el.clientWidth > 0) {
        clipped.push(path(el) + ` "${el.textContent.trim().slice(0, 30)}" ${el.clientWidth}<${el.scrollWidth}px`);
      }
    }
    for (const svg of svgs) {
      const sr = svg.getBoundingClientRect();
      for (const t of svg.querySelectorAll('text')) {
        if (!t.textContent.trim() || !visible(t)) continue;
        const r = t.getBoundingClientRect();
        if (r.left < sr.left - 1 || r.right > sr.right + 1 || r.top < sr.top - 1 || r.bottom > sr.bottom + 1) {
          clipped.push(path(t) + ` "${t.textContent.trim().slice(0, 30)}" spills the svg box`);
        }
      }
    }
    if (clipped.length) add('text-clipped', 'error', `${clipped.length} label(s) cut off`, clipped);

    // 3. Tick labels colliding: group svg <text> into rows, check neighbours.
    const collisions = [];
    for (const svg of svgs) {
      const texts = [...svg.querySelectorAll('text')].filter((t) => t.textContent.trim() && visible(t))
        .map((t) => ({ t, r: t.getBoundingClientRect() }));
      const rows = [];
      for (const item of texts) {
        const cy = item.r.top + item.r.height / 2;
        const row = rows.find((x) => Math.abs(x.cy - cy) <= 6);
        if (row) row.items.push(item); else rows.push({ cy, items: [item] });
      }
      for (const row of rows) {
        if (row.items.length < 2) continue;
        row.items.sort((a, b) => a.r.left - b.r.left);
        for (let i = 1; i < row.items.length; i++) {
          const prev = row.items[i - 1].r, cur = row.items[i].r;
          if (prev.right > cur.left + 1) {
            collisions.push(`"${row.items[i - 1].t.textContent.trim()}" over "${row.items[i].t.textContent.trim()}" in ${path(svg)}`);
          }
        }
      }
    }
    if (collisions.length) add('tick-collision', 'error', `${collisions.length} overlapping label pair(s)`, collisions);

    // 4. WCAG contrast: 4.5:1 for text, 3:1 for data marks.
    const lowText = [], lowMark = [];
    for (const svg of svgs) {
      const bg = bgOf(svg);
      for (const t of svg.querySelectorAll('text')) {
        if (!t.textContent.trim() || !visible(t)) continue;
        const st = cs(t);
        const fg = rgba(st.fill) || rgba(st.color);
        if (!fg || fg[3] === 0) continue;
        const floor = (parseFloat(st.fontSize) || 12) >= 24 ? 3 : 4.5;
        const c = contrast(over(fg, bg), bg);
        if (c < floor) lowText.push(`"${t.textContent.trim().slice(0, 24)}" ${hex(over(fg, bg))} on ${hex(bg)} = ${c.toFixed(2)}:1 (needs ${floor})`);
      }
      for (const m of svg.querySelectorAll('rect,path,circle,line,polyline,polygon,ellipse')) {
        if (!visible(m)) continue;
        const st = cs(m);
        const fill = rgba(st.fill), stroke = rgba(st.stroke);
        const paint = fill && fill[3] > 0 ? fill
          : (stroke && stroke[3] > 0 && (parseFloat(st.strokeWidth) || 0) >= 1 ? stroke : null);
        if (!paint) continue;
        const c = contrast(over(paint, bg), bg);
        if (c < 3) lowMark.push(`${path(m)} ${hex(over(paint, bg))} on ${hex(bg)} = ${c.toFixed(2)}:1`);
      }
    }
    if (lowText.length) add('contrast-text', 'error', `${lowText.length} text node(s) below WCAG 1.4.3`, lowText);
    if (lowMark.length) add('contrast-mark', 'warn', `${lowMark.length} mark(s) below 3:1 (WCAG 1.4.11; exempt if directly labelled or a decorative gridline)`, lowMark);

    // 5. Series told apart by hue alone.
    for (const svg of svgs) {
      const lines = [...svg.querySelectorAll('path,polyline')].filter((el) => {
        const st = cs(el);
        const s = rgba(st.stroke), f = rgba(st.fill);
        return s && s[3] > 0 && (!f || f[3] === 0) && visible(el);
      });
      const dashed = lines.filter((el) => (cs(el).strokeDasharray || 'none') !== 'none');
      const markers = svg.querySelectorAll('circle,use,marker').length;
      if (lines.length > 1 && dashed.length === 0 && markers === 0) {
        add('color-only-series', 'warn',
          `${lines.length} line series in ${path(svg)} share one dash pattern and carry no markers: colour may be the only channel (WCAG 1.4.1)`);
      }
    }

    // 6. Text equivalent for the chart.
    const mute = svgs.filter((svg) => !svg.querySelector('title,desc') &&
      !svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby') &&
      svg.getAttribute('aria-hidden') !== 'true');
    if (mute.length) add('no-text-equivalent', 'warn', `${mute.length} svg(s) with no <title>/<desc>/aria-label`, mute.map(path));

    // 7. Clickable surface: input for the dead-end rule (SKILL.md section 3), not a verdict.
    const marks = svgs.flatMap((svg) => [...svg.querySelectorAll('rect,path,circle,polygon')]).filter(visible);
    const clickable = marks.filter((el) => cs(el).cursor === 'pointer' ||
      el.hasAttribute('tabindex') || el.hasAttribute('role') || el.onclick);

    const meta = {
      url: W.location.href,
      viewport: `${W.innerWidth}x${W.innerHeight}`,
      theme: de.dataset.theme || de.getAttribute('data-theme') || '(none)',
      prefersDark: W.matchMedia('(prefers-color-scheme: dark)').matches,
      prefersReducedMotion: W.matchMedia('(prefers-reduced-motion: reduce)').matches,
      svgCount: svgs.length,
      canvasCount: canvases.length,
      markCount: marks.length,
      clickableMarks: clickable.length,
      scrollContainers: [...root.querySelectorAll('*')]
        .filter((el) => el.scrollWidth > el.clientWidth + 1 && /auto|scroll/.test(cs(el).overflowX))
        .map(path).slice(0, max),
    };

    if (canvases.length) {
      add('canvas-opaque-to-probe', 'info',
        `${canvases.length} <canvas> chart(s): marks, labels and contrast are pixels, so this probe cannot read them`);
    }

    // 8. The page ignores the reader's colour scheme.
    const pageBg = bgOf(D.body);
    if (meta.prefersDark !== (lum(pageBg) < 0.2) && meta.theme === '(none)') {
      add('scheme-ignored', 'warn',
        `reader asked for ${meta.prefersDark ? 'dark' : 'light'} and the page paints ${hex(pageBg)}, with no [data-theme] override in play`);
    }

    return { ok: !findings.some((f) => f.severity === 'error'), meta, findings };
  }

  function digest(report) {
    if (report.error) return 'ERROR ' + report.error;
    const sev = { error: 'ERR', warn: 'WARN', info: 'INFO' };
    const m = report.meta;
    return [
      `${report.ok ? 'PASS' : 'FAIL'} ${m.viewport} theme=${m.theme} prefers=${m.prefersDark ? 'dark' : 'light'}`,
      `svg=${m.svgCount} canvas=${m.canvasCount} marks=${m.markCount} clickable=${m.clickableMarks} scrollers=${m.scrollContainers.length}`,
      ...report.findings.map((f) => `${sev[f.severity]} ${f.check}: ${f.detail}`),
      report.findings.length ? 'drill one check: __chartReport.findings[N].samples' : 'no findings',
    ].join('\n');
  }

  // A narrow viewport measured in a same-origin iframe: resize_window is unreliable when the
  // browser window is maximized, and it returns success anyway.
  async function probeAtWidth(opts) {
    const f = document.createElement('iframe');
    f.style.cssText = `position:fixed;left:0;top:0;z-index:2147483647;border:0;width:${opts.width}px;height:${opts.height || 844}px`;
    f.src = opts.url || location.href;
    document.body.appendChild(f);
    try {
      await new Promise((res, rej) => {
        f.addEventListener('load', res, { once: true });
        setTimeout(() => rej(new Error('iframe load timed out')), 15000);
      });
      // setTimeout, never requestAnimationFrame: a tab that is not the foreground tab never
      // paints, so rAF simply does not fire and the probe hangs until the tool times out.
      await new Promise((r) => setTimeout(r, 150));
      globalThis.__chartReport = scan(f.contentWindow, opts);
      return digest(globalThis.__chartReport);
    } finally {
      f.remove();
    }
  }

  // The default path stays synchronous on purpose: the tool channel returns a pending promise
  // as {} instead of awaiting it, so only the {width} form may hand one back (await it).
  function chartProbe(opts = {}) {
    if (opts.width) return probeAtWidth(opts);
    globalThis.__chartReport = scan(window, opts);
    return digest(globalThis.__chartReport);
  }

  globalThis.chartProbe = chartProbe;
  return chartProbe();
})()

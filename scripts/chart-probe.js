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
    const tabelas = [...root.querySelectorAll('table')].filter(visible);
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
    // 4b. HTML text: the loop above only walks <text> inside <svg>, so a label, an axis tick or a
    // cell value written in HTML was never checked. Same rule, same floors.
    const lowHtml = [];
    for (const el of root.querySelectorAll('*')) {
      if (el.children.length || !el.textContent.trim() || !visible(el)) continue;
      const st = cs(el);
      const fg = rgba(st.color);
      if (!fg || fg[3] === 0) continue;
      const bg = bgOf(el);
      const grande = (parseFloat(st.fontSize) || 16) >= 24 ||
        ((parseFloat(st.fontSize) || 16) >= 18.66 && (parseInt(st.fontWeight) || 400) >= 700);
      const floor = grande ? 3 : 4.5;
      const c = contrast(over(fg, bg), bg);
      if (c < floor) lowHtml.push(path(el) + ' "' + el.textContent.trim().slice(0, 20) + '" = ' + c.toFixed(2) + ':1 (needs ' + floor + ')');
    }
    if (lowHtml.length) add('contrast-text-html', 'error', `${lowHtml.length} HTML text node(s) below WCAG 1.4.3`, lowHtml);

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

    // 6b. Marks drawn in HTML/CSS (div bars, dot grids, heat-map cells). Without this the probe
    // reports markCount 0 on a chart made of elements and passes it clean by never looking.
    const htmlGroups = (() => {
      const cand = [];
      for (const el of root.querySelectorAll('div,span,i,td,li,b')) {
        if (!visible(el)) continue;
        const r = el.getBoundingClientRect();
        if (r.width > 600 || r.height > 120) continue;          // panels are not marks
        const st0 = cs(el);
        const paint = rgba(st0.backgroundColor);
        const contorno = (parseFloat(st0.borderTopWidth) || 0) >= 1 ? rgba(st0.borderTopColor) : null;
        if ((!paint || paint[3] === 0) && (!contorno || contorno[3] === 0)) continue;
        const parentBg = el.parentElement ? bgOf(el.parentElement) : [255, 255, 255];
        const tinta = paint && paint[3] > 0 ? paint : contorno;
        if (contrast(over(tinta, parentBg), parentBg) < 1.06) continue;   // same colour as its ground
        const txt = el.textContent.trim();
        if (txt.length > 12) continue;                          // a labelled block, not a mark
        cand.push(el);
      }
      const by = new Map();
      for (const el of cand) {
        const key = path(el.parentElement || el) + '|' + el.tagName + '.' + [...el.classList].slice(0, 1).join('');
        (by.get(key) || by.set(key, []).get(key)).push(el);
      }
      return [...by.entries()].filter(([, g]) => g.length >= 3).map(([key, g]) => ({ key, els: g }));
    })();
    const htmlMarks = htmlGroups.flatMap((g) => g.els);

    if (htmlMarks.length) {
      const low = [];
      for (const m of htmlMarks) {
        const st = cs(m);
        const bg = m.parentElement ? bgOf(m.parentElement) : [255, 255, 255];
        // A CSS mark can carry its contrast in the fill OR in a visible border; take the stronger.
        const canais = [rgba(st.backgroundColor)];
        if ((parseFloat(st.borderTopWidth) || 0) >= 1) canais.push(rgba(st.borderTopColor));
        if ((parseFloat(st.outlineWidth) || 0) >= 1) canais.push(rgba(st.outlineColor));
        if (st.boxShadow && st.boxShadow !== 'none') {
          const cor = st.boxShadow.match(/rgba?\([^)]+\)|#[0-9a-f]{3,8}/i);
          if (cor) canais.push(rgba(cor[0]));
        }
        const cs_ = canais.filter((p) => p && p[3] > 0).map((p) => contrast(over(p, bg), bg));
        if (!cs_.length) continue;
        const c = Math.max(...cs_);
        if (c < 3) {
          const paint = rgba(st.backgroundColor) || [0, 0, 0];
          low.push(path(m) + ' ' + hex(over(paint, bg)) + ' on ' + hex(bg) + ' = ' + c.toFixed(2) + ':1 (fill+border)');
        }
      }
      if (low.length) add('contrast-mark-html', 'warn',
        `${low.length} HTML/CSS mark(s) below 3:1 against their own ground (WCAG 1.4.11; exempt if directly labelled)`, low);

      const semTexto = htmlGroups.filter((g) => {
        if (g.els[0].closest('figure,table,[role],[aria-label],[aria-labelledby]')) return false;
        // Exempt: every mark sits beside its own label (a legend), so the meaning is already in text.
        const rotulado = g.els.every((el) => {
          const p = el.parentElement;
          return p && p.textContent.trim().length > 1;
        });
        return !rotulado;
      });
      if (semTexto.length) add('no-text-equivalent-html', 'warn',
        `${semTexto.length} HTML/CSS chart group(s) with no figure/table/role/aria-label wrapper: nothing for a screen reader to read`,
        semTexto.map((g) => g.key + ' x' + g.els.length));

      // 6c. SKILL.md section 15: length IS the encoding. A min-width/min-height floor clamps short
      // bars to a fixed size, so two different values draw the same length. Only visible at the
      // width where the floor starts binding, which is why this is a render-time check.
      const pisadas = [];
      for (const g of htmlGroups) {
        for (const el of g.els) {
          const st = cs(el);
          const r = el.getBoundingClientRect();
          const minW = parseFloat(st.minWidth) || 0;
          const minH = parseFloat(st.minHeight) || 0;
          if (minW > 0 && Math.abs(r.width - minW) < 1.5 && /%|px/.test(st.width))
            pisadas.push(path(el) + ' width ' + Math.round(r.width) + 'px = min-width');
          else if (minH > 0 && Math.abs(r.height - minH) < 1.5 && /%|px/.test(st.height))
            pisadas.push(path(el) + ' height ' + Math.round(r.height) + 'px = min-height');
        }
      }
      if (pisadas.length) add('mark-size-floored', 'error',
        `${pisadas.length} mark(s) rendered at their min-width/min-height: the floor is clamping the ` +
        `encoding, so different values draw the same length (SKILL.md section 15, lie factor)`, pisadas);

      if (!svgs.length && !canvases.length) add('html-chart-only', 'info',
        `chart drawn in HTML/CSS (${htmlGroups.length} group(s), ${htmlMarks.length} marks): the svg-only checks ` +
        `(tick-collision, color-only-series, svg text contrast) did not run; verify axis labels and series separation by eye`);
    }

    // 7. Clickable surface: input for the dead-end rule (SKILL.md section 3), not a verdict.
    const marks = svgs.flatMap((svg) => [...svg.querySelectorAll('rect,path,circle,polygon')]).filter(visible);
    const clickable = [...marks, ...htmlMarks].filter((el) => cs(el).cursor === 'pointer' ||
      el.hasAttribute('tabindex') || el.hasAttribute('role') || el.onclick);

    const meta = {
      url: W.location.href,
      viewport: `${W.innerWidth}x${W.innerHeight}`,
      theme: de.dataset.theme || de.getAttribute('data-theme') || '(none)',
      prefersDark: W.matchMedia('(prefers-color-scheme: dark)').matches,
      prefersReducedMotion: W.matchMedia('(prefers-reduced-motion: reduce)').matches,
      svgCount: svgs.length,
      canvasCount: canvases.length,
      markCount: marks.length + htmlMarks.length,
      htmlMarkGroups: htmlGroups.length,
      clickableMarks: clickable.length,
      tableCount: tabelas.length,
      scrollContainers: [...root.querySelectorAll('*')]
        .filter((el) => el.scrollWidth > el.clientWidth + 1 && /auto|scroll/.test(cs(el).overflowX))
        .map(path).slice(0, max),
    };

    // 9. Tables (references/tables.md). The probe was chart-only, so a data table on the same
    // surface went unreviewed. These are the rules that a rendered DOM can decide.
    const alinhaMal = [], semTabular = [], decimalMisto = [], regrasVerticais = [], linhaBaixa = [];
    for (const t of tabelas) {
      const todas = [...t.querySelectorAll('tbody tr')].filter(visible);
      if (!todas.length) continue;
      // Column count comes from the header, or from the widest row: a group-header row with a
      // colspan would otherwise report one column and silently skip every check below.
      const nCols = t.querySelector('thead tr')
        ? t.querySelector('thead tr').cells.length
        : Math.max(...todas.map((r) => r.cells.length));
      const corpo = todas.filter((r) => r.cells.length === nCols).slice(0, 40);
      if (corpo.length < 3) continue;
      for (let c = 0; c < nCols; c++) {
        const celulas = corpo.map((r) => r.cells[c]).filter(Boolean);
        const textos = celulas.map((x) => x.textContent.trim()).filter(Boolean);
        if (textos.length < 3) continue;
        const numericos = textos.filter((x) => /^[+\-\u2212(]?[\d.,]+\)?(\s*[%a-z$]{0,4})?$/i.test(x));
        if (numericos.length / textos.length < 0.7) continue;      // not a numeric column

        // A grid of one/two-digit marks with a fill is a heat map, not a column of magnitudes:
        // tables.md's alignment rule is about comparing orders of magnitude (Few 2004).
        const curto = numericos.every((x) => x.replace(/\D/g, '').length <= 2);
        const pintada = celulas.some((x) => { const p = rgba(cs(x).backgroundColor); return p && p[3] > 0; });
        const heatmap = curto && pintada;

        const st = cs(celulas[0]);
        const alinha = st.textAlign === 'start' ? (st.direction === 'rtl' ? 'right' : 'left') : st.textAlign;
        if (!heatmap && alinha !== 'right')
          alinhaMal.push(path(celulas[0]) + ' column ' + (c + 1) + ' is numeric and aligned ' + alinha +
            ' (tables.md: right-align numbers, never centre them)');
        if (!heatmap && !/tabular-nums/.test(st.fontVariantNumeric))
          semTabular.push(path(celulas[0]) + ' column ' + (c + 1) + ' numeric without tabular-nums');
        const casas = new Set(numericos.map((x) => (x.split(/[.,]/)[1] || '').replace(/\D/g, '').length));
        if (casas.size > 1)
          decimalMisto.push(path(celulas[0]) + ' column ' + (c + 1) + ' mixes ' + [...casas].join('/') + ' decimal places');
      }
      const primeira = corpo[0].cells[0];
      if (primeira) {
        const stc = cs(primeira);
        const alt = primeira.getBoundingClientRect().height;
        const fonte = parseFloat(stc.fontSize) || 13;
        if (alt < fonte * 1.6) linhaBaixa.push(path(primeira) + ' row ' + Math.round(alt) + 'px for ' + Math.round(fonte) + 'px text');
        if ((parseFloat(stc.borderLeftWidth) || 0) >= 1 || (parseFloat(stc.borderRightWidth) || 0) >= 1)
          regrasVerticais.push(path(t) + ' has vertical rules between columns');
      }
    }
    if (alinhaMal.length) add('table-numeric-align', 'error',
      `${alinhaMal.length} numeric column(s) not right-aligned (tables.md, Few 2004; Wilke 2019)`, alinhaMal);
    if (semTabular.length) add('table-tabular-nums', 'warn',
      `${semTabular.length} numeric column(s) without lining tabular figures (tables.md, Rutter 2017)`, semTabular);
    if (decimalMisto.length) add('table-decimal-mixed', 'warn',
      `${decimalMisto.length} column(s) mixing decimal precision (tables.md, Wilke 2019)`, decimalMisto);
    if (regrasVerticais.length) add('table-vertical-rules', 'warn',
      `${regrasVerticais.length} table(s) with vertical rules: alignment already separates columns (tables.md, Wilke 2019)`, regrasVerticais);
    if (linhaBaixa.length) add('table-row-height', 'warn',
      `${linhaBaixa.length} table(s) with rows under 1.6x the text size: adjacent rows fuse (tables.md, Few 2004)`, linhaBaixa);

    // 10. SKILL.md section 6: a number with no baseline is noise. A hero number is judged with the
    // whole tile, and with its sibling group: a trio of today/after/difference IS the comparison,
    // even though no single tile carries a delta.
    const semBase = [];
    for (const el of root.querySelectorAll('*')) {
      if (el.children.length || !visible(el)) continue;
      const txt = el.textContent.trim();
      if (!/\d/.test(txt) || txt.length > 18) continue;
      if ((parseFloat(cs(el).fontSize) || 0) < 24) continue;        // not a hero number
      const tile = el.closest('div,section,li,td,article') || el;
      // Context is the tile itself, plus only the siblings that share its shape (a KPI row):
      // widening to the whole parent lets an unrelated table next door count as the baseline.
      const irmaos = tile.parentElement
        ? [...tile.parentElement.children].filter((n) => n.tagName === tile.tagName &&
            n.className === tile.className)
        : [tile];
      const escopo = irmaos.length >= 2 ? irmaos : [tile];
      const contexto = escopo.map((n) => n.textContent).join(' ').replace(txt, ' ');
      const temNumero = (contexto.match(/\d[\d.,]*/g) || []).length >= 1;
      const temPalavra = /\bvs\b|versus|antes|depois|hoje|meta|alvo|target|de\s+\d|para\s+\d|[+\-\u2212]\s*\d|%/i.test(contexto);
      if (!temNumero && !temPalavra)
        semBase.push(path(el) + ' "' + txt.slice(0, 16) + '" has no baseline in its tile or group');
    }
    if (semBase.length) add('number-without-baseline', 'warn',
      `${semBase.length} hero number(s) with no baseline nearby: no previous period, target or benchmark ` +
      `(SKILL.md section 6). A number with no comparison is noise`, semBase);

    // 11. SKILL.md section 10: a number surface with no as-of date is not auditable. Looked up over
    // the whole root, because one stamp serves the page; the check only fires when there is none at all.
    const temNumeros = tabelas.length || htmlMarks.length || svgs.length;
    if (temNumeros) {
      const txtPagina = root.textContent;
      const meses = 'janeiro|fevereiro|mar\u00e7o|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro' +
        '|january|february|march|april|may|june|july|august|september|october|november|december';
      const temData = new RegExp('\\d{4}-\\d{2}-\\d{2}|\\d{1,2}/\\d{1,2}/\\d{2,4}|(' + meses + ')', 'i').test(txtPagina);
      if (!temData) add('no-as-of-date', 'warn',
        'no as-of date anywhere on the surface: a number with no reference date is neither trustworthy ' +
        'nor auditable (SKILL.md section 10)');
    }

    // A clean run is not a review. State the half this probe cannot decide, so "no findings"
    // is never mistaken for "the chart was reviewed" (SKILL.md sections 11-15).
    add('not-checked-here', 'info',
      'this probe answers the mechanical half only. Still open, and only decidable by judgement: ' +
      'section 11 form choice (does the chart type match the relationship in the data?), section 12 encoding ' +
      '(is the message on the most precise channel available?), section 14 message (is the title the ' +
      'conclusion, is the context grey?), section 4 consistency (does this chart use the same format as ' +
      'the others on the surface?). Read references/chart-choice.md before calling the chart done.');

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
      `svg=${m.svgCount} canvas=${m.canvasCount} marks=${m.markCount} htmlGroups=${m.htmlMarkGroups} clickable=${m.clickableMarks} scrollers=${m.scrollContainers.length}`,
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

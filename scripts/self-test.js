// await import('http://127.0.0.1:PORT/self-test.js'); await chartProbeSelfTest()

(() => {
  const CASOS = [
    {
      nome: 'bar clamped by min-width',
      espera: ['mark-size-floored'],
      html: `<div style="width:300px">
        <div style="height:20px"><div class="b" style="width:2%;min-width:40px;height:100%;background:#0a6"></div></div>
        <div style="height:20px"><div class="b" style="width:50%;min-width:40px;height:100%;background:#0a6"></div></div>
        <div style="height:20px"><div class="b" style="width:90%;min-width:40px;height:100%;background:#0a6"></div></div>
      </div>`,
    },
    {
      nome: 'bars sized above the floor',
      proibe: ['mark-size-floored'],
      html: `<div style="width:300px">
        <div style="height:20px"><div class="b" style="width:30%;min-width:10px;height:100%;background:#0a6"></div></div>
        <div style="height:20px"><div class="b" style="width:60%;min-width:10px;height:100%;background:#0a6"></div></div>
        <div style="height:20px"><div class="b" style="width:90%;min-width:10px;height:100%;background:#0a6"></div></div>
      </div>`,
    },
    {
      nome: 'numeric column centred',
      espera: ['table-numeric-align'],
      html: tabela('text-align:center', ['1.204', '3.918', '742', '5.001']),
    },
    {
      nome: 'numeric column right-aligned with tabular figures',
      proibe: ['table-numeric-align', 'table-tabular-nums'],
      html: tabela('text-align:right;font-variant-numeric:tabular-nums', ['1.204', '3.918', '742', '5.001']),
    },
    {
      nome: 'heat-map grid of one-digit codes stays centred',
      proibe: ['table-numeric-align'],
      html: tabela('text-align:center;background:#cfe4e1', ['9', '10', '0', '7']),
    },
    {
      nome: 'group-header row with colspan must not hide the columns',
      espera: ['table-numeric-align'],
      html: `<table><thead><tr><th>a</th><th>b</th></tr></thead><tbody>
        <tr><td colspan="2">a group header</td></tr>
        ${['1.204', '3.918', '742', '5.001'].map((v) => `<tr><td>x</td><td style="text-align:center">${v}</td></tr>`).join('')}
        </tbody></table><p>2026-09-10</p>`,
    },
    {
      nome: 'hero number with no baseline anywhere',
      espera: ['number-without-baseline'],
      html: `<p>2026-09-10</p><div class="t"><span style="font-size:40px">569</span><span>saved</span></div>`,
    },
    {
      nome: 'hero number with the baseline in its own tile',
      proibe: ['number-without-baseline'],
      html: `<p>2026-09-10</p><div class="t"><span style="font-size:40px">569</span><span>of 1730 paid today</span></div>`,
    },
    {
      nome: 'hero numbers compared across sibling tiles',
      proibe: ['number-without-baseline'],
      html: `<p>2026-09-10</p><div><div class="t"><span style="font-size:40px">569</span><span>saved</span></div>
        <div class="t"><span style="font-size:40px">1730</span><span>today</span></div></div>`,
    },
    {
      nome: 'surface of numbers with no as-of date',
      espera: ['no-as-of-date'],
      html: tabela('text-align:right', ['1.204', '3.918', '742', '5.001']).replace(/<p>[^<]*<\/p>/, ''),
    },
    {
      nome: 'mark whose contrast lives in the border, not the fill',
      proibe: ['contrast-mark-html'],
      html: `<p>2026-09-10</p><div style="background:#fff">${
        '<i style="display:inline-block;width:14px;height:14px;background:#f4f9f6;border:1px solid #1a6b4a"></i>'.repeat(4)}</div>`,
    },
    {
      nome: 'mark with weak fill and no border',
      espera: ['contrast-mark-html'],
      html: `<p>2026-09-10</p><div style="background:#fff">${
        '<i style="display:inline-block;width:14px;height:14px;background:#f4f9f6"></i>'.repeat(4)}</div>`,
    },
    {
      nome: 'legend swatches sit beside their own labels',
      proibe: ['no-text-equivalent-html'],
      html: `<p>2026-09-10</p><div style="background:#fff">${
        ['ok', 'warn', 'bad'].map((t) => `<span><i style="display:inline-block;width:14px;height:14px;background:#1a6b4a"></i> ${t}</span>`).join('')
      }</div>`,
    },
  ];

  function tabela(estiloCelula, valores) {
    const linhas = valores.map((v) => `<tr><td>row</td><td style="${estiloCelula}">${v}</td></tr>`).join('');
    return `<table><thead><tr><th>name</th><th>value</th></tr></thead><tbody>${linhas}</tbody></table><p>2026-09-10</p>`;
  }

  globalThis.chartProbeSelfTest = async function chartProbeSelfTest() {
    if (typeof globalThis.chartProbe !== 'function') {
      return { erro: 'load chart-probe.js first' };
    }
    const caixa = document.createElement('div');
    caixa.id = 'chartProbeFixture';
    caixa.style.cssText = 'position:fixed;left:-9999px;top:0;width:420px;background:#fff;color:#111';
    document.body.appendChild(caixa);

    const falhas = [];
    for (const caso of CASOS) {
      caixa.innerHTML = caso.html;
      await globalThis.chartProbe({ root: '#chartProbeFixture' });
      const vistos = new Set((globalThis.__chartReport.findings || []).map((f) => f.check));
      for (const c of caso.espera || []) {
        if (!vistos.has(c)) falhas.push(`${caso.nome}: expected ${c}, got [${[...vistos].join(', ')}]`);
      }
      for (const c of caso.proibe || []) {
        if (vistos.has(c)) falhas.push(`${caso.nome}: ${c} fired and should not have`);
      }
    }
    caixa.remove();

    const resumo = falhas.length
      ? `FAIL ${falhas.length}/${CASOS.length}`
      : `ok: ${CASOS.length} cases`;
    console.log(resumo);
    falhas.forEach((f) => console.error('  ' + f));
    return { resumo, falhas };
  };
})();

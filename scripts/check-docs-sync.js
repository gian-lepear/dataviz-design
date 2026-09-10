#!/usr/bin/env node
// node scripts/check-docs-sync.js — the probe's checks against the table in render-check.md

const { readFileSync } = require('node:fs');
const { join } = require('node:path');

const raiz = join(__dirname, '..');
const probe = readFileSync(join(raiz, 'scripts/chart-probe.js'), 'utf8');
const doc = readFileSync(join(raiz, 'references/render-check.md'), 'utf8');

const noCodigo = new Set([...probe.matchAll(/add\('([a-z0-9-]+)'/g)].map((m) => m[1]));
const noDoc = new Set([...doc.matchAll(/^\| `([a-z0-9-]+)`/gm)].map((m) => m[1]));

const faltaNoDoc = [...noCodigo].filter((c) => !noDoc.has(c)).sort();
const faltaNoCodigo = [...noDoc].filter((c) => !noCodigo.has(c)).sort();

if (!faltaNoDoc.length && !faltaNoCodigo.length) {
  console.log(`ok: ${noCodigo.size} checks, code and render-check.md agree`);
  process.exit(0);
}

if (faltaNoDoc.length) {
  console.error('emitted by the probe, missing from render-check.md:');
  for (const c of faltaNoDoc) console.error('  ' + c);
}
if (faltaNoCodigo.length) {
  console.error('documented in render-check.md, never emitted:');
  for (const c of faltaNoCodigo) console.error('  ' + c);
}
process.exit(1);

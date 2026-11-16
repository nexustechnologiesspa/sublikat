// qa/medir-contraste.mjs — Sublikat
// Mide los pares de contraste que pide el brief, con los valores de
// build/tokens.css (la fuente de verdad del color).
//
//   node qa/medir-contraste.mjs
//
// Salida: una línea por par con su ratio y si cumple el mínimo pedido.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.resolve(AQUI, '..');
const css = fs.readFileSync(path.join(RAIZ, 'build', 'tokens.css'), 'utf8');

// --- luminancia relativa (WCAG 2.1) -------------------------------------
function hex(c) {
  const s = c.trim().replace('#', '');
  const n = s.length === 3 ? s.split('').map((x) => x + x).join('') : s;
  return [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16));
}
function lum([r, g, b]) {
  const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}
function ratio(a, b) {
  const l1 = lum(hex(a)), l2 = lum(hex(b));
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

// --- tokens por tema ------------------------------------------------------
function tokensDe(bloque) {
  const m = bloque.match(/\{([\s\S]*?)\}/);
  const t = {};
  for (const linea of (m ? m[1] : '').split('\n')) {
    const d = linea.match(/^\s*(--[a-z0-9-]+)\s*:\s*(#[0-9a-fA-F]{6})\s*;/i);
    if (d) t[d[1]] = d[2].toLowerCase();
  }
  return t;
}
const claro = tokensDe(css.match(/\[data-theme="light"\][\s\S]*?\}/)?.[0] || '');
const oscuro = tokensDe(css.match(/\[data-theme="dark"\][\s\S]*?\}/)?.[0] || '');

const pares = [
  { tema: 'claro', par: 'Texto sobre fondo', a: '--ink', b: '--bg', min: 9 },
  { tema: 'claro', par: 'Texto sobre superficie', a: '--ink', b: '--surface', min: 9 },
  { tema: 'claro', par: 'Texto suave sobre fondo', a: '--muted', b: '--bg', min: 5.5 },
  { tema: 'claro', par: 'Blanco sobre violeta', a: '--on-accent', b: '--accent-fill', min: 7 },
  { tema: 'claro', par: 'Tinta sobre amarillo', a: '--awning-ink', b: '--awning', min: 7 },
  { tema: 'claro', par: 'Tinta sobre oliva', a: '--on-success', b: '--success', min: 4.5 },
  { tema: 'oscuro', par: 'Texto sobre fondo', a: '--ink', b: '--bg', min: 9 },
  { tema: 'oscuro', par: 'Texto sobre superficie', a: '--ink', b: '--surface', min: 9 },
  { tema: 'oscuro', par: 'Texto suave sobre superficie', a: '--muted', b: '--surface', min: 5.5 },
  { tema: 'oscuro', par: 'Lila sobre superficie', a: '--accent-ink', b: '--surface', min: 6 },
  { tema: 'oscuro', par: 'Tinta sobre amarillo', a: '--awning-ink', b: '--awning', min: 7 },
  { tema: 'oscuro', par: 'Tinta sobre oliva', a: '--on-success', b: '--success', min: 4.5 },
];

// Alternativas de la propia paleta, por si un par no llega al minimo pedido.
const alternativas = [
  { par: 'Blanco sobre violeta profundo', a: '#ffffff', b: '#3f21d6', min: 7 },
  { par: 'Tinta oscura sobre oliva', a: '#2b2933', b: '#b5a94e', min: 4.5 },
  { par: 'Tinta de marca sobre oliva', a: '#413f4b', b: '#b5a94e', min: 4.5 },
];

let fallos = 0;
console.log('tema   par                        ratio  minimo  estado');
console.log('------ --------------------------- ------ ------- ------');
for (const p of pares) {
  const t = p.tema === 'claro' ? claro : oscuro;
  if (!t[p.a] || !t[p.b]) {
    console.log(`${p.tema.padEnd(6)} ${p.par.padEnd(27)} ${'(falta token)'.padStart(6)}`);
    fallos++;
    continue;
  }
  const r = ratio(t[p.a], t[p.b]);
  const ok = r >= p.min;
  if (!ok) fallos++;
  console.log(`${p.tema.padEnd(6)} ${p.par.padEnd(27)} ${r.toFixed(2).padStart(6)} ${String(p.min).padStart(7)}  ${ok ? 'PASA' : 'FALLA'}`);
}
console.log('');
console.log(fallos === 0 ? 'Todos los pares cumplen el minimo pedido.' : `${fallos} par(es) por debajo del minimo.`);
process.exit(fallos === 0 ? 0 : 1);

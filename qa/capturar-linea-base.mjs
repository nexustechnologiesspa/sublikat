// qa/capturar-linea-base.mjs — Sublikat
// Regenera la línea base visual del catálogo y la portada.
//
// Requisitos:
//   · Node 18+ y un Chrome o Edge instalado en el sistema.
//   · playwright-core (no descarga navegadores):
//       npm i playwright-core
//     o define PLAYWRIGHT_MODULE con la ruta al módulo.
//   · Si el proyecto tiene node_modules, se usa ese; si no, define
//     PLAYWRIGHT_MODULE apuntando a la instalación global.
//
// Uso:
//   node qa/capturar-linea-base.mjs [carpeta-de-salida] [pagina-a-capturar]
//   (por defecto: qa/baseline/capturas e index.html)
//
// La salida es determinista: mismas condiciones → mismos nombres de archivo,
// de modo que comparar dos carpetas de capturas indique una regresión. Para que
// las capturas de sección no dependan del estado de scroll, se anulan el
// desplazamiento suave y la cabecera fija de pestañas solo durante la captura.

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.resolve(AQUI, '..');
const SALIDA = path.resolve(process.argv[2] || path.join(AQUI, 'baseline', 'capturas'));
const PAGINA = process.argv[3] || 'index.html';
const PUERTO = Number(process.env.PUERTO || 8899);

const require_ = createRequire(import.meta.url);
const candidatos = [
  process.env.PLAYWRIGHT_MODULE,
  path.join(RAIZ, 'node_modules', 'playwright-core'),
  'playwright-core',
].filter(Boolean);
let chromium = null;
for (const base of candidatos) {
  try { ({ chromium } = require_(base)); break; } catch (e) { /* siguiente candidato */ }
}
if (!chromium) {
  console.error('Falta playwright-core. Instálalo con "npm i playwright-core" o define PLAYWRIGHT_MODULE.');
  process.exit(2);
}

const NAVEGADORES = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
].filter(Boolean);

const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml',
  '.json': 'application/json', '.webp': 'image/webp', '.woff2': 'font/woff2',
};

// Servidor estático: la página usa localStorage y Tailwind por CDN, así que
// se sirve por http:// en lugar de file:// para que el tema sea determinista.
const servidor = http.createServer((req, res) => {
  let ruta = decodeURIComponent(req.url.split('?')[0]);
  if (ruta.endsWith('/')) ruta += 'index.html';
  const archivo = path.join(RAIZ, ruta);
  if (!archivo.startsWith(path.resolve(RAIZ)) || !fs.existsSync(archivo) || fs.statSync(archivo).isDirectory()) {
    res.writeHead(404); res.end('no encontrado'); return;
  }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(archivo).toLowerCase()] || 'application/octet-stream' });
  fs.createReadStream(archivo).pipe(res);
});

const ANCHOS = [
  { nombre: '375', w: 375, h: 812 },
  { nombre: '768', w: 768, h: 1024 },
  { nombre: '1280', w: 1280, h: 900 },
];
const TEMAS = ['light', 'dark'];
const PESTANAS = ['regalos', 'cuadros', 'textiles', 'papeleria', 'identificacion'];
const registro = [];

async function abrirPagina(contexto, url, tema) {
  const pagina = await contexto.newPage();
  await pagina.addInitScript((t) => {
    try { localStorage.setItem('sublikat-tema', t); } catch (e) {}
  }, tema);
  await pagina.goto(url, { waitUntil: 'load', timeout: 60000 });
  await pagina.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
  await pagina.evaluate(() => document.fonts && document.fonts.ready).catch(() => {});
  await pagina.waitForTimeout(700);
  return pagina;
}

// Las capturas de sección no deben depender del scroll: se anulan el scroll
// suave, la cabecera y la barra de pestañas fijas y se oculta el botón flotante,
// cuya posición y estado compacto dependen de la altura de scroll.
async function fijarParaSeccion(pagina) {
  await pagina.addStyleTag({
    content: [
      'html{scroll-behavior:auto !important}',
      '[role="tablist"]{position:static !important}',
      '#site-header{position:static !important}',
      '.od-was{display:none !important}',
    ].join(''),
  });
  await pagina.waitForTimeout(250);
}

servidor.listen(PUERTO, '127.0.0.1', async () => {
  fs.mkdirSync(SALIDA, { recursive: true });
  const url = `http://127.0.0.1:${PUERTO}/${PAGINA}`;
  let navegador = null;
  for (const ejecutable of NAVEGADORES) {
    try { navegador = await chromium.launch({ executablePath: ejecutable, headless: true }); break; }
    catch (e) { /* siguiente navegador */ }
  }
  if (!navegador) { console.error('No hay Chrome ni Edge disponible en el sistema.'); process.exit(3); }

  // 1) Página completa: cada ancho, en claro y en oscuro.
  for (const ancho of ANCHOS) {
    for (const tema of TEMAS) {
      const contexto = await navegador.newContext({
        viewport: { width: ancho.w, height: ancho.h },
        deviceScaleFactor: 1,
        colorScheme: tema,
        locale: 'es-CL',
        reducedMotion: 'reduce',
      });
      const pagina = await abrirPagina(contexto, url, tema);
      const nombre = `completa-${ancho.nombre}-${tema}.png`;
      await pagina.screenshot({ path: path.join(SALIDA, nombre), fullPage: true });
      registro.push({ archivo: nombre, tipo: 'pagina-completa', ancho: ancho.w, tema, pestana: 'inicial' });
      console.log('captura', nombre);
      await contexto.close();
    }
  }

  // 2) Sección del catálogo con cada pestaña activa (375 en claro, 1280 en claro y oscuro).
  for (const ancho of ANCHOS.filter((a) => a.nombre !== '768')) {
    for (const tema of TEMAS) {
      if (ancho.nombre === '375' && tema === 'dark') continue;
      for (const categoria of PESTANAS) {
        const contexto = await navegador.newContext({
          viewport: { width: ancho.w, height: ancho.h },
          deviceScaleFactor: 1,
          colorScheme: tema,
          locale: 'es-CL',
          reducedMotion: 'reduce',
        });
        const pagina = await abrirPagina(contexto, url, tema);
        await pagina.evaluate((c) => { window.location.hash = '#cat-' + c; }, categoria);
        await pagina.waitForTimeout(700);
        await fijarParaSeccion(pagina);
        const estado = await pagina.evaluate(() => ({
          paneles_visibles: Array.from(document.querySelectorAll('[role="tabpanel"]'))
            .filter((p) => !p.hasAttribute('hidden')).map((p) => p.id),
          pestana_activa: Array.from(document.querySelectorAll('[role="tab"][aria-selected="true"]'))
            .map((t) => t.getAttribute('data-categoria')),
        }));
        const nombre = `catalogo-${categoria}-${ancho.nombre}-${tema}.png`;
        await pagina.locator('#tienda').screenshot({ path: path.join(SALIDA, nombre) });
        registro.push({ archivo: nombre, tipo: 'seccion-catalogo', ancho: ancho.w, tema, pestana: categoria, ...estado });
        console.log('captura', nombre, JSON.stringify(estado));
        await contexto.close();
      }
    }
  }

  fs.writeFileSync(path.join(SALIDA, 'manifest.json'), JSON.stringify({
    generado: new Date().toISOString(),
    url,
    pagina: PAGINA,
    navegador: NAVEGADORES[0],
    nota: 'Línea base visual. Para detectar regresiones, repite la captura en otra carpeta y compara los PNG con el mismo nombre.',
    capturas: registro,
  }, null, 1), 'utf8');

  await navegador.close();
  servidor.close();
  console.log('OK ->', SALIDA);
  process.exit(0);
});

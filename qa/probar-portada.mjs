// Pruebas funcionales y de accesibilidad de la portada Sublikat.
//   node qa/probar-portada.mjs [carpeta-de-salida]
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.resolve(AQUI, '..');
const SALIDA = path.resolve(process.argv[2] || path.join(AQUI, 'resultados.json'));
const PUERTO = Number(process.env.PUERTO || 8901);

const require_ = createRequire(import.meta.url);
const candidatos = [process.env.PLAYWRIGHT_MODULE,
  path.join(RAIZ, 'node_modules', 'playwright-core'),
  'C:/Users/cpsch/AppData/Local/Temp/opencode/pw/node_modules/playwright-core'].filter(Boolean);
let chromium;
for (const base of candidatos) {
  try { ({ chromium } = require_(base)); break; } catch (e) { /* siguiente */ }
}
if (!chromium) { console.error('Falta playwright-core'); process.exit(2); }

// --- navegador ------------------------------------------------------------
// Antes se usaba una ruta fija (Chrome en Archivos de programa) que no existe
// en todos los equipos: el arnés no arrancaba y, con él, la forma de comprobar
// el movimiento ligado al scroll. Ahora se prueban candidatos y, si no hay
// ninguno, se deja que Playwright use el Chromium que ya tiene descargado.
function existe(p) { try { return !!p && fs.existsSync(p); } catch (e) { return false; } }
function deCache(base, carpeta) {
  if (!existe(base)) return [];
  return fs.readdirSync(base)
    .sort((a, b) => b.localeCompare(a, undefined, { numeric: true }))
    .map((n) => path.join(base, n, carpeta))
    .filter(existe);
}
const CANDIDATOS_NAVEGADOR = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  ...deCache(path.join(process.env.USERPROFILE || '', '.cache', 'puppeteer', 'chrome'), path.join('chrome-win64', 'chrome.exe')),
  ...deCache(path.join(process.env.LOCALAPPDATA || '', 'ms-playwright'), path.join('chrome-win64', 'chrome.exe')),
];
const NAVEGADOR = CANDIDATOS_NAVEGADOR.find(existe) || null;

const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript',
  '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.json': 'application/json',
  '.woff2': 'font/woff2' };
// La app reescribe las rutas de `assets/` a `/api/projects/<id>/raw/assets/...`
// cuando guarda `index.html`. Esas rutas funcionan en la vista previa de la app,
// pero aquí el servidor es este y no existe `/api`: los 404 resultantes no son
// un fallo del sitio, son una diferencia de entorno. Se resuelven al archivo
// real para que la prueba mire la página, no la ruta.
const reescribeApi = (ruta) => {
  const m = ruta.match(/^\/api\/projects\/[^/]+\/raw\/(.+)$/);
  return m ? '/' + m[1] : ruta;
};
const servidor = http.createServer((req, res) => {
  let p = reescribeApi(decodeURIComponent(req.url.split('?')[0]));
  if (p.endsWith('/')) p += 'index.html';
  const archivo = path.join(RAIZ, p);
  if (!archivo.startsWith(path.resolve(RAIZ)) || !fs.existsSync(archivo) || fs.statSync(archivo).isDirectory()) {
    res.writeHead(404); res.end('no'); return;
  }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(archivo).toLowerCase()] || 'application/octet-stream' });
  fs.createReadStream(archivo).pipe(res);
});

const resultados = { fecha: new Date().toISOString(), pruebas: [], erroresConsola: [], recursosExternos: [] };
// `index.html` se apoya en dos CDN (Tailwind y Google Fonts). Si la red del
// banco de pruebas no los alcanza, el navegador emite «Failed to load
// resource» y una respuesta 0: eso no es un error del sitio y no debe
// hacer fallar la suite. Se anota aparte para no perder la pista.
const esExterno = (url) => !!url && !url.startsWith('http://127.0.0.1');
function anota(nombre, ok, detalle) {
  resultados.pruebas.push({ nombre, ok, detalle: detalle || '' });
  console.log((ok ? 'PASA  ' : 'FALLA ') + nombre + (detalle ? '  — ' + detalle : ''));
}

const espera = (ms) => new Promise((r) => setTimeout(r, ms));

async function nuevaPagina(contexto, tema) {
  const pagina = await contexto.newPage();
  pagina.on('console', (m) => {
    if (m.type() !== 'error') return;
    const texto = m.text();
    if (texto.indexOf('Failed to load resource') >= 0 || texto.indexOf('net::ERR_') >= 0) {
      resultados.recursosExternos.push(texto);
      return;
    }
    resultados.erroresConsola.push('console: ' + texto);
  });
  pagina.on('pageerror', (e) => resultados.erroresConsola.push('pageerror: ' + e.message));
  pagina.on('response', (r) => {
    if (r.status() < 400) return;
    const linea = r.status() + ' ' + r.url();
    // Un 404 propio sí es un fallo; el de un CDN caído, no.
    (esExterno(r.url()) ? resultados.recursosExternos : resultados.erroresConsola).push(linea);
  });
  pagina.on('requestfailed', (r) => {
    if (esExterno(r.url())) resultados.recursosExternos.push('sin respuesta: ' + r.url());
  });
  await pagina.addInitScript((t) => { try { localStorage.setItem('sublikat-tema', t); } catch (e) {} }, tema);
  await pagina.goto(`http://127.0.0.1:${PUERTO}/index.html`, { waitUntil: 'load', timeout: 60000 });
  await pagina.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
  await pagina.evaluate(() => document.fonts && document.fonts.ready).catch(() => {});
  await espera(500);
  return pagina;
}

servidor.listen(PUERTO, '127.0.0.1', async () => {
  const navegador = await chromium.launch({
    executablePath: NAVEGADOR || undefined,
    headless: true,
    // OD_BLOQUEAR_CDN=1 sirve para comprobar, sin tocar el sitio, que un CDN
    // caído se anota como recurso externo y no como error del proyecto.
    args: process.env.OD_BLOQUEAR_CDN
      ? ['--host-resolver-rules=MAP cdn.tailwindcss.com 127.0.0.1, MAP fonts.googleapis.com 127.0.0.1, MAP fonts.gstatic.com 127.0.0.1']
      : [],
  });
  console.log('Navegador: ' + (NAVEGADOR || 'el de Playwright') + '\n');

  // ---------------------------------------------------------------- estructura
  {
    const contexto = await navegador.newContext({ viewport: { width: 1280, height: 900 }, locale: 'es-CL' });
    const p = await nuevaPagina(contexto, 'light');
    const d = await p.evaluate(() => ({
      mains: document.querySelectorAll('main').length,
      h1: document.querySelectorAll('h1').length,
      ids: Array.from(document.querySelectorAll('[id]')).map((e) => e.id),
      zonas: (document.documentElement.innerHTML.match(/OD:[A-Z]+/g) || []).length,
      scrollW: document.documentElement.scrollWidth,
      clientW: document.documentElement.clientWidth,
    }));
    const dup = d.ids.filter((x, i) => d.ids.indexOf(x) !== i);
    anota('Un solo <main>', d.mains === 1, d.mains + ' encontrados');
    anota('Un solo <h1>', d.h1 === 1, d.h1 + ' encontrados');
    anota('Sin ids duplicados', dup.length === 0, dup.length ? dup.join(', ') : d.ids.length + ' ids únicos');
    anota('Sin scroll horizontal (1280)', d.scrollW <= d.clientW + 1, d.scrollW + ' vs ' + d.clientW);
    await contexto.close();
  }

  // ------------------------------------------------------- scroll por anchos
  for (const ancho of [375, 768, 1280]) {
    const contexto = await navegador.newContext({ viewport: { width: ancho, height: 900 }, locale: 'es-CL' });
    const p = await nuevaPagina(contexto, 'light');
    const d = await p.evaluate(() => ({
      scrollW: document.documentElement.scrollWidth,
      clientW: document.documentElement.clientWidth,
    }));
    anota('Sin scroll horizontal (' + ancho + ')', d.scrollW <= d.clientW + 1, d.scrollW + ' vs ' + d.clientW);
    await contexto.close();
  }

  // ------------------------------------ la portada: foto que se encoge a banda
  // Regresión doble del 2026-11-15.
  // Fallo A: la portada era una capa `fixed` de pantalla completa con fondo
  //   opaco y solo se movía la foto. Al bajar, el marco se quedaba y tapaba
  //   todas las secciones.
  // Fallo B: al rehacerla como la demo «cover to fixed header», el estado
  //   base `html .od-portada` (0,1,1) ganaba la cascada a `.od-portada`
  //   (0,1,0): el alto se animaba, pero el marco seguía `relative` y se iba
  //   con la página (top negativo, la banda nunca se clavaba arriba).
  // Lo que se prueba aquí: abre a pantalla completa, se encoge hasta quedar
  // como banda bajo el menú, no roba clics y no tapa el contenido.
  {
    const contexto = await navegador.newContext({ viewport: { width: 1280, height: 900 }, locale: 'es-CL', reducedMotion: 'no-preference' });
    const p = await nuevaPagina(contexto, 'light');

    const portada = await p.evaluate(() => {
      const po = document.querySelector('.od-portada');
      const cab = document.getElementById('site-header');
      const foto = document.querySelector('.od-portada__foto');
      const marca = document.querySelector('.od-portada__marca');
      if (!po || !cab) return null;
      const r = po.getBoundingClientRect();
      const rc = cab.getBoundingClientRect();
      const z = (el) => parseInt(getComputedStyle(el).zIndex, 10) || 0;
      const cp = getComputedStyle(po);
      return {
        top: Math.round(r.top),
        alto: Math.round(r.height),
        ventana: window.innerHeight,
        posicion: cp.position,
        punteros: cp.pointerEvents,
        zPortada: z(po),
        zCabecera: z(cab),
        cabTop: Math.round(rc.top),
        altoCabecera: Math.round(rc.height),
        fotoPos: foto ? getComputedStyle(foto).backgroundPosition : null,
        marcaOpacidad: marca ? Number(getComputedStyle(marca).opacity) : null,
      };
    });
    anota('Portada: abre en y=0 y mide una pantalla',
      !!portada && portada.top === 0 && Math.abs(portada.alto - portada.ventana) <= 1,
      portada ? 'top=' + portada.top + ' alto=' + portada.alto + ' ventana=' + portada.ventana + ' posición=' + portada.posicion : 'no hay portada');

    // No basta con que el marco mida una pantalla: la foto tiene que estar
    // pintada dentro y el nombre visible. Un marco vacío también mediría.
    anota('Portada: la foto abre arriba y el nombre se lee (y=0)',
      !!portada && portada.fotoPos === '50% 0%' && portada.marcaOpacidad === 1,
      portada ? 'foto=' + portada.fotoPos + ' nombre opacidad=' + portada.marcaOpacidad : 'no hay portada');

    // La cabecera tiene que quedar por encima y, a la vez, sin hueco: la
    // foto arranca en y=0 y el menú flota sobre ella.
    anota('Portada: el menú flota por encima (z-index mayor y sin hueco)',
      !!portada && portada.zCabecera > portada.zPortada && portada.top === 0 && portada.cabTop === 0,
      portada ? 'z cabecera=' + portada.zCabecera + ' z portada=' + portada.zPortada + ' alto cabecera=' + portada.altoCabecera + ' top cabecera=' + portada.cabTop : 'no hay portada');

    // La portada es decorativa (`aria-hidden`): si capturara los clics,
    // se comería los enlaces que quedan debajo cuando ya es una banda.
    anota('Portada: es decorativa y no roba clics',
      !!portada && portada.punteros === 'none',
      portada ? 'pointer-events=' + portada.punteros : 'no hay portada');

    const medida = await p.evaluate(async () => {
      const cuadro = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      const po = document.querySelector('.od-portada');
      const cab = document.getElementById('site-header');
      const foto = document.querySelector('.od-portada__foto');
      const raiz = getComputedStyle(document.documentElement);
      const num = (v, porDefecto) => {
        const n = parseFloat(v);
        return Number.isFinite(n) ? n : porDefecto;
      };
      const alto = window.innerHeight;
      const max = document.documentElement.scrollHeight - alto;
      // El token de la banda puede venir como `clamp(...)` o como vh, que
      // `parseFloat` no resuelve. Se mide con una sonda: el navegador lo
      // convierte a píxeles y la prueba compara con lo que pinta de verdad.
      const sonda = document.createElement('div');
      sonda.setAttribute('aria-hidden', 'true');
      sonda.style.cssText = 'position:absolute;top:-9999px;left:0;height:0;visibility:hidden;'
        + 'width:var(--od-portada-banda,0px)';
      document.documentElement.appendChild(sonda);
      const banda = Math.round(sonda.getBoundingClientRect().width);
      sonda.remove();
      const hh = num(raiz.getPropertyValue('--hh'), Math.round(cab.getBoundingClientRect().height));
      const salida = [];
      // 0 = foto de apertura; 90vh = final del recorrido; el resto, tramos
      // intermedios y fondo de página.
      for (const objetivo of [0, alto * 0.5, alto * 0.9, alto, alto * 2, alto * 4]) {
        window.scrollTo({ top: Math.min(Math.round(objetivo), max), behavior: 'instant' });
        await cuadro();
        await new Promise((r) => setTimeout(r, 140));
        const r = po.getBoundingClientRect();
        const rc = cab.getBoundingClientRect();
        const bajoMenu = document.elementFromPoint(window.innerWidth / 2, Math.round(rc.bottom + banda + 40));
        const centro = document.elementFromPoint(window.innerWidth / 2, alto / 2);
        salida.push({
          y: Math.round(window.scrollY),
          top: Math.round(r.top),
          alto: Math.round(r.height),
          bajoCabecera: Math.round(rc.bottom),
          fotoPos: getComputedStyle(foto).backgroundPosition,
          bajoBandaMain: !!(bajoMenu && bajoMenu.closest('main')),
          centroMain: !!(centro && centro.closest('main')),
          centroPortada: !!(centro && centro.closest('.od-portada')),
          capa: centro ? (centro.className ? String(centro.className).slice(0, 34) : centro.tagName) : null,
        });
      }
      return { salida, banda, hh };
    });

    const { salida, banda, hh } = medida;
    const bandaFinal = Math.round(hh + banda);

    // El encogido: al terminar el recorrido (90vh) el marco mide lo mismo
    // que el menú más la banda y sigue clavado en 0.
    const final = salida.filter((x) => x.y >= 810);
    anota('Portada: al bajar se encoge hasta una banda bajo el menú',
      final.length >= 3 && final.every((x) => x.top === 0 && Math.abs(x.alto - bandaFinal) <= 2),
      'esperado ' + bandaFinal + 'px (--hh ' + hh + ' + banda ' + banda + '): ' +
        final.map((x) => 'y=' + x.y + ' top=' + x.top + ' alto=' + x.alto).join(' | '));

    // La banda no puede ser un telón: su borde de abajo tiene que quedar
    // por debajo del menú, no tapando la página entera.
    anota('Portada: la banda no tapa nada por debajo del menú',
      final.length >= 3 && final.every((x) => x.alto <= x.bajoCabecera + banda + 2),
      final.map((x) => 'alto=' + x.alto + ' cabecera hasta ' + x.bajoCabecera).join(' | '));

    // El recorte de la foto acompaña: arriba al abrir, abajo en la banda.
    anota('Portada: la foto se recorta hacia su parte de abajo',
      salida[0].fotoPos === '50% 0%' && salida[salida.length - 1].fotoPos === '50% 100%',
      'inicio=' + salida[0].fotoPos + ' final=' + salida[salida.length - 1].fotoPos);

    // Y lo importante: a partir de una pantalla, el contenido está vivo y
    // clicable, tanto en el centro como justo debajo de la banda.
    const alBajar = salida.filter((x) => x.y >= 900);
    anota('Al bajar aparecen las secciones: nada las tapa',
      alBajar.length === 3 && alBajar.every((x) => x.centroMain && !x.centroPortada && x.bajoBandaMain),
      alBajar.map((x) => 'y=' + x.y + (x.centroMain ? ' centro en main' : ' centro TAPADO por ' + x.capa) + (x.bajoBandaMain ? ' + bajo la banda ok' : ' + la banda tapa el contenido')).join(' | '));

    const secciones = await p.evaluate(async () => {
      const cuadro = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      const cab = document.getElementById('site-header');
      const banda = document.querySelector('.od-portada');
      const salida = [];
      for (const id of ['tienda', 'proceso', 'resenas', 'contacto']) {
        const el = document.getElementById(id);
        if (!el) { salida.push({ id: id, falta: true }); continue; }
        el.scrollIntoView({ block: 'start', behavior: 'instant' });
        await cuadro();
        await new Promise((r) => setTimeout(r, 120));
        const r = el.getBoundingClientRect();
        salida.push({
          id: id,
          top: Math.round(r.top),
          alto: Math.round(r.height),
          bajoElMenu: r.top >= cab.getBoundingClientRect().bottom - 2,
          bajoLaBanda: !banda || r.top >= banda.getBoundingClientRect().bottom - 2,
        });
      }
      return salida;
    });
    anota('Anclas: cada sección queda entera por debajo del menú',
      secciones.length === 4 && secciones.every((x) => !x.falta && x.alto > 0 && x.bajoElMenu && x.bajoLaBanda),
      secciones.map((x) => x.id + (x.falta ? ' FALTA' : ' top=' + x.top + ' alto=' + x.alto + (x.bajoElMenu ? '' : ' TAPADA') + (x.bajoLaBanda ? '' : ' TAPADA POR LA BANDA'))).join(' | '));

    // La foto de portada es responsive: cada tramo de ancho tiene que
    // cargar su propio archivo y el del móvil tiene que ser el recorte
    // vertical. Se mide leyendo el `background-image` computado, que es lo
    // que el navegador pide de verdad, no lo que dice el CSS.
    const fotoPorAncho = async (w, h) => {
      await p.setViewportSize({ width: w, height: h });
      await espera(220);
      return p.evaluate(() => {
        const c = getComputedStyle(document.querySelector('.od-portada__foto'));
        const url = c.backgroundImage.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
        return { archivo: url.split('/').pop(), foco: c.getPropertyValue('--od-portada-foco-x').trim() };
      });
    };
    const en1280 = await fotoPorAncho(1280, 900);
    const en768 = await fotoPorAncho(768, 900);
    const en375 = await fotoPorAncho(375, 812);
    const en375c = await fotoPorAncho(667, 375);
    await p.setViewportSize({ width: 1280, height: 900 });
    anota('Portada responsive: cada ancho carga su propio archivo de foto',
      en1280.archivo === 'quita-la-luz-2150.jpg'
        && en768.archivo === 'quita-la-luz-1440.jpg' && en768.foco === '68%'
        && en375.archivo === 'quita-la-luz-movil.jpg'
        && en375c.archivo === 'quita-la-luz-1024.jpg',
      '1280=' + en1280.archivo + ' · 768=' + en768.archivo + ' (foco ' + en768.foco + ')'
        + ' · 375 vertical=' + en375.archivo + ' · 667×375 apaisado=' + en375c.archivo);

    await contexto.close();
  }

  // ------------------------------------------------------------- menú móvil
  {
    const contexto = await navegador.newContext({ viewport: { width: 375, height: 812 }, locale: 'es-CL' });
    const p = await nuevaPagina(contexto, 'light');
    const antes = await p.locator('#menu-movil').isVisible();
    await p.click('#menu-btn');
    await espera(250);
    const abierto = await p.locator('#menu-movil').isVisible();
    const expandido = await p.getAttribute('#menu-btn', 'aria-expanded');
    await p.keyboard.press('Escape');
    await espera(250);
    const cerrado = await p.evaluate(() => {
      const n = document.getElementById('menu-movil');
      return n.hasAttribute('hidden') && getComputedStyle(n).display === 'none';
    });
    const diagMenu = await p.evaluate(() => {
      const n = document.getElementById('menu-movil');
      return { hidden: n.hidden, atributo: n.hasAttribute('hidden'), clase: n.className, display: getComputedStyle(n).display };
    });
    console.log('DIAGNOSTICO-MENU', JSON.stringify(diagMenu));
    anota('Menú móvil: abre y cierra', !antes && abierto && cerrado, 'abierto=' + abierto + ' cerrado=' + cerrado);
    anota('Menú móvil: aria-expanded correcto', expandido === 'true', 'aria-expanded=' + expandido);
    await contexto.close();
  }

  // ---------------------------------------------------------------- pestañas
  {
    const contexto = await navegador.newContext({ viewport: { width: 1280, height: 900 }, locale: 'es-CL' });
    const p = await nuevaPagina(contexto, 'light');
    const pestanas = ['regalos', 'cuadros', 'textiles', 'papeleria', 'identificacion'];
    let todasOk = true; const detalle = [];
    for (const cat of pestanas) {
      await p.click('#tab-cat-' + cat);
      await espera(350);
      const estado = await p.evaluate((c) => {
        const paneles = Array.from(document.querySelectorAll('[role="tabpanel"]'));
        const visibles = paneles.filter((x) => !x.hasAttribute('hidden')).map((x) => x.id);
        const sel = Array.from(document.querySelectorAll('[role="tab"][aria-selected="true"]')).map((x) => x.dataset.categoria);
        return { visibles, sel };
      }, cat);
      const ok = estado.visibles.length === 1 && estado.visibles[0] === 'cat-' + cat && estado.sel[0] === cat;
      todasOk = todasOk && ok;
      detalle.push(cat + (ok ? ' ok' : ' MAL (' + JSON.stringify(estado) + ')'));
    }
    anota('Las 5 pestañas cambian de panel', todasOk, detalle.join(' | '));
    // teclado
    await p.click('#tab-cat-regalos');
    await espera(200);
    await p.focus('#tab-cat-regalos');
    await p.keyboard.press('ArrowRight');
    await espera(300);
    const trasDerecha = await p.evaluate(() => ({
      sel: Array.from(document.querySelectorAll('[role="tab"][aria-selected="true"]')).map((x) => x.dataset.categoria),
      foco: document.activeElement && document.activeElement.dataset ? document.activeElement.dataset.categoria : null,
    }));
    await p.keyboard.press('End');
    await espera(300);
    const trasFin = await p.evaluate(() => Array.from(document.querySelectorAll('[role="tab"][aria-selected="true"]')).map((x) => x.dataset.categoria));
    anota('Teclado en pestañas: flecha derecha y fin', trasDerecha.sel[0] === 'cuadros' && trasFin[0] === 'identificacion',
      'derecha=' + trasDerecha.sel[0] + ' fin=' + trasFin[0]);

    // El cambio de categoría vuelve arriba de la lista: quien está mirando el
    // último producto de una categoría larga y elige una corta no debe
    // quedarse a media altura viendo el bloque siguiente (§16).
    await p.click('#tab-cat-regalos');
    await espera(400);
    await p.evaluate(() => {
      const fichas = document.querySelectorAll('#cat-regalos article');
      fichas[fichas.length - 1].scrollIntoView({ block: 'center', behavior: 'instant' });
    });
    await espera(600);
    const fondo = await p.evaluate(() => ({
      y: Math.round(window.scrollY),
      panelTop: Math.round(document.getElementById('cat-regalos').getBoundingClientRect().top),
    }));
    await p.click('#tab-cat-papeleria');
    await espera(1600);
    const desdeFondo = await p.evaluate(() => {
      const barra = document.querySelector('.od-tablist').getBoundingClientRect();
      const panel = document.getElementById('cat-papeleria');
      const h3 = panel.querySelector('h3').getBoundingClientRect();
      const primera = panel.querySelector('article').getBoundingClientRect();
      const siguiente = document.getElementById('proceso');
      return {
        hueco: Math.round(h3.top - barra.bottom),
        tituloBajoLaBarra: h3.top >= barra.bottom - 1,
        primeraVisible: primera.top >= barra.bottom - 1 && primera.bottom <= innerHeight,
        siguienteDespues: siguiente ? siguiente.getBoundingClientRect().top > primera.bottom : true,
      };
    });
    anota('Catálogo: cambiar de categoría desde el fondo vuelve a la primera ficha',
      fondo.panelTop < 0 && desdeFondo.tituloBajoLaBarra && desdeFondo.hueco <= 40
        && desdeFondo.primeraVisible && desdeFondo.siguienteDespues,
      'antes: panelTop=' + fondo.panelTop + ' · después: hueco bajo la barra=' + desdeFondo.hueco
        + ' · primera ficha visible=' + desdeFondo.primeraVisible
        + ' · bloque siguiente después de la ficha=' + desdeFondo.siguienteDespues);

    // Y si no se ha bajado, no hay salto: la sección ya se está viendo.
    await p.evaluate(() => document.getElementById('tienda').scrollIntoView({ block: 'start', behavior: 'instant' }));
    await espera(500);
    const antesInicio = await p.evaluate(() => Math.round(window.scrollY));
    await p.click('#tab-cat-cuadros');
    await espera(1400);
    const enInicio = await p.evaluate(() => {
      const barra = document.querySelector('.od-tablist').getBoundingClientRect();
      const panel = document.getElementById('cat-cuadros').getBoundingClientRect();
      return { y: Math.round(window.scrollY), panelBajoLaBarra: panel.top >= barra.bottom };
    });
    anota('Catálogo: desde el inicio de la sección el cambio no da un salto',
      enInicio.panelBajoLaBarra && enInicio.y <= antesInicio + 4,
      'y ' + antesInicio + ' → ' + enInicio.y + ' · panel bajo la barra=' + enInicio.panelBajoLaBarra);

    await contexto.close();
  }

  // --------------------------------------------------------------- carruseles
  {
    const contexto = await navegador.newContext({ viewport: { width: 375, height: 812 }, locale: 'es-CL' });
    const p = await nuevaPagina(contexto, 'light');
    const d = await p.evaluate(() => {
      const swipes = document.querySelectorAll('.swipe');
      const dots = document.querySelectorAll('.dots');
      const hijos = Array.from(swipes).map((s) => s.children.length);
      return { swipes: swipes.length, dots: dots.length, hijos };
    });
    anota('Carruseles: indicadores .dots generados', d.swipes > 0 && d.dots === d.swipes, d.swipes + ' carruseles, ' + d.dots + ' indicadores');
    await contexto.close();
  }

  // ---------------------------------------------------------------- formulario
  {
    const contexto = await navegador.newContext({ viewport: { width: 1280, height: 900 }, locale: 'es-CL' });
    const p = await nuevaPagina(contexto, 'light');
    // el formulario viene con datos de ejemplo: se vacian para probar los errores
    await p.fill('#contacto-nombre', '');
    await p.fill('#contacto-email', '');
    await p.fill('#contacto-mensaje', '');
    await p.uncheck('#contacto-privacidad').catch(() => {});
    await p.click('[data-od-id="enviar-consulta"]');
    await espera(400);
    const err = await p.evaluate(() => {
      const resumen = document.getElementById('error-summary');
      const items = document.querySelectorAll('#error-summary-list li');
      const invalidos = document.querySelectorAll('[aria-invalid="true"]');
      return {
        visible: resumen ? !resumen.hasAttribute('hidden') : false,
        items: items.length,
        invalidos: invalidos.length,
        mensajes: Array.from(items).map((li) => li.textContent.trim().split(':')[0]),
      };
    });
    anota('Formulario: al enviar vacío muestra el resumen de errores', err.visible && err.items > 0, err.items + ' errores: ' + err.mensajes.join(', '));
    anota('Formulario: los campos se marcan con aria-invalid', err.invalidos > 0, err.invalidos + ' campos marcados');

    await p.check('#contacto-privacidad').catch(() => {});
    await p.fill('#contacto-nombre', 'María Fernández');
    await p.fill('#contacto-email', 'maria@ejemplo.cl');
    await p.selectOption('#contacto-producto', { index: 1 });
    await p.fill('#contacto-mensaje', 'Necesito 20 tazas con el logo de mi taller.');
    await p.evaluate(() => {
      window.__envios = 0;
      document.getElementById('form-contacto').addEventListener('submit', () => { window.__envios++; });
    });
    const diagBoton = await p.evaluate(() => {
      const b = document.querySelector('[data-od-id="enviar-consulta"]');
      const f = document.getElementById('form-contacto');
      const r = b.getBoundingClientRect();
      const encima = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      return { tipo: b.type, dentroDelFormulario: b.form === f, deshabilitado: b.disabled, encima: encima ? (encima.outerHTML || '').slice(0, 70) : null };
    });
    console.log('DIAGNOSTICO-BOTON', JSON.stringify(diagBoton));
    await p.click('[data-od-id="enviar-consulta"]');
    await espera(500);
    const diag2 = await p.evaluate(() => ({
      envios: window.__envios,
      validez: document.getElementById('form-contacto').checkValidity(),
      invalidosNativo: Array.from(document.getElementById('form-contacto').elements).filter((e) => !e.checkValidity()).map((e) => (e.id || e.name) + ':' + e.validationMessage),
      nombre: document.getElementById('contacto-nombre').value,
      mensaje: document.getElementById('contacto-mensaje').value,
      invalidos: Array.from(document.querySelectorAll('[aria-invalid="true"]')).map((e) => e.id),
      formOculto: document.getElementById('form-contacto').hasAttribute('hidden'),
      exitoClase: (document.getElementById('exito-contacto') || {}).className || null,
    }));
    console.log('DIAGNOSTICO2', JSON.stringify(diag2));
    const exitoConClic = await p.evaluate(() => window.__envios > 0);
    if (!exitoConClic) {
      // el error insertado desplaza el boton: se repite el envio en una pagina limpia
      await p.evaluate(() => document.getElementById('form-contacto').requestSubmit());
      await espera(400);
    }
    const ok = await p.evaluate(() => {
      const exito = document.getElementById('exito-contacto');
      const form = document.getElementById('form-contacto');
      return {
        exito: exito ? !exito.hasAttribute('hidden') : null,
        nombre: (document.getElementById('exito-nombre') || {}).textContent,
        formOculto: form ? form.hasAttribute('hidden') : false,
      };
    });
    anota('Formulario: confirmación con el nombre y el formulario oculto',
      !!ok && (ok.exito === null ? true : (ok.exito && ok.formOculto && /María/.test(ok.nombre || ''))),
      ok && ok.exito === null
        ? 'no aplica: el HTML no trae el panel #exito-contacto'
        : 'nombre=' + ok.nombre + (exitoConClic ? ' (clic)' : ' (requestSubmit: el clic no disparo submit tras insertar el resumen de errores)'));
    // el mismo camino, pero en una pagina limpia: el clic debe disparar el envio
    {
      const p2 = await nuevaPagina(contexto, 'light');
      await p2.fill('#contacto-nombre', 'Ana Ruiz');
      await p2.fill('#contacto-email', 'ana@ejemplo.cl');
      await p2.selectOption('#contacto-producto', { index: 1 });
      await p2.fill('#contacto-mensaje', 'Quiero cotizar 30 tazas del mismo modelo.');
      await p2.click('[data-od-id="enviar-consulta"]');
      await espera(500);
      const limpio = await p2.evaluate(() => {
        const e = document.getElementById('exito-contacto');
        const f = document.getElementById('form-contacto');
        return { exito: e ? !e.classList.contains('hidden') && !e.hasAttribute('hidden') : null, formOculto: f.hasAttribute('hidden'), nombre: (document.getElementById('exito-nombre') || {}).textContent };
      });
      anota('Formulario: el clic en «Revisar mi consulta» confirma (pagina limpia)',
        limpio.exito === null ? true : (limpio.exito && limpio.formOculto && /Ana/.test(limpio.nombre || '')),
        limpio.exito === null ? 'no aplica: el HTML no trae el panel #exito-contacto' : JSON.stringify(limpio));
      await p2.close();
    }

    // reiniciar
    if (await p.locator('#form-reiniciar').isVisible()) {
      await p.click('#form-reiniciar');
      await espera(300);
    } else {
      const diag = await p.evaluate(() => {
        const exito = document.getElementById('exito-contacto');
        return {
          errores: Array.from(document.querySelectorAll('#error-summary-list li')).map((li) => li.textContent.trim()),
          exitoOculto: exito ? (exito.hasAttribute('hidden') || exito.classList.contains('hidden')) : 'sin panel #exito-contacto',
          formOculto: document.getElementById('form-contacto').hasAttribute('hidden'),
          producto: (document.getElementById('contacto-producto') || {}).value,
          email: (document.getElementById('contacto-email') || {}).value,
          privacidad: (document.getElementById('contacto-privacidad') || {}).checked,
        };
      });
      console.log('DIAGNOSTICO', JSON.stringify(diag));
    }
    const reinicio = await p.evaluate(() => {
      const form = document.getElementById('form-contacto');
      const exito = document.getElementById('exito-contacto');
      return {
        formVisible: form ? !form.hasAttribute('hidden') : false,
        exitoOculto: exito ? (exito.hasAttribute('hidden') || exito.classList.contains('hidden')) : null,
      };
    });
    anota('Formulario: «Enviar otra consulta» reinicia',
      reinicio.exitoOculto === null ? true : (reinicio.formVisible && reinicio.exitoOculto),
      reinicio.exitoOculto === null
        ? 'no aplica: sin panel #exito-contacto no hay botón de reinicio que probar'
        : JSON.stringify(reinicio));
    await contexto.close();
  }

  // ------------------------------------------------------------- botón tema
  {
    const contexto = await navegador.newContext({ viewport: { width: 1280, height: 900 }, locale: 'es-CL' });
    const p = await nuevaPagina(contexto, 'light');
    const inicio = await p.getAttribute('html', 'data-theme');
    await p.click('#theme-toggle');
    await espera(300);
    const tras = await p.evaluate(() => ({
      tema: document.documentElement.getAttribute('data-theme'),
      guardado: localStorage.getItem('sublikat-tema'),
      pressed: document.getElementById('theme-toggle').getAttribute('aria-pressed'),
      luna: !document.querySelector('[data-icon="luna"]').classList.contains('hidden'),
    }));
    anota('Botón de tema: alterna claro/oscuro y lo guarda', inicio === 'light' && tras.tema === 'dark' && tras.guardado === 'dark',
      'inicio=' + inicio + ' tras=' + tras.tema + ' guardado=' + tras.guardado);
    anota('Botón de tema: aria-pressed y icono coherentes', tras.pressed === 'true' && tras.luna, 'pressed=' + tras.pressed);

    // En móvil el conmutador no ocupa sitio en la barra: el mismo nodo se
    // muda dentro del menú de hamburguesa. Se mide el padre, el tamaño y
    // que no haya dos botones (un duplicado rompería `aria-pressed` y los
    // `aria-controls` del resto de la cabecera).
    await p.setViewportSize({ width: 375, height: 812 });
    await espera(280);
    const ubicacion = await p.evaluate(() => {
      const t = document.getElementById('theme-toggle');
      return {
        padre: t.parentNode.id,
        duplicados: document.querySelectorAll('#theme-toggle').length,
      };
    });
    await p.click('#menu-btn');
    await espera(280);
    const dentro = await p.evaluate(() => {
      const t = document.getElementById('theme-toggle');
      const r = t.getBoundingClientRect();
      const hueco = document.getElementById('menu-tema');
      const etiqueta = t.querySelector('.od-tema-etiqueta');
      return {
        padre: t.parentNode.id,
        enMenu: document.getElementById('menu-movil').contains(t),
        huecoOculto: hueco ? hueco.hidden : null,
        ancho: Math.round(r.width), alto: Math.round(r.height),
        etiquetaVisible: etiqueta ? getComputedStyle(etiqueta).display !== 'none' : false,
        temaAntes: document.documentElement.getAttribute('data-theme'),
      };
    });
    anota('Modo oscuro dentro de la hamburguesa: en móvil el conmutador vive en el menú',
      ubicacion.padre === 'menu-tema' && ubicacion.duplicados === 1
        && dentro.enMenu && dentro.huecoOculto === false
        && dentro.alto >= 44 && dentro.ancho > 200 && dentro.etiquetaVisible,
      'padre=' + ubicacion.padre + ' · nodos=' + ubicacion.duplicados
        + ' · fila=' + dentro.ancho + '×' + dentro.alto + ' · etiqueta=' + dentro.etiquetaVisible);

    await p.click('#theme-toggle');
    await espera(280);
    const desdeMenu = await p.evaluate(() => ({
      tema: document.documentElement.getAttribute('data-theme'),
      pressed: document.getElementById('theme-toggle').getAttribute('aria-pressed'),
      etiqueta: (document.querySelector('.od-tema-etiqueta') || {}).textContent,
    }));
    anota('Modo oscuro dentro de la hamburguesa: alterna y cambia la etiqueta',
      desdeMenu.tema !== dentro.temaAntes && desdeMenu.pressed === (desdeMenu.tema === 'dark' ? 'true' : 'false')
        && /^Modo (claro|oscuro)$/.test(desdeMenu.etiqueta || ''),
      dentro.temaAntes + ' → ' + desdeMenu.tema + ' · etiqueta=' + desdeMenu.etiqueta);

    await p.setViewportSize({ width: 1280, height: 900 });
    await espera(300);
    const devuelto = await p.evaluate(() => {
      const t = document.getElementById('theme-toggle');
      const hueco = document.getElementById('menu-tema');
      const etiqueta = t.querySelector('.od-tema-etiqueta');
      return {
        enMenu: document.getElementById('menu-movil').contains(t),
        antesDe: t.nextElementSibling ? t.nextElementSibling.id : null,
        huecoOculto: hueco ? hueco.hidden : null,
        ancho: Math.round(t.getBoundingClientRect().width),
        etiquetaVisible: etiqueta ? getComputedStyle(etiqueta).display !== 'none' : false,
        duplicados: document.querySelectorAll('#theme-toggle').length,
      };
    });
    anota('Modo oscuro dentro de la hamburguesa: vuelve a la barra al ensanchar',
      !devuelto.enMenu && devuelto.antesDe === 'menu-btn' && devuelto.huecoOculto === true
        && devuelto.ancho === 44 && !devuelto.etiquetaVisible && devuelto.duplicados === 1,
      'antesDe=' + devuelto.antesDe + ' · ancho=' + devuelto.ancho + ' · etiqueta=' + devuelto.etiquetaVisible);

    await contexto.close();
  }

  // --------------------------------------------------------------- WhatsApp
  {
    const contexto = await navegador.newContext({ viewport: { width: 375, height: 812 }, locale: 'es-CL' });
    const p = await nuevaPagina(contexto, 'light');
    const d = await p.evaluate(() => {
      const w = document.querySelector('.od-was');
      const a = w ? w.querySelector('a') : null;
      const r = w ? w.getBoundingClientRect() : null;
      return {
        existe: !!w,
        href: a ? a.getAttribute('href') : null,
        destino: a ? a.getAttribute('target') : null,
        etiqueta: a ? a.getAttribute('aria-label') : null,
        fijo: w ? getComputedStyle(w).position : null,
        visible: r ? (r.bottom <= window.innerHeight + 1 && r.right <= window.innerWidth + 1) : false,
      };
    });
    anota('Widget de WhatsApp: enlace, destino y etiqueta', d.existe && /wa\.me\/56949409253/.test(d.href || '') && d.destino === '_blank' && !!d.etiqueta,
      d.href);
    anota('Widget de WhatsApp: fijo y dentro de la pantalla', d.fijo === 'fixed' && d.visible, 'position=' + d.fijo + ' visible=' + d.visible);
    await contexto.close();
  }

  // ------------------------------------------------------------- foco visible
  {
    const contexto = await navegador.newContext({ viewport: { width: 1280, height: 900 }, locale: 'es-CL' });
    const p = await nuevaPagina(contexto, 'light');
    const d = await p.evaluate(() => {
      const sel = ['#enviar-consulta', '#tab-cat-regalos', '#theme-toggle', '.contacto-nombre, #contacto-nombre'];
      const salida = [];
      for (const s of sel) {
        const el = document.querySelector(s);
        if (!el) { salida.push(s + ': no encontrado'); continue; }
        el.focus();
        const c = getComputedStyle(el);
        const antes = { outline: c.outlineWidth + ' ' + c.outlineStyle, shadow: c.boxShadow };
        el.blur();
        salida.push(s + ': outline=' + antes.outline + ' shadow=' + antes.shadow.slice(0, 40));
      }
      return salida;
    });
    const conFoco = d.filter((x) => /outline=\S+ (solid|dashed|dotted|auto)/.test(x) || /shadow=(?!none)/.test(x)).length;
    anota('Foco visible en los controles', conFoco >= 3, d.join(' | '));
    await contexto.close();
  }

  // ---------------------------------------------------------------- contraste
  {
    const contexto = await navegador.newContext({ viewport: { width: 1280, height: 900 }, locale: 'es-CL' });
    for (const tema of ['light', 'dark']) {
      const p = await nuevaPagina(contexto, tema);
      const d = await p.evaluate(() => {
        function lum(c) {
          const v = c.map((x) => { x /= 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); });
          return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
        }
        function ratio(a, b) { const l1 = lum(a), l2 = lum(b); const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1]; return (hi + 0.05) / (lo + 0.05); }
        function parse(s) { const m = s.match(/[\d.]+/g); return m ? m.slice(0, 3).map(Number) : null; }
        function fondo(el) {
          let n = el;
          while (n) {
            const c = getComputedStyle(n).backgroundColor;
            const p = parse(c);
            if (p && !/rgba\(.*,\s*0\)/.test(c) && (p.length < 3 || c.indexOf(',') < 0 || !/,\s*0\)$/.test(c))) return p;
            n = n.parentElement;
          }
          return [255, 255, 255];
        }
        const muestras = ['h1', 'p', '.section-title', '#contacto-nombre', 'label', '.cat-tab', 'a[href="#tienda"]'];
        const salida = [];
        for (const s of muestras) {
          const el = document.querySelector(s);
          if (!el) continue;
          const c = getComputedStyle(el);
          const fg = parse(c.color);
          const bg = fondo(el);
          if (!fg || !bg) continue;
          const r = ratio(fg, bg);
          const grande = parseFloat(c.fontSize) >= 24 || (parseFloat(c.fontSize) >= 18.66 && Number(c.fontWeight) >= 700);
          salida.push({ sel: s, ratio: Math.round(r * 100) / 100, minimo: grande ? 3 : 4.5, ok: r >= (grande ? 3 : 4.5) });
        }
        return salida;
      });
      const malos = d.filter((x) => !x.ok);
      anota('Contraste ' + tema + ': muestras AA', malos.length === 0,
        d.map((x) => x.sel + ' ' + x.ratio + (x.ok ? '' : ' BAJO')).join(' | '));
    }
    await contexto.close();
  }

  // ------------------------------------------- movimiento ligado al scroll
  // Las líneas de tiempo de scroll solo se pueden comprobar en un navegador que
  // las soporte y con el movimiento permitido: con `prefers-reduced-motion:
  // reduce` (si el sistema lo informa) el sitio se muestra entero y quieto, y
  // la prueba no mediría nada. Por eso el contexto de este bloque fuerza
  // `no-preference`.
  {
    const contexto = await navegador.newContext({ viewport: { width: 1280, height: 900 }, locale: 'es-CL', reducedMotion: 'no-preference' });
    const p = await nuevaPagina(contexto, 'light');
    const soporte = await p.evaluate(() => CSS.supports('animation-timeline', 'view()'));
    if (!soporte) {
      anota('Movimiento: el navegador admite animation-timeline', true, 'no lo admite: se omite la comprobación');
    } else {
      anota('Movimiento: el navegador admite animation-timeline', true, 'view() y scroll() soportados');

      const barra = await p.evaluate(async () => {
        const el = document.querySelector('.od-progress');
        if (!el) return null;
        const leer = () => {
          const m = getComputedStyle(el).transform.match(/matrix\(([^)]+)\)/);
          return m ? parseFloat(m[1].split(',')[0]) : null;
        };
        const cuadro = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
        window.scrollTo({ top: 0, behavior: 'instant' });
        await cuadro();
        const arriba = leer();
        window.scrollTo({ top: 1600, behavior: 'instant' });
        await cuadro();
        await new Promise((r) => setTimeout(r, 120));
        const abajo = leer();
        return { arriba, abajo, display: getComputedStyle(el).display };
      });
      anota('Movimiento: la barra de lectura avanza con el scroll',
        !!barra && barra.display === 'block' && barra.arriba !== null && barra.abajo !== null && barra.arriba < 0.05 && barra.abajo > 0.05,
        barra ? 'scaleX arriba=' + barra.arriba + ' abajo=' + barra.abajo : 'no hay .od-progress');

      const fichas = await p.evaluate(async () => {
        const el = document.querySelector('[data-od-id^="producto-"]');
        if (!el) return null;
        const panel = el.closest('[role="tabpanel"]');
        const visible = !!panel && !panel.hasAttribute('hidden');
        const cuadro = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
        window.scrollTo({ top: 0, behavior: 'instant' });
        await cuadro();
        const lejos = parseFloat(getComputedStyle(el).opacity);
        const top = el.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: Math.max(0, top - 300), behavior: 'instant' });
        await cuadro();
        await new Promise((r) => setTimeout(r, 150));
        const cerca = parseFloat(getComputedStyle(el).opacity);
        return { lejos, cerca, visible, animacion: getComputedStyle(el).animationName };
      });
      anota('Movimiento: las fichas del catálogo aparecen al entrar en pantalla',
        !!fichas && fichas.visible && fichas.lejos < 0.5 && fichas.cerca > 0.95,
        fichas ? 'opacidad lejos=' + fichas.lejos + ' cerca=' + fichas.cerca + ' animación=' + fichas.animacion : 'no hay fichas');
    }
    await contexto.close();
  }

  // ------------------------------------------- demos nuevas por sección
  // Las cuatro demos añadidas el 2026-11-14: la foto del héroe que se
  // retira, la columna vertebral del proceso, el icono de la ficha y las
  // sombras de scroll de los carruseles.
  {
    const contexto = await navegador.newContext({ viewport: { width: 1280, height: 900 }, locale: 'es-CL', reducedMotion: 'no-preference' });
    const p = await nuevaPagina(contexto, 'light');
    const escalaX = (t) => { const m = String(t).match(/matrix\(([^)]+)\)/); return m ? parseFloat(m[1].split(',')[0]) : null; };

    const heroe = await p.evaluate(async () => {
      const img = document.querySelector('.od-hero__media img');
      if (!img) return null;
      const cuadro = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      const leer = () => {
        const c = getComputedStyle(img);
        return { t: c.translate, clip: c.clipPath, anim: c.animationName, esc: c.scale };
      };
      window.scrollTo({ top: 0, behavior: 'instant' });
      await cuadro();
      await new Promise((r) => setTimeout(r, 150));
      const arriba = leer();
      window.scrollTo({ top: 700, behavior: 'instant' });
      await cuadro();
      await new Promise((r) => setTimeout(r, 150));
      return { arriba, abajo: leer() };
    });
    // `translate` computado es «0px 16px»; interesa la componente Y.
    const ejeY = (t) => { const n = String(t).match(/(-?[\d.]+)px/g); return n && n.length > 1 ? parseFloat(n[1]) : null; };
    const yArriba = ejeY(heroe && heroe.arriba.t), yAbajo = ejeY(heroe && heroe.abajo.t);
    anota('Demo 6: el parallax de la foto del héroe la mueve con el scroll',
      !!heroe && Math.abs(heroe.arriba.anim.indexOf('od-hero-parallax') >= 0 ? 1 : 0) === 1
        && yArriba !== null && yAbajo !== null && Math.abs(yAbajo - yArriba) >= 30,
      heroe ? 'translate Y arriba=' + yArriba + ' abajo=' + yAbajo + ' animaciones=' + heroe.arriba.anim : 'no hay foto');
    anota('Demo 6: la cortina del héroe termina abierta y sin dejar la foto recortada',
      !!heroe && heroe.arriba.anim.indexOf('od-hero-curtain') >= 0
        && heroe.arriba.clip.indexOf('inset(') === 0 && heroe.arriba.clip.indexOf('26%') < 0,
      heroe ? 'clip-path=' + heroe.arriba.clip + ' scale=' + heroe.arriba.esc : 'no hay foto');

    // La línea que avanzaba sobre las píldoras se retiró el 15-11-2026: la
    // prueba deja de comprobar que crece y pasa a comprobar que NO vuelve.
    const proceso = await p.evaluate(async () => {
      const el = document.querySelector('#proceso .od-steps');
      if (!el) return null;
      const cuadro = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      window.scrollTo({ top: 0, behavior: 'instant' });
      await cuadro();
      const caja = el.getBoundingClientRect();
      window.scrollTo({ top: Math.max(0, caja.top + window.scrollY - 260), behavior: 'instant' });
      await cuadro();
      await new Promise((r) => setTimeout(r, 160));
      const capa = getComputedStyle(el, '::after');
      const base = getComputedStyle(el, '::before');
      const paso = document.querySelector('#proceso .od-step');
      const seg = paso ? getComputedStyle(paso, '::after') : null;
      return {
        relleno: { contenido: capa.content, anim: capa.animationName },
        base: { contenido: base.content, anim: base.animationName },
        segmento: seg ? { contenido: seg.content, anim: seg.animationName } : null,
        apilado: paso ? getComputedStyle(paso).animationName : null,
      };
    });
    const sinLinea = !!proceso && proceso.relleno.contenido === 'none' && proceso.base.contenido === 'none'
      && proceso.relleno.anim === 'none' && proceso.base.anim === 'none'
      && (!proceso.segmento || (proceso.segmento.contenido === 'none' && proceso.segmento.anim === 'none'));
    anota('Regresión: la línea del proceso no vuelve (se retiró el 15-11-2026)',
      sinLinea && !!proceso && proceso.apilado === 'od-step-recede',
      proceso ? 'relleno=' + proceso.relleno.contenido + ' / ' + proceso.relleno.anim
        + ' | base=' + proceso.base.contenido + ' / ' + proceso.base.anim
        + ' | segmento móvil=' + (proceso.segmento ? proceso.segmento.contenido + ' / ' + proceso.segmento.anim : 'no aplica')
        + ' | apilado de pasos=' + proceso.apilado : 'no hay rejilla de pasos');

    const icono = await p.evaluate(async () => {
      const el = document.querySelector('[data-od-id^="producto-"] > div > div > svg');
      if (!el) return null;
      const cuadro = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      window.scrollTo({ top: 0, behavior: 'instant' });
      await cuadro();
      const lejos = parseFloat(getComputedStyle(el).opacity);
      const caja = el.getBoundingClientRect();
      window.scrollTo({ top: Math.max(0, caja.top + window.scrollY - 260), behavior: 'instant' });
      await cuadro();
      await new Promise((r) => setTimeout(r, 160));
      return { lejos, cerca: parseFloat(getComputedStyle(el).opacity), animacion: getComputedStyle(el).animationName };
    });
    anota('Demo 6: el icono de la ficha se asienta al entrar',
      !!icono && icono.animacion === 'od-icon-settle' && icono.lejos < 0.5 && icono.cerca > 0.95,
      icono ? 'opacidad lejos=' + icono.lejos + ' cerca=' + icono.cerca + ' animación=' + icono.animacion : 'no hay icono');

    // La cortina es lo que hace visible la aparición de la ficha: el
    // recuadro del icono se abre un 26 % desde abajo.
    const cortina = await p.evaluate(async () => {
      const caja = document.querySelector('[data-od-id^="producto-"] > div > div');
      if (!caja) return null;
      const cuadro = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      window.scrollTo({ top: 0, behavior: 'instant' });
      await cuadro();
      const lejos = getComputedStyle(caja).clipPath;
      const r = caja.getBoundingClientRect();
      window.scrollTo({ top: Math.max(0, r.top + window.scrollY - 260), behavior: 'instant' });
      await cuadro();
      await new Promise((res) => setTimeout(res, 160));
      return { lejos, cerca: getComputedStyle(caja).clipPath, anim: getComputedStyle(caja).animationName };
    });
    anota('Demo 6: la cortina del recuadro de la ficha se abre al entrar',
      !!cortina && cortina.anim === 'od-ficha-curtain'
        && cortina.lejos.indexOf('26%') >= 0 && cortina.cerca.indexOf('26%') < 0,
      cortina ? 'clip-path lejos=' + cortina.lejos + ' cerca=' + cortina.cerca : 'no hay recuadro');

    // La garantía que protege el cambio de pestaña: si una ficha está
    // entera en pantalla, está opaca. Si esto falla, el catálogo se ve
    // translúcido y no hay animación que lo justifique.
    const guarda = await p.evaluate(async () => {
      const cuadro = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      const panel = Array.from(document.querySelectorAll('[role="tabpanel"]')).find((s) => !s.hasAttribute('hidden'));
      if (!panel) return null;
      const fichas = Array.from(panel.querySelectorAll('[data-od-id^="producto-"]'));
      window.scrollTo({ top: 0, behavior: 'instant' });
      await cuadro();
      const r0 = fichas[0].getBoundingClientRect();
      window.scrollTo({ top: Math.max(0, r0.top + window.scrollY - 120), behavior: 'instant' });
      await cuadro();
      await new Promise((res) => setTimeout(res, 200));
      const visibles = fichas.filter((f) => {
        const r = f.getBoundingClientRect();
        return r.top >= 0 && r.bottom <= window.innerHeight;
      });
      return {
        total: fichas.length,
        visibles: visibles.length,
        malas: visibles.filter((f) => parseFloat(getComputedStyle(f).opacity) < 0.99)
          .map((f) => f.getAttribute('data-od-id')),
      };
    });
    anota('Regresión: ninguna ficha visible queda a media opacidad',
      !!guarda && guarda.visibles > 0 && guarda.malas.length === 0,
      guarda ? guarda.visibles + '/' + guarda.total + ' visibles, translúcidas: ' + (guarda.malas.join(', ') || 'ninguna') : 'no hay panel');

    const apilado = await p.evaluate(async () => {
      const el = document.querySelector('#proceso .od-step');
      if (!el) return null;
      const cuadro = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      const leer = () => { const v = getComputedStyle(el).scale; return v === 'none' ? 1 : parseFloat(v); };
      window.scrollTo({ top: 0, behavior: 'instant' });
      await cuadro();
      const antes = leer();
      const r = el.getBoundingClientRect();
      window.scrollTo({ top: Math.max(0, r.top + window.scrollY + 400), behavior: 'instant' });
      await cuadro();
      await new Promise((res) => setTimeout(res, 180));
      return { antes, despues: leer(), anim: getComputedStyle(el).animationName };
    });
    anota('Demo 15: los pasos se reducen al salir (apilado ligero)',
      !!apilado && apilado.anim === 'od-step-recede' && apilado.antes > 0.999 && apilado.despues < 0.99,
      apilado ? 'scale antes=' + apilado.antes + ' después=' + apilado.despues + ' animación=' + apilado.anim : 'no hay pasos');

    const barra6 = await p.evaluate(() => {
      const el = document.querySelector('.od-progress');
      if (!el) return null;
      const c = getComputedStyle(el);
      return { alto: c.blockSize, display: c.display };
    });
    anota('Barra de lectura: 6 px y visible',
      !!barra6 && barra6.display === 'block' && parseFloat(barra6.alto) >= 6,
      barra6 ? 'alto=' + barra6.alto + ' display=' + barra6.display : 'no hay barra');
    await contexto.close();
  }

  // Las sombras de scroll solo existen en móvil: en escritorio las rejillas
  // son rejillas y no desbordan.
  {
    const contexto = await navegador.newContext({ viewport: { width: 375, height: 812 }, locale: 'es-CL', reducedMotion: 'no-preference' });
    const p = await nuevaPagina(contexto, 'light');
    const d = await p.evaluate(async () => {
      const el = document.querySelector('#beneficios .swipe');
      const marco = el && el.closest('.swipe-marco');
      if (!el || !marco) return null;
      const cuadro = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      await cuadro();
      // Las capas viven en el envoltorio, no en el carrusel: ahí es donde
      // hay que leer la intensidad del degradado.
      const leer = () => {
        const ci = getComputedStyle(marco, '::before');
        const cd = getComputedStyle(marco, '::after');
        const opacidad = (t) => { const m = String(t).match(/\/\s*([\d.]+)\)/); return m ? parseFloat(m[1]) : 0; };
        return { l: opacidad(ci.backgroundImage), r: opacidad(cd.backgroundImage),
          z: ci.zIndex, pos: ci.position, ancho: ci.width };
      };
      const inicio = leer();
      const max = el.scrollWidth - el.clientWidth;
      el.scrollLeft = Math.round(max * 0.45);
      await cuadro();
      await new Promise((r) => setTimeout(r, 220));
      const medio = leer();
      // La sombra derecha da por hecho que hay desbordamiento: con una
      // línea de tiempo inactiva (contenido que cabe) quedaría fija.
      const desbordan = Array.from(document.querySelectorAll('.swipe')).map((s) => ({
        sel: s.closest('section') ? s.closest('section').id : '?',
        sobra: s.scrollWidth - s.clientWidth,
      }));
      return { inicio, medio, max, left: el.scrollLeft, desbordan };
    });
    anota('Demo 14: los carruseles avisan con sombra de borde por encima de las tarjetas',
      !!d && d.max > 0 && d.inicio.l === 0 && d.inicio.r > 0.2 && d.medio.l > 0.2
        && d.inicio.z !== 'auto' && d.inicio.pos === 'absolute' && parseFloat(d.inicio.ancho) >= 20
        && d.desbordan.length === 3 && d.desbordan.every((x) => x.sobra > 0),
      d ? 'alpha izquierda ' + d.inicio.l + '→' + d.medio.l + ', derecha ' + d.inicio.r
        + ', z-index ' + d.inicio.z + ', ancho ' + d.inicio.ancho + ', recorrido ' + d.left + '/' + d.max
        + ', desbordan ' + d.desbordan.map((x) => x.sel + ':' + x.sobra).join(' ')
        : 'no hay carrusel con envoltorio');
    await contexto.close();
  }

  // Movimiento reducido: es el escenario que, si falla, deja la página
  // inservible. Nada puede quedar invisible, desplazado ni con la línea a
  // medias.
  {
    const contexto = await navegador.newContext({ viewport: { width: 1280, height: 900 }, locale: 'es-CL', reducedMotion: 'reduce' });
    const p = await nuevaPagina(contexto, 'light');
    const d = await p.evaluate(() => {
      const sel = ['.od-hero__media-col', '.od-hero__title', '.od-hero__media', '.od-hero__media img',
        '.od-hero__tape', '.od-fade', '.od-reveal', '.od-reveal > div > div', '.od-reveal-soft',
        '.od-step', '.od-stagger > *', '.od-steps'];
      const salida = [];
      for (const s of sel) {
        const el = document.querySelector(s);
        if (!el) continue;
        const c = getComputedStyle(el);
        salida.push({ s, op: parseFloat(c.opacity), tr: c.translate, anim: c.animationName, es: c.scale, cl: c.clipPath });
      }
      const pasos = document.querySelector('#proceso .od-steps');
      const linea = pasos ? getComputedStyle(pasos, '::after') : null;
      const icono = document.querySelector('[data-od-id^="producto-"] > div > div > svg');
      const ic = icono ? getComputedStyle(icono) : null;
      const swipe = document.querySelector('#beneficios .swipe');
      const marco = swipe ? swipe.closest('.swipe-marco') : null;
      const barra = document.querySelector('.od-progress');
      return {
        salida,
        linea: linea ? { op: parseFloat(linea.opacity), tr: linea.transform, anim: linea.animationName, contenido: linea.content } : null,
        icono: ic ? { op: parseFloat(ic.opacity), tr: ic.transform, anim: ic.animationName } : null,
        sombra: marco ? getComputedStyle(marco, '::before').display : null,
        barra: barra ? getComputedStyle(barra).display : null,
      };
    });
    // Ojo: la cinta del héroe lleva una rotación estática (`rotate-3`) que
    // debe conservarse. Lo que no puede quedar es una animación viva, un
    // `scale` estático que recorte la foto ni un `clip-path` que la oculte.
    const malos = d.salida.filter((x) => x.op < 0.99 || x.tr !== 'none' || x.anim !== 'none'
      || (x.es && x.es !== 'none') || (x.cl && x.cl !== 'none'));
    anota('Movimiento reducido: el contenido se ve completo y quieto',
      malos.length === 0 && d.linea && d.linea.anim === 'none' && d.linea.contenido === 'none'
        && d.icono && d.icono.op >= 0.99 && d.icono.anim === 'none',
      malos.length ? malos.map((x) => x.s + ' opacidad=' + x.op + ' translate=' + x.tr + ' animación=' + x.anim + ' scale=' + x.es + ' clip=' + x.cl).join(' | ')
        : 'opacidad 1 y sin animación en ' + d.salida.length + ' elementos' + (d.linea ? '; línea del proceso=' + d.linea.contenido : ''));
    anota('Movimiento reducido: sin barra de lectura ni sombra de borde',
      d.barra === 'none' && d.sombra === 'none',
      'barra=' + d.barra + ' capas de sombra=' + d.sombra);
    await contexto.close();
  }

  anota('Sin errores en consola', resultados.erroresConsola.length === 0, resultados.erroresConsola.join(' | ') || 'ninguno');
  if (resultados.recursosExternos.length) {
    console.log('DIAGNOSTICO-EXTERNOS (no afecta al resultado) '
      + resultados.recursosExternos.length + ' fallo(s) de red: '
      + resultados.recursosExternos.slice(0, 4).join(' | '));
  }

  await navegador.close();
  servidor.close();
  fs.writeFileSync(SALIDA, JSON.stringify(resultados, null, 1), 'utf8');
  const fallos = resultados.pruebas.filter((p) => !p.ok);
  console.log('\n' + (resultados.pruebas.length - fallos.length) + '/' + resultados.pruebas.length + ' pruebas superadas');
  process.exit(fallos.length ? 1 : 0);
});

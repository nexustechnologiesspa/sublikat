# Auditoría de estructura y línea base — Sublikat

> **Documento de etapa.** Describe el proyecto tal como estaba cuando se escribió. Después llegaron
> el ordenamiento (`qa/orden-proyecto.md`) y la dirección cerrada crema + Chewy. Las referencias a
> `build/pendiente-violeta/`, `OD:SCROLL` y `build/scroll-animations.css` son **históricas**: hoy
> esos ficheros están en `archive/`, la zona se llama `OD:MOTION` y el movimiento vive en
> `build/motion.css`. No leas este informe como estado actual.

**Fecha:** 12 de noviembre de 2026
**Alcance:** `index.html` y la carpeta `build/` del proyecto Sublikat
**Naturaleza de la etapa:** solo lectura. **No se modificó ningún archivo existente del proyecto.**
Lo único añadido son archivos nuevos dentro de `qa/`.

> **Estado posterior (12-11-2026).** Los hallazgos de este informe se han ido cerrando en las
> etapas siguientes:
>
> - **R1 (crítico) — resuelto.** `build/` vuelve a ser la única fuente de verdad: el CSS, el
>   JavaScript y los fragmentos de markup se movieron a `build/`, y `index.html` se regenera desde
>   ahí. Ver `qa/refactor-build.md`.
> - **R2 (crítico) — resuelto.** Ya no hay cabecera ni pie en línea que se dupliquen al
>   regenerar: ambos vienen de `build/sections/`. Ver `qa/estructura-secciones.md`.
> - **R4 (alto) — resuelto.** Los tokens viven en un único bloque por tema, sin alias ni
>   definiciones repetidas.
> - **R3 (alto) — resuelto.** Queda un solo `<main>`; el pie contextual se mantiene donde estaba.
> - **R5 a R12 — abiertos o archivados.** El bloque `<style id="mejoras">` y el script final ya
>   no están sueltos; el rediseño violeta de `build/` quedó archivado en
>   `build/pendiente-violeta/`; la decisión de paleta sigue pendiente (ver §6, punto 1).
>
> Este documento se conserva tal cual: es la foto del estado que había antes de las etapas.

---

## 0. Resumen ejecutivo

La auditoría encontró un problema que condiciona cualquier trabajo posterior:

> **`index.html` no es la versión que describe `build/`.** Es una versión anterior (portada crema y
> coral, tipografía Chewy, 19 fichas) mientras que `build/` ya contiene el diseño aprobado
> (paleta violeta, tipografía Archivo, 20 fichas, cabecera y pie nuevos). Las zonas `OD:BASE`,
> `OD:SCROLL`, `OD:CABECERA` y `OD:PIE` **no existen** en el HTML; las zonas `OD:TOKENS`, `OD:APP`
> y `OD:EXITO` existen pero contienen material antiguo.

Consecuencia práctica: `build/actualizar-portada.ps1` **no es un regenerador neutro sobre el estado
actual**. Simulado sobre una copia, pasa la página de 2.834 a 4.703 líneas y deja **dos cabeceras y
tres pies** en el documento. Esa simulación está documentada en el hallazgo R2 y es la razón de que
en esta etapa el script **no** se haya ejecutado contra el proyecto.

Todo lo demás es menor: la página no tiene identificadores duplicados, el linter da cero avisos, y
el catálogo y el formulario funcionan.

| # | Hallazgo | Severidad |
|---|---|---|
| R1 | `index.html` está desfasado respecto de `build/` (4 zonas ausentes, 3 con contenido antiguo) | crítica |
| R2 | Regenerar ahora duplicaría cabecera y pie (2 `<header>`, 3 `<footer>`) | crítica |
| R3 | Tres `<main>` y un `<footer>` perdido a mitad del flujo | alta |
| R4 | Dos paletas conviviendo; 52 variables repetidas, 6 muertas | alta |
| R5 | Bloque `<style id="mejoras">` y script final fuera del control de `build/` | media |
| R6 | El `<head>` carga Chewy; `build/` ya usa Archivo | media |
| R7 | Cuatro de las cinco páginas de `build/` no existen en disco; el pie nuevo las enlaza | media |
| R8 | `.font-display` no existe en el CSS actual, pero la cabecera y el pies nuevos la usan | baja |
| R9 | El catálogo actual tiene 19 fichas; el pie nuevo anuncia 20 | baja |
| R10 | Tailwind por CDN: sin red, la página pierde el layout | baja |
| R11 | `aria-current` con dos convenciones distintas en los enlaces de la cabecera | baja |
| R12 | Tres utilidades del marcado sin regla CSS en ningún archivo | baja |

---

## 1. Cómo se ensambla `index.html`

`build/actualizar-portada.ps1` es un ensamblador por zonas: no genera el documento desde cero,
sustituye el contenido entre marcadores `<!-- OD:X -->` … `<!-- /OD:X -->`.

### 1.1 Paso a paso

1. **Resuelve la raíz del proyecto** con `$root = Resolve-Path build/..` (línea 2). Todas las
   rutas son relativas a la ubicación del script, así que el proyecto se puede mover sin tocarlo.
2. **Lee nueve ficheros de `build/`** (líneas 20-28) con `[IO.File]::ReadAllText`, que respeta los
   acentos y la `ñ` sin romper la codificación:

   | Fichero | Zona que gobierna | Tipo de contenido |
   |---|---|---|
   | `base.css` | `OD:BASE` | `<style>` |
   | `tokens.css` + `widget.css` | `OD:TOKENS` | `<style>` (los dos concatenados) |
   | `scroll-animations.css` | `OD:SCROLL` | `<style>` |
   | `app.js` | `OD:APP` | `<script>` |
   | `cabecera.html` | `OD:CABECERA` | HTML |
   | `pie.html` | `OD:PIE` | HTML |
   | `widget-whatsapp.html` | `OD:WIDGET` | HTML |
   | `exito-contacto.html` | `OD:EXITO` | HTML |

3. **Recorre una lista fija de cinco páginas** (línea 55): `index.html`, `tienda.html`,
   `personalizados.html`, `cotizar.html`, `contacto.html`. Si una no existe en disco **la omite**
   y lo dice por consola («todavía no existe, se omite»). Hoy solo existe `index.html`.
4. **Asegura las zonas** (`Asegurar-Zona`, líneas 32-53): si falta un marcador `OD:X`, lo inserta
   **vacío** para que el regenerador sea idempotente y tolere una restauración desde el historial
   del host. Dónde lo inserta depende del modo: `BASE`, `TOKENS`, `SCROLL` y `APP` antes de
   `</head>`; `CABECERA` justo después de `<body>`; `PIE` y `WIDGET` antes de `</body>`.
5. **Sustituye el contenido de cada zona** (`Reemplazar-Zona`, líneas 7-18): busca
   `<!-- OD:X -->`, busca `<!-- /OD:X -->` y cambia el fragmento intermedio por el contenido del
   fichero, respetando el marcador de cierre. Si falta cualquiera de los dos marcadores y la zona
   es obligatoria, **lanza un error y se detiene**; `EXITO` es la única zona opcional.
6. **Escribe el resultado** en UTF-8 sin BOM (`[IO.File]::WriteAllText`, línea 79) y resume por
   consola cuántas páginas reconstruyó y con qué tamaño.

Consecuencias que importan:

- El script **solo toca las zonas**. Todo lo que quede fuera de un `OD:` —la cabecera y el pie
  actuales están fuera— sobrevive a la regeneración sin cambios.
- Es **idempotente**: ejecutarlo dos veces con el mismo `build/` da el mismo archivo.
- **No existe zona para el `<head>`**, así que ni las fuentes web, ni el `<title>`, ni los
  `meta`, ni el script de Tailwind se tocan nunca.
- **No existe zona para el cuerpo**: si el `body` actual y la cabecera nueva no encajan, el
  resultado es un documento híbrido (ver R2).

### 1.2 Estado real de las zonas en `index.html`

| Zona | Estado | Qué contiene hoy |
|---|---|---|
| `OD:BASE` | **Ausente** | `base.css` (utilidades y componentes nuevos) no está inyectado |
| `OD:TOKENS` | **Desfasada** | 12.415 caracteres; paleta crema/coral y tipografía Chewy |
| `OD:SCROLL` | **Ausente** | `scroll-animations.css` no está inyectado |
| `OD:APP` | **Desfasada** | 11.969 caracteres; versión anterior de `app.js` |
| `OD:CABECERA` | **Ausente** | la cabecera está en línea en el cuerpo (línea 1512) |
| `OD:PIE` | **Ausente** | el pie está en línea en el cuerpo (línea 2704) |
| `OD:WIDGET` | **Idéntica** | coincide con `widget-whatsapp.html` |
| `OD:EXITO` | **Desfasada** | 722 caracteres frente a 1.054 del original |

`build/tokens.css` y `build/app.js` actuales describen el diseño aprobado; el contenido de las
zonas del HTML es de antes de ese cambio.

---

## 2. Inventario de `index.html`

2.834 líneas, 132.422 bytes, 36 atributos `data-od-id`.

### 2.1 Bloques de estilo y de script

| # | Tipo | Líneas | Zona | Origen |
|---|---|---|---|---|
| 1 | `<style>` | 18-75 | fuera de zona | heredado, sin control de `build/` |
| 2 | `<style>` | 77-129 | fuera de zona | heredado, sin control de `build/` |
| 3 | `<style>` | 131-782 | fuera de zona | heredado, sin control de `build/` |
| 4 | `<style>` | 785-1109 | `OD:TOKENS` | `tokens.css` + `widget.css` (**versión antigua**) |
| 5 | `<style id="mejoras">` | 1456-1500 | fuera de zona | heredado, sin control de `build/` |
| 1 | `<script src>` | 13 | — | Tailwind por CDN |
| 2 | `<script>` | 1113-1454 | `OD:APP` | `app.js` (**versión anterior**) |
| 3 | `<script>` | 2797-2832 | fuera de zona | heredado, sin control de `build/` |

**Cinco `<style>` y tres `<script>`, de los cuales solo dos están gobernados por `build/`.** El
script final (líneas 2797-2832) implementa el menú móvil, los indicadores de carrusel, el enlace
activo por `IntersectionObserver` y el botón de WhatsApp que se compacta al bajar; nada de eso
está en `build/`.

### 2.2 Landmarks

| Elemento | Cantidad | Líneas |
|---|---|---|
| `<main>` | **3** | 1576, 1774, 2396 |
| `<header>` | 1 | 1512 |
| `<footer>` | **2** | 2380, 2704 |
| `<nav>` | 4 | 1545 (escritorio), 1569 (móvil), 1812 (pestañas del catálogo), 2776 (pie) |
| `<section>` | 11 | ver §3 |
| `<article>` | 22 | 19 fichas de producto + 3 compromisos |
| `<form>` | 1 | 2493 |
| `<aside>` | 1 | 2616 (respuesta inmediata) |

El `<footer>` de la línea 2380 está **en medio del flujo**, entre «Cómo trabajamos» y «Lo que
garantizamos por escrito»: es el pie de una versión anterior que quedó dentro del documento (se ve
como una línea de copyright suelta en mitad de la página).

### 2.3 Identificadores

- **0 identificadores duplicados.** 78 `id` distintos, todos únicos.
- El inventario de `data-od-id` cubre las 11 secciones, las 19 fichas de producto, los 3
  compromisos, los CTA, el formulario, el widget y la tabla de contenidos.
- `aria-controls` de las 5 pestañas apunta a los 5 paneles existentes; `aria-labelledby` de los
  paneles apunta a sus pestañas. Las relaciones ARIA son coherentes.

### 2.4 Clases

- **324 clases distintas** en el marcado.
- La gran mayoría son utilidades de **Tailwind servidas por el CDN** (`w-`, `h-`, `bg-`,
  `text-`, `grid-cols-`, `md:`, `lg:`, `hover:`, `focus:`…).
- Las clases propias (`ink-border-thick`, `shadow-offset`, `sticker-border`, `cat-tab`,
  `btn-whatsapp`, `field-error-msg`, `od-was`…) **existen todas** en el CSS del documento.
- **Excepciones: tres utilidades del marcado no tienen regla en ningún archivo del proyecto**:
  `bd-ink/40`, `tx-ink/70` y `hover:sticker-shadow-lg`. Tailwind no las genera (no son suyas) y
  el CSS del documento no las define, así que hoy no aplican ningún estilo.

### 2.5 Variables CSS

- **52 variables están definidas más de una vez** en el documento, casi siempre porque conviven
  dos capas: el `:root` heredado (líneas 18-129, `--ink #3b2417`, `--bg #f4e6c8`,
  `--card #fffaf1`, `--accent #d4573f`, `--awning #f7c948`) y la capa de tokens de la zona
  `OD:TOKENS` (`--surface`, `--muted`, `--line`, `--accent-fill`…).
- **6 variables definidas y nunca usadas**: `--card`, `--color-accent`, `--color-card`,
  `--color-green`, `--color-toldo`, `--shadow-flat-sm`.
- **0 alias redundantes**: ninguna variable es solo `var(--otra)`.
- El documento actual **no** usa la nomenclatura de `build/tokens.css` (`--color-ink`,
  `--surface`, `--muted`, `--line`, `--accent-fill`…), que es la que se quiere como fuente de verdad.

### 2.6 Tailwind frente a clases propias

- Tailwind entra por CDN (`https://cdn.tailwindcss.com`, línea 13): el HTML **no** lleva
  Tailwind compilado.
- Las clases propias viven en el `<style>` heredado (líneas 18-782) y en la zona `OD:TOKENS`.
- Consecuencia: **la página depende de una conexión externa para maquetarse**. Sin red, el layout
  se viene abajo aunque los ficheros locales carguen.

---

## 3. Secciones reales y qué las afecta

| Sección | `id` | `data-od-id` | Línea | CSS que la afecta | JS que la afecta |
|---|---|---|---|---|---|
| Cabecera | `site-header` | — | 1512 | `#site-header` (línea 1458), bloque heredado 131-782 | `theme-toggle`, `menu-btn`, `menu-movil`, `IntersectionObserver` de enlaces activos (script final) |
| Navegación escritorio | — | — | 1545 | bloque heredado | `marcarPaginaActual()` de `app.js` |
| Navegación móvil | `menu-movil` | — | 1569 | `html .menu-movil` (1462-1465, 1495) | `iniciarMenu()` de `app.js` **y** el script final: **las dos capas abren y cierran el mismo panel** |
| Hero | — | `cta-ver-productos` | 1576 (`<main>`) | bloque heredado + `OD:TOKENS` | — |
| Beneficios | `beneficios` | `beneficios-taller` | 1691 | bloque heredado | — |
| Aviso de taller | `aviso-taller` | `aviso-taller` | 1777 (`<main>`) | `#aviso-taller` (1487) | — |
| Catálogo | `tienda` | `catalogo-productos` | 1794 | `#tienda`, `[role="tablist"]` (1467), `[role="tabpanel"]` (1470), `[data-od-id^="producto-"]` (1482-1486) | `iniciarCategorias()` de `app.js`; script final: centra la pestaña activa al hacer clic |
| Panel de pestañas | `cat-regalos` … `cat-identificacion` | igual | 1821-2092 | heredado | `iniciarCategorias()` (teclado, `aria-selected`, `hidden`) |
| 19 fichas | — | `producto-*` | 1828-2140 | `[data-od-id^="producto-"]` | `a[data-producto]` → prellena el formulario (`iniciarCotizacion()`) |
| Método | `proceso` | `proceso-taller` | 2151 | heredado | observación de enlace activo |
| **Pie intercalado** | — | — | 2380 | heredado | — |
| Garantías | `resenas` | `resenas` | 2396 (`<main>`), 2401 | heredado | observación de enlace activo |
| 3 compromisos | — | `compromiso-*` | 2418-2446 | heredado | — |
| Contacto | `contacto` | `contacto` | 2465 | heredado | `iniciarFormulario()` |
| Formulario | `form-contacto` | — | 2493 | heredado | validación en cliente, resumen de errores, envío simulado |
| Confirmación | `exito-contacto` | — | 2605 | `OD:EXITO` (desfasada) | `iniciarFormulario()` |
| Aviso legal | `aviso-legal` | — | 2765 | heredado | — |
| Widget WhatsApp | — | `widget-whatsapp` | 2785 | `OD:WIDGET` | script final: se compacta al bajar de 400 px |

---

## 4. Línea base visual

En `qa/baseline/`:

- **`index.html`**: copia del documento actual. Idéntica byte a byte salvo **una** línea, la ruta
  de la imagen del héroe (`assets/…` → `../../assets/…`), ajustada para que la copia se vea desde
  su carpeta.
- **`capturas/`**: 21 PNG + `manifest.json` con el índice de cada captura.

| Conjunto | Contenido | Condiciones |
|---|---|---|
| `completa-*.png` (6) | página completa | 375 × 812, 768 × 1024, 1280 × 900; claro y oscuro |
| `catalogo-*.png` (15) | sección `#tienda` | 5 pestañas × 1280 (claro y oscuro) + 5 pestañas × 375 (claro) |

Cómo se generó y cómo se compara: `qa/capturar-linea-base.mjs` (Chrome headless con
`playwright-core`, `reducedMotion: reduce`, tema forzado por `localStorage` y pestaña activada por
hash). Ver `qa/baseline/README.md`.

**Verificación:** en las 15 capturas de catálogo se comprobó que queda **exactamente un panel
visible** y que la pestaña activa es la esperada (`paneles_visibles: ["cat-…"]`,
`pestana_activa: ["…"]` en `manifest.json`). Las 6 capturas de página completa se revisaron a ojo
en modo claro y oscuro: la portada renderiza correctamente, con la foto del héroe, las 19 fichas y
el pie.

> Esta línea base es el **«antes»**, no el diseño final: captura la versión crema/coral con Chewy.
> Cuando se regenere la portada habrá que capturar una línea base nueva.

---

## 5. Riesgos

### R1 — `index.html` está desfasado respecto de `build/` (crítica)

El proyecto tiene dos verdades: `build/` con el diseño aprobado y `index.html` con una versión
anterior. La zona `OD:TOKENS` del HTML define `--bg: #f4e6c8` y `--accent: #d4573f`; `build/tokens.css`
define `--bg: #f6f5fa` y `--accent: #4f2cf5`. La cabecera del HTML usa `<header id="site-header">`
con clases de Tailwind; `build/cabecera.html` usa `<header class="site-header od-header"
data-od-id="cabecera">` con una franja de datos logísticos que no aparece en la página actual.

**Riesgo:** cualquier trabajo que dé por bueno el estado actual partirá de una versión que el
cliente no ha aprobado, y cualquier regeneración producirá un híbrido.

### R2 — Regenerar ahora duplicaría cabecera y pie (crítica)

Simulación ejecutada sobre una **copia** en carpeta temporal (el proyecto no se tocó):

```
index.html reconstruido (189.215 caracteres)
lineas origen=2.834  resultado=4.703  lineas distintas=5.367
bytes  origen=132.422  resultado=189.592
```

En el resultado aparecen **2 `<header>`**, **3 `<footer>`**, 7 `<nav>` y 7 `<style>`: la cabecera y
el pie nuevos (inyectados por el script) **se suman** a la cabecera y el pie antiguos, que están en
línea en el cuerpo y fuera de cualquier zona `OD:`.

**Riesgo:** una regeneración sin más deja el documento con dos cabeceras y tres pies, es decir, un
fallo visible en la primera pantalla.

### R3 — Tres `<main>` y un `<footer>` en medio del flujo (alta)

`<main>` en 1576, 1774 y 2396. El `<footer>` de 2380 rompe el orden de lectura y aparece entre dos
secciones de contenido.

**Riesgo:** captura de pantalla mal leída por technologies de asistencia y por los buscadores;
además, el pie intercalado es visible a simple vista.

### R4 — Dos paletas conviviendo (alta)

52 variables repetidas entre la capa heredada y la de tokens, 6 muertas. La página se ve hoy con
la paleta antigua porque la capa heredada declara `--bg`, `--ink`, `--accent`… en `:root` y la zona
de tokens los vuelve a declarar.

**Riesgo:** un cambio de color aplicado en `build/tokens.css` no se reflejará de forma uniforme
mientras la capa heredada siga declarando las mismas variables.

### R5 — Comportamiento fuera del control de `build/` (media)

El bloque `<style id="mejoras">` (1456-1500) y el script final (2797-2832) no pertenecen a ninguna
zona. Aportan el menú móvil, los indicadores de carrusel, el enlace activo por observación y el
widget compacto de WhatsApp.

**Riesgo:** si alguien «ordena» la página quitando lo que parece sobrante fuera de las zonas, se
pierde comportamiento real sin que el linter avise.

### R6 — La tipografía del `<head>` no es la del diseño aprobado (media)

El `<link>` de Google Fonts (línea 16) carga **Chewy + Nunito**. `build/` ya usa **Archivo + Nunito**
(`.font-display` en `build/base.css`). Como no hay zona para el `<head>`, regenerar **no** cambia
esa línea.

**Riesgo:** tras regenerar, los titulares nuevos quedarían con la tipografía de cuerpo y el resto
con Chewy: mezcla tipográfica.

### R7 — Cuatro de las cinco páginas no existen (media)

`build/actualizar-portada.ps1` las omite con aviso. `build/pie.html` enlaza a `tienda.html`,
`personalizados.html#polerones` e `index.html#tienda` («Catálogo completo (20 productos)»).

**Riesgo:** al inyectar el pie nuevo aparecen enlaces a páginas inexistentes.

### R8 — `.font-display` no existe en el CSS actual (baja)

La usa `build/cabecera.html` y `build/pie.html`, y solo está definida en `build/base.css`.

**Riesgo:** si se inyecta cabecera y pie sin `OD:BASE`, sus titulares saldrían con la tipografía del
cuerpo.

### R9 — 19 fichas frente a las 20 que anuncia el pie nuevo (baja)

**Riesgo:** inconsistencia visible entre el catálogo y el pie.

### R10 — Tailwind por CDN (baja)

**Riesgo:** sin conexión, la página pierde el layout. Además es una dependencia externa en
producción y un punto de fallo de rendimiento.

### R11 — `aria-current` con dos convenciones (baja)

`app.js` marca la página actual con `aria-current="page"`; el script final usa
`aria-current="true"`/`"false"` sobre los enlaces internos de la cabecera. Son valores distintos
para la misma propiedad.

**Riesgo:** Readers inconsistentes; `aria-current="false"` no es un valor válido.

### R12 — Tres utilidades sin regla CSS (baja)

`bd-ink/40`, `tx-ink/70` y `hover:sticker-shadow-lg` se usan en el marcado y no las define ni
Tailwind ni el CSS del proyecto.

**Riesgo:** bordes y opacidades que no se aplican; un detalle fino que desaparece al regenerar.

---

## 6. Propuesta de decisiones (para la siguiente etapa, sin aplicarlas aquí)

1. **Fijar cuál es el origen de verdad.** Opción A: `build/` manda y `index.html` se reconstruye
   desde cero con las cinco páginas. Opción B: el HTML actual manda y `build/` se alinea con él.
   La auditoría recomienda **A**, porque `build/` contiene el diseño aprobado por el cliente
   (cabecera y pie nuevos, paleta oficial, tipografía corporativa) y el HTML actual no lo es.
2. **Antes de regenerar, vaciar el cuerpo.** Retirar de `index.html` la cabecera y el pie antiguos
   y dejar sus sitios con las zonas `OD:CABECERA` y `OD:PIE`, para que el script no duplique nada
   (R2). Lo mismo con el `<footer>` intercalado de la línea 2380 y con el segundo `<main>`.
3. **Añadir una zona para el `<head>`** (o un fichero `meta.html`) para que las fuentes web, el
   `<title>` y los `meta` se actualicen con el diseño nuevo (R6).
4. **Recuperar las cuatro páginas que faltan** (`tienda.html`, `personalizados.html`,
   `cotizar.html`, `contacto.html`) antes de inyectar el pie nuevo, o quitar esos enlaces del pie
   (R7).
5. **Capturar una línea base nueva** cuando la portada esté regenerada: la actual solo sirve como
   «antes» (R1).
6. **Decidir qué hacer con Tailwind por CDN** (R10): compilarlo en `build/` o, en su defecto,
   aceptar la dependencia de forma explícita.

---

## 7. Pruebas ejecutadas

| Prueba | Resultado |
|---|---|
| `od lint index.html` | **clean — 0 hallazgos (P0 0 · P1 0 · P2 0)** |
| Lectura y análisis de `build/actualizar-portada.ps1` | 83 líneas; 9 ficheros de origen; 8 zonas `OD:` |
| Comparación de cada zona contra su fichero de `build/` | 1 idéntica, 3 desfasadas, 4 ausentes |
| Simulación del ensamblado sobre copia en temporal | 2.834 → 4.703 líneas; 2 `<header>`, 3 `<footer>` |
| Inventario de landmarks, `id`, clases y variables | 3 `<main>`, 2 `<footer>`, 0 `id` duplicados, 324 clases, 52 variables repetidas, 6 muertas |
| Captura con Chrome headless | 21 PNG + `manifest.json`; un solo panel visible por captura de pestaña |
| Revisión visual de las capturas | correcta en claro y en oscuro, a 375 y 1280 px |

**No ejecutado, y por qué:** `build/actualizar-portada.ps1` **no** se ejecutó contra el proyecto.
Habría modificado `index.html` (R2), y el objetivo de esta etapa era no tocar ningún archivo
existente. Se simuló sobre una copia en carpeta temporal, que es lo que documenta R1 y R2.

---

## 8. Archivos

### Añadidos (nuevos, en `qa/`)

- `qa/auditoria.md` — este informe.
- `qa/capturar-linea-base.mjs` — script que regenera la línea base (levanta servidor estático,
  captura con Chrome headless y escribe `manifest.json`).
- `qa/baseline/index.html` — copia del documento actual (una única diferencia: la ruta de la
  imagen del héroe).
- `qa/baseline/README.md` — qué contiene la línea base y cómo compararla.
- `qa/baseline/capturas/completa-*.png` (6) y `qa/baseline/capturas/catalogo-*.png` (15).
- `qa/baseline/capturas/manifest.json` — índice de las 21 capturas.

### Modificados

- Ninguno. No se ha tocado `index.html`, ni `build/`, ni `assets/`, ni ningún otro fichero
  existente del proyecto.

# `build/` como única fuente de verdad

> **Documento de etapa.** Describe el montaje de `build/` tal como estaba cuando se escribió. Las
> referencias a `build/pendiente-violeta/` y a `build/scroll-animations.css` son **históricas**: hoy
> están en `archive/` y el movimiento vive en `build/motion.css`. Ver `qa/orden-proyecto.md`.

**Fecha:** 12 de noviembre de 2026
**Alcance:** descomponer `index.html` en sus orígenes dentro de `build/` y regenerarlo desde allí.
**Naturaleza de la etapa:** refactor puro. Cero cambios visuales, de contenido o de comportamiento.

---

## 1. El problema que se حلía

`index.html` es un fichero generado, pero contenía cosas que **no** estaban en `build/`: tres
bloques `<style>` heredados, un bloque de «mejoras» (menú móvil, carruseles, pestañas fijas…) y
un `<script>` suelto al final del `<body>`. Ejecutar `build/actualizar-portada.ps1` habría
borrado todo eso.

Además, `build/` contenía el **rediseño violeta** (paleta `#f6f5fa`/`#4f2cf5`, tipografía
Archivo, cabecera y pie nuevos, 20 fichas) mientras que la página en disco era la versión
anterior (paleta crema, tipografía Chewy, 19 fichas). `build/` y la página contaban historias
distintas.

## 2. Diferencias encontradas entre `index.html` y lo que generaba el script

| # | Categoría | Qué era | Dónde estaba |
|---|---|---|---|
| 1 | Zona ausente | `OD:BASE` no existía: los tres bloques CSS heredados vivían en línea en el `<head>` | `index.html`, líneas 18-782 |
| 2 | Zona ausente | `OD:SCROLL` no existía: el bloque de mejoras de página estaba en línea | `index.html`, líneas 1456-1500 |
| 3 | Zona ausente | `OD:CABECERA` no existía: la cabecera estaba en línea | `index.html`, líneas 1511-1573 |
| 4 | Zona ausente | `OD:PIE` no existía: el pie de página estaba en línea | `index.html`, líneas 2704-2782 |
| 5 | Zona desfasada | `OD:TOKENS` con la capa de tokens antigua (crema) | `build/tokens.css` (violeta) |
| 6 | Zona desfasada | `OD:APP` con el JavaScript anterior | `build/app.js` (posterior) |
| 7 | Zona desfasada | `OD:EXITO` con el panel de confirmación anterior | `build/exito-contacto.html` |
| 8 | Fuera de zona | `<script>` suelto: menú móvil, indicadores de carrusel, pestaña activa centrada, enlace activo por sección, WhatsApp compacto | `index.html`, líneas 2797-2832 |
| 9 | Fuera de zona | `<style id="mejoras">`: menú móvil, `.swipe`/`.dots`, catálogo a 2 columnas, pestañas sticky, transición de paneles, WhatsApp compacto | `index.html`, líneas 1456-1500 |
| 10 | Fuera de zona | `<header>` y `<footer>` completos, con su navegación y sus cuatro columnas | `index.html`, en línea |
| 11 | Marcado | Atributos `autocomplete`, clases `swipe` y el menú móvil dentro del cuerpo | `index.html`, cuerpo |
| 12 | Defecto | `data-od-id` dentro del valor de `class` en «Ver productos» | `index2.html` (copia obsoleta) |
| 13 | Defecto | `id="theme-toggle"` duplicado | `index2.html` (copia obsoleta) |

## 3. Qué se movió al origen

| Origen | Contenido que recibe |
|---|---|
| `build/base.css` | los tres bloques CSS heredados, ya sin sus `:root` (los tokens viven en `tokens.css`) |
| `build/tokens.css` | la capa de tokens de la página |
| `build/widget.css` | las reglas del botón flotante de WhatsApp |
| `build/scroll-animations.css` | el bloque de mejoras de página (menú móvil, carruseles, 2 columnas, pestañas sticky, transición, widget compacto) |
| `build/app.js` | el JavaScript de la página **más** el script suelto, convertido en seis funciones con nombre: `iniciarMedidaCabecera`, `iniciarMenuMovil`, `iniciarCarruseles`, `centrarPestanaActiva`, `iniciarEnlaceActivo`, `iniciarWhatsAppCompacto` |
| `build/cabecera.html` → `build/sections/header.html` | la cabecera completa |
| `build/pie.html` → `build/sections/footer.html` | el pie de página completo |
| `build/widget-whatsapp.html` → `build/sections/widget-whatsapp.html` | el botón flotante |

El marcado que **no** obtiene el script (el cuerpo, con sus 19 fichas de catálogo y el formulario)
sigue editándose en `index.html`, que es su origen: el script solo sustituye el contenido entre
marcadores `OD:`.

## 4. El rediseño violeta, archivado

Al alinear `build/` con la página en disco, el rediseño violeta con tipografía Archivo que estaba
en `build/` no se eliminó: quedó en **`build/pendiente-violeta/`** (9 ficheros: `tokens.css`,
`base.css`, `widget.css`, `scroll-animations.css`, `app.js`, `cabecera.html`, `pie.html`,
`exito-contacto.html`, `theme-toggle.html`).

Es una decisión pendiente, no un descarte: esa dirección responde al encargo corporativo del
cliente («moderno, minimalista, profesional, sin tono infantil»), mientras que la versión en disco
sigue con la tipografía redondeada Chewy. Retomarlo es un cambio acotado ahora que todo es
reproducible desde `build/`.

## 5. Verificación

| Prueba | Resultado |
|---|---|
| Texto visible antes y después | **idéntico** |
| Bloques `<style>` / `<script>` | de 5 y 3 a 3 y 2 (los huérfanos están ahora en `build/`) |
| `data-od-id` | 36, los mismos |
| Cabecera y pie | 1 `<header>` y 2 `<footer>`, los mismos que antes (no se duplican) |
| Capturas contra la línea base | idénticas dentro del ruido de captura |
| `od lint index.html` | clean, 0 hallazgos |

Los dos defectos de `index2.html` (el `data-od-id` dentro del `class` y el conmutador duplicado)
**no estaban en `index.html`**, que ya los tenía correctos; se corrigieron en `index2.html`, que
es una copia obsoleta de la versión de las 18:10.

## 6. Archivos

**Creados:** `build/base.css`, `build/sections/*.html` (10), `qa/refactor-build.md`.
**Modificados:** `build/tokens.css`, `build/widget.css`, `build/scroll-animations.css`,
`build/app.js`, `build/actualizar-portada.ps1`, `index.html`.
**Eliminados:** `build/cabecera.html`, `build/pie.html`, `build/widget-whatsapp.html` (movidos).
**Archivados:** los nueve ficheros del rediseño violeta en `build/pendiente-violeta/`.

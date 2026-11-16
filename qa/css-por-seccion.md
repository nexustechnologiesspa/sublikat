# CSS por sección

> **Documento de etapa.** Describe el refactor del CSS tal como estaba cuando se escribió. Las
> referencias a `build/scroll-animations.css` y a la zona `OD:SCROLL` son **históricas**: ese archivo
> se repartió entre los CSS de sección y el movimiento vive hoy en `build/motion.css` (zona
> `OD:MOTION`). Ver `qa/orden-proyecto.md`.

**Fecha:** 12 de noviembre de 2026
**Alcance:** el CSS de `build/`, repartido en `build/css/` con un archivo por sección.
**Naturaleza de la etapa:** refactor puro. Cero cambios visuales, de contenido o de comportamiento.

---

## 1. Resultado

`build/css/` tiene un archivo por sección, con el orden de carga definido en
`build/actualizar-portada.ps1` y documentado en `build/css/README.md`:

| Fichero | Contenido | Reglas |
|---|---|---|
| `build/tokens.css` | solo variables de diseño: un bloque por tema y otro con lo que no cambia | 3 bloques |
| `build/css/base.css` | reset, tipografía y utilidades base | 15 |
| `build/css/components.css` | componentes compartidos y utilidades de color | 96 |
| `build/css/header.css` | cabecera, navegación y menú móvil | 5 |
| `build/css/hero.css` | héroe (solo utilidades por ahora) | 0 |
| `build/css/beneficios.css` | ventajas (solo utilidades por ahora) | 0 |
| `build/css/aviso.css` | aviso de taller | 1 |
| `build/css/catalogo.css` | pestañas, paneles y fichas | 7 |
| `build/css/proceso.css` | método de trabajo (solo utilidades por ahora) | 0 |
| `build/css/compromisos.css` | compromisos del taller | 13 |
| `build/css/contacto.css` | formulario, ficha del taller y confirmación | 27 |
| `build/css/footer.css` | pie de página | 20 |
| `build/css/widget.css` | botón flotante de WhatsApp | 14 |

Regla aplicada: **una regla que usen varias secciones va a `components.css`; una regla de una sola
sección, a su archivo**. Por eso el héroe, las ventajas y el método de trabajo se quedan sin
reglas propias: hoy se componen con utilidades de Tailwind y con componentes compartidos.

## 2. Qué se movió

| Antes | Ahora |
|---|---|
| `build/base.css` (componentes heredados) | `build/css/components.css` + `build/css/base.css` |
| `build/tokens.css` (variables + utilidades + ajustes + responsive) | `build/tokens.css` (solo variables) + `build/css/components.css` + los archivos de sección |
| `build/widget.css` | `build/css/widget.css` |
| `build/scroll-animations.css` (mejoras de página) | repartido: `header.css` (menú móvil), `components.css` (`.swipe`/`.dots`), `catalogo.css` (pestañas y fichas), `aviso.css`, `footer.css`, `base.css`, `widget.css` |

`build/base.css`, `build/widget.css` y `build/scroll-animations.css` quedaron **eliminados**.

## 3. Reglas eliminadas

**Cinco reglas muertas**, comprobadas con búsqueda en el marcado, en los parciales y en
`build/app.js` (0 apariciones): `.stripes-awning`, `.stars-group`, `.review-card-top`,
`.source-badge`, `.review-date`.

**Diecinueve overrides `html .x`** que solo existían para ganarle a otra regla: se fundieron en
esa regla y se borraron, dejando el mismo valor final.

| Override | Se funde en | Cambio |
|---|---|---|
| `html .btn-submit` | `.btn-submit` | `background: var(--accent)` → `var(--accent-fill)` |
| `html .btn-submit:hover` | `.btn-submit:hover` | redundante |
| `html .btn-whatsapp` | `.btn-whatsapp` | redundante |
| `html .sticker-badge` | `.sticker-badge` | `color: var(--ink)` → `var(--awning-ink)` |
| `html .demo-tag` | `.demo-tag` | borde a `var(--line)` |
| `html .assurance-badge` | `.assurance-badge` | redundante |
| `html .assurance-text` | `.assurance-text` | redundante |
| `html .field-input, .field-select, .field-textarea` | las tres | borde a `var(--line)` |
| `html .field-input.has-error` | la misma | redundante |
| `html .site-footer` | `.site-footer` | borde superior a `var(--line)` |
| `html .footer-hours-box` | la misma | redundante |
| `html .legal-notice-box` | la misma | redundante |
| `html .footer-brand-title, .footer-hours-box strong` | las dos | redundante |
| `html .author-role, .review-date, .field-help-text, .detail-text` | las tres | redundante |

Los overrides de modo oscuro (`[data-theme="dark"] .sticker-border`…) **se conservan**: adaptan los
componentes al modo oscuro y no se pueden quitar sin cambiar el color de los bordes y las sombras.

## 4. Convención de nombres

Documentada en `build/css/README.md`: `.cat-` para el catálogo, `.comp-` para los compromisos,
`.ct-` para el contacto y `.proc-` para el método de trabajo.

**No se renombró ninguna clase en esta etapa**, porque la tarea lo pedía solo en caso de colisión y
no hay ninguna. Queda pendiente, para una etapa posterior, renombrar `.reviews-*`/`.review-*`/
`.rating-*`/`.author-*` a `.comp-*` y `.contact-*`/`.detail-*`/`.assurance-*` a `.ct-*`; cuando se
haga, hay que actualizar a la vez los parciales `build/sections/compromisos.html` y
`build/sections/contacto.html`, el CSS y `build/app.js` (los identificadores que crea el
JavaScript, `.field-error-msg` y `.has-error`, no se tocan).

## 5. Orden de carga

Definido en `build/actualizar-portada.ps1`, en tres zonas del `<head>`:

| Zona | Qué inyecta |
|---|---|
| `OD:BASE` | `css/base.css` |
| `OD:TOKENS` | `tokens.css` |
| `OD:ESTILOS` | `css/components.css` y, detrás, un archivo por sección en el orden de la página |

La zona `OD:SCROLL` (que llevaba las mejoras de página) se renombró a `OD:ESTILOS`: era el nombre
viejo de lo que ahora es el CSS por sección. Es el único cambio estructural en `index.html`: dos
líneas de marcador.

El orden relativo de las reglas se conservó: reset → componentes heredados → utilidades de color
→ ajustes de modo oscuro → sección → sección.

## 6. Verificación

| Prueba | Resultado |
|---|---|
| Comparación semántica del CSS de la línea base contra el actual (regla a regla) | 24 selectores eliminados (los 5 muertos y los 19 overrides fundidos) y 5 con el valor del override ya incorporado; ningún otro cambio de declaración |
| Capturas contra la línea base | idénticas dentro del ruido de captura medido |
| `od lint index.html` | **clean — 0 hallazgos (P0 0 · P1 0 · P2 0)** |
| Idempotencia del ensamblador | dos ejecuciones seguidas dan el mismo `sha256` |

**Sobre el ruido de captura:** comparando **la misma página** en dos ejecuciones se obtiene
exactamente la misma diferencia que contra la línea base (24.287 px en `completa-375-light`, el
0,75 % de la columna de texto a 375 px). Es rasterización de la tipografía, no un cambio de estilo:
la comparación semántica del CSS no encuentra ninguna diferencia de valor.

## 7. Archivos

**Creados:** `build/css/README.md` y los 12 ficheros de CSS, `qa/css-por-seccion.md`.

**Modificados:** `build/tokens.css` (solo variables), `build/actualizar-portada.ps1` (orden de
carga y zonas), `index.html` (dos líneas de marcador), `ARQUITECTURA.md` (§2, §3 y §4).

**Eliminados:** `build/base.css`, `build/widget.css`, `build/scroll-animations.css`.

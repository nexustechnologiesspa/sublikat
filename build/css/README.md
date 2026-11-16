# CSS por sección

El CSS de la portada vive aquí, repartido por sección. Un solo bloque de tokens
(`build/tokens.css`) y, detrás, un archivo por sección.

## Orden de carga

Lo define `build/actualizar-portada.ps1`, en este orden:

| # | Fichero | Qué trae |
|---|---|---|
| 1 | `build/tokens.css` | variables de diseño: una definición por tema y nombre canónico |
| 2 | `build/css/base.css` | reset, tipografía y utilidades base |
| 3 | `build/css/components.css` | componentes compartidos: botones, tarjetas sticker, badges, campos y utilidades de color |
| 4 | `build/css/header.css` | cabecera, navegación y menú móvil |
| 5 | `build/css/hero.css` | héroe de la portada |
| 6 | `build/css/beneficios.css` | bloque de ventajas |
| 7 | `build/css/aviso.css` | aviso de taller |
| 8 | `build/css/catalogo.css` | pestañas, paneles y fichas del catálogo |
| 9 | `build/css/proceso.css` | método de trabajo |
| 10 | `build/css/compromisos.css` | compromisos del taller |
| 11 | `build/css/contacto.css` | formulario, ficha del taller y confirmación |
| 12 | `build/css/footer.css` | pie de página |
| 13 | `build/css/widget.css` | botón flotante de WhatsApp |

El orden importa: las utilidades de color y los ajustes de modo oscuro van en `components.css`
después de los componentes heredados, y cada sección va al final para poder Adjustar sus
propios componentes sin tocar los compartidos.

## Convención de nombres

| Prefijo | Sección | Familias que la usan hoy |
|---|---|---|
| `.cat-` | catálogo | `.cat-tab` |
| `.proc-` | método de trabajo | — (la sección aún no tiene reglas propias) |
| `.comp-` | compromisos | hoy `.reviews-*`, `.review-*`, `.rating-*`, `.author-*` |
| `.ct-` | contacto | hoy `.contact-*`, `.detail-*`, `.assurance-*`, `.exito-panel`, `.form-container-card` |

El héroe, el bloque de ventajas, el método de trabajo y el aviso se componen con utilidades de
Tailwind y con componentes compartidos, así que sus archivos están preparados pero todavía no
tienen reglas propias.

**Pendiente de una etapa posterior:** renombrar las familias `.reviews-*`/`.review-*`/`.rating-*`/
`.author-*` a `.comp-*` y las `.contact-*`/`.detail-*`/`.assurance-*` a `.ct-*`. No se renombró en
esta etapa porque no había colisiones y porque los identificadores que crea el JavaScript
(`.field-error-msg`, `.has-error`) no se tocan. Cuando se renombre, hay que actualizar a la vez
el marcado de `build/sections/compromisos.html` y `build/sections/contacto.html`, el CSS y
`build/app.js`.

## Reglas

- Ningún color vive como hexadecimal suelto: todo es `var(--…)`.
- Solo hay dos `!important` en todo el CSS: los de `[hidden]` y los de `prefers-reduced-motion`.
  No se añaden más.
- Una regla que usen varias secciones vive en `components.css`; una regla que use una sola
  sección vive en el archivo de esa sección.
- Si una regla no casa con ningún elemento, se borra (comprobado con búsqueda en el marcado y en
  `build/app.js`).

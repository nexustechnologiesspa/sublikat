# Sublikat — Etapa 3.6c: estructura del catálogo

## Alcance y fuentes

Se usaron como referencia el bloque `OD:CATALOGO` de
`docs/archive/index-original.html` (líneas 3326–3704), la auditoría de la etapa
3.5, los informes de las etapas 3.6a y 3.6b, y los módulos actuales
`catalogData.js`, `ProductCard.jsx`, `ProductIcons.jsx` y `Catalog.jsx`.

Se completó la composición de catálogo en `src/sections/Catalog/Catalog.jsx`.
No se integraron interacciones de pestañas ni se modificaron otros
componentes, estilos o datos.

## Estructura implementada

La sección conserva la raíz original:
`section#tienda[aria-labelledby="heading-catalogo"][data-od-id="catalogo-productos"]`.
Sus hijos directos aparecen en el mismo orden del original:

1. Encabezado en `div.flex.flex-col.md:flex-row...`, con etiqueta decorativa,
   `h2#heading-catalogo`, descripción y tarjeta lateral de ejemplo.
2. `nav[role="tablist"][aria-label="Categorías del catálogo"].od-tablist`.
3. Cinco `section[role="tabpanel"]`, cada una con su encabezado, contador y
   grid de tarjetas.

No se agregaron wrappers entre la raíz, el encabezado, la navegación ni los
paneles. Los paneles y botones se generan con `catalogCategories`; cada grid
filtra `catalogProducts` por el código `dataCategoria` y renderiza los
productos en su orden original mediante `ProductCard`.

| Orden | Categoría | `data-categoria` | ID de pestaña | ID del panel | Tarjetas |
|---:|---|---|---|---|---:|
| 1 | Regalos personalizados | `regalos` | `tab-cat-regalos` | `cat-regalos` | 7 |
| 2 | Cuadros y fotografías | `cuadros` | `tab-cat-cuadros` | `cat-cuadros` | 3 |
| 3 | Estampados textiles | `textiles` | `tab-cat-textiles` | `cat-textiles` | 5 |
| 4 | Papelería corporativa | `papeleria` | `tab-cat-papeleria` | `cat-papeleria` | 2 |
| 5 | Identificación corporativa | `identificacion` | `tab-cat-identificacion` | `cat-identificacion` | 3 |
| **Total** | | | | | **20** |

## Atributos y estado inicial

- Los cinco botones conservan `type="button"`, `role="tab"`, sus IDs,
  `aria-controls`, `aria-selected`, `tabIndex`, `data-categoria`, la clase
  `cat-tab`, el nombre visible, el contador y la clase de contador.
- La navegación conserva `role="tablist"`, `aria-label="Categorías del
  catálogo"` y sus clases originales.
- Los paneles conservan ID, `role="tabpanel"`, `aria-labelledby`,
  `data-od-id` igual al ID del panel y `space-y-4 scroll-mt-24`.
- La pestaña de Regalos está seleccionada, con `tabIndex="0"`. Las otras
  cuatro están no seleccionadas, con `tabIndex="-1"`.
- `cat-regalos` no tiene `hidden`; los otros cuatro paneles sí.
- No se añadieron eventos, hooks, listeners, manejo de foco, acceso al hash o
  almacenamiento local. Las pestañas son solo la representación estática
  inicial, según el alcance de esta etapa.

## Preservación de tarjetas y animaciones

Las veinte fichas reutilizan `ProductCard`; `Catalog.jsx` no duplica el DOM ni
los SVG de las tarjetas. Los grids mantienen
`grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6`.

La estructura de `ProductCard` conserva
`.od-reveal > div > div > svg` y los selectores
`[data-od-id^="producto-"]`. Diecinueve tarjetas reciben `od-reveal`;
Polerones permanece sin esa clase. No se modificaron `components.css`,
`motion.css` ni la animación nativa `--od-ficha`.

## Validaciones

- **Revisión final del encabezado:** cotejado completo con `OD:CATALOGO`, en
  particular el texto de la descripción en `index-original.html:3336`. El
  componente ya contiene «El precio» (no «Elprecio»), con el mismo texto,
  clases, atributos y orden que la fuente; no fue necesario cambiar ese JSX.
  La comparación SSR también confirmó la separación antes del contador de
  cada pestaña.
- `npm run build`: **correcto**; Vite 8.3.8 construyó la aplicación.
- Render SSR aislado de `Catalog.jsx` mediante Vite `ssrLoadModule` y React
  `renderToStaticMarkup`: **correcto**.
- Comparación del árbol de la sección renderizada con el bloque original:
  **correcta**. Coincidieron jerarquía y orden de etiquetas, atributos y
  valores, textos normalizados, clases, IDs, estados ARIA, contenido de
  paneles y tarjetas. La comparación ignoró comentarios HTML y espacios de
  formato entre etiquetas.
- Conteos: **5 pestañas, 5 paneles, 20 tarjetas**; por categoría,
  **7, 3, 5, 2 y 3**.
- Relaciones `aria-controls` / `aria-labelledby` e IDs: **correctas**.
- Estado visible/oculto inicial y `aria-selected`/`tabIndex`: **correctos**.
- Polerones sin `od-reveal` y diecinueve fichas con esa clase:
  **correcto**.
- `git diff --check`: **correcto**.

## Archivos

Modificado:

- `src/sections/Catalog/Catalog.jsx`

Creado:

- `docs/ETAPA-3-6C-ESTRUCTURA-CATALOGO.md`

No se detectaron diferencias de estructura o contenido respecto al HTML
original en la comparación realizada. No se modificaron `App.jsx`, datos,
componentes de tarjeta/iconos, CSS, HTML archivado, recursos ni dependencias.
No se implementó la etapa 3.6d. No se hizo commit, push ni despliegue.

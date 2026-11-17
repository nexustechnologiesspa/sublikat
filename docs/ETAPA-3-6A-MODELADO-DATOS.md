# Sublikat — Etapa 3.6a: modelado de datos del catálogo

## Fuente y alcance

Se verificaron los datos del bloque `OD:CATALOGO` de
`docs/archive/index-original.html` (líneas 3326–3704) directamente contra el
HTML y se contrastaron con
`docs/ETAPA-3-5-AUDITORIA-CATALOGO.md`. La auditoría previa coincide con el
contenido original.

Esta etapa solo crea el módulo de datos y este informe. No se implementaron
componentes, interacciones, SVG ni estilos.

## Estructura elegida

`src/sections/Catalog/catalogData.js` exporta dos arreglos:

- `catalogCategories`: una entrada por categoría con `order`, `name`,
  `dataCategoria`, `tabId`, `panelId` y `productCount`.
- `catalogProducts`: una entrada plana por producto con `order` global,
  `orderInCategory`, `category` (el valor original de `data-categoria`),
  `name`, `dataOdId`, `dataProducto`, `description`, `badge`, `svgKey` y
  `hasOdReveal`.

Los valores ausentes de descripción o distintivo se representan como `null`.
No se almacenan HTML, precios ni rutas de imagen.

El HTML no asigna IDs a los SVG. Por eso `svgKey` es una clave interna nueva,
estable y descriptiva que identifica qué SVG original habrá que representar
cuando se creen los componentes visuales. No contiene el SVG ni pretende ser
un atributo original.

## Categorías

| Orden | Nombre original | `dataCategoria` | `tabId` | `panelId` | Productos |
|---:|---|---|---|---|---:|
| 1 | Regalos personalizados | `regalos` | `tab-cat-regalos` | `cat-regalos` | 7 |
| 2 | Cuadros y fotografías | `cuadros` | `tab-cat-cuadros` | `cat-cuadros` | 3 |
| 3 | Estampados textiles | `textiles` | `tab-cat-textiles` | `cat-textiles` | 5 |
| 4 | Papelería corporativa | `papeleria` | `tab-cat-papeleria` | `cat-papeleria` | 2 |
| 5 | Identificación corporativa | `identificacion` | `tab-cat-identificacion` | `cat-identificacion` | 3 |

## Productos

El orden global y el orden dentro de cada categoría son 1-based y coinciden
con el orden DOM original. `dataProducto` conserva el nombre exacto de cada
producto; no se convierte en un slug.

| Orden | Categoría | Orden en categoría | Nombre / `dataProducto` | `dataOdId` | Descripción / distintivo | `svgKey` | `hasOdReveal` |
|---:|---|---:|---|---|---|---|:---:|
| 1 | `regalos` | 1 | Tazas | `producto-tazas` | — | `cup` | Sí |
| 2 | `regalos` | 2 | Tazas mágicas | `producto-tazas-magicas` | — | `magic-cup` | Sí |
| 3 | `regalos` | 3 | Botellas | `producto-botellas` | — | `bottle` | Sí |
| 4 | `regalos` | 4 | Mousepads | `producto-mousepads` | — | `mousepad` | Sí |
| 5 | `regalos` | 5 | Bolsas | `producto-bolsas` | — | `bag` | Sí |
| 6 | `regalos` | 6 | Relojes | `producto-relojes` | — | `watch` | Sí |
| 7 | `regalos` | 7 | Chapas para mascotas | `producto-chapas-mascotas` | — | `pet-tag` | Sí |
| 8 | `cuadros` | 1 | Cuadros de piedra | `producto-cuadros-piedra` | — | `stone-frame` | Sí |
| 9 | `cuadros` | 2 | Cuadros de fotos | `producto-cuadros-fotos` | Formatos desde A6 hasta A3 | `photo-frame` | Sí |
| 10 | `cuadros` | 3 | Cuadros de fotos en aluminio | `producto-cuadros-aluminio` | Formato A4 | `aluminum-photo-frame` | Sí |
| 11 | `textiles` | 1 | Polerones | `producto-polerones` | Descripción original; distintivo «Producto destacado» | `hoodie` | **No** |
| 12 | `textiles` | 2 | Estampado en telas de 1 color | `producto-estampado-1-color` | — | `one-color-textile` | Sí |
| 13 | `textiles` | 3 | Estampado en telas de 2 colores | `producto-estampado-2-colores` | — | `two-color-textile` | Sí |
| 14 | `textiles` | 4 | Estampado en telas de 3 colores | `producto-estampado-3-colores` | — | `three-color-textile` | Sí |
| 15 | `textiles` | 5 | Estampado en tela con imágenes | `producto-estampado-imagenes` | Formatos de hasta A3 | `image-textile` | Sí |
| 16 | `papeleria` | 1 | Tarjetas de presentación | `producto-tarjetas-presentacion` | — | `business-card` | Sí |
| 17 | `papeleria` | 2 | Tarjetas de presentación PVC | `producto-tarjetas-pvc` | — | `pvc-business-card` | Sí |
| 18 | `identificacion` | 1 | Lanyards | `producto-lanyards` | — | `lanyard` | Sí |
| 19 | `identificacion` | 2 | Credenciales | `producto-credenciales` | — | `credential` | Sí |
| 20 | `identificacion` | 3 | Credenciales PVC | `producto-credenciales-pvc` | — | `pvc-credential` | Sí |

La descripción de Polerones conservada en los datos es:
«Estampado a todo color con su diseño, desde 1 unidad. Modelos, tallas y
colores por confirmar.» Los guiones de la tabla indican `description: null` y
`badge: null` cuando el original no tiene esos elementos.

## Correspondencia y decisiones

- Los nombres, códigos de categoría, IDs de pestaña/panel, `data-od-id`,
  `data-producto`, descripciones, distintivo y orden se cotejaron con el bloque
  original.
- `category` en cada producto coincide literalmente con el `data-categoria`
  de la pestaña correspondiente.
- `dataOdId` conserva el valor del atributo HTML `data-od-id`; no representa
  un atributo `id`.
- Las veinte claves SVG son internas y únicas. El código SVG queda en el HTML
  original para su futura migración.
- El original tiene cero imágenes de producto; por ello no se agregaron
  propiedades de ruta o `alt`.
- `hasOdReveal` representa la presencia de esa clase. Polerones se mantiene
  con `false`; no se normalizó ni corrigió la excepción.
- El destino y el texto del CTA (`href="#contacto"` y «Cotizar») son comunes y
  no se duplican en cada objeto. `data-producto` sí varía por producto y su
  valor original está guardado explícitamente en cada entrada.

## Validaciones y resultados

El módulo ejecuta validaciones al importarse y lanza un `Error` si se rompe
alguna invariante. Comprueba:

- Cinco categorías y veinte productos.
- Conteos por categoría `7, 3, 5, 2, 3`.
- Orden global y orden por categoría.
- Unicidad de `dataCategoria`, IDs de pestaña/panel, `dataOdId`, nombres,
  `dataProducto` y claves SVG.
- Pertenencia de cada producto a una categoría existente.
- Presencia de clave SVG y correspondencia `dataProducto === name`.
- La excepción `hasOdReveal: false` de Polerones y `true` para los demás.

Comprobaciones ejecutadas:

- Importación ESM del módulo con Node.js: **correcta**; sus validaciones
  internas se ejecutaron sin error.
- Comparación estática de categorías, pestañas, paneles y cada tarjeta contra
  el HTML original: **correcta**; coincidieron 5 categorías, 20 productos,
  conteos, nombres, IDs, `data-producto`, descripciones, distintivo, orden y
  presencia de `od-reveal`.
- Claves SVG: **20 presentes y únicas**.
- Polerones: **`hasOdReveal: false`**.
- No se ejecutó build ni se añadieron dependencias; esta etapa solo incorpora
  un módulo de datos y el import directo cubre el requisito de importación.

## Limitaciones y archivos

Las claves SVG son identificadores internos, porque el HTML original no
proporciona IDs para esos dibujos. Los componentes deberán resolverlas a sus
SVG en una etapa posterior; no se decidió ni creó aquí esa implementación.

Archivo creado para esta etapa:

- `src/sections/Catalog/catalogData.js`
- `docs/ETAPA-3-6A-MODELADO-DATOS.md`

`docs/ETAPA-3-5-AUDITORIA-CATALOGO.md` ya estaba presente como archivo sin
seguimiento al inicio de esta tarea; se conservó intacto. No se modificaron
componentes, estilos, configuración, dependencias, recursos ni el HTML
archivado. No se hizo commit, push ni despliegue.

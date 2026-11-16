# El catálogo, desde una sola fuente de datos

**Fecha:** 12 de noviembre de 2026
**Alcance:** las 19 fichas del catálogo y las opciones del desplegable del formulario, generadas
desde `build/data/catalogo.json`.
**Naturaleza de la etapa:** refactor puro. Cero cambios visuales, de contenido o de comportamiento.

---

## 1. Resultado

El catálogo ya no está escrito a mano. `build/data/catalogo.json` es la **fuente única**: de ahí
salen las 5 pestañas con su conteo, los 5 paneles con sus 19 fichas y las 20 opciones del
desplegable del formulario. Los iconos SVG viven sueltos en `build/icons/`, uno por producto.

Para **añadir un producto basta con editar el JSON**: se probó (ver §6) y la pestaña, el panel y el
desplegable se actualizan solos.

## 2. La fuente de datos

`build/data/catalogo.json`:

```json
{
  "version": 1,
  "categorias": [
    { "id": "regalos", "nombre": "Regalos personalizados", "productos": ["tazas", "…"] }
  ],
  "productos": [
    {
      "id": "cuadros-fotos",
      "nombre": "Cuadros de fotos",
      "nota": "Formatos desde A6 hasta A3",
      "icono": "producto-cuadros-fotos.svg",
      "selectValor": "cuadros-fotos",
      "selectTexto": "Cuadros de fotos (desde A6 hasta A3)",
      "dataProducto": "Cuadros de fotos"
    }
  ],
  "opciones_extra": [{ "valor": "otro", "texto": "Otro soporte personalizado" }]
}
```

- **Categoría**: `id`, `nombre` y la lista de `productos` en su orden.
- **Producto**: `id`, `nombre`, `nota` opcional (la línea que va bajo el título en la ficha),
  `icono` (referencia al SVG), `selectValor` y `selectTexto` (lo que dice la opción del
  desplegable) y `dataProducto` (el texto del botón «Cotizar»).
- `selectValor` y `dataProducto` existen aparte del `id` porque en el catálogo original no
  coincidían: las fichas usan `producto-estampado-1-color` y el desplegable usaba
  `textil-1-color`. Se conserva cada valor tal como estaba.

## 3. Los iconos

Los 19 SVG pasaron a `build/icons/producto-<id>.svg`. Se **insertan en línea** en la ficha, no como
`<img>`: los iconos usan `stroke="currentColor"`, y como imagen externa perderían el color del
texto. Al insertarlos en línea, el renderizado es idéntico al que había.

## 4. Las plantillas y las zonas generadas

| Plantilla | Genera |
|---|---|
| `build/templates/pestana.html` | el `<button role="tab">` de una categoría |
| `build/templates/ficha.html` | el `<article data-od-id="producto-…">` de un producto |

El script las rellena con `{{id}}`, `{{nombre}}`, `{{icono}}`, `{{nota}}`, `{{conteo}}`,
`{{seleccionada}}` y `{{tabindex}}`, y mete el resultado en tres zonas nuevas:

| Zona | Qué contiene |
|---|---|
| `OD:PESTANAS` | los 5 `<button role="tab">` |
| `OD:PANELES` | los 5 `<section role="tabpanel">` con sus fichas |
| `OD:OPCIONES` | los 5 `<optgroup>` y la opción «Otro soporte personalizado» |

Las zonas viven dentro de los parciales: `build/sections/catalogo.html` y
`build/sections/contacto.html`. El script las rellena **después** de inyectar los parciales, igual
que hacía con `OD:EXITO`.

Detalles que el generador respeta:

- Solo el primer panel va visible; los otros cuatro llevan `hidden` ✓.
- Solo la primera opción del desplegable lleva `selected` ✓.
- El botón «Cotizar» conserva su `data-producto` ✓.

## 5. Lo que se conservó

| Comprobación | Resultado |
|---|---|
| Categorías | 5, mismo orden y mismo nombre |
| Productos | 19, mismo orden y mismos textos |
| `data-od-id` | los 19 `producto-*` y los 5 `cat-*`, sin cambios |
| `id` de pestaña | `tab-cat-regalos`, `tab-cat-cuadros`, `tab-cat-textiles`, `tab-cat-papeleria`, `tab-cat-identificacion` |
| `aria-controls` / `aria-labelledby` | apuntan a los mismos paneles y pestañas |
| `data-producto` | los 19, con el mismo texto |
| Notas de ficha | 3 (Cuadros de fotos, Cuadros de fotos en aluminio, Estampado en tela con imágenes) |
| «Otro soporte personalizado» | sigue siendo la última opción, fuera de los grupos |

## 6. Verificación

| Prueba | Resultado |
|---|---|
| HTML generado contra el anterior | **idéntico byte a byte**, salvo los marcadores de zona (`<!-- OD:PESTANAS -->`, `<!-- OD:PANELES -->`, `<!-- OD:OPCIONES -->`) |
| «Añadir un producto = editar solo el JSON» | **probado**: con un producto de prueba en el JSON aparecen la ficha (20 en total), su opción en el desplegable y la pestaña pasa a 8 productos; al restaurar el JSON la página vuelve a su estado anterior |
| Capturas contra la línea base (375/768/1280, claro y oscuro, 5 pestañas) | 19 de 21 idénticas al píxel; las 2 restantes dentro del ruido de captura medido (rasterización de la tipografía a 375 px) |
| `od lint index.html` | **clean — 0 hallazgos (P0 0 · P1 0 · P2 0)** |
| Enlaces internos y anclas | 0 rotos; las 12 anclas exigidas presentes |
| Pestañas, botón «Cotizar» y formulario | sin cambios: `app.js` sigue enganchándose por `id` y por atributos |

## 7. Archivos

**Creados:** `build/data/catalogo.json`, `build/icons/*.svg` (19), `build/templates/pestana.html`,
`build/templates/ficha.html`, `qa/catalogo-desde-datos.md`.

**Modificados:** `build/sections/catalogo.html` (los botones y los paneles pasan a las zonas
`OD:PESTANAS` y `OD:PANELES`), `build/sections/contacto.html` (las opciones pasan a la zona
`OD:OPCIONES`), `build/actualizar-portada.ps1` (genera y rellena las tres zonas),
`ARQUITECTURA.md` (§2 y §3), `qa/baseline/` (copia del HTML actual y 21 capturas nuevas).

**Eliminados:** nada.

## 8. Pendientes que esta etapa no toca

- **La paleta**: cerrada el 2026-11-12 en crema con tipografía Chewy. El rediseño violeta con Archivo
  está en `archive/referencias/pendiente-violeta/`.
- **La nota de ficha** es un dato del JSON, pero solo la usan hoy tres productos: no hay una nota
  visible en el resto de las fichas.
- **El desplegable del formulario** sigue sin los campos «Cantidad», «Información del diseño» y
  «Medio de contacto».

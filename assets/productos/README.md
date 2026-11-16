# Fotos de producto — Sublikat

Esta carpeta guarda **las fotografías reales de los productos del taller**. Es el destino de las
fotos que entregue el cliente y el lugar donde se quedarán cuando la web se publique.

## Por qué una carpeta aparte

`assets/stock/` contiene material de **ejemplo**: tres imágenes de 512×512 generadas para el
prototipo, con su procedencia en `assets/stock/credits.json`. Esas llevan la etiqueta «Ejemplo»
en la interfaz.

Lo que va aquí es fotografía de producto real. Al separarlas, la etiqueta «Ejemplo» sigue siendo
cierta y el cliente puede distinguir de un vistazo qué material es suyo y cuál es de muestra.

## Estructura

```
assets/productos/
  catalogo.json          manifiesto: una entrada por ficha, con su archivo, medidas y texto alternativo
  README.md              este documento
  regalos/               Regalos personalizados (7 fichas)
  cuadros/               Cuadros y fotografías (3 fichas)
  textiles/               Estampados textiles (4 fichas)
  papeleria/             Papelería corporativa (2 fichas)
  identificacion/        Identificación corporativa (3 fichas)
```

El nombre de cada carpeta es el identificador de categoría que ya usa el catálogo en `index.html`
(`data-categoria="regalos"`, `"cuadros"`, `"textiles"`, `"papeleria"`, `"identificacion"`), de modo
que la ruta del archivo y el `data-od-id` de la ficha se corresponden sin need de un mapa aparte.

## Convención de nombres

El archivo se llama como la ficha, en kebab-case:

| Ficha (`data-od-id`) | Archivo |
|---|---|
| `producto-tazas-magicas` | `regalos/tazas-magicas.jpg` |
| `producto-cuadros-piedra` | `cuadros/cuadros-piedra.jpg` |
| `producto-credenciales-pvc` | `identificacion/credenciales-pvc.jpg` |

Si un producto necesita más de una foto, se numera: `tazas-magicas-01.jpg`, `tazas-magicas-02.jpg`.

## Especificación técnica

- **Relación 1:1 y 1200 × 1200 px.** La caja de cada ficha es cuadrada (`aspect-square`); con
  fotos cuadradas el encuadre `object-fit: cover` no recorta el producto.
- **JPEG progresivo, calidad ~80, ≤ 150 KB por archivo.** Con 19 fotos el peso total del catálogo
  se queda en ~3 MB.
- **Fondo claro y uniforme**, con el producto centrado y con aire alrededor.
- **Nombres en minúscula y sin acentos** (`tazas-magicas.jpg`, no `Tazas Mágicas.JPG`): evita
  problemas demayúsculas en el servidor y de codificación en las URL.

## Cómo entra la foto en la ficha

Cada ficha tiene hoy una caja cuadrada con un icono SVG. Al llegar la foto, el SVG se sustituye
por la imagen, sin tocar el resto de la tarjeta:

```html
<div class="relative w-full aspect-square ink-border rounded-sticker overflow-hidden bg-soft">
  <img src="assets/productos/regalos/tazas-magicas.jpg"
       alt="Taza con estampado que aparece con el calor"
       width="1200" height="1200" loading="lazy" decoding="async"
       class="w-full h-full object-cover">
</div>
```

- `width`/`height` declarados para que la página no salte al cargar la foto.
- `loading="lazy"` en todas menos la primera visible.
- `alt` descriptivo en español: es lo que lee un lector de pantalla y lo que aparece si la foto
  no carga.

## Rutas

- `index.html` (raíz del proyecto) → `assets/productos/…` sin prefijo.
- Los HTML dentro de `src/` → `../assets/productos/…`.

## Antes de dar por cerrada una foto

1. Está en la carpeta de su categoría y con el nombre del manifiesto.
2. Mide 1200 × 1200 px y pesa menos de 150 KB.
3. El `alt` describe lo que se ve, no repite el nombre del producto.
4. La procedencia queda anotada en `catalogo.json` (campo `creditos`): quién la hizo, cuándo y con
   qué licencia. Si es una foto de muestra generada, además lleva la etiqueta «Ejemplo» en la
   interfaz.
5. Si la foto sustituye a una de ejemplo de `assets/stock/`, se actualiza el `usado_en` de
   `assets/stock/credits.json` y se retira el archivo viejo para no dejar material muerto.

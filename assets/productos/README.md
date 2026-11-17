# Fotos de producto — Sublikat

Esta carpeta guarda **las fotografías de producto del catálogo**. Es el destino de las fotos que
entregue el cliente y el lugar donde se quedarán cuando la web se publique.

**Estado actual (2026-11-17):** las 20 fichas tienen archivo en su carpeta, pero todas son
**imágenes de muestra generadas con IA** (`"estado": "muestra"` en `catalogo.json`). Se ven en la
web junto a la etiqueta «Ejemplo» de la sección. Cuando llegue la foto real del taller se sobrescribe
el mismo archivo, se cambia el estado a `listo` y se anota su procedencia en `creditos`.

## Por qué una carpeta aparte

`assets/stock/` contiene material de **ejemplo**: tres imágenes de 512×512 generadas para el
prototipo, con su procedencia en `assets/stock/credits.json`. Esas llevan la etiqueta «Ejemplo»
en la interfaz.

Lo que va aquí es fotografía de producto real. Al separarlas, la etiqueta «Ejemplo» sigue siendo
cierta y el cliente puede distinguir de un vistazo qué material es suyo y cuál es de muestra.

## Estructura

```
assets/productos/
  catalogo.json          manifiesto: 20 entradas, una por ficha, con archivo, medidas y texto alternativo
  README.md              este documento
  regalos/               Regalos personalizados (7 fichas)
  cuadros/               Cuadros y fotografías (3 fichas)
  textiles/              Estampados textiles (5 fichas, incluida Polerones)
  papeleria/             Papelería corporativa (2 fichas)
  identificacion/        Identificación corporativa (3 fichas)
```

El nombre de cada carpeta es el identificador de categoría que ya usa el catálogo
(`data-categoria="regalos"`, `"cuadros"`, `"textiles"`, `"papeleria"`, `"identificacion"`), de modo
que la ruta del archivo y el `data-od-id` de la ficha se corresponden sin need de un mapa aparte.

## Convención de nombres

El maestro se llama como la ficha, en kebab-case:

| Ficha (`data-od-id`) | Maestro |
|---|---|
| `producto-tazas-magicas` | `regalos/tazas-magicas.jpg` |
| `producto-cuadros-piedra` | `cuadros/cuadros-piedra.jpg` |
| `producto-credenciales-pvc` | `identificacion/credenciales-pvc.jpg` |

Las variantes que publica la web se derivan de ese nombre: `tazas-magicas-480.avif`,
`tazas-magicas-960.webp`, etc.

Si un producto necesita más de una foto, se numera: `tazas-magicas-01.jpg`, `tazas-magicas-02.jpg`.

## Especificación técnica

- **Relación 1:1 y 1200 × 1200 px en el maestro.** La caja de cada ficha es cuadrada
  (`aspect-square`); con fotos cuadradas el encuadre `object-fit: cover` no recorta el producto.
- **Maestro en JPEG progresivo, ≤ 150 KB.** Es la fuente de trabajo: **no se publica**.
- **Fondo claro y uniforme**, con el producto centrado y con aire alrededor.
- **Nombres en minúscula y sin acentos** (`tazas-magicas.jpg`, no `Tazas Mágicas.JPG`): evita
  problemas demayúsculas en el servidor y de codificación en las URL.

## Variantes que se publican

`npm run fotos` lee los maestros y escribe cuatro variantes por ficha:

| Variante | Formato | Peso típico | Para qué |
|---|---|---|---|
| `-480.avif` | AVIF q52, croma 4:4:4 | 3–9 KB | Móvil (la tarjeta mide ~129 px) |
| `-480.webp` | WebP q80 | 5–15 KB | Respaldo de AVIF en móvil |
| `-960.avif` | AVIF q52, croma 4:4:4 | 8–26 KB | Escritorio retina y tablet |
| `-960.webp` | WebP q80 | 11–43 KB | Respaldo de AVIF y `src` del `<img>` |

Totales de las 20 fichas: **105 KB** si el navegador sirve las 480 AVIF y **283 KB** si sirve las
960 AVIF, frente a 1,6 MB de los maestros JPEG. Con `loading="lazy"` solo se descargan las fichas de
la pestaña que se está viendo.

El script está en `build/optimizar-fotos.mjs`; `npm run fotos -- --force` rehace todas las
variantes. Se ejecuta después de sustituir o añadir un maestro.

## Cómo entra la foto en la ficha

La tarjeta de producto de React (`src/sections/Catalog/ProductCard.jsx`) resuelve la imagen por el
`data-od-id` desde `src/sections/Catalog/productImages.js` y pinta un `<picture>` dentro de la caja
cuadrada; si esa ficha no tuviera foto, sigue mostrando su icono SVG. El marcado equivale a:

```html
<div class="relative w-full aspect-square ink-border rounded-sticker overflow-hidden bg-soft">
  <picture>
    <source type="image/avif"
            srcset="…/tazas-magicas-480.avif 480w, …/tazas-magicas-960.avif 960w"
            sizes="(min-width: 1024px) 330px, (min-width: 640px) 310px, 33vw">
    <source type="image/webp"
            srcset="…/tazas-magicas-480.webp 480w, …/tazas-magicas-960.webp 960w"
            sizes="(min-width: 1024px) 330px, (min-width: 640px) 310px, 33vw">
    <img src="…/tazas-magicas-960.webp"
         alt="Taza negra mate con un estampado floral coral que aparece con el calor"
         width="960" height="960" loading="lazy" decoding="async"
         class="w-full h-full object-cover">
  </picture>
</div>
```

- `width`/`height` declarados para que la página no salte al cargar la foto.
- `loading="lazy"` en todas: el catálogo está por debajo del pliegue y no compite con la portada.
- `sizes` describe el ancho real de la tarjeta; sin él el navegador descargaría siempre la variante
  grande.
- `alt` descriptivo en español: es lo que lee un lector de pantalla y lo que aparece si la foto
  no carga.

## Rutas

- `index.html` (raíz del proyecto) → `assets/productos/…` sin prefijo.
- Los HTML dentro de `src/` → `../assets/productos/…`.
- La tarjeta React recoge las variantes con `import.meta.glob` sobre
  `../../../assets/productos/*/*-{480,960}.{avif,webp}`; Vite las empaqueta y conserva
  `assets/productos/…` en `dist/`.

## Antes de dar por cerrada una foto

1. Está en la carpeta de su categoría y con el nombre del manifiesto.
2. El maestro mide 1200 × 1200 px y pesa menos de 150 KB.
3. Se ejecutó `npm run fotos` y existen las cuatro variantes de esa ficha.
4. El `alt` describe lo que se ve, no repite el nombre del producto, y coincide con
   `catalogo.json`.
5. La procedencia queda anotada en `catalogo.json` (campo `creditos`): quién la hizo, cuándo y con
   qué licencia. Si es una foto de muestra generada, además lleva la etiqueta «Ejemplo» en la
   interfaz.
6. El `estado` del manifiesto coincide: `muestra` mientras sea material de ejemplo, `listo` cuando
   sea fotografía real del taller.
7. Si la foto sustituye a una de ejemplo de `assets/stock/`, se actualiza el `usado_en` de
   `assets/stock/credits.json` y se retira el archivo viejo para no dejar material muerto.

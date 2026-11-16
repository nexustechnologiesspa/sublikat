# Línea base visual — Sublikat

Estado capturado el **12 de noviembre de 2026** sobre el `index.html` que había en el proyecto
en ese momento. Sirve para comparar después de cualquier cambio y ver qué se movió.

## Qué hay aquí

| Archivo | Qué es |
|---|---|
| `index.html` | Copia del `index.html` actual. Es idéntico byte a byte salvo en **una** línea: la ruta de la imagen del héroe pasa de `assets/stock/camiseta-cats.jpg` a `../../assets/stock/camiseta-cats.jpg`, para que la copia se vea desde dentro de `qa/baseline/`. |
| `capturas/completa-*.png` | Página completa (scroll entero) en 375, 768 y 1280 px, en modo claro y oscuro: 6 capturas. |
| `capturas/catalogo-*.png` | Sección `#tienda` con cada pestaña del catálogo activa: 5 categorías × 1280 px (claro y oscuro) + 5 categorías × 375 px (claro) = 15 capturas. |
| `capturas/manifest.json` | Índice de cada captura: ancho, tema, pestaña y, en las de catálogo, qué panel quedó visible. |

## Cómo se generó

Con `qa/capturar-linea-base.mjs`, que levanta un servidor estático sobre la raíz del proyecto y
captura con Chrome headless (`playwright-core`). Las condiciones son fijas para que la comparación
sea reproducible:

- `reducedMotion: 'reduce'` (movimiento reducido activo).
- Tema forzado por `localStorage` (`sublikat-tema`), no por la preferencia del sistema.
- Pestaña del catálogo activada por hash (`#cat-regalos`, `#cat-cuadros`, …).
- `deviceScaleFactor: 1`.
- En las capturas de sección se anulan el desplazamiento suave, la cabecera fija y el botón
  flotante, para que el recorte no dependa de la altura de scroll.

## Ruido conocido de la captura

Dos ejecuciones de **la misma página** no dan píxel idéntico. Se midió el ruido comparando la
página consigo misma:

| Grupo | Ruido | Dónde |
|---|---|---|
| Página completa (375 y 1280 px, claro y oscuro) | 0 px | — |
| Página completa 768 px | hasta 0,59 % (≈36.000 px) | antialiasing del texto y del control nativo `<select>` |
| Sección del catálogo | 1 %–8 % | la última fila de tarjetas, que se pinta justo en el borde del recorte |

**Cómo comparar:** una diferencia solo cuenta como regresión si supera ese ruido o si aparece en
las capturas de página completa a 375 o 1280, donde el ruido es de 0 px.

## Cómo comparar

1. Captura el estado nuevo en otra carpeta:
   `node qa/capturar-linea-base.mjs qa/baseline-nuevo`
2. Compara los PNG con el mismo nombre (mismo ancho, tema y pestaña).
3. Lo que debe seguir igual: la composición, los colores, los textos y las proporciones.
4. Lo que sí puede cambiar de forma controlada: el contenido de las fichas y los textos.

## Advertencia

Esta línea base captura el `index.html` **tal como estaba el 2026-11-12 antes del ordenamiento**:
paleta crema y coral, tipografía Chewy y catálogo de 19 fichas. Esa es **la dirección vigente**, así
que esta carpeta sigue siendo la referencia del diseño final, no solo un «antes».

El ordenamiento del 2026-11-12 no cambió ni un píxel: añadió la capa de movimiento vacía
(`build/motion.css` + zona `OD:MOTION`), los ganchos `od-*` en el marcado y documentación. El texto
visible de la portada es idéntico al de `archive/baseline/index-2026-11-12.html`.

Para comparar después de implementar el movimiento, recuerda que estas capturas se tomaron con
`reducedMotion: 'reduce'`: son el estado **sin animación**, que es justo el que debe seguir viéndose
igual.

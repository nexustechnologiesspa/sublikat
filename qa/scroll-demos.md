# Los 15 demos de scroll-driven-animations.style, uno por uno

Análisis de los demos de <https://scroll-driven-animations.style/> contra la portada real de Sublikat.
Para cada demo: qué técnica usa, qué exige del marcado y **si entra o no** en este proyecto.

**Fecha:** 12 de noviembre de 2026
**Estado:** análisis cerrado y matriz implementada. El veredicto por sección está en `MOTION.md` §6 y
las mediciones de lo que se entregó, en `qa/movimiento-implementado.md`.

---

## Resumen

| # | Demo | Técnica | Veredicto |
| --- | --- | --- | --- |
| 1 | Reading Progress Indicator | `scroll(root)` + `scaleX` | **Entra** (global) |
| 2 | Carousel Step Indicator | `scroll(inline)` + progreso escalonado | No |
| 3 | Carousel with markers | `view(inline)` por elemento | No |
| 4 | Reverse-Scrolling Columns | dos `scroll()` con dirección invertida | No |
| 5 | Cover Card to Fixed Header | `view()` + `position: sticky` | No |
| 6 | Image Reveal Effects | `view()` con `entry` | **Entra** (catálogo) |
| 7 | Fly-in Fly-out Contact List | `view()` con `entry` y `exit` | **Entra** (beneficios, compromisos) |
| 8 | Cover Flow | `view(inline)` + `rotateY` | No |
| 9 | Window Carousel | `view()` con `entry-crossing` / `exit-crossing` | No |
| 10 | Stacking Cards | `view()` + `exit-crossing` + sticky interno | No |
| 11 | Horizontal Scroll Section | `view()` con `contain` + `translateX` | No |
| 12 | 3D Shoe Explorer | `scroll()` + rotación 3D | No |
| 13 | Shrinking Header + Shadow | `scroll(root)` sobre altura y sombra | **Parcial** (solo la sombra) |
| 14 | Scroll Shadows | `scroll(self)` + `@property` | **Entra** (los 3 `.swipe`) |
| 15 | The Road to Baseline Newly Available | `timeline-scope` + líneas con nombre | **Entra** (proceso) |

**Cuenta:** 6 entran (uno de ellos parcial), 9 se descartan.

---

## 1. Reading Progress Indicator

**Qué hace:** una barra en la parte superior que avanza según lo que llevas leído.

**Técnica:** `animation-timeline: scroll(root block)` con un `@keyframes` que va de `scaleX(0)` a
`scaleX(1)`. La barra es `position: fixed` y `transform-origin: 0 50%`.

**Por qué entra:** es la única señal de progreso honesta en una página de 3487 líneas. No ocupa
espacio (es fija), no toca el layout y se anima con `scaleX`, que es compositable.

**Requisito:** hay que crear el elemento. No existe hoy en el marcado.

**Cuidado:** con `prefers-reduced-motion: reduce` la barra se oculta, no se congela a medias.

---

## 2. Carousel Step Indicator

**Qué hace:** un carrusel con un indicador de progreso escalonado que marca el elemento visible.

**Técnica:** `animation-timeline: scroll(inline)` sobre el contenedor del carrusel, con un
`@keyframes` por pasos (`steps()` o keyframes discretos).

**Por qué no entra:** la tablist del catálogo **no es un carrusel**. Son 5 pestañas con un único
panel visible, no un scroller horizontal. Un indicador de paso sugeriría que se puede deslizar, y no
se puede. Además duplicaría la información que ya da la pestaña activa (`aria-selected`).

**Nota:** el `.swipe` de beneficios sí es un carrusel en móvil, pero ahí el indicador de paso no
aporta: son 4 tarjetas y se ven todas de un vistazo.

---

## 3. Carousel with markers

**Qué hace:** igual que el anterior, con marcas por elemento en vez de una barra continua.

**Técnica:** `view-timeline` por elemento dentro de un scroller inline (`view(inline)`), y una marca
que se activa al cruzar el centro.

**Por qué no entra:** mismo motivo que el 2. La única diferencia es el dibujo del indicador.

---

## 4. Reverse-Scrolling Columns

**Qué hace:** una columna central normal y dos laterales que se mueven en sentido contrario.

**Técnica:** dos `scroll()` sobre el mismo contenedor, uno con `animation-direction: reverse`.

**Por qué no entra:** es un efecto de escaparate. En una página de lectura rompe la orientación
espacial: el usuario no sabe si sube o baja. Además necesita 3 columnas, y la portada es de una sola
columna en móvil.

---

## 5. Cover Card to Fixed Header

**Qué hace:** una tarjeta a pantalla completa se transforma en cabecera fija al hacer scroll.

**Técnica:** `view()` sobre la tarjeta, con `position: sticky` y `animation-range` para el momento
del cambio; se animan altura, radio y posición.

**Por qué no entra:** **cambia la altura de la cabecera**, y en esta página la altura de la cabecera
alimenta `--hh`, que usa la tablist fija del catálogo. Si la cabecera se encoge, la tablist se
descoloca. Además anima `height` y `border-radius`, que no son compositables.

**Lo que sí se toma:** la idea de «la cabecera reacciona al scroll», pero solo con la sombra (demo 13).

---

## 6. Image Reveal Effects

**Qué hace:** las imágenes se revelan al entrar en el viewport.

**Técnica:** `animation-timeline: view()` con `animation-range: entry 25% cover 50%`, animando
`opacity` y un desplazamiento corto (o `clip-path` en las versiones más vistosas).

**Por qué entra:** es el patrón base de los reveals del catálogo. Con `opacity` + `translate` cumple
las cinco reglas.

**Adaptación al proyecto:** las fichas del catálogo **no tienen fotos** (son SVG en línea). El reveal
se aplica a la ficha entera, no a una imagen.

**Cuidado:** las fichas usan `hover:translate-y-[-2px]`. El reveal debe usar `translate`, no
`transform`, o el hover deja de funcionar.

---

## 7. Fly-in Fly-out Contact List

**Qué hace:** las entradas de una lista entran y salen con desplazamiento y opacidad.

**Técnica:** `view()` con dos rangos: `entry 0% entry 60%` para entrar y `exit 0% exit 100%` para
salir.

**Por qué entra (solo la mitad):** se toma el **fly-in**, no el fly-out. Un elemento que se
desvanece al salir por abajo deja huecos visuales mientras el usuario sigue leyendo. En esta página
nada desaparece: lo que entra se queda.

**Destino:** beneficios (4 tarjetas, escalonadas) y compromisos (3 tarjetas).

---

## 8. Cover Flow

**Qué hace:** las portadas de álbum se inclinan en 3D al pasar por el centro.

**Técnica:** `view(inline)` por elemento, con `rotateY` y `translateZ` según la posición respecto al
centro del scroller.

**Por qué no entra:** convierte el catálogo en un carrusel 3D. El cliente compra **comparando
fichas**, no hojeando. Un cover flow esconde 18 de las 19 fichas detrás de un gesto.

**Además:** `rotateY` en 19 tarjetas con sombra plana y borde de tinta se ve sucio; la estética de
sticker no admite perspectiva.

---

## 9. Window Carousel

**Qué hace:** las imágenes de un carrusel se deslizan al entrar y salir del scrollport.

**Técnica:** `view()` con `entry-crossing` y `exit-crossing` para mover cada elemento a distinta
velocidad.

**Por qué no entra:** sustituye la rejilla de fichas por un carrusel. Mismo problema que el 8.

---

## 10. Stacking Cards

**Qué hace:** un conjunto de tarjetas se apila a medida que se solapan.

**Técnica:** `view()` + `exit-crossing`, con las tarjetas internas en `position: sticky` y un
`scale` decreciente para dar profundidad.

**Por qué no entra:** las tarjetas del catálogo **no se apilan: se comparan**. El apilado esconde
fichas y añade un `sticky` por tarjeta, que es justo lo que rompe el scroll en móvil.

**Nota:** es el demo técnicamente más bonito de la lista y el más tentador. Se descarta a propósito.

---

## 11. Horizontal Scroll Section

**Qué hace:** una tira horizontal avanza mientras el usuario hace scroll vertical.

**Técnica:** `view()` sobre la sección con `animation-range: contain 0% contain 100%` y `translateX`
de la tira interna; la sección se fija con `sticky`.

**Por qué no entra:** la página ya tiene **tres** contenedores `.swipe` horizontales (beneficios,
proceso, reseñas). Un cuarto bloque horizontal dejaría al usuario sin saber en qué eje está. Y en
móvil, un `sticky` de altura completa con `translateX` pelea con el scroll táctil.

---

## 12. 3D Shoe Explorer

**Qué hace:** modelos 3D de zapatillas que giran al hacer scroll.

**Técnica:** `scroll()` + rotación 3D sobre un modelo (o una secuencia de imágenes).

**Por qué no entra:** no hay modelo 3D ni lo va a haber. Añadiría peso sin contenido, y la portada
no tiene ni fotos reales todavía.

---

## 13. Shrinking Header + Shadow

**Qué hace:** la cabecera se encoge y gana sombra al bajar.

**Técnica:** `animation-timeline: scroll(root block)` con `animation-range: 0 150px`, animando
altura/padding y `box-shadow`.

**Por qué entra solo a medias:** se toma **la sombra**, no el encogimiento. Encoger la cabecera
rompe `--hh` (ver demo 5). Y `box-shadow` no es compositable: se anima la **opacidad de un
pseudo-elemento** que ya lleva la sombra.

**Destino:** `.od-header`, rango `0 150px`, coste S.

---

## 14. Scroll Shadows

**Qué hace:** sombras en los bordes de un contenedor que indican que hay más contenido; desaparecen
al llegar al borde.

**Técnica:** `animation-timeline: scroll(self inline)` + una custom property registrada con
`@property` (`--can-scroll`), que se interpola entre 0 y 1 y controla la opacidad de dos degradados
de fondo.

**Por qué entra:** los tres `.swipe` (beneficios, proceso, reseñas) **no avisan de que se pueden
deslizar**. En móvil, sin sombra ni indicador, el usuario cree que solo hay una tarjeta. Es
información, no decoración.

**Cuidado:** si el contenedor no desborda (escritorio), las sombras no deben aparecer. Se resuelve
con el propio `--can-scroll`.

---

## 15. The Road to Baseline Newly Available

**Qué hace:** una línea de tiempo horizontal que se rellena al recorrerla, con hitos que se activan
al pasar.

**Técnica:** `timeline-scope` + `view-timeline-name` en la sección, con los hitos suscritos a esa
línea con nombre. La línea se rellena con `scaleX` y los hitos cambian de color.

**Por qué entra:** es la única forma de que los 4 pasos del proceso se lean como un recorrido y no
como 4 tarjetas sueltas. La línea ya existe visualmente en el diseño; solo falta que avance.

**Adaptación:** horizontal en escritorio, vertical en móvil. En móvil se anima `scaleY`, no `scaleX`.

**Cuidado:** es el coste L de la matriz. Necesita un elemento de línea nuevo en
`build/sections/proceso.html` y comprobar que no provoca scroll horizontal a 375 px.

---

## Lo que se aprende de los descartes

De los 9 descartados, **7 se descartan por la misma razón**: convierten una página de catálogo en un
escaparate. Los otros 2 (Cover Card, Stacking Cards) se descartan por restricciones técnicas duras
del proyecto (altura de cabecera y `sticky` en móvil).

Eso deja un criterio claro para el futuro: **si un demo esconde contenido o cambia el eje de
lectura, no entra**. Los que informan —progreso, entrada, sombra, recorrido— sí.

---

## Cómo se comprobó

| Comprobación | Resultado |
| --- | --- |
| Las 15 demos tienen versión CSS pura (sin JS) | Sí: la web ofrece `/css/` y `/waapi/` para cada una |
| `view()` dentro de un scroller horizontal | **Falla**: rango de bloque cero; las tarjetas se quedan invisibles. Verificado en el patrón de `.swipe` |
| `transform` en tarjeta con `hover:translate-y` | **Falla**: el hover deja de responder. Hay que usar `translate` |
| Paneles `hidden` y `view()` | **Falla**: no generan línea de tiempo hasta mostrarse |
| `box-shadow` en scroll | No compositable: se sustituye por opacidad de pseudo-elemento |
| Cabecera que encoge y `--hh` | **Falla**: descoloca la tablist fija |

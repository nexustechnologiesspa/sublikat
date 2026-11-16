# SECTION-MAP — Sección, ancla, parcial, CSS y ganchos

Mapa de las 9 secciones de `index.html` con todo lo que hay que saber para tocar una sin tocar las
demás. Es el índice que usan `MOTION.md`, `DESIGN.md` y `ARQUITECTURA.md`.

**Fecha:** 12 de noviembre de 2026
**Fuente:** `index.html` (3487 líneas), `build/sections/*.html`, `build/css/*.css`.

---

## 1. Vista general

| # | Sección | Ancla | `data-od-id` de la sección | Parcial | CSS | Líneas de `index.html` |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Aviso de prototipo + cabecera | `#site-header` | — (solo `id`) | `sections/header.html` | `css/header.css` | 2179 – 2257 |
| 2 | Héroe | — | — | `sections/hero.html` | `css/hero.css` | 2258 – 2373 |
| 3 | Beneficios | `#beneficios` | `beneficios-taller` | `sections/beneficios.html` | `css/beneficios.css` | 2374 – 2451 |
| 4 | Aviso del taller | `#aviso-taller` | `aviso-taller` | `sections/aviso.html` | `css/aviso.css` | 2452 – 2471 |
| 5 | Catálogo | `#tienda` + `#cat-*` | `catalogo-productos` | `sections/catalogo.html` | `css/catalogo.css` | 2472 – 2835 |
| 6 | Proceso | `#proceso` | `proceso-taller` | `sections/proceso.html` | `css/proceso.css` | 2836 – 3083 |
| 7 | Compromisos | `#resenas` | `resenas` | `sections/compromisos.html` | `css/compromisos.css` | 3084 – 3146 |
| 8 | Contacto | `#contacto` | `contacto` | `sections/contacto.html` | `css/contacto.css` | 3147 – 3389 |
| 9 | Pie | — | — | `sections/footer.html` | `css/footer.css` | 3390 – 3471 |
| — | Widget de WhatsApp | — | `widget-whatsapp` | `sections/widget-whatsapp.html` | `css/widget.css` | 3472 – 3487 |

Compartidos: `css/base.css` (capa `OD:BASE`), `css/components.css` (dentro de `OD:ESTILOS`) y
`build/motion.css` (capa `OD:MOTION`).

---

## 2. Sección por sección

### 1. Aviso de prototipo + cabecera

- **Qué es:** barra superior con el distintivo «Prototipo interactivo» y la nota de datos de muestra;
  debajo, la cabecera con logo (SVG del gato), navegación y conmutador de tema. **En móvil (≤767 px) el
  conmutador de tema no está en la barra: se muda dentro de `#menu-movil`** (`iniciarTemaEnMenu`), en el
  hueco `#menu-tema`; al volver a escritorio regresa a su sitio, justo antes de `#menu-btn`.
- **Ancla:** `#site-header` (id, sin `data-od-id`).
- **Gancho de movimiento:** `.od-header` (1) y `.od-progress` (1, la barra de lectura que va antes del
  aviso de prototipo).
- **Restricción crítica:** la cabecera es `fixed` (desde el 15-11-2026) y su altura define `--hh`, que
  usa la tablist fija del catálogo, el `scroll-margin-top` de los anclajes y el alto final de la banda de
  la portada (`--hh` + `--od-portada-banda`). **No puede cambiar de altura ni de padding en scroll.** Al
  ser `fixed` no reserva alto en el flujo: la portada fotográfica arranca en `y=0` por detrás de ella y
  el menú flota encima. **La cabecera no pinta fondo** (el `background: var(--bg)` de `#site-header` está
  comentado a propósito): así la foto se ve también dentro de su relleno, entre el borde de la ventana y
  la tarjeta del menú. Lo único opaco es la tarjeta interior (`bg-surface`).
- **Movimiento permitido:** la opacidad de un pseudo-elemento con la sombra (0–150 px de scroll) y el
  `scaleX` de la barra de lectura. Medido en navegador: 99 px de alto con y sin scroll.

### 2. Héroe

- **Qué es:** cinta con el claim, tarjeta principal con el H1 («Tu camiseta, estampada como ninguna
  otra»), foto de muestra, dos CTAs y una nota.
- **Ancla:** ninguna (es la primera sección; no tiene id).
- **`data-od-id`:** solo el CTA primario, `cta-ver-productos`.
- **Ganchos:** `.od-hero`, `.od-hero__body`, `.od-hero__media-col`, `.od-hero__claim`,
  `.od-hero__title`, `.od-hero__lead`, `.od-hero__ctas`, `.od-hero__note`, `.od-hero__media`,
  `.od-hero__media img` (cortina + parallax), `.od-hero__deco`, `.od-hero__tape`, `.od-parallax`
  (la etiqueta amarilla).
- **Restricción:** las hojas (claim, título, entradilla, CTAs, nota, foto y cinta) entran con una
  animación de **tiempo**, no de scroll: ya están en pantalla al cargar y un `view()` nacería a medio
  revelar. **El H1 nunca se oculta**; como mucho se desplaza. Se animan solo las hojas para que los
  desplazamientos no se sumen.
- **Movimiento de scroll (desde el 14-11-2026):** el héroe no se apaga al bajar. La foto lleva
  `od-hero-curtain` (cortina de tiempo, 620 ms: `clip-path` de `inset(0 0 24% 0)` a `inset(0)`) y
  `od-hero-parallax` (`scroll(root block)` en `0 700px`, ±16 px, con `scale: 1.14` estático para que
  no se descubran los bordes). La versión anterior (opacidad 0,55 en `.od-hero__media-col`) se retiró.

### 3. Beneficios

- **Qué es:** franja de 4 ventajas con icono y texto corto. En móvil es un `.swipe` horizontal.
- **Ancla:** `#beneficios`. **`data-od-id`:** `beneficios-taller`.
- **Ganchos:** `.od-stagger.od-stagger-2` en la rejilla, `.od-fade` en las 4 tarjetas.
- **Estructura:** el `.swipe` va dentro de `<div class="swipe-marco">`. Ese envoltorio **no se puede
  quitar**: sostiene las dos capas que pintan la sombra de borde por encima de las tarjetas (ver §4).
- **Restricción:** al ser `.swipe`, el `view()` va en el contenedor; animar las tarjetas por separado
  daría rango cero en móvil. Verificado a 375 px: las tarjetas pasan de 0 a 1 al entrar.
- **Movimiento aplicado:** asentamiento con `scale` (96 % → 100 %) y opacidad, rangos
  `entry 5% cover 12%` … `entry 26% cover 30%` (escalonado por tarjeta). Es `scale` y no `translate`
  a propósito: el `.swipe` tiene 22 px de relleno arriba y 10 abajo, y desplazar en vertical desborda
  el propio carrusel. Además el borde lleva sombra de scroll (ver §4).

### 4. Aviso del taller

- **Qué es:** banner de piezas listas para envío y personalización sin pedido mínimo.
- **Ancla:** `#aviso-taller`. **`data-od-id`:** `aviso-taller`.
- **Ganchos:** ninguno.
- **Decisión:** no se anima. Es un aviso legal: aparece completo.

### 5. Catálogo

- **Qué es:** encabezado, `<nav role="tablist">` con 5 pestañas y 5 paneles con 19 fichas en total.
- **Anclas:** `#tienda` (sección), `#cat-regalos`, `#cat-cuadros`, `#cat-textiles`, `#cat-papeleria`,
  `#cat-identificacion` (paneles).
- **`data-od-id`:** `catalogo-productos` (sección), `cat-regalos`, `cat-cuadros`, `cat-textiles`,
  `cat-papeleria`, `cat-identificacion` (paneles) y 19 `producto-<slug>`.
- **Ganchos:** `.od-tablist` en el nav, `.od-reveal` en cada una de las 19 fichas y
  `.od-reveal > div > div` en el recuadro del icono (la cortina).
- **Restricción:** 4 de los 5 paneles llevan `hidden`. Un panel oculto no genera línea de tiempo:
  la animación arranca sola al mostrarse. **No forzar `animation-play-state`** ni precalentar.
- **Restricción:** el reveal usa `animation-range: entry 0% entry 90%`, el máximo que aún termina en
  cuanto la ficha ha entrado entera (28 px de recorrido). Con rangos que acaban más allá de `entry`,
  cambiar de pestaña dejaba fichas a media opacidad. Verificado: al abrir una pestaña, sus fichas
  visibles están ya a opacidad 1.
- **Movimiento aplicado (desde el 14-11-2026):** sobre la línea `--od-ficha` de cada ficha, el
  recuadro del icono se abre con `clip-path: inset(0 0 26% 0 round var(--radius))` → `inset(0 0 0)`, y
  el SVG se asienta con opacidad + `scale` (86 % → 100 %). La cortina va en el recuadro y no en el SVG
  para que el efecto se lea sobre el marco.
- **Restricción:** las fichas usan `hover:translate-y-[-2px]`. El reveal usa `translate`, no
  `transform`, o el hover deja de funcionar.

### 6. Proceso

- **Qué es:** 4 pasos numerados con ilustración SVG y un CTA de lote.
- **Ancla:** `#proceso`. **`data-od-id`:** `proceso-taller`.
- **Ganchos:** `.od-steps.od-stagger.od-stagger-2` en la rejilla, `.od-step` en los 4 pasos.
- **Movimiento — la línea se retiró el 15-11-2026:** la «columna vertebral» (demo 15 *The Road to
  Baseline*) se quitó a petición del cliente. La barra de `--accent` que avanzaba sobre las píldoras
  «Paso NN» se leía como un subrayado a medias y competía con las píldoras, que ya numeran los pasos.
  Se borraron la base, el relleno, el segmento móvil por tarjeta y los `@keyframes od-spine-grow`.
  **No volver a añadirla**: el arnés tiene una prueba de regresión que falla si reaparece.
- **Apilado ligero (Stacking Cards, desde el 14-11-2026):** al salir por arriba, cada paso se reduce a
  `scale 0.96` y baja a opacidad 0,9 (`exit 0% exit 100%`, escalonado 8 % por tarjeta, solo ≥768 px).
  Sin `position: sticky`, sin reordenar y sin cambiar el orden de lectura. Es lo único que queda del
  bloque 8 de movimiento.
- **Restricción:** los pasos no llevan gancho de aparición (`od-reveal`). La rejilla sigue acotada fuera
  de `#beneficios` y `#resenas` para el escalonado.
- **Estructura:** la rejilla va dentro de `<div class="swipe-marco">`, que sostiene las capas de la
  sombra de borde. No se puede quitar.

### 7. Compromisos

- **Qué es:** 3 tarjetas con compromisos verificables (desde 1 unidad, muestra antes de imprimir,
  respuesta de 10:00 a 17:00). El `id` sigue siendo `#resenas` por compatibilidad de enlaces.
- **Ancla:** `#resenas`. **`data-od-id`:** `resenas` + `compromiso-minimo`, `compromiso-muestra`,
  `compromiso-atencion`.
- **Ganchos:** `.od-stagger` en `.reviews-grid.swipe`.
- **Restricción:** es un `.swipe`; mismo cuidado que beneficios. Va dentro de `<div class="swipe-marco">`,
  que sostiene las dos capas de la sombra de borde: no se puede quitar.

### 8. Contacto

- **Qué es:** formulario (validación al salir del campo, resumen de errores, panel de confirmación)
  y tarjeta lateral con WhatsApp, dirección, horarios y envíos.
- **Ancla:** `#contacto` (+ `#form-contacto` en el formulario). **`data-od-id`:** `contacto`,
  `enviar-consulta`.
- **Ganchos:** `.od-reveal-soft` en el `<h2 id="contact-heading">` y en la entradilla
  (`.section-subtitle`). Añadidos el 2026-11-12 con `build/ganchos-scroll.ps1`. **El formulario no
  lleva gancho**: nunca se oculta ni se desplaza.
- **Movimiento aplicado:** solo opacidad, sin desplazamiento. Es la sección donde más caro sale
  esconder algo: el foco del teclado, el resumen de errores y la validación viven ahí.

### 9. Pie

- **Qué es:** 4 columnas (marca, productos, el taller, visítanos), aviso legal y barra inferior.
- **Ancla:** `#aviso-legal` (dentro del pie). **`data-od-id`:** ninguno.
- **Ganchos:** `.od-reveal-soft` en `<footer class="site-footer od-reveal-soft">`.
- **Movimiento aplicado:** opacidad y 20 px de desplazamiento (`od-fade-rise`, rango
  `entry 0% cover 20%`). El rango acaba dentro de `cover` para que el pie esté a opacidad 1 cuando
  termina de asomar.

---

## 3. Anclas y enlaces

| Ancla | Destino | Quién la enlaza |
| --- | --- | --- |
| `#beneficios` | Sección de ventajas | Navegación |
| `#aviso-taller` | Banner del taller | Navegación |
| `#tienda` | Catálogo | Navegación y CTA del héroe |
| `#cat-regalos` … `#cat-identificacion` | Pestañas del catálogo | Pie y navegación. El JS abre la pestaña al leer el hash |
| `#proceso` | Pasos | Navegación |
| `#resenas` | Compromisos | Navegación |
| `#contacto` | Formulario | Navegación y CTAs |
| `#form-contacto` | Formulario concreto | Enlace de salto |
| `#aviso-legal` | Aviso del pie | Pie |

---

## 4. Ganchos de movimiento aplicados

**48 elementos** del marcado llevan al menos un gancho `od-*`, aplicados por `build/ganchos-scroll.ps1`
(idempotente: la segunda pasada aplica 0). En total son **51 clases `od-*` de movimiento**, porque
algunos elementos llevan dos ganchos a la vez (la rejilla del proceso lleva `od-steps od-stagger
od-stagger-2`). Aparte van **3 envoltorios `.swipe-marco`**, que no son ganchos sino soporte de las
sombras de borde.

| Gancho | Dónde | Cuántos | ¿Anima? |
| --- | --- | --- | --- |
| `.od-progress` | `<div class="od-progress">`, antes del aviso de prototipo | 1 | Sí: barra de lectura |
| `.od-header` | `<header id="site-header">` | 1 | Sí: sombra al desplazar |
| `.od-hero` y `.od-hero__*` | Héroe (12 clases distintas, una por elemento, más `.od-hero__media img` para la foto) | 12 | Solo las hojas: entrada por tiempo. La foto lleva además cortina de tiempo y parallax de scroll |
| `.od-parallax` | Etiqueta amarilla del héroe | 1 | No: fila 5 no aprobada |
| `.od-stagger` / `.od-stagger-2` | Rejilla de beneficios, rejilla de proceso, `.reviews-grid` | 5 | En beneficios y compromisos, sí; en el proceso la rejilla solo aporta la línea |
| `.od-fade` | Las 4 tarjetas de beneficios | 4 | Sí |
| `.od-reveal` | Las 19 fichas del catálogo | 19 | Sí: la ficha sube 28 px y aparece; su recuadro se abre con `clip-path` y el icono se asienta, todo sobre la línea `--od-ficha` |
| `.od-tablist` | `<nav role="tablist">` | 1 | No: sin animación por decisión |
| `.od-steps` / `.od-step` | Rejilla y pasos del proceso | 5 | Sí: el apilado ligero (`scale` 0,96 al salir). La línea de recorrido (demo 15) se retiró el 15-11-2026 |
| `.od-reveal-soft` | `<footer>`, título y entradilla de contacto | 3 | Sí: solo opacidad; el pie añade 20 px |
| `.swipe-marco` | Envoltorio de los tres carruseles (beneficios, proceso, compromisos) | 3 | Sí: sostiene las capas `::before`/`::after` de la sombra de borde, por encima de las tarjetas. Sin él la sombra no se ve |

**Ganchos definidos pero sin usar en el marcado:** `.od-reveal-left`, `.od-reveal-right`,
`.od-reveal-scale`. Están en el guard de movimiento reducido de `build/motion.css` por si se usan;
hoy no activan nada.

**`.swipe-marco` no es decorativo:** es el único elemento que se pinta encima del carrusel. El
degradado no puede vivir en el `.swipe` porque las tarjetas son opacas y el recorte de `overflow` es el
padding box, así que lo taparían. `qa/probar-portada.mjs` comprueba que las capas existen, que van por
encima y que cada carrusel desborda (si no desbordara, su línea de tiempo sería inactiva).

**No son ganchos de movimiento:** `.od-was`, `.od-was__btn`, `.od-was__icon` y `.od-was__label` son
las clases del widget de WhatsApp (`od` + `was`), anteriores a esta capa. Se listan aparte para que
nadie las confunda con un reveal.

---

## 5. Qué tocar y qué no

| Quiero… | Toco | Y después |
| --- | --- | --- |
| Cambiar un color | `build/tokens.css` | `actualizar-portada.ps1` (seguro: el catálogo está conciliado) |
| Cambiar un texto | El parcial de la sección en `build/sections/` | `actualizar-portada.ps1` |
| Cambiar el estilo de una sección | Su archivo en `build/css/` | `actualizar-portada.ps1` |
| Añadir movimiento | `build/motion.css` | `actualizar-portada.ps1` |
| Añadir una clase de gancho | `build/ganchos-scroll.ps1` | Ejecutarlo (idempotente) |
| Añadir un producto | Ficha + panel + opción del desplegable | `actualizar-portada.ps1` |
| Cambiar el `<head>` | `index.html` directamente (no tiene origen en `build/`) | — |

**No tocar:** la altura de la cabecera, los `hidden` de los paneles, el `data-theme` de `<html>`, los
`data-od-id` existentes (el modo comentario de la app los usa como ancla) ni los `<div class="swipe-marco">`
que envuelven los tres carruseles: sin ellos no hay dónde pintar la sombra de borde.

**La portada fotográfica es una capa fija que se encoge, y eso es a propósito.** Desde el 15-11-2026
`html .od-portada` es `fixed` (z-index 35, bajo el 50 del menú) y anima su **`block-size`** de `100svh` a
`--hh` + `--od-portada-banda` en `0 90vh`; el alto que reserva en el flujo lo pone `html body` con
`padding-block-start: 100svh`. Tres cosas no se pueden tocar sin romperlo:

1. **El prefijo `html `** en las reglas del efecto: el estado base es `html .od-portada` (0,1,1) y una
   regla `.od-portada` (0,1,0) pierde la cascada. Así se rompió antes: el alto se animaba, pero el marco
   seguía `relative` y se iba con la página (`top` negativo, la banda nunca se clavaba).
2. **Se anima el marco, no la foto.** La primera versión movía solo la foto dentro de un marco de
   pantalla completa con fondo opaco: quedaba un rectángulo tapando todas las secciones.
3. **`pointer-events: none`**: es decorativa (`aria-hidden`). Si capturara clics, se comería los enlaces
   que pasan por debajo de la banda.

`qa/probar-portada.mjs` lo cubre con 9 pruebas de portada y anclas, incluidas «al bajar se encoge hasta
una banda bajo el menú», «la banda no tapa nada por debajo del menú» y «al bajar aparecen las secciones:
nada las tapa».

**Tampoco existen en el marcado:** los paginadores `.dots` de los tres carruseles los genera `app.js`
en tiempo de ejecución, así que no aparecen en `index.html` ni en `build/sections/`. Los inserta con
`el.after(...)`, o sea **dentro del `.swipe-marco`**, que es donde tienen que quedar: el envoltorio no
tiene relleno propio. Medido a 375 px: los tres paginadores salen con padre `swipe-marco`, `display:
flex`, centro **exacto** con el carrusel (desvío 0 px) y los mismos 4 px de separación que antes del
envoltorio. Lo mismo vale para el relleno de las fichas del catálogo, que sale de
`build/data/catalogo.json`.

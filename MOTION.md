# MOTION — Movimiento ligado al scroll

Documento de decisión del movimiento de la portada de Sublikat. Aquí está **qué se mueve, con qué
técnica, en qué rango y por qué**. La implementación vive en `build/motion.css`, inyectado en la zona
`OD:MOTION` de `index.html`.

**Fecha:** 12 de noviembre de 2026 · ampliado el 14 de noviembre de 2026 y el 15 de noviembre de 2026
**Estado:** **implementado** con las filas 1, 2, 3, 4, 6, 9, 10 y 11 de la matriz (§6). El 2026-11-14 se
sumaron **cuatro demos más de `scroll-driven-animations.style`, una por sección**: la 5 adaptada (la foto
del héroe se retira al bajar), la 15 (la columna vertebral del proceso), la 6 enriquecida (el icono de
la ficha se asienta) y la 14 (sombras de scroll en los carruseles). **El 2026-11-15 se retiró la 15 a
petición del cliente** (la barra que avanzaba sobre las píldoras «Paso NN»): quedan tres. Siguen fuera por
decisión del cliente la animación del aviso legal y la de las pestañas. Verificación en navegador real:
`qa/movimiento-implementado.md`.
**Referencia externa:** los 15 demos de <https://scroll-driven-animations.style/>. El veredicto de
cada uno está en `qa/scroll-demos.md` y el estado de cada uno en §6 de este documento.

---

## 1. Las cinco reglas que no se negocian

Toda animación que se añada a `build/motion.css` cumple las cinco. Si una no se cumple, la animación
no entra.

| # | Regla | Por qué |
| --- | --- | --- |
| 1 | **Solo `transform`, `translate` y `opacity`** | Son las tres propiedades que el compositor puede animar sin recalcular layout. `width`, `height`, `top`, `left`, `margin`, `padding` y `box-shadow` provocan layout o repintado en cada frame |
| 2 | **El contenido se ve por defecto** | El estado inicial (`opacity: 0`) solo existe dentro de `@supports (animation-timeline: view())` **y** de `@media (prefers-reduced-motion: no-preference)`. Sin soporte o con movimiento reducido, la página se ve completa |
| 3 | **Sin librerías, sin listeners de `scroll`, sin `requestAnimationFrame`** | El objetivo de la técnica es que el navegador lleve la animación fuera del hilo principal. Un listener de scroll reintroduce exactamente el problema que se quiere evitar |
| 4 | **Cero hexadecimales** | El color sale de `var(--…)`. `build/motion.css` no declara ni un color propio |
| 5 | **La cabecera no cambia de altura** | `--hh` mide la cabecera y la tablist fija del catálogo depende de ella. Si la cabecera se encoge, la tablist se descoloca |

### Reglas derivadas del proyecto (no del estándar)

- **`translate`, no `transform`, en tarjetas con hover.** Las fichas y los beneficios usan
  `hover:translate-y-[-2px]` de Tailwind. Animar `transform` en el mismo elemento anula ese hover.
  La propiedad `translate` es independiente y convive con él.
- **Nada de `view()` dentro de `.swipe`.** Los contenedores `.swipe` (beneficios, proceso, reseñas)
  hacen scroll horizontal en móvil. Un `view()` ahí mide el rango en el eje de bloque del scroller,
  que es cero: las tarjetas se quedan invisibles. Se anima el contenedor, no la tarjeta.
- **Los paneles ocultos no generan línea de tiempo.** Las 5 pestañas del catálogo tienen 4 paneles
  con `hidden`. Un panel oculto no produce `view()`: al cambiar de pestaña hay que dejar que la
  animación arranque sola, sin forzarla.
- **El héroe no lleva `view()`.** Ya está en pantalla al cargar: usar `view()` ahí dejaría el contenido
  a medio revelar en la primera pantalla. Su entrada es una animación de tiempo normal
  (`--motion-enter`). Lo que sí lleva es `scroll(root)`, que es reversible: la columna de la foto se
  retira al bajar (demo 5) y vuelve a su sitio al subir. Va en la **columna**, no en la foto: la foto ya
  tiene su entrada por tiempo y dos animaciones sobre el mismo elemento se pisarían.

---

## 2. Personalidad del movimiento

La dirección visual es **crema + Chewy**: sticker, papel, tinta gruesa, sombra plana. El movimiento
tiene que sonar a eso y no a una web corporativa.

| Sí | No |
| --- | --- |
| Desplazamientos cortos (16–24 px) con curva de salida rápida | Recorridos largos tipo parallax de agencia |
| Escalonado visible entre tarjetas hermanas | Todo entrando a la vez |
| Un solo gesto de atención por bloque | Animación en cada elemento |
| Rebote muy leve, casi imperceptible | Overshoot elástico |
| Nada se mueve dos veces | Reveals que se repiten al subir y bajar |

La curva es `var(--motion-ease-out)` (`cubic-bezier(0.22, 1, 0.36, 1)`): arranca rápido y frena
largo. Es la misma para todo el sitio; no hay una curva por sección.

---

## 3. Intensidad propuesta: **B — movimiento con función**

Tres niveles posibles. La propuesta es B.

| Nivel | Qué incluye | Veredicto |
| --- | --- | --- |
| A — mínimo | Solo reveals de opacidad en beneficios y catálogo | Se queda corto: no aprovecha la estructura de la página y no da ninguna señal de progreso |
| **B — con función** | Progress de lectura, reveals escalonados, sombra de cabecera, sombras de scroll en `.swipe` y apilado de los pasos del proceso | **Propuesto.** Todo el movimiento informa: dónde estás, qué es nuevo, qué se puede desplazar |
| C — escaparate | B + parallax en el héroe, cover flow en el catálogo, contador animado, tipografía cinética | Rechazado: convierte un catálogo de taller en una demo de efectos y contradice el criterio de `craft/animation-discipline.md` (el movimiento debe reorientar, no decorar) |

**Por qué B y no C:** en esta página el movimiento tiene tres trabajos reales y ninguno más.

1. **Decir dónde estás** → barra de progreso de lectura.
2. **Decir qué acaba de entrar** → reveals al entrar en el viewport.
3. **Decir que algo se puede desplazar** → sombras de scroll en los carruseles táctiles.

Todo lo que no sea uno de esos tres trabajos es decoración, y la decoración en una página con 19
fichas y un formulario compite con la lectura.

---

## 4. Las tres familias

| Familia | Técnica | Qué propiedad toca |
| --- | --- | --- |
| **Progress** | `animation-timeline: scroll(root)` | `scaleX` de una barra fija, `opacity` de una sombra |
| **Reveal** | `animation-timeline: view()` | `opacity` + `translate` |
| **Spine** | `animation-timeline: view()` con `contain` | `scaleX`/`scaleY` de una línea, `opacity` de un relleno. *Familia sin uso desde el 15-11-2026: la línea del proceso se retiró* |

No hay una cuarta familia. Parallax, cover flow, 3D y tipografía cinética quedan fuera (§8).

---

## 5. Mapa de secciones y anclas

Las 9 secciones reales de `index.html`, con su ancla y su parcial. El detalle de CSS y `data-od-id`
está en `SECTION-MAP.md`.

| # | Sección | Ancla | Parcial |
| --- | --- | --- | --- |
| 1 | Aviso de prototipo + cabecera | `#site-header` | `sections/header.html` |
| 2 | Héroe | — (primera sección) | `sections/hero.html` |
| 3 | Beneficios | `#beneficios` | `sections/beneficios.html` |
| 4 | Aviso del taller | `#aviso-taller` | `sections/aviso.html` |
| 5 | Catálogo | `#tienda` (+ `#cat-*`) | `sections/catalogo.html` |
| 6 | Proceso | `#proceso` | `sections/proceso.html` |
| 7 | Compromisos | `#resenas` | `sections/compromisos.html` |
| 8 | Contacto | `#contacto` | `sections/contacto.html` |
| 9 | Pie | — | `sections/footer.html` |

---

## 6. Matriz aprobable: sección → demo → técnica → rango → hook → reduced-motion → coste

Esta es la tabla que se revisó y se aprobó el 2026-11-12 y que se amplió el 2026-11-14 con cuatro demos
más. **La columna «Estado» dice qué está en `build/motion.css` hoy**: implementada, o fuera por
decisión.

| Sección | Demo de origen | Técnica | Rango | Hook | Con movimiento reducido | Coste | Estado |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Global | Reading Progress Indicator | `animation-timeline: scroll(root block)` + `scaleX` | `0% 100%` | barra nueva `.od-progress` (6 px) | barra oculta | S | **Implementada y calibrada** |
| Cabecera | Shrinking Header + Shadow | `scroll(root block)` sobre `opacity` de un pseudo-elemento | `0 150px` | `.od-header` | sin sombra | S | **Implementada** |
| Portada | Cover Card to Fixed Header (adaptado: la foto se encoge a una banda, no se convierte en cabecera) | `scroll(root block)` sobre el `block-size` del marco `fixed` + `background-position` de la foto + `opacity` del nombre; `body` reserva `100svh` | `0 90vh` el encogido y el recorte; `0 45vh` el desvanecido | `.od-portada`, `.od-portada__foto`, `.od-portada__marca` | portada quieta de una pantalla en el flujo | M | **Implementada el 15-11** en la zona `OD:MOTION` de `index.html` (§11.4) |
| Héroe | — | Animación de tiempo, no de scroll: `--motion-enter` con escalonado | n/a | `.od-hero__claim`, `__title`, `__lead`, `__ctas`, `__note`, `__media`, `__tape` | todo visible, sin desplazamiento | S | **Implementada** |
| Héroe | Image Reveal Effects + Window Carousel (solo el parallax) | Cortina `clip-path: inset(0 0 24% 0)` → `inset(0)` de TIEMPO (al cargar el héroe ya está a la vista) + `scroll(root block)` sobre `translate` del parallax | `0 700px` el parallax; la cortina 620 ms | `.od-hero__media img` | foto quieta, sin recorte y sin escala | M | **Implementada el 14-11** (sustituye a la retirada de la columna) |
| Beneficios | Fly-in Fly-out Contact List | `view()` con `entry` → `cover`, asentamiento con `scale` | `entry 5% cover 12%` → `entry 26% cover 30%` | `.od-stagger-2` (timeline) y `.od-fade` (hijos) | visible | S | **Implementada y calibrada** |
| Beneficios, proceso y compromisos | Scroll Shadows | `@property --od-can-scroll-l/r` interpolados por `scroll-timeline: --od-desliz inline` del carrusel; el degradado de 24 px se pinta en dos capas **por encima** sobre `.swipe-marco` (`timeline-scope`) | `0% 100%` | `.swipe` (línea de tiempo) y `.swipe-marco` (capas) | capas ocultas | L | **Implementada el 14-11**, solo en móvil; reescrita el mismo día porque la primera versión no se veía |
| Aviso del taller | — | Sin animación | n/a | ninguno | n/a | 0 | Fuera: es un aviso legal |
| Catálogo | Image Reveal Effects | `view()` sobre `opacity` + `translate` (28 px) de cada ficha | `entry 0% entry 90%` | `.od-reveal` | visible | M | **Implementada y calibrada** |
| Catálogo | Image Reveal Effects (enriquecida) | Cortina `clip-path` del recuadro + `opacity` + `scale` del icono, las dos sobre `--od-ficha` | `entry 0% entry 90%` y `entry 0% entry 60%` | `.od-reveal > div > div` y `> svg` | recuadro entero, icono opaco | S | **Implementada el 14-11** |
| Catálogo (pestañas) | — | Sin animación en el cambio de panel; el regreso al principio de la lista es un `scrollTo` suave (instantáneo con movimiento reducido) | n/a | `.od-tablist` (solo estilo) | n/a | 0 | Fuera: el cambio de pestaña es instantáneo. Desde el 16-11 el scroll vuelve a la primera ficha al cambiar de categoría (§16 de `qa/movimiento-implementado.md`) |
| Proceso | Stacking Cards (versión ligera) | `view()` con `exit`: `scale` 0.96 y opacidad 0.9, escalonado 8 % por paso | `exit 0% exit 100%` | `#proceso .od-step` | pasos quietos y opacos | S | **Implementada el 14-11**, solo ≥768 px. La línea de *The Road to Baseline* (demo 15) se **retiró el 15-11-2026** a petición del cliente |
| Compromisos | Fly-in Fly-out Contact List | `view()` con `entry` → `cover`, asentamiento con `scale` | `entry 5% cover 12%` → `entry 26% cover 30%` | `.od-stagger` (timeline) y sus hijos | visible | S | **Implementada y calibrada** |
| Contacto | — | Solo `opacity` en título y entradilla; el formulario no se oculta | `entry 0% entry 40%` | `.od-reveal-soft` | visible | S | **Implementada** |
| Pie | — | `view()` con `entry` → `cover`, opacidad y 20 px de desplazamiento | `entry 0% cover 20%` | `.od-reveal-soft` | visible | S | **Implementada y calibrada** |

**Tres rangos cambiaron respecto a la propuesta**, por lo que se vio en el navegador:

- Las fichas del catálogo iban a usar `entry 25% cover 50%`. Con ese rango, una ficha ya visible al
  cambiar de pestaña se quedaba a media opacidad hasta hacer scroll. Se usa `entry 0% entry 90%`, que
  termina cuando la ficha ha entrado entera. El 90 % es el máximo que conserva esa garantía.
- Beneficios y compromisos comparten `.od-stagger`/`.od-stagger-2`, y la rejilla del proceso lleva los
  mismos ganchos. Las reglas se acotan a `#beneficios` y `#resenas`; el proceso tiene la suya propia.
- El asentamiento de las rejillas pasó de `translate` a `scale`: las tarjetas viven dentro del `.swipe`,
  que en móvil desplaza en horizontal, y moverlas en vertical desbordaba el propio carrusel.

### Calibración del 2026-11-14

La primera versión era correcta y no se veía. El motivo no era el código: eran los números. Se
midieron con el vídeo del cliente y con el arnés:

| | Antes | Ahora |
| --- | --- | --- |
| Recorrido de una ficha | 12 px sobre ~260 px = 4,6 % | **28 px** |
| Recorrido de una tarjeta de rejilla | 10 px | **scale 96 % → 100 %** |
| Fecha del rango | `entry` (termina cuando el elemento asoma) | **`cover`** (termina delante del usuario) |
| Barra de lectura | 3 px, tapada por la cabecera | **6 px** |
| Foto del héroe | se apagaba a 0,55 de opacidad | **cortina + parallax** |
| Sombras de borde | 18 px al 20 %, en el fondo del carrusel (tapadas por las tarjetas) | **24 px al 30 %, en dos capas por encima** sobre `.swipe-marco` |

**Regla que se añade a la matriz, y que es medible:** un elemento completamente visible tiene que
estar a opacidad 1, en su sitio y sin recorte. El arnés lo comprueba en la prueba «Regresión: ninguna
ficha visible queda a media opacidad».

**Coste:** S = menos de 20 líneas de CSS y un hook ya existente. M = necesita ajuste de rangos y
prueba en móvil. L = necesita estructura nueva (la línea del proceso, el envoltorio de las sombras) y
es la única que puede requerir tocar el marcado.

**Lo que la matriz evita a propósito:** ningún hook nuevo en el héroe más allá de los que ya existen,
ninguna animación en el aviso legal, y nada que dependa de que el usuario cambie de pestaña.

---

## 7. Fases de implementación

| Fase | Qué entra | Criterio de salida | Estado |
| --- | --- | --- | --- |
| **F1 — Progress y cabecera** | Barra de lectura + sombra de cabecera | La barra llega a 100% al final; la cabecera no cambia de altura; `--hh` sigue midiendo lo mismo | **Entregada**: barra 0 → 1 y 101 px de cabecera constante |
| **F2 — Reveals** | Beneficios, catálogo, compromisos, contacto, pie | Con JS desactivado y con `prefers-reduced-motion: reduce`, todo el contenido es visible y legible | **Entregada**: opacidad 1 en todo, con movimiento reducido y sin JS |
| **F3 — Spine del proceso** | Línea de recorrido del proceso | En móvil la línea es vertical y no provoca scroll horizontal | **Entregada el 14-11 y retirada el 15-11**: la línea horizontal (y el segmento por tarjeta del carrusel móvil) se quitaron a petición del cliente; el apilado ligero de los pasos se queda |
| **F4 — Scroll shadows** | Sombras en los tres `.swipe` | Las sombras desaparecen al llegar al borde; no aparecen si el contenedor no desborda | **Entregada el 14-11**: solo en móvil, que es donde los carruseles desbordan |
| **F5 — Calibración** | Recorridos, rangos, barra y cortinas | Ninguna ficha visible queda por debajo de opacidad 1; el movimiento se percibe sin medirlo | **Entregada el 14-11**: 39/39 pruebas, cortina del héroe medida de 24 % a 0 % |

Cada fase se entrega con su prueba en `qa/` y se puede revertir sola: `build/motion.css` está
separado del resto de capas y la zona `OD:MOTION` es independiente.

---

## 8. Demos descartados y por qué

| Demo | Por qué no |
| --- | --- |
| Carousel Step Indicator | La tablist del catálogo no es un carrusel: son pestañas con panel único. Un indicador de paso mentiría sobre el modelo |
| Carousel with markers | Igual que el anterior, y además duplicaría la información de la pestaña activa |
| Reverse-Scrolling Columns | Efecto de escaparate sin función. En una columna de lectura rompe la orientación |
| Cover Card to Fixed Header | Se probó el 14-11 y se retiró el mismo día: convertir la tarjeta en cabecera rompe `--hh` y descoloca la tablist fija, y la versión adaptada (retirar la columna de la foto bajando su opacidad a 0,55) apagaba la foto justo cuando el usuario la miraba. **El 15-11 vuelve, pero no como cabecera**: la portada se encoge hasta una banda *debajo* del menú que ya existe (`--hh` + `--od-portada-banda`), sin tocar `--hh` ni la tablist. Ver §11.4 |
| Cover Flow | Convierte el catálogo en un carrusel 3D. El cliente compra comparando fichas, no hojeando |
| Window Carousel | Mismo problema: sustituye la rejilla por un carrusel |
| 3D Shoe Explorer | No hay modelo 3D ni lo va a haber. Añadiría peso sin contenido |
| Horizontal Scroll Section | La página ya tiene tres `.swipe` horizontales; un cuarto bloque horizontal haría que el usuario no supiera en qué eje está |
| Stacking Cards | **Descartado en el catálogo y aplicado en pequeño en el proceso.** En el catálogo no: las fichas se comparan, no se apilan, y el apilado esconde fichas. En `#proceso` se usa la versión ligera acordada el 14-11: al salir por arriba cada paso se reduce al 96 % con 8 % de escalonado, sin `position: sticky`, sin reordenar el DOM y sin cambiar el orden de lectura |

**Los que sí se usan:** Reading Progress (barra de lectura, 6 px), Shrinking Header + Shadow (solo la
sombra; la altura no cambia), Fly-in Fly-out e Image Reveal (como apariciones al entrar en pantalla) y,
desde el 14-11-2026, **Image Reveal + Window Carousel** (la cortina de la foto del héroe y su parallax),
**Scroll Shadows** (sombra de borde en los carruseles) y **Stacking Cards** en su versión ligera (el
apilado del proceso). *The Road to Baseline* (la línea del proceso) se usó del 14 al 15-11 y se retiró.

**Siguen fuera:** la animación del aviso legal (es un aviso: se lee entero) y la del cambio de pestaña
del catálogo (es instantáneo por decisión de diseño).

---

## 9. Trampas conocidas

Diez cosas que ya rompieron algo en este proyecto o en las pruebas de los demos.

1. **`view()` dentro de un scroller horizontal da rango cero.** Las tarjetas de `.swipe` en móvil se
   quedaban invisibles. Solución aplicada: la línea de tiempo se declara **en la rejilla** con
   `view-timeline-name` y los hijos la consumen por nombre; el contenedor sí se mide contra el scroll
   de la página. Es más preciso que animar el contenedor entero, porque conserva el escalonado.
2. **Animar `transform` mata el hover de Tailwind.** `hover:translate-y-[-2px]` y `transform` compiten
   por la misma propiedad. Solución: usar `translate`.
3. **`box-shadow` no es compositable.** La sombra de la cabecera se anima con la opacidad de un
   pseudo-elemento que ya tiene la sombra, no con `box-shadow` directo.
4. **Los paneles `hidden` no generan línea de tiempo.** No se puede precalentar la animación del
   catálogo: arranca sola cuando el panel se hace visible.
5. **El `@supports` tiene que envolver también los `@keyframes`.** Si los `@keyframes` quedan fuera,
   un navegador sin soporte aplica el estado inicial del keyframe y oculta el contenido.
6. **Un recorrido de 10-12 px no se ve.** Medido con el vídeo del cliente: la animación existía y era
   imperceptible. El mínimo que se lee en una tarjeta de ~260 px es **28-40 px**. Y si el recorrido se
   hace con `translate`, hay que comprobar que el contenedor no recorte (aquí, `.swipe` en móvil).
7. **Los rangos que terminan en `entry` dejan el elemento asomando.** `entry 0% entry 60%` acaba cuando
   la tarjeta aún está a medio entrar, así que se queda al 60-80 % de opacidad justo cuando empieza a
   leerse. Los rangos de entrada terminan en `cover`, no en `entry`.
8. **Un elemento que ya está a la vista al cargar no puede animarse con `view()`.** La foto del héroe
   nacería con el rango a medias y no llegaría a abrirse nunca. Para eso, animación de **tiempo**; y si
   el mismo elemento lleva las dos, hay que declararlas juntas y respetar el orden:
   `animation: a 620ms ..., b linear ...; animation-timeline: auto, scroll(root block);`.
9. **Un degradado en el fondo de un scroller queda debajo de sus hijos.** La sombra de borde de los
   carruseles vivía en el `background` del `.swipe` y no se veía nunca: las tarjetas son opacas y el
   recorte de `overflow` es el padding box, así que al desplazarse tapan justo esa franja. Hay que
   pintarla en una capa `position: absolute` con `z-index` **fuera** del scroller, sobre un envoltorio
   (`.swipe-marco`), y engancharle la línea de tiempo por nombre con `timeline-scope`.
10. **Un estado base con `html` gana a una regla del efecto sin `html`, y solo a medias.** El 15-11 la
    portada animaba su alto mientras `position: fixed` perdía la cascada contra `html .od-portada`
    (0,1,1 > 0,1,0): el marco se encogía **y se iba con la página** (`top` de 0 a −4000), así que la
    banda nunca se clavaba. Si una propiedad se anima y la de al lado no, sospecha de la especificidad
    antes que de `overflow` o del contenedor de `fixed`. Comprobación: `getComputedStyle(el).position`.

---

## 10. Cómo se verifica

| Prueba | Cómo |
| --- | --- |
| Contenido visible sin soporte | DevTools → Rendering → desactivar «Scroll-driven animations» (o Firefox) |
| Movimiento reducido | DevTools → Rendering → `prefers-reduced-motion: reduce`; recorrer la página entera |
| Sin JS | Desactivar JavaScript y recargar |
| Sin layout shift | Performance → comprobar que no hay entradas de layout después del primer pintado |
| Cabecera estable | Medir `--hh` antes y después de hacer scroll hasta el final |
| Sin scroll horizontal | A 375 px, `document.documentElement.scrollWidth === clientWidth` |
| Contraste intacto | La opacidad nunca baja de 1 en el estado final; el texto no se queda a medio revelar |
| Regla de visibilidad | Con la página quieta, toda ficha entera en pantalla tiene `opacity === 1`; si no, hay un rango mal puesto |
| Intensidad | El recorrido se mide en px, no «a ojo»: por debajo de 20 px no se percibe y hay que subirlo |
| Cortinas de tiempo | `Animation.setPlaybackRate(0.08)` por CDP y muestreo del `clip-path` cada 150 ms |
| Portada-banda | A `scrollY ≥ 90vh`, `getBoundingClientRect().top` del marco en 0 y alto = `--hh` + `--od-portada-banda` (±2 px); el `background-position` de la foto en `50% 100%` |
| Clics bajo la banda | `elementFromPoint(centro, cabecera.bottom + banda + 40)` tiene que caer dentro de `<main>` |

La comprobación de `prefers-reduced-motion` es la más importante: es la única que, si falla, deja la
página inservible para una parte de los usuarios.

Todo esto está automatizado en `qa/probar-portada.mjs` (52 pruebas, servidor propio en el puerto 8901).
Los fallos de red de los dos CDN que usa la página se anotan como diagnóstico aparte y **no** cuentan
como fallo del proyecto; con `OD_BLOQUEAR_CDN=1` se puede forzar ese escenario y ver que la suite baja
por motivos de layout, no de movimiento.

---

## 11. Estado de la implementación

**Implementado el 2026-11-12, ampliado y calibrado el 2026-11-14, y con la portada rehecha el
2026-11-15.** `build/motion.css` tiene 569 líneas, **14 `@keyframes`** y un guard de **30 selectores**.
Están dentro las 8 filas aprobadas y las cuatro demos nuevas; fuera, la del aviso legal y la de las
pestañas. El bloque 11 (portada) no vive en ese archivo: está en la zona `OD:MOTION` de `index.html`
para no tocar el marcado ni el alto del marco.

### 11.1 Qué hay en el archivo

| Bloque | Qué hace | Depende de |
| --- | --- | --- |
| 0. Estado base | `.od-progress { display: none }`; nada oculto ni desplazado por defecto | nada |
| 1. Guard | 30 selectores a `animation: none / opacity: 1 / translate: none / scale: none / clip-path: none` con `!important`, más el icono de la ficha | `prefers-reduced-motion: reduce` |
| 2. Barra de lectura | `scaleX` 0 → 1 con `scroll(root block)`, 6 px | `@supports (animation-timeline: scroll())` |
| 3. Sombra de cabecera | `opacity` de un `::after` con `box-shadow`, rango `0 150px` | idem |
| 4. Entrada del héroe | `od-hero-enter` por tiempo, escalonado con `--motion-stagger` | `no-preference` |
| 5. Apariciones | `od-reveal-rise` (fichas, 28 px), `od-fade-only` (contacto), `od-fade-rise` (pie, 20 px) | `@supports (animation-timeline: view())` |
| 6. Rejillas | `--od-rejilla` declarada en `#beneficios`/`#resenas`, consumida por los hijos; asentamiento con `scale 0.96 → 1` | idem |
| 7. Héroe (demos 5/6) | `od-hero-curtain` (620 ms, `clip-path` de 24 % a 0) + `od-hero-parallax` (`scroll(root block)`, `0 700px`, ±16 px) sobre la foto | `@supports (animation-timeline: scroll())` |
| 8. Proceso (Stacking Cards ligera) | `od-step-recede` (`exit 0% exit 100%`, `scale` 0.96 y opacidad 0.9, escalonado 8 %, solo ≥768 px). La línea de la demo 15 (`od-spine-grow`) **se retiró el 15-11-2026** | idem |
| 9. Ficha (demo 6) | `od-ficha-curtain` sobre el recuadro del icono (`clip-path` 26 % → 0) y `od-icon-settle` sobre el SVG (`opacity` + `scale`), con `--od-ficha` declarada en la ficha | idem |
| 10. Sombras de scroll (demo 14) | `@property --od-can-scroll-l/r` animados por `scroll-timeline: --od-desliz inline`; el degradado de 24 px se pinta en `::before`/`::after` de `.swipe-marco`, por encima de las tarjetas | idem |
| 11. Portada (demo 16) | `od-portada-encoger`: el **marco** `fixed` anima `block-size` de `100svh` a `calc(--hh + --od-portada-banda)` en `scroll(root block)`, rango `0 90vh`; `od-portada-recorte` lleva el `background-position` de la foto de `50% 0` a `50% 100%`; `od-portada-desvanecer` apaga nombre y velo en `0 45vh`. `html body` reserva `100svh` con `padding-block-start` | idem |

### 11.2 Las tres diferencias con la propuesta

1. **Rango de las fichas:** de `entry 25% cover 50%` a `entry 0% entry 90%`. Con el rango largo, una
   ficha ya visible al cambiar de pestaña se quedaba translúcida hasta hacer scroll.
2. **Alcance de las rejillas:** las reglas de `od-stagger` van acotadas a `#beneficios` y `#resenas`.
   El proceso comparte esos ganchos y lleva su propia animación en el bloque 8. Además se quitó
   `od-reveal` de los cuatro pasos en el marcado, para que no vuelva a colarse al reensamblar.
3. **La foto del héroe no se retira, se abre.** La demo 5 adaptada (bajar la columna a opacidad 0,55 y
   `scale` 0,96) se midió y se retiró el mismo día: apagaba la foto justo cuando el usuario la miraba y
   el héroe es lo único que se ve al cargar. En su lugar va una cortina de tiempo más un parallax de
   scroll, que además es lo único que se nota al bajar porque el resto del héroe ya está a la vista.

### 11.3 Verificación

Todas las mediciones están en `qa/movimiento-implementado.md`: valores de estilos calculados leídos
por CDP en Chrome a 1280×900 y 375×812, con y sin movimiento reducido, y con JS desactivado. El arnés
`qa/probar-portada.mjs` cubre el movimiento con **52 pruebas, 52 en verde**. Los datos que resumen el
resultado:

- Barra: `scaleX` 0 → 0,98 al final del documento; 6 px de alto; cabecera de **99 px** constante,
  `fixed` sobre la portada.
- Portada: marco de una pantalla en `y=0` (la foto abre por detrás del menú), z-index 35 frente al 50 de
  la cabecera; al 90 % del recorrido mide **117 px** (99 de menú + 18 de labio: la banda acaba casi a la
  altura del menú) y sigue clavada en
  `top: 0`; desde una pantalla de scroll hacia abajo el `elementFromPoint` del centro cae siempre
  dentro de `<main>`.
- Fichas: opacidad 0 fuera de pantalla → 1 al entrar; al cambiar de pestaña, sus fichas ya están a 1
  (prueba «Regresión: ninguna ficha visible queda a media opacidad»).
- Héroe: `clip-path` de `inset(0 0 24% 0)` a `inset(0)` en 620 ms (medido con
  `Animation.setPlaybackRate(0.08)`); parallax de `translate Y` **+16 px → −16 px** en 700 px de scroll.
- Proceso: sin línea (retirada el 15-11-2026); pasos de `scale` **1 → 0,965** al salir.
- Ficha: cortina de `inset(0 0 26% round 14px)` a `inset(0 0 0% round 14px)`; icono de opacidad 0 a 1.
- Movimiento reducido: todo a opacidad 1, sin `translate`, `scale` ni `clip-path`, sin barra y sin
  sombras de borde; las rotaciones estáticas del héroe intactas.

### 11.4 Cambio del 2026-11-15: la portada se encoge hasta ser una banda

La portada se diseñó como telón `fixed` a pantalla completa que, al bajar, se encogía hasta una banda de
64 px. **Fallo A:** el marco nunca se encogía —solo se animaba el `translate` de la foto—, así que su
fondo opaco (`--ink-fill`) seguía cubriendo la pantalla y **ninguna sección aparecía al hacer scroll**.
Se retiró el efecto y la portada quedó quieta en el flujo. Ese fue el estado intermedio.

Ahora el efecto vuelve, pero encogiendo el **marco**, no la foto, y con tres piezas:

- `html .od-portada` pasa a `position: fixed` (z-index 35, `pointer-events: none`) y anima `block-size`
  de `100svh` a `calc(var(--hh) + var(--od-portada-banda))`: **117 px** a 1280×900 (99 + 18), **172 px**
  a 375×812 (159 + 13) y **177 px** a 768×900 (159 + 18). Rango `0 90vh` sobre `scroll(root block)`.
  El token es solo el **labio de foto** que asoma por debajo del menú: `clamp(10px, 2vh, 20px)` en
  escritorio y `clamp(8px, 1.6vh, 16px)` por debajo de 768 px. La primera versión usaba `64px` fijos
  (163 px de banda) y el cliente la vio demasiado baja: la foto tiene que acabar **casi a la altura del
  menú**, no a media pantalla.
- `od-portada-recorte` lleva el `background-position` de la foto de `50% 0` a `50% 100 %`, así la banda
  muestra el trozo de abajo de la foto; `od-portada-desvanecer` apaga nombre y velo en `0 45vh`.
- `html body { padding-block-start: 100svh }`: al salir del flujo, el marco necesita que el cuerpo
  reserve su alto o el contenido saltaría arriba.

**Fallo B, el que costó encontrar:** el estado base está escrito como `html .od-portada` (0,1,1). La
regla del efecto se escribió primero como `.od-portada` (0,1,0): `position: fixed` e `inset` perdían la
cascada mientras el alto sí se animaba (las animaciones ganan a las declaraciones normales). El marco se
encogía **y se iba con la página**: medido a 1280×900, `marco.top` pasaba de 0 a **−200, −400, −810,
−4000**. La corrección es el prefijo `html ` en las cinco reglas del bloque, comentado en el CSS.

El menú sigue por encima: cabecera `fixed` con z-index 50 sobre el 35 de la portada, y la foto arranca en
`y=0` por debajo. Sin soporte de líneas de tiempo o con `prefers-reduced-motion: reduce`, el bloque del
efecto no entra: la portada se queda `relative`, mide una pantalla, no reserva alto y se va con la
página.

Regresión en el arnés (9 pruebas de portada y anclas): «abre en y=0 y mide una pantalla», «la foto abre
arriba y el nombre se lee (y=0)», «el menú flota por encima», «es decorativa y no roba clics», «al bajar
se encoge hasta una banda bajo el menú», «la banda no tapa nada por debajo del menú», «la foto se recorta
hacia su parte de abajo», «al bajar aparecen las secciones: nada las tapa» y «anclas: cada sección queda
entera por debajo del menú». Los detalles y las tablas, en `qa/movimiento-implementado.md` §15.

### 11.5 Lo que queda fuera, y por qué

| Cosa | Estado |
| --- | --- |
| Fila 8 — línea del proceso | **Entregada el 14-11** sin tocar el markup: la línea son pseudo-elementos de la rejilla y el segmento de móvil, un pseudo-elemento de la tarjeta |
| Fila 12 — sombras de los `.swipe` | **Entregadas el 14-11**, solo en móvil, que es donde los carruseles desbordan. Necesitan el envoltorio `.swipe-marco` de `build/sections/` para pintarse por encima de las tarjetas; sin él la sombra existe pero no se ve |
| `od lint index.html` | **Bloqueado**: el CLI `od` no existe en disco, ni en `bin/` de la app, ni en npm global, ni en PATH (`$env:OD_NODE_BIN` y `$env:OD_BIN` vacíos). Solo corre desde dentro de la app |
| Captura de línea base nueva | Opcional; el texto visible no cambió |
| Prueba en Firefox y Safari | Pendiente de hacer a mano; Firefox cae en el estado seguro por el `@supports` |

### 11.6 Si hay que quitar el movimiento

El movimiento vive en **dos** sitios y conviene saber cuál manda:

| Dónde | Qué hay | Quién lo usa |
| --- | --- | --- |
| Zona `<!-- OD:MOTION -->` de `index.html` | Todo el CSS de movimiento real: bloques 0 a 11, incluida la portada (`od-portada-encoger/recorte/desvanecer` y el `padding-block-start` de `body`) | La página que se entrega |
| `build/motion.css` + `build/*.ps1` | Fuente legacy de la que se copió la zona. **No se ejecutan**: `actualizar-portada.ps1` y `actualizar-inicio.ps1` romperían el `index.html` actual | Solo como referencia histórica |

Por eso:

- **Quitar la barra:** una línea, `display: none` en `.od-progress` (dentro de `index.html`).
- **Quitar la portada animada:** borrar el bloque `@supports (animation-timeline: scroll())` de la zona
  `OD:MOTION` que contiene las reglas `html .od-portada*` y el `html body { padding-block-start }`. El
  estado base (`relative`, `100svh`, sin reserva de alto) queda válido tal cual: la portada vuelve a ser
  una foto de una pantalla que se va con la página, sin tocar el marcado.
- **Quitar todo:** vaciar la zona `OD:MOTION` y dejar el bloque 0 (`.od-progress { display: none }`). El
  texto visible no depende de esa capa: nada está oculto por defecto.
- **Quitar una demo concreta:** cada bloque está comentado con su número y sus `@keyframes` propios; se
  borra el bloque entero y no queda ninguna regla huérfana. Así se retiró la línea del proceso el
  2026-11-15 (bloque 8), dejando intacto el apilado de los pasos.

# Movimiento implementado — verificación en navegador

Registro de lo que se midió el **12 de noviembre de 2026** después de escribir `build/motion.css` con
las filas **1, 2, 3, 4, 6, 9, 10 y 11** de la matriz de `MOTION.md` §6.

No son estimaciones ni capturas de pantalla interpretadas a ojo: son valores de **estilos
calculados** leídos con el protocolo de depuración de Chrome (CDP), después de desplazar la página y
esperar a que el compositor aplicara el cuadro.

---

## 1. Cómo se midió

| Pieza | Detalle |
| --- | --- |
| Navegador | Chrome estable, `--headless=new`, perfil temporal |
| Cliente | `qa`-externo: Node 22 con `WebSocket` nativo, **sin dependencias** (no hay `node_modules` ni Playwright en el proyecto) |
| Puertos | 9337 / 9338 / 9339 según la batería |
| Tamaños | **1280 × 900** (escritorio) y **375 × 780** (móvil) |
| Medios | `Emulation.setEmulatedMedia` con `prefers-reduced-motion: no-preference` y `reduce` |
| Lectura | `getComputedStyle().opacity` / `.transform` / `.animationName`, y `offsetHeight` para las alturas |
| Espera | Doble `requestAnimationFrame` + 120–140 ms antes de cada lectura |

El script vive fuera del proyecto, en `%TEMP%\opencode\cdp-verify2.mjs`, porque es una herramienta de
comprobación y no forma parte del entregable. Se puede volver a ejecutar con `node`.

---

## 2. Fila 1 — barra de lectura

| Posición | `transform` calculado | Lectura |
| --- | --- | --- |
| Arriba del todo (`scrollY = 0`) | `matrix(0, 0, 0, 1, 0, 0)` | `scaleX` = **0** |
| `scrollY = 600` | `matrix(0.114679, 0, 0, 1, 0, 0)` | `scaleX` = **0,1147** |
| Final del documento | `matrix(1, 0, 0, 1, 0, 0)` | `scaleX` = **1** |

- `display` en los dos modos de movimiento: `block`.
- La barra **no ocupa espacio**: es `position: fixed` con `block-size: 3px`, y la altura del documento
  no cambia al aparecer (ver §6).
- Con movimiento reducido: `display: none`. No hay barra, ni hueco de 3 px, ni animación.

## 3. Fila 2 — sombra de la cabecera

| Posición | `opacity` del `::after` |
| --- | --- |
| Arriba del todo | **0** |
| `scrollY = 600` | **1** |

El rango es `0 150px`, así que a 600 px ya está saturada.

**Altura de la cabecera: 101 px** en las tres posiciones medidas (arriba, a 600 px y al final). Es el
dato crítico: `--hh` alimenta el `top` de la tablist fija del catálogo. Si la cabecera cambiara de
alto, las pestañas se descolgarían. No cambia.

Con movimiento reducido el pseudo-elemento **no existe** (`content: none`): no hay sombra ni
animación, pero tampoco un `::after` vacío ocupando sitio.

## 4. Fila 3 — entrada del héroe

Es una animación de **tiempo**, no de scroll: al cargar ya ha terminado. Se mide su estado final, que
es el que importa para la accesibilidad.

| Elemento | `opacity` a los 800 ms de cargar |
| --- | --- |
| `.od-hero__title` (el H1) | **1** |
| `.od-hero__note` | **1** |
| `.od-hero__tape` | **1** |

El H1 nunca se oculta: como mucho se desplaza 12 px durante la entrada. Con movimiento reducido se
salta la animación y aparece directamente a opacidad 1, sin desplazamiento, pero **conservando las
rotaciones** del toldo y la cinta (que usan `transform`, no `translate`).

## 5. Filas 4, 6, 9, 10 y 11 — apariciones

> **Mediciones del 12-11-2026.** Los recorridos y rangos cambiaron en la calibración del 14-11: donde
> aquí se lee 12 px, hoy son 28 px, y los rangos terminan en `cover`. Los valores vigentes están en
> §13. Se conserva el registro porque documenta lo que se midió antes de calibrar.

### 5.1 Estado inicial (arriba del todo, sin haber hecho scroll)

| Grupo | Opacidades medidas |
| --- | --- |
| Beneficios (`#beneficios .od-stagger > *`) | `1, 1, 0.772, 0.522` |
| Compromisos (`#resenas .od-stagger > *`) | `0, 0, 0` |
| Fichas del catálogo (panel visible, primeras) | `0, 0, 0` |

Los cuatro beneficios dan `1, 1, 0.77, 0.52` porque a 900 px de alto **la franja ya está a la vista**:
sus primeras tarjetas han completado el rango y las últimas están a media transición. Es el
comportamiento correcto —el rango empieza en el borde inferior del viewport—, no un fallo.

### 5.2 Al entrar en pantalla

| Sección | Opacidades tras centrarla | `animation-name` |
| --- | --- | --- |
| Beneficios | `1, 1, 1, 1` | `od-rejilla-fade` |
| Compromisos | `1, 1, 1` | `od-rejilla-fade` |
| Catálogo (4 primeras fichas) | `1, 1, 1, 0.003` | `od-reveal-rise` |

La cuarta ficha está a `0.003` porque en ese instante aún asoma por el borde inferior: está
empezando su rango, no se ha quedado atascada.

### 5.3 Móvil a 375 px, la prueba que importa

Aquí `.swipe` **sí** es contenedor de scroll en ambos ejes, y es donde un `view()` mal puesto da rango
cero y deja las tarjetas invisibles para siempre. Medido:

| Sección | Antes | Al centrarla |
| --- | --- | --- |
| Beneficios | `0` | **`1`** |
| Compromisos | `0` | **`1`** |

Funciona porque la línea de tiempo se declara **en la rejilla con nombre** (`view-timeline-name:
--od-rejilla`) y los hijos la consumen con `animation-timeline: --od-rejilla`. El contenedor se mide
contra el scroll de la página; los hijos solo heredan el progreso.

### 5.4 Cambio de pestaña en el catálogo

Se pulsó la pestaña de cuadros y se midió el panel recién mostrado:

| Dato | Resultado |
| --- | --- |
| Panel visible | `true` (sin `hidden`) |
| Opacidad de sus 3 fichas | **`1, 1, 1`** |

Con el rango propuesto originalmente (`entry 25% cover 50%`) estas fichas habrían quedado a media
opacidad hasta hacer scroll. Con `entry 0% entry 60%` —hoy `entry 0% entry 90%`, ver §13— quedan opacas
al instante, porque el rango termina en cuanto la ficha ha entrado entera.

### 5.5 Contacto y pie

| Elemento | Opacidad |
| --- | --- |
| `#contact-heading` | **1** |
| `#contacto .section-subtitle` | **1** |
| `#contacto form` | **1** |
| `.site-footer` | **1** al final |

El formulario **no lleva gancho**: aparece a opacidad 1 desde el primer cuadro y nunca se mueve. Ahí
viven el foco del teclado, el resumen de errores y la validación; esconderlo sería el peor sitio para
hacerlo.

## 6. Lo que no debe moverse

> **Actualizado el 14-11-2026.** Hasta esa fecha el proceso entraba en esta lista («filas no
> aprobadas»); dejó de ser cierto al aprobarse las demos de la línea y del apilado ligero. Lo que
> sigue sin moverse es el aviso legal y el cambio de pestaña del catálogo.

| Comprobación | Resultado |
| --- | --- |
| Aviso del taller | sin gancho |
| Tablist del catálogo y cambio de panel | sin animación; el panel aparece completo |
| Formulario de contacto | sin gancho: nunca se oculta ni se desplaza |
| `#proceso .od-step` | **sí se anima** desde el 14-11: `scale` 1 → 0,965 al salir (`od-step-recede`). La línea `od-spine-grow` se retiró el 15-11 (§15.7) |

Los pasos del proceso siguen sin gancho de aparición (`od-reveal`): su gesto es el apilado al salir. La
rejilla acotada a `#beneficios` y `#resenas` sigue siendo cierta para el escalonado de `.od-stagger`.

## 7. Movimiento reducido (`prefers-reduced-motion: reduce`)

| Comprobación | Resultado |
| --- | --- |
| Barra de lectura | `display: none` |
| Pseudo de sombra de la cabecera | no existe (`content: none`) |
| Héroe (título y cinta) | opacidad **1** |
| Beneficios | **1, 1, 1, 1** |
| Compromisos | **1, 1, 1** |
| Pasos del proceso | **1, 1, 1, 1** |
| Fichas del catálogo | **1, 1, 1** |
| Contacto | **1** |
| Pie | **1** |
| Toldo y cinta del héroe | **siguen rotados** (`transform` intacto) |

Es el escenario que deja la página inservible si falla, y no falla: no hay ni un elemento oculto ni
desplazado.

## 8. Sin JavaScript

Con `Emulation.setScriptExecutionDisabled` y recarga: las fichas del catálogo y el título del héroe
quedan a **opacidad 1**. Nada del movimiento depende de JS; todo es CSS.

## 9. Layout y estabilidad

| Comprobación | Resultado |
| --- | --- |
| Altura del documento, escritorio | **6132 px** con y sin movimiento |
| Altura del documento, móvil | **8778 px** con y sin movimiento |
| Altura de la cabecera | **101 px** constante |
| Scroll horizontal a 375 px | **ninguno** (`scrollWidth ≤ clientWidth`) |
| Texto visible | **idéntico** al baseline (7788 caracteres) |

El movimiento no añade ni un píxel de layout en ningún estado: solo se animan `opacity`, `translate`
y `transform`. La barra de lectura es `fixed` y la sombra de la cabecera vive en un pseudo-elemento
absoluto, así que ninguna de las dos entra en el flujo.

---

## 10. Lo que estas mediciones no cubren

| Hueco | Por qué |
| --- | --- |
| Firefox y Safari | Solo se probó Chrome. Firefox no soporta aún líneas de tiempo de scroll, así que cae en el estado seguro (todo visible) por el envoltorio `@supports`; Safari sí las soporta desde la 26, sin verificar aquí |
| Suavidad real (FPS) | Sin GPU en el contenedor de prueba no tiene sentido medir fps. Las propiedades elegidas son compositables, pero la prueba definitiva es a mano en un dispositivo |
| Lectores de pantalla | La barra lleva `aria-hidden="true"` y el resto del movimiento no altera el árbol de accesibilidad; no se hizo prueba con NVDA/VoiceOver |
| `od lint` | El 14-11-2026 sí se pudo ejecutar: `& $env:OD_NODE_BIN $env:OD_BIN lint index.html` da **0 avisos** (P0 0 · P1 0 · P2 0). El 12-11 el CLI no estaba en disco ni en PATH |

---

## 11. Revisión del 14 de noviembre de 2026: por qué no se ve en Open Design

Petición: «el scroll-driven animation no funciona y no se ve en Open Design».

**Resultado: el sistema de movimiento está bien implementado y la vista previa de la app es la que no
puede reproducirlo.** No hay defecto en `build/motion.css` ni en el marcado.

### 11.1 Lo que se comprobó de nuevo en el archivo (revisión estática)

| Comprobación | Resultado |
| --- | --- |
| `build/motion.css` dentro de la zona `OD:MOTION` de `index.html` | Idéntico byte a byte (8262 caracteres, los dos archivos) |
| Declaraciones `animation-timeline` | 9: `scroll(root block)` ×2 y `view()` ×7 |
| `view-timeline-name` | 1: `--od-rejilla`, en las rejillas de beneficios y compromisos |
| `@keyframes` | 6: `od-progress-grow`, `od-header-shadow`, `od-hero-enter`, `od-reveal-rise`, `od-fade-only`, `od-rejilla-fade` |
| Ficha de producto | `<article class="… od-reveal" data-od-id="producto-…">`: la clase va **después** de `data-od-id`, nunca dentro |
| Formulario | Sin gancho: nunca se oculta ni se mueve mientras se rellena |
| JavaScript de movimiento | Ninguno. 0 `requestAnimationFrame`, 0 librerías. Los dos `addEventListener('scroll')` que hay son el carrusel de pestañas y el widget de WhatsApp, y no mueven nada del sistema |
| Soporte declarado | Chrome/Edge 115+, Safari 26+, Firefox 144+ |

El inventario completo de ganchos vive en `SECTION-MAP.md` (§«Ganchos de movimiento»).

### 11.2 Por qué la vista previa de la app no lo reproduce

La vista previa de Open Design no es una pestaña de navegador: es un `iframe` aislado
(`sandbox allow-scripts allow-forms`, origen opaco) servido por el demonio local, montado sobre un lienzo
escalado (`previewScale` / `canvasWidth`). Tres consecuencias:

1. **El `iframe` no es el contenedor de scroll de una ventana real.** Las líneas de tiempo `view()` y
   `scroll(root)` solo avanzan si el documento se desplaza dentro de ese marco y con el viewport real de
   una ventana. El lienzo escalado del panel no reproduce ese contexto, y el resultado observable es que
   la página se ve **entera y correcta, pero sin movimiento**.
2. **La propia app congela el movimiento cuando captura.** En su ruta de exportación estática emula
   `prefers-reduced-motion: reduce` y llama a `animation.finish()` sobre todas las animaciones: los
   PNG/PDF de `od export` muestran el estado final, nunca el movimiento.
3. **El guard de movimiento reducido se activa igual.** Con `prefers-reduced-motion: reduce`, la regla
   de `build/motion.css` pone `animation: none` y `opacity: 1` en todos los ganchos: el sitio se ve
   completo y estático. Es el comportamiento correcto, no un fallo.

Por eso la página **no está rota**: en la vista previa se ve entera, con su color, su tipografía y su
jerarquía. Lo que no aparece es el movimiento, porque el panel no lo puede ejecutar.

### 11.3 Comprobación automática añadida al arnés (14-11-2026)

`qa/probar-portada.mjs` tenía 25 pruebas y ninguna miraba el movimiento. Ahora tiene **28**, y tres de
ellas son las que contestan a esta pregunta. Se ejecutan en un contexto con `reducedMotion:
'no-preference'`, porque con movimiento reducido el sitio se muestra quieto a propósito y la medición no
diría nada.

| Prueba | Qué mide | Resultado medido |
| --- | --- | --- |
| `Movimiento: el navegador admite animation-timeline` | `CSS.supports('animation-timeline', 'view()')` | **PASA** — `view()` y `scroll()` soportados |
| `Movimiento: la barra de lectura avanza con el scroll` | `scaleX` del `.od-progress` arriba y a 1600 px | **PASA** — `scaleX` arriba = **0**, abajo = **0,30581** |
| `Movimiento: las fichas del catálogo aparecen al entrar en pantalla` | opacidad de la primera ficha fuera de pantalla y ya dentro | **PASA** — opacidad lejos = **0**, cerca = **1**, `animation-name` = **`od-reveal-rise`** |

Ejecución completa del arnés: **28/28 pruebas superadas**, sin errores en consola.

```powershell
$env:PLAYWRIGHT_MODULE = "$env:TEMP\opencode\pw\node_modules\playwright-core"
node qa\probar-portada.mjs
```

El arnés además dejó de depender de una ruta fija de navegador: antes exigía Chrome en
`C:/Program Files/Google/Chrome/Application/chrome.exe` y salía sin hacer nada si no estaba. Ahora prueba
esa ruta, las de Edge, y las cachés de Puppeteer y Playwright, que ya traen un Chromium descargado:

| Navegador | Ruta |
| --- | --- |
| Chrome (instalado) | `C:/Program Files/Google/Chrome/Application/chrome.exe` |
| Chrome (caché de Puppeteer) | `%USERPROFILE%\.cache\puppeteer\chrome\win64-150.0.7871.24\chrome-win64\chrome.exe` |
| Chromium (caché de Playwright) | `%LOCALAPPDATA%\ms-playwright\chromium-1223\chrome-win64\chrome.exe` |

### 11.4 Lo que hay que ver a ojo

Para ver el movimiento, abrir `index.html` en un Chromium (≥116) y desplazarse. Valores al día
(calibración del 14-11, §13):

| Señal | Qué esperar |
| --- | --- |
| Barra de lectura | Franja de acento de **6 px** arriba, de `scaleX(0)` a `scaleX(1)` al recorrer la página |
| Sombra de la cabecera | Aparece al pasar los primeros 150 px de scroll |
| Entrada del héroe | Claim, título, entradilla, CTAs, nota y cinta entran escalonados **al cargar** (es tiempo, no scroll) |
| Foto del héroe | Se abre con una **cortina** al cargar (620 ms) y se mueve con **parallax** de ±16 px en los primeros 700 px de scroll |
| Fichas del catálogo | Suben **28 px**, el recuadro del icono se abre con `clip-path` y el icono se asienta |
| Beneficios y compromisos | Las tarjetas salen escalonadas y se asientan de **96 % a 100 %** de escala |
| Proceso | La línea se dibuja al entrar; los pasos se reducen al 96 % al salir por arriba (escritorio) |
| Carruseles en móvil | Sombra de borde de **24 px** a los lados que tienen contenido; desaparece al llegar al extremo |

### 11.5 Conclusión

**El movimiento ligado al scroll funciona y está medido.** El sistema cumple las reglas del proyecto
(solo propiedades que el compositor anima: `opacity`, `translate`, `scale`, `clip-path`; sin librerías,
sin listeners de scroll, sin `requestAnimationFrame`; con neutralización completa en
`prefers-reduced-motion`).

Lo que no funciona es **la vista previa de la app como banco de pruebas**: muestra el artefacto dentro de
un `iframe` aislado y congelado, no como una ventana de navegador, así que presenta la página completa y
sin movimiento. Para juzgar este sistema hay que abrir el archivo en un Chromium real o usar el arnés.

---

## 12. Ampliación del 14 de noviembre de 2026: cuatro demos más, una por sección

Petición: «que según la sección de la página se puedan aplicar las demos de
<https://scroll-driven-animations.style/>».

Se añadieron cuatro demos, cada una en la sección que le corresponde. Todas en CSS puro y **sin tocar
el markup**: la línea del proceso son pseudo-elementos de la rejilla y el segmento de móvil es un
pseudo-elemento de la tarjeta.

| Demo | Sección | Qué hace | Técnica |
| --- | --- | --- | --- |
| Cover Card to Fixed Header (adaptada) | Héroe | la columna de la foto se retira al bajar y vuelve al subir — **retirada el mismo día, ver §13** | `scroll(root block)`, rango `0 420px`, sobre `scale` y `opacity` |
| The Road to Baseline Newly Available | Proceso | la línea de recorrido se dibuja al pasar la sección; las píldoras «Paso NN» son los hitos | `view()` + `contain 12% 88%` sobre `scaleX`; en móvil, `view(inline)` por tarjeta |
| Image Reveal Effects (enriquecida) | Catálogo | el icono de la ficha se asienta como un sello, en sincronía con la ficha | `view()` de la ficha (`--od-ficha`) sobre `opacity` y `scale` del icono |
| Scroll Shadows | Beneficios, proceso y compromisos | sombra de borde en los carruseles: aparece cuando hay contenido hacia ese lado y desaparece al llegar al extremo | `@property --od-can-scroll-l/r` + `scroll(self inline)` |

### 12.1 Lo que se midió (Chrome, 1280 × 900 y 375 × 812)

| Comprobación | Resultado |
| --- | --- |
| Héroe: opacidad de `.od-hero__media-col` arriba y a 400 px | **1** → **0,5714** |
| Proceso: `scaleX` del relleno de la línea, arriba y con la sección centrada | ~~**0** → **0,7802**~~ — la línea se retiró el 15-11-2026 (§15.7); hoy solo queda el apilado `od-step-recede` |
| Catálogo: opacidad del icono de la primera ficha, fuera de pantalla y dentro | **0** → **1** (`animation-name: od-icon-settle`) |
| Móvil: `--od-can-scroll-l` del carrusel de beneficios, al inicio y a media vuelta | **0** → **1** (recorrido 264 px de 824). *Medición de la primera versión: la sombra se pintaba debajo de las tarjetas y no se veía. Ver §13.6* |
| Movimiento reducido: opacidad y `translate` de 10 elementos con gancho | **1** y `translate: none` en todos |
| Movimiento reducido: barra de lectura y sombra de borde | `display: none` y `--od-can-scroll-l: 0` |
| Cabecera | 101 px, sin cambios |
| Scroll horizontal a 375 px | Ninguno |

El arnés `qa/probar-portada.mjs` quedó entonces en **34/34**: las 28 pruebas de antes, más 4 de las demos
nuevas y 2 de movimiento reducido. Hoy son **48** (39 tras la calibración y el arreglo de las sombras, §13;
44 con la regresión de la portada y 48 con la portada-banda del 15-11, §15).

### 12.2 Un fallo que salió en el camino

El icono de la ficha se animaba con su propio `view()` y **no se movía**: el recuadro que lo contiene
tiene `overflow-hidden` (por las esquinas redondeadas) y era su contenedor de scroll, así que el icono
ya estaba «dentro» desde el principio y la línea de tiempo se completaba de golpe. La solución es la
misma que ya usaba el proyecto para las rejillas: la línea de tiempo se declara en la ficha
(`--od-ficha`) y el icono la consume por nombre.

### 12.3 Dónde verlas

La vista previa de Open Design no reproduce el movimiento ligado al scroll (§11.2): abre `index.html`
en Chrome o Edge (≥115) y desplázate, o repite la medición con el arnés.

---

## 13. Calibración del 14 de noviembre de 2026 (segunda pasada del mismo día)

Petición: «las animaciones no se ven». Se revisó con el vídeo del cliente
(`Sublikat … 2026-11-14 13-59-52.mp4`) y con el arnés, y **el código no estaba roto**: la barra de
lectura crecía de 0 a 1359 px (98,8 % del documento) en la grabación, y esa barra solo existe dentro de
`@supports (animation-timeline: scroll())`. El problema era la **magnitud**: 10-12 px de recorrido y
rangos que terminaban en `entry`, con el elemento aún asomando por el borde inferior.

### 13.1 Antes y después

| | Antes | Ahora |
| --- | --- | --- |
| Recorrido de una ficha | 12 px sobre ~260 px = 4,6 % | **28 px** |
| Rango de la ficha | `entry 0% entry 60%` | **`entry 0% entry 90%`** |
| Recorrido de una tarjeta de rejilla | 10 px de `translate` | **`scale` 96 % → 100 %** |
| Rango de las rejillas | `entry 0% entry 40%` … `entry 30% entry 70%` | **`entry 5% cover 12%` … `entry 26% cover 30%`** |
| Barra de lectura | 3 px (tapada por la cabecera) | **6 px** |
| Foto del héroe | opacidad 1 → 0,55 y `scale` 0,96 al bajar | **cortina `clip-path` 24 % → 0 (620 ms) + parallax `0 700px`, ±16 px** |
| Recuadro de la ficha | sin cortina | **`clip-path inset(0 0 26% round 14px) → inset(0)`** |
| Pasos del proceso | solo la línea | **+ `scale` 1 → 0,96 y opacidad 0,9 en `exit`, escalonado 8 %** |
| Sombras de borde de `.swipe` | 18 px al 20 %, pintadas en el fondo del carrusel (tapadas por las tarjetas) | **24 px al 30 %, en dos capas por encima** sobre `.swipe-marco` |
| Pie | opacidad y rango `entry 0% entry 30%` | **`od-fade-rise`: opacidad + 20 px, `entry 0% cover 20%`** |

### 13.2 Regla nueva y medible

**Un elemento completamente visible tiene que estar a opacidad 1, en su sitio y sin recortar.** Antes
bastaba con que la animación existiera; ahora se comprueba que no haya estado intermedio persistente.
El arnés la implementa en la prueba «Regresión: ninguna ficha visible queda a media opacidad»: recorre
las fichas del panel abierto y falla si alguna entera en pantalla está por debajo de 0,99.

### 13.3 Lo que se midió

| Comprobación | Resultado |
| --- | --- |
| Parallax del héroe: `translate Y` arriba y a 700 px | **+16 px → −16 px** (`od-hero-curtain, od-hero-parallax`) |
| Cortina del héroe al terminar | `clip-path: inset(0px 0px 0%)`, `scale: 1.14` |
| Cortina del héroe en el tiempo (`Animation.setPlaybackRate(0.08)`, muestra cada 150 ms) | **24 % → 23,8 % → 21,7 % → 19,5 % → … → 0 %** |
| Cortina del recuadro de la ficha | `inset(0px 0px 26% round 14px)` → `inset(0px 0px 0% round 14px)` |
| Línea del proceso (`scaleX` del relleno) | **retirada** el 15-11-2026: `content: none` en los tres pseudo-elementos (§15.7) |
| Pasos del proceso (`scale`) | **1 → 0,965437** (`od-step-recede`) |
| Icono de la ficha (opacidad) | **0 → 1** (`od-icon-settle`) |
| Barra de lectura | `block-size: 6px`, `display: block`, `scaleX` 0 → 0,98 al final |
| Sombras de `.swipe` en móvil | capas `::before`/`::after` del envoltorio: alpha **0 → 0,30** al desplazar; píxel del borde `(190,174,149)` → `(235,220,192)`; los tres carruseles desbordan (`824`, `628`, `505` px) |
| Movimiento reducido | 12 selectores muestreados a opacidad 1, `translate`/`scale`/`clip-path` en `none`, sin barra ni sombras |
| Cabecera | 101 px, sin cambios |
| Scroll horizontal a 375 px | Ninguno |

El arnés pasa de **34 a 39 pruebas, 39 en verde** (`node qa/probar-portada.mjs`). Las cinco nuevas son:
parallax del héroe, cortina del héroe terminada, cortina del recuadro de la ficha, guarda de fichas
visibles y apilado del proceso; la de la barra se amplió para exigir 6 px.

### 13.4 Dos decisiones que salieron de esta pasada

1. **El héroe no se apaga, se abre.** La «retirada» de la columna bajaba la foto a 0,55 de opacidad y
   `scale` 0,96 justo cuando el usuario empezaba a mirarla. Se sustituyó por la cortina (tiempo) y el
   parallax (scroll) del mismo día. La cortina es de **tiempo** a propósito: el héroe ya está a la
   vista al cargar y un `view()` nacería a medio abrir.
2. **Las rejillas se asientan con `scale`, no con `translate`.** Las tarjetas viven dentro del `.swipe`,
   que en móvil desplaza en horizontal; moverlas en vertical desbordaba el carrusel (22 px de relleno
   arriba, 10 abajo).

### 13.5 Dónde verlo

Igual que §12.3: la vista previa de la app no reproduce el scroll de la página, así que hay que abrir
`index.html` en Chrome o Edge. El movimiento base pide 115; las sombras de borde suben el listón a
**116** por `timeline-scope` (§13.6). Para ver la cortina del héroe hay que mirar **al cargar**; para
todo lo demás, desplazarse.

### 13.6 El fallo que salió en la verificación visual: una sombra que existía y no se veía

La sombra de los carruseles pasaba las pruebas (los números `--od-can-scroll-l/r` iban de 0 a 1) y no
se veía **nada** en la captura. La causa es de pintado, no de animación: el degradado vivía en el
`background` del `.swipe`, y las tarjetas son opacas, así que al desplazarse tapan exactamente esa
franja. El recorte de `overflow` es el **padding box**, no el content box: el contenido desplazado se
pinta encima del relleno del contenedor, que es donde estaba la sombra.

Arreglo, en tres piezas:

1. Un envoltorio `<div class="swipe-marco">` alrededor de cada `.swipe` en `build/sections/` (tres
   carruseles). Es el único sitio desde el que se puede pintar **encima** del contenido desplazado.
2. Dos capas `position: absolute` (`::before` y `::after`) con `z-index: 2`, `pointer-events: none` y
   `isolation: isolate` en el envoltorio. Se anclan a `left/right: -16px` porque en móvil el `.swipe`
   se sale 16 px por lado (`margin-inline: -16px`): su borde visual no es el del envoltorio.
3. La línea de tiempo sube del carrusel al envoltorio por nombre: `scroll-timeline: --od-desliz inline`
   en el `.swipe` y `timeline-scope: --od-desliz` en el marco. `scroll(self inline)` no sirve aquí
   porque el envoltorio no es el que se desplaza.

Medición final, en píxeles y no en estilos: en los tres carruseles el borde pasa de `(190,174,149)` a
`(235,220,192)` en 20 px CSS; en tema oscuro, de `(49,30,19)` a `(59,36,23)`.

Dos límites que conviene saber:

- **`timeline-scope` es Chrome 116+**, un escalón por encima del 115 que ya pedía el resto. Sin soporte
  las capas simplemente no aparecen: no hay estado roto.
- **Si un carrusel no desbordara**, su línea de tiempo quedaría inactiva y la sombra derecha se
  quedaría fija. Hoy los tres desbordan a 375 px (las tarjetas son del 82 %), y el arnés lo comprueba
  para que no se rompa en silencio si cambia el número de tarjetas.

## 14. Las dos dependencias externas, y por qué el arnés las separa

`index.html` carga dos cosas de internet en tiempo de ejecución:

| Recurso | Para qué | Si falta |
| --- | --- | --- |
| `cdn.tailwindcss.com` | Todas las clases de utilidad del marcado: layout, tipografía, colores | La página se ve **sin estilos**: una columna de texto crudo. No es un fallo de movimiento, es un fallo de entrega |
| `fonts.googleapis.com` + `fonts.gstatic.com` | Chewy y Nunito | Cae a la fuente del sistema; se pierde la personalidad, el layout aguanta |

Ninguna de las dos es parte de la capa de movimiento, pero las dos pueden desaparecer sin que el
proyecto cambie una línea. En la primera pasada del 14-11 el arnés marcó **FALLA Sin errores en
consola** con tres `net::ERR_CONNECTION_TIMED_OUT`: eran los CDN, no el sitio. Un banco de pruebas que
falla cuando falla la red del banco no sirve para decidir nada.

Cómo queda: los fallos de red se anotan en `recursosExternos` y se imprimen como
`DIAGNOSTICO-EXTERNOS`; solo los errores del propio `127.0.0.1:8901` cuentan como error del proyecto.
Un 404 local sigue siendo FALLA.

Para comprobar que la clasificación no esconde fallos reales, el arnés acepta `OD_BLOQUEAR_CDN=1`, que
mapea los tres dominios a `127.0.0.1` con `--host-resolver-rules`:

| Con los CDN alcanzables | Con `OD_BLOQUEAR_CDN=1` |
| --- | --- |
| **39/39** (versión de 39 pruebas; hoy el arnés tiene 48) | **30/39** |
| Sin errores de consola | Sin errores de consola, y `DIAGNOSTICO-EXTERNOS` con los 72 intentos fallidos |

Las 9 que caen con el CDN bloqueado son de layout y contraste (`1282` vs `1280` px de ancho,
`554` vs `375`, enlaces con contraste 1,54), no de movimiento: sin Tailwind no hay rejilla. Es la
prueba de que el filtro distingue red de proyecto, y a la vez el recordatorio de que **la página
depende del CDN**: si Sublikat abre el archivo sin conexión, el problema no será el scroll.

---

## 15. Portada del 15 de noviembre de 2026: la foto que se encoge hasta ser una banda

Petición: que la foto del taller funcione como el «cover to fixed header» de
`scroll-driven-animations.style` (`@keyframes sticky-parallax-header-move-and-size`), **con el menú por
encima**. Hubo que corregir dos cosas, y la segunda fue un fallo de cascada.

### 15.1 El fallo: la regla del efecto perdía la cascada

El estado base de la portada está escrito como `html .od-portada` (especificidad 0,1,1). La primera
versión de la regla del efecto se escribió como `.od-portada` (0,1,0). Resultado: `position: fixed` e
`inset` del efecto **nunca se aplicaban**, pero el alto sí se animaba (las animaciones ganan a las
declaraciones normales). Medido a 1280 × 900:

| `scrollY` | `marco.top` (antes) | `marco.alto` (antes) | `marco.top` (ahora) | `marco.alto` (ahora) |
| --- | --- | --- | --- | --- |
| 0 | 0 | 900 | 0 | 900 |
| 200 | **−200** | 718 | 0 | 718 |
| 400 | **−400** | 536 | 0 | 536 |
| 810 | **−810** | 163 | 0 | 163 |
| 4000 | **−4000** | 163 | 0 | 163 |

La banda se encogía, sí, pero se iba con la página: nunca se clavaba arriba. La corrección es un prefijo
(`html .od-portada`) y está comentada en el CSS para que no se pierda.

### 15.2 Cómo queda (medido, no estimado)

| Pieza | Valor medido |
| --- | --- |
| Alto al abrir | `100svh` (900 px a 1280 × 900; 812 px a 375 × 812) |
| Alto al final del recorrido | `--hh` + `--od-portada-banda`: **117 px** (99 + 18) a 1280; **172 px** (159 + 13) a 375; **177 px** (159 + 18) a 768. La banda acaba a la altura del menú, con un labio de foto de ~30 px por debajo de la tarjeta (ver §16) |
| Recorrido | `animation-range: 0 90vh` sobre `scroll(root block)` |
| Foto | `background-position` **50 % 0 → 50 % 100 %**, mismo rango |
| Nombre y velo | opacidad **1 → 0** en `0 45vh` (al 45 % del recorrido ya están a 0) |
| Reserva de alto | `html body { padding-block-start: 100svh }`, solo dentro del `@supports` |
| Clics | `pointer-events: none`: la portada es decorativa y no se come los enlaces que pasan por debajo |
| Movimiento reducido | `position: relative`, 900 px y `padding-block-start: 0`: se va con la página, sin banda |

Anclas: con la banda puesta, `scroll-margin-top` pasa a `--hh` + banda + 12 px. Medido con
`scrollIntoView({ block: 'start' })`: las cuatro secciones (`#tienda`, `#proceso`, `#resenas`,
`#contacto`) quedan en **top = 129 px** (99 + 18 + 12), justo por debajo del menú y de la banda.

### 15.3 El arnés: de 44 a 48 pruebas (49 el 15-11 por la foto responsive; 52 y luego 54 el 16-11)

| Prueba | Qué comprueba |
| --- | --- |
| Portada: abre en y=0 y mide una pantalla | marco de `100svh` en `top: 0` |
| Portada: la foto abre arriba y el nombre se lee (y=0) | `background-position: 50% 0%` y nombre a opacidad 1 (un marco vacío también mediría una pantalla) |
| Portada: el menú flota por encima (z-index mayor y sin hueco) | z 50 > 35 y cabecera en `top: 0` |
| Portada: es decorativa y no roba clics | `pointer-events: none` |
| Portada: al bajar se encoge hasta una banda bajo el menú | en 90vh, 100vh, 200vh y 400vh: `top = 0` y alto = `--hh` + banda ± 2 px |
| Portada: la banda no tapa nada por debajo del menú | alto ≤ cabecera + banda + 2 |
| Portada: la foto se recorta hacia su parte de abajo | 50 % 0 % al abrir, 50 % 100 % al final |
| Al bajar aparecen las secciones: nada las tapa | centro y punto bajo la banda dentro de `<main>` en 100vh, 200vh y 400vh |
| Anclas: cada sección queda entera por debajo del menú | además de `top ≥` cabecera, `top ≥` borde inferior de la banda |
| Portada responsive: cada ancho carga su propio archivo de foto | 1280 → `-2150.jpg`; 768 → `-1440.jpg` con foco 68 %; 375 vertical → `-movil.jpg`; 667×375 apaisado → `-1024.jpg` |
| Modo oscuro dentro de la hamburguesa: en móvil el conmutador vive en el menú | padre `#menu-tema`, un solo nodo, fila de 301 × 48 con la etiqueta visible |
| Modo oscuro dentro de la hamburguesa: alterna y cambia la etiqueta | clic dentro del menú: `data-theme` cambia, `aria-pressed` coincide y la etiqueta pasa a «Modo claro» |
| Modo oscuro dentro de la hamburguesa: vuelve a la barra al ensanchar | a 1280 px: fuera del menú, justo antes de `#menu-btn`, 44 px y sin etiqueta |
| Catálogo: cambiar de categoría desde el fondo vuelve a la primera ficha | desde el último producto de «Regalos» a «Papelería»: título y primera ficha bajo la barra fija (§16) |
| Catálogo: desde el inicio de la sección el cambio no da un salto | el scroll no se mueve y el panel sigue por debajo de la barra |

Ejecución completa: **54/54 pruebas superadas** (`node qa/probar-portada.mjs`), con «Sin errores en
consola — ninguno». Las pruebas de movimiento reducido siguen pasando: con `reduce` la portada se queda
en el flujo, mide una pantalla y no hay banda.

### 15.4 El arnés y las rutas que reescribe la app

Cuando `index.html` se guarda desde la app, las referencias a `assets/` se reescriben a
`/api/projects/<id>/raw/assets/...?workspaceId=...`. En la vista previa de la app eso funciona; en el
banco de pruebas, que sirve los archivos con su propio `http.createServer`, esas rutas dan 404 y la
prueba «Sin errores en consola» falla por un motivo de entorno, no del sitio.

Desde el 15-11-2026 el servidor del arnés deshace ese prefijo (`reescribeApi`) y sirve el archivo real.
Así la suite mide la página y no la forma de la ruta. En el archivo entregado las tres referencias
(`favicon.svg`, `portada/quita-la-luz-2150.jpg`, `stock/camiseta-cats.jpg`) se dejaron **relativas**:
el HTML tiene que funcionar abierto desde el disco, sin la app.

Ese mismo día se restauró la cabecera completa en la zona `OD:HEADER`, que se había borrado: el
`<header id="site-header">` con el logo SVG, los cuatro enlaces de navegación, el conmutador de tema, el
botón del menú móvil y el `<nav id="menu-movil">`. Medido después: `position: fixed`, `top: 0`, 99 px de
alto, z-index 50, `--hh` = 99 px en escritorio y 396 px en móvil con el panel abierto.

### 15.5 La cabecera deja de pintar fondo

Petición: que la foto quede «debajo del menú y dentro del header». La cabecera tenía
`background: var(--bg)` en `html #site-header`, así que pintaba una banda opaca de 1200 px que se comía
el primer tramo de la foto: la imagen empezaba a verse a los 99 px y el menú parecía estar encima de un
cuadro claro. Ahora esa declaración está comentada (en `index.html` y en `build/css/header.css`) y lo
único opaco que queda es la tarjeta del menú (`bg-surface`, `rgb(255,255,255)` en claro).

Medido con `getComputedStyle`:

| Elemento | `background-color` |
| --- | --- |
| `#site-header` | `rgba(0, 0, 0, 0)` |
| tarjeta interior | `rgb(255, 255, 255)` en claro, superficie oscura en el tema oscuro |

La foto sigue arrancando en `y=0`, se ve en los 12 px de relleno de arriba y de abajo de la cabecera, y
la banda incluye el alto del menú: `--hh` + `--od-portada-banda`. La suite sigue en **48/48**; ninguna
prueba dependía del fondo de la cabecera.

### 15.6 Cuánto sube: el labio de foto (segunda pasada del 15-11)

La primera versión dejaba la banda en `--hh` + 64 px (163 px a 1280). El cliente la vio **demasiado
abajo**: quería que la foto acabara «casi a la altura del menú», con el borde inferior de la banda como
límite del recorrido. Se corrigió el token, no la animación:

| Medido | Antes (`64px` fijo) | Ahora (`clamp`) |
| --- | --- | --- |
| `--od-portada-banda` a 1280 × 900 | 64 px | **18 px** (`clamp(10px, 2vh, 20px)`) |
| Alto final de la banda a 1280 | 163 px | **117 px** (menú 99 + 18) |
| Alto final a 375 × 812 | 207 px | **172 px** (menú 159 + 13) |
| Alto final a 768 × 900 | 223 px | **177 px** (menú 159 + 18) |
| Foto visible por debajo de la tarjeta del menú | 76 px | **31 px** (la tarjeta acaba en `y=87`) |

En móvil se usa `clamp(8px, 1.6vh, 16px)` porque el menú ocupa dos filas (159 px) y el labio se
reduce. El resultado se comprobó con capturas a 1280 y 375: la banda termina donde termina el menú más
un filo de foto, y las secciones empiezan inmediatamente después, sin hueco muerto.

### 15.7 La línea del proceso, retirada el mismo día

Petición aparte, sobre la sección «Cómo trabajamos»: la barra de `--accent` que avanzaba sobre las
píldoras «Paso NN» se leía como un subrayado a medias. Se eliminaron **cinco piezas**: la base gris
(`#proceso .od-steps::before`), el relleno que crecía (`::after`), el segmento por tarjeta del carrusel
móvil (`#proceso .od-step::after`), los `@keyframes od-spine-grow` y el `z-index: 1` de las tarjetas
(que solo servía para pasar por delante de la línea).

Medido después, con la sección a la vista:

| Comprobación | Valor |
| --- | --- |
| `getComputedStyle(#proceso .od-steps, '::after').content` | `none` |
| `getComputedStyle(#proceso .od-steps, '::before').content` | `none` |
| `getComputedStyle(#proceso .od-step, '::after').content` | `none` |
| `animation-name` de los tres | `none` |
| Apilado de los pasos | `od-step-recede` intacto (`scale` 1 → 0,965) |
| Hueco entre píldoras y tarjetas | el `gap` de la rejilla; no queda ningún espacio fantasma |

La prueba del arnés «Demo 15: la línea del proceso se dibuja al avanzar» **se sustituyó** por
«Regresión: la línea del proceso no vuelve (se retiró el 15-11-2026)», que exige `content: none` en los
tres pseudo-elementos y que el apilado siga activo. La suite pasó de 48 a 49 al añadirse la prueba de la
foto responsive (§15.8); no se perdió ninguna cobertura.

### 15.8 La foto de la portada, responsive

El original pesa **287 KB** y mide **2150 × 1200**. Con `background-size: cover` el navegador escala por
la dimensión que falta: en un móvil vertical (375 × 812) escala por el alto, así que **solo se ven unos
554 px de los 2150** y el resto se descarga para nada. Las tres variantes se generaron desde el original
con `System.Drawing` (bicúbico, calidad 82–84):

| Archivo | Tamaño | Peso | Se sirve en |
| --- | --- | --- | --- |
| `quita-la-luz-2150.jpg` | 2150 × 1200 | 287 KB | ≥1280 px |
| `quita-la-luz-1440.jpg` | 1440 × 804 | 157 KB | 768–1279 px |
| `quita-la-luz-1024.jpg` | 1024 × 572 | 95 KB | móvil apaisado (≤767 px y `orientation: landscape`) |
| `quita-la-luz-movil.jpg` | 554 × 1200 | **73 KB** | móvil vertical (≤767 px y `orientation: portrait`) |

El recorte vertical conserva los **1200 px de alto** del original, así que el detalle que se ve por
centímetro es el mismo que en escritorio; lo que se ahorra es el ancho que `cover` tiraba. Y al tener la
misma proporción que la pantalla, `cover` ya no recorta: el encuadre viene elegido (prensa y taza) en vez
de ser el centro accidental de la foto.

**Foco horizontal por ancho.** En tablet vertical (768–1023 px) `cover` recorta casi 8 de cada 10 px de
ancho y el centro de la foto es pared: se sube el foco a **68 %**, que deja dentro la prensa y las tazas.
El foco vive en `--od-portada-foco-x` y lo consumen tanto la posición en reposo como los `@keyframes`
`od-portada-recorte`, así que no hay dos versiones de la animación:

```css
html .od-portada__foto { --od-portada-foco-x: 50%; background-position: var(--od-portada-foco-x) 0; }
@keyframes od-portada-recorte {
  from { background-position: var(--od-portada-foco-x, 50%) 0; }
  to   { background-position: var(--od-portada-foco-x, 50%) 100%; }
}
```

Medido con `getComputedStyle(...).backgroundImage` en el navegador:

| Ancho × alto | Archivo pedido | Foco |
| --- | --- | --- |
| 1280 × 900 | `quita-la-luz-2150.jpg` | 50 % |
| 768 × 900 | `quita-la-luz-1440.jpg` | **68 %** |
| 375 × 812 (vertical) | `quita-la-luz-movil.jpg` | 50 % |
| 667 × 375 (apaisado) | `quita-la-luz-1024.jpg` | 50 % |

Ese cuadro es la prueba nueva «Portada responsive: cada ancho carga su propio archivo de foto», que lee
el `background-image` computado (lo que el navegador pide de verdad) en cuatro tamaños de ventana.

### 15.9 El conmutador de tema, dentro de la hamburguesa (16-11-2026)

Petición del cliente: en móvil el botón de modo oscuro no debía ocupar sitio en la barra, sino estar
**dentro del menú de hamburguesa**. La solución no duplica el botón: **se muda el mismo nodo**.

```js
function iniciarTemaEnMenu(medir) {
  var consulta = window.matchMedia('(max-width: 767px)');
  function ubicar() {
    if (consulta.matches) { hueco.hidden = false; hueco.appendChild(boton); }
    else { padre.insertBefore(boton, siguiente); hueco.hidden = true; }
    medir();                       // la barra cambia de alto: `--hh` se remide
  }
}
```

Por qué mover y no copiar: `#theme-toggle` ya tiene su listener de `click`, su `aria-pressed` y su
estado de icono; `aplicarTema()` lo busca por id. Un segundo botón obligaría a sincronizar dos estados y
a decidir cuál manda con el lector de pantalla. Moviendo el nodo, hay **un solo botón** siempre: solo
cambia de padre. La hamburguesa (`#menu-btn`) sigue en la barra, así que el menú se abre igual aunque el
conmutador esté dentro.

| Comprobación | Valor medido |
| --- | --- |
| Nodos `#theme-toggle` en el documento | 1 (en móvil y en escritorio) |
| Padre a 375 px, con el menú cerrado | `#menu-tema` (dentro de `#menu-movil`) |
| Tamaño de la fila a 375 px, menú abierto | **301 × 48** px, texto a la izquierda e icono a la derecha |
| Etiqueta escrita («Modo oscuro» / «Modo claro») | `display: none` en la barra, `inline` dentro del menú |
| Clic dentro del menú | `data-theme` cambia, `aria-pressed` coincide y la etiqueta se actualiza |
| Padre a 1280 px | la barra, **justo antes de `#menu-btn`**, 44 × 44 px y sin etiqueta |
| Hueco `#menu-tema` fuera de móvil | `hidden` (`display: none`) |

La etiqueta es `aria-hidden`: el nombre accesible sigue siendo el `aria-label` del botón («Cambiar a
modo oscuro» / «Cambiar a modo claro»), que ya se actualizaba en `aplicarTema()`. El texto de dentro solo
existe para que la fila del menú se lea como un renglón más, al lado de «Tienda» o «Contacto».

Con esto la suite pasó de 49 a **52 pruebas** (las tres de §15.3 sobre la ubicación del conmutador) y
todo sigue en verde.

## 16. El catálogo vuelve al principio al cambiar de categoría (16-11-2026)

Reporte del cliente: «en la sección "20 productos en 5 categorías", al seleccionar una categoría nueva
debe volver siempre a las primeras tarjetas o al inicio de la sección, ya que ahora, si estás muy abajo
en el último producto y eliges una categoría con menos productos, quedas abajo, viendo la sección que
sigue». El fallo era exactamente ese: el panel se cambia en el sitio, sin tocar el scroll, y como la
lista nueva es más corta que la posición en la que estabas, la ventana acababa por debajo de la lista.

**Qué hace ahora** (`volverAlaLista`, en `iniciarCategorias`): al pulsar una pestaña —o al cambiarla con
las flechas, Inicio o Fin— se mide dónde debe empezar la lista y, si la primera ficha no se ve entera
por debajo de la barra de pestañas fija, se desplaza hasta dejarla ahí.

```js
techo = top de la tablist fija (calc(--hh + banda + 8px)) + su alto + 12
if (panel.top >= techo - 1) return;   // ya se ve: no se mueve
scrollTo({ top: scrollY + panel.top - techo, behavior: suave ? 'smooth' : 'auto' })
```

Tres decisiones que importan:

- **Solo sube si hace falta.** Si la sección ya se está viendo (panel por debajo del techo), no se toca
  el scroll. Pulsar una pestaña sin haber bajado no da ningún salto; medido: `y` no cambia (2176 → 2176
  a 1280 × 900).
- **El techo es la barra fija, no el borde de la ventana.** Si se alineara a `0`, el título de la
  categoría quedaría detrás de la tablist pegajosa. Se usa su `top` computado (que ya incluye `--hh` y la
  banda de la portada) más su alto más 12 px de respiro.
- **Corrección después del desplazamiento.** El alto de lo que hay encima del panel puede asentar unas
  décimas después del cambio (fuentes que acaban de entrar): se vuelve a medir al terminar (`scrollend`,
  o 900 ms si el navegador no lo emite) y se corrige el desvío con un `scrollBy` instantáneo, una sola
  vez. Sin esa pasada el título quedaba 10 px por debajo de lo previsto.

Medido en el navegador, tras cambiar desde el fondo de «Regalos personalizados» (7 productos) a
«Papelería corporativa» (2):

| Ancho × alto | Hueco bajo la barra | Primera ficha entera | Bloque siguiente |
| --- | --- | --- | --- |
| 375 × 812 | 12 px | sí | 633 px (fuera de la pantalla) |
| 768 × 900 | 12 px | sí | 893 px (fuera) |
| 1280 × 900 | 12 px | sí | después de la ficha |

Con movimiento reducido el desplazamiento es instantáneo (`behavior: 'auto'`) y la corrección llega a
los 60 ms: mismo resultado, 12 px de hueco.

Dos pruebas nuevas en el arnés, ambas en el bloque de pestañas: «Catálogo: cambiar de categoría desde el
fondo vuelve a la primera ficha» (exige que antes se estuviera a media lista, `panelTop < 0`, y que
después el título y la primera ficha queden a la vista) y «Catálogo: desde el inicio de la sección el
cambio no da un salto». La suite pasa de 52 a **54 pruebas**.



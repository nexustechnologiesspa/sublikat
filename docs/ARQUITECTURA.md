# Sublikat — Arquitectura de la portada

Documento de traspaso técnico. Sirve para que un diseñador o desarrollador frontend se meta en el
proyecto sin tener que reconstruirlo desde cero: qué hay, cómo se relaciona cada parte y qué reglas
no se deben romper.

No es un manual de uso: para eso están `DESIGN.md` (sistema visual) y `PENDIENTES-CLIENTE.md`
(lo que falta del cliente, por sectores).

---

## 1. Qué es este proyecto

Una **landing page estática de una sola página** para el taller de estampado Sublikat (Maipú,
Santiago). No hay backend, ni bundler, ni base de datos, ni servidor de desarrollo: es HTML, CSS y
JavaScript served tal cual.

| | |
| --- | --- |
| Entrada | `index.html` (139 KB, un solo documento) |
| Se abre con | doble clic, o cualquier servidor estático |
| Dependencias externas | solo dos: Tailwind por CDN y las tipografías de Google Fonts |
| Imágenes | 4 locales en `assets/stock/` (3 fotos de ejemplo + `credits.json`) |
| Build | opcional pero recomendado: `build/` → `index.html` |

El sitio es un **prototipo navegable**: la mecánica real está (catálogo filtrable, cotización,
validación de formulario, modo claro/oscuro), pero los datos son de muestra y el formulario no
envía a ningún servidor. Está marcado como tal en la barra superior de la página.

---

## 2. El flujo de trabajo: `build/` es la fuente de verdad

`index.html` **no se edita a mano para cambiar estilos**: hay una capa de tokens que se vuelca
automáticamente. El resto del marcado sí se edita directamente en `index.html`.

```
build/css/base.css          ─┐
build/tokens.css            ─┤
build/css/*.css (12)        ─┤
build/motion.css            ─┼─►  powershell -File build\actualizar-portada.ps1  ─►  index.html
build/app.js                ─┤        (10 parciales: cabecera, héroe, beneficios, aviso,
build/sections/*.html       ─┘         catálogo, proceso, compromisos, contacto,
                                       pie y botón de WhatsApp)
```

El script busca marcadores `<!-- OD:... -->` / `<!-- /OD:... -->` en `index.html` y sustituye el
contenido entre ellos. **Es idempotente**: ejecutarlo dos veces seguidas da el mismo fichero.
Si una zona falta, la reinserta en su sitio: las del cuerpo, justo después de la zona anterior.

> **Sobre el catálogo (resuelto el 2026-11-12):** circularon dos cifras, 24 y 19. La real es **19**:
> `build/data/catalogo.json` declara 19 productos y la portada tiene 19 fichas, con los mismos ids.
> Se comprobó ejecutando el ensamblador y comparando: la página resultante es **idéntica** salvo una
> línea en blanco, y una segunda ejecución da el mismo archivo byte a byte. Ejecutarlo es seguro.

Reglas prácticas:

- Para cambiar **colores, tipografía de interfaz o responsive**: se edita `build/tokens.css` y se
  ejecuta el script. No se tocan hexadecimales en `index.html`.
- Para cambiar **textos, estructura o componentes**: se edita el parcial de su sección en
  `build/sections/` y se ejecuta el script.
- Para cambiar el **JavaScript**: `build/app.js` y se ejecuta el script.
- Los ficheros de `build/` usan rutas relativas: el proyecto funciona igual desde donde se abra.

### Zonas que regenera el script

| Zona | Origen | Qué contiene |
| --- | --- | --- |
| `OD:BASE` | `css/base.css` | Reset, tipografía y utilidades base |
| `OD:TOKENS` | `tokens.css` | Variables de diseño: una definición por tema y nombre canónico |
| `OD:ESTILOS` | `css/components.css` + un archivo por sección | Componentes compartidos y estilos de cada sección, en el orden de la página (ver `build/css/README.md`) |
| `OD:MOTION` | `motion.css` | Movimiento ligado al scroll: barra de lectura, sombra de cabecera, entrada del héroe, apariciones al entrar en pantalla **y la portada que se encoge a banda** (bloque 11, escrito directamente en `index.html`). Guard de `prefers-reduced-motion` con 27 selectores (ver `MOTION.md`) |
| `OD:APP` | `app.js` | Tema, pestañas, validación del formulario, prellenado, menú móvil |
| `OD:HEADER` | `sections/header.html` | Aviso de prototipo y cabecera con navegación y conmutador |
| `OD:HERO` | `sections/hero.html` | Héroe: cinta, H1, CTA y foto |
| `OD:BENEFICIOS` | `sections/beneficios.html` | Las cuatro ventajas del taller |
| `OD:AVISO` | `sections/aviso.html` | Banner de piezas listas para envío |
| `OD:CATALOGO` | `sections/catalogo.html` | Catálogo con pestañas y 19 fichas |
| `OD:PROCESO` | `sections/proceso.html` | Los cuatro pasos y el CTA de lote |
| `OD:COMPROMISOS` | `sections/compromisos.html` | Bloque «Compromisos del taller» |
| `OD:CONTACTO` | `sections/contacto.html` | Formulario y tarjeta lateral (incluye `OD:EXITO`) |
| `OD:PESTANAS` | `data/catalogo.json` + `templates/pestana.html` | Las 5 pestañas del catálogo con su conteo, generadas desde los datos |
| `OD:PANELES` | `data/catalogo.json` + `templates/ficha.html` + `icons/` | Los 5 paneles con sus 19 fichas, generadas desde los datos |
| `OD:OPCIONES` | `data/catalogo.json` | Las opciones del desplegable del formulario, agrupadas por categoría |
| `OD:EXITO` | `exito-contacto.html` | Panel de confirmación del formulario |
| `OD:FOOTER` | `sections/footer.html` | Pie de página con aviso legal |
| `OD:WIDGET` | `sections/widget-whatsapp.html` | Botón flotante de WhatsApp |

Cualquier cosa que se escriba **fuera** de esas zonas sobrevive a la regeneración ✓. Hoy queda
fuera el pie contextual con la información legal y de prototipo, que va dentro del bloque del
aviso.

---

## 3. Mapa de ficheros

```
index.html                     Entrada única: toda la portada
DESIGN.md                      Sistema de diseño: paleta, tipografía, componentes, reglas
MOTION.md                      Movimiento: reglas, intensidad, matriz sección → demo → técnica
SECTION-MAP.md                 Sección → ancla → parcial → CSS → ganchos de movimiento
qa/movimiento-implementado.md  Medición del movimiento en navegador real (CDP, Chrome)
PENDIENTES-CLIENTE.md          Lo que falta responder del cliente, por sectores (checklist vivo)
Sublikat_-cuestionario-para-diseñar-tu-sitio-web.csv  Cuestionario de 53 respuestas del cliente
image.png                      Boceto de marca entregado por el cliente

assets/stock/
  camiseta-cats.jpg            Foto de ejemplo (512×512, generada con Stitch)
  taza-ronnoneo.jpg            Foto de ejemplo (512×512)
  sudadera-miaou.jpg           Foto de ejemplo (512×512)
  credits.json                 Procedencia y uso de cada imagen (lateral del proyecto)

archive/                       Historial: NO se usa para construir
  baseline/index-2026-11-12.html   Copia de index.html previa al ordenamiento
  referencias/
    index2.html                Copia obsoleta de la portada (dos defectos de markup corregidos)
    pendiente-violeta/         Rediseño violeta con Archivo, descartado por el cliente
    src/                       Montajes de Stitch: 04-modo-oscuro, 05-movil y bloques sueltos
  referencias-paletas/
    AdobeColor-Triada-Sublikat.jpeg          Tríada del cliente (descartada)
    AdobeColor-Complementarios-Sublikat.jpeg Segunda extracción de Adobe Color (descartada)

build/
  tokens.css                 FUENTE DE VERDAD de la paleta: un bloque por tema, sin alias
  motion.css                 Movimiento ligado al scroll (zona OD:MOTION)
  css/                       Un archivo por sección de la página (ver css/README.md)
    base.css                 Reset, tipografía y utilidades base
    components.css           Componentes compartidos y utilidades de color
    header.css               Cabecera, navegación y menú móvil
    hero.css                 Héroe
    beneficios.css           Ventajas del taller
    aviso.css                Aviso de taller
    catalogo.css             Pestañas, paneles y fichas del catálogo
    proceso.css              Método de trabajo
    compromisos.css           Compromisos del taller
    contacto.css             Formulario, ficha del taller y confirmación
    footer.css               Pie de página
    widget.css               Botón flotante de WhatsApp
  app.js                     Conmutador de tema, pestañas, validación, menú móvil
  sections/                  Un parcial por sección de la página (10 ficheros)
    header.html              Aviso de prototipo + cabecera
    hero.html                Héroe
    beneficios.html          Ventajas del taller
    aviso.html               Aviso de taller
    catalogo.html            Catálogo con pestañas y fichas
    proceso.html             Cómo trabajamos
    compromisos.html         Compromisos del taller
    contacto.html            Formulario y contacto
    footer.html              Pie de página
    widget-whatsapp.html     Botón flotante de WhatsApp
  data/catalogo.json         Modelo del catálogo: 5 categorías y 19 productos declarados (los mismos que la página)
  icons/                     Un SVG por producto (19 ficheros), insertados en las fichas
  templates/pestana.html     Plantilla de la pestaña de categoria
  templates/ficha.html       Plantilla de la ficha de producto
  exito-contacto.html        Fragmento de la confirmación del formulario
  actualizar-portada.ps1     Vuelca build/ dentro de index.html (19 zonas OD:)
  ganchos-scroll.ps1         Añade las clases od-* al markup (idempotente)
  limpiar-hex.ps1            Comprueba que el color solo viva en los tokens
  patch-imagenes.ps1         Rutas de imagen por nivel de carpeta + credits.json
  contenido-inicio.json      Texto y bloques de la portada
  meta-inicio.json           Título, descripción y Open Graph
  aplicar-contenido.ps1      Vuelca contenido-inicio.json en index.html
  actualizar-inicio.ps1      Reconstruye la portada desde la plantilla
  leer-encaje.ps1            Lector del CSV de respuestas del cliente
  criterios-encaje.json      Criterios de contraste y territorio de color por zona
```

> Los ficheros de `archive/` se conservan para no perder el registro, pero **ninguno participa en la
> construcción**: ni el script ni la página los leen. Los montajes de Stitch y el rediseño violeta
> usan sus propios colores y no heredan los tokens; si algún día se restauran, hay que devolverlos a
> la raíz y adaptarlos a mano.

---

## 4. Las capas de CSS

`index.html` lleva cuatro bloques `<style>`, todos ellos desde `build/`. El orden importa:
**gana el último**.

| Capa | Zona | Origen | Contenido |
| --- | --- | --- | --- |
| 1 | `OD:BASE` | `css/base.css` | **Reset** (`box-sizing`, márgenes) y **tipografía**: `body`, `.font-chewy`, el anillo de foco |
| 2 | `OD:TOKENS` | `tokens.css` | **Las variables**: un bloque por tema (claro y oscuro) y otro con lo que no cambia entre temas |
| 3 | `OD:ESTILOS` | `css/components.css` + un archivo por sección | **Componentes compartidos** (`.sticker-*`, `.ink-border*`, `.shadow-offset*`, `.btn-*`, `.field-*`, badges y las utilidades `html .bg-*` / `html .tx-*`) y **los estilos de cada sección**, en el orden de la página |
| 4 | `OD:MOTION` | `motion.css` | **Movimiento**: barra de lectura, sombra de cabecera, entrada del héroe y apariciones ligadas al scroll. Va al final para poder neutralizar cualquier animación con `!important` en el guard de movimiento reducido |

Los tokens viven **solo** en la capa 2: un bloque `:root` con lo que no cambia entre temas y un
bloque por modo (claro y oscuro). No hay alias: cada color tiene un único nombre y una única
definición por tema. Ningún archivo de `build/css/` declara variables ni lleva hexadecimales
sueltos: usa `var(--…)` para todo.

Consecuencia práctica: las utilidades tipo `bg-accent` o `tx-muted` están en `components.css`,
después de los componentes heredados, y cada sección va al final para poder ajustar sus propios
componentes sin tocar los compartidos. Por eso cambiar un color de marca es tocar `tokens.css` y
nada más.

Tailwind llega por CDN (`https://cdn.tailwindcss.com`) y aporta las utilidades de layout y
tipografía (`flex`, `gap-3`, `text-sm`, `max-w-[1200px]`…). No hay `tailwind.config` ni `@apply`
en el proyecto: las clases de componente son CSS plano en `components.css`.

---

## 5. El sistema de tokens

`build/tokens.css` define dos modos con las mismas variables. El modo se conmuta con el atributo
`data-theme` en `<html>` (`light` por defecto, `dark` en el toggle).

| Rol | Claro | Oscuro | Para qué |
| --- | --- | --- | --- |
| `--bg` | `#f4e6c8` | `#2a1c14` | Fondo de página |
| `--surface` | `#fffaf1` | `#3b2417` | Tarjetas y cabecera |
| `--soft` / `--soft-2` | `#f4e6c8` / `#f8eed7` | `#39271c` / `#4a3223` | Chips y superficies de apoyo |
| `--ink` | `#3b2417` | `#f4e6c8` | Texto principal y bordes (13,9:1 sobre superficie) |
| `--muted` | `#6a4f3b` | `#d9c4a5` | Textos secundarios y ayudas (7,2:1) |
| `--line` / `--line-soft` | `#3b2417` / `#c9ad80` | `#5a4130` | Bordes de tinta y separadores suaves |
| `--accent` | `#d4573f` | `#d4573f` | Coral de marca: iconos, cintas, distintivos (3,9:1, solo display) |
| `--accent-fill` | `#c04a33` | `#c04a33` | Relleno del botón principal y enlaces (4,7:1 con `--on-accent`) |
| `--accent-ink` | `#c04a33` | `#f0947c` | Texto de acento según modo (6,4:1 en oscuro) |
| `--awning` | `#f7c948` | `#f7c948` | Amarillo: toldo, cinta, banner (9,2:1 con tinta) |
| `--success` / `--success-text` | `#6fa96b` / `#467a49` | `#6fa96b` / `#8ec48f` | Verde de confianza; el texto cumple 4,9:1 |
| `--whatsapp` | `#25d366` | `#25d366` | Solo el botón de WhatsApp (4,8:1 con tinta) |
| `--focus` | `#d4573f` | `#f7c948` | Anillo de foco de teclado (10,5:1 en oscuro) |

Ningún color de la paleta es texto pequeño sin comprobar: `--accent` (3,9:1) es de display y para
texto se usa `--accent-fill`; `--success` es relleno y para texto se usa `--success-text`.

### La regla de reparto

Cada color tiene **un solo territorio**, por lo que comunica:

| Color | Significado | Dónde puede aparecer | Dónde no |
| --- | --- | --- | --- |
| Coral | Acción y carácter | Botón principal, enlaces, pestaña activa, foco, distintivo de producto | Textos pequeños con `--accent`, superficies grandes |
| Amarillo | Atención | Toldo de cabecera, cinta del héroe, banner de oferta: un gesto por bloque | Iconos, cuadros, chips |
| Verde | Oficio y confianza | Garantía, método artesanal, notas de los pasos, confirmaciones | Acciones: el verde tranquiliza, no convence |
| Crema y superficie | Papel y calidez | Fondo, tarjetas, cabecera y campos | Detrás de texto sin comprobar contraste |
| Tinta | Estructura | Texto, bordes, sombras, contornos | Como relleno grande: la página se vuelve marrón |

Reglas de frecuencia: el coral ocupa menos del 10% de la pantalla, el amarillo aparece una vez
por bloque, el verde solo en mensajes de confianza y el crema es el color por defecto.

---

## 6. Anatomía del `<body>`, sección por sección

Líneas del fichero actual (3487 líneas). Cada bloque lleva su `data-od-id`, que es el ancla
que usa el modo comentario de la app para señalar un fragmento concreto.

| Líneas | Bloque | Qué es |
| --- | --- | --- |
| 2179 – 2257 | Aviso de prototipo + `<header>` | Barra superior con el distintivo «Prototipo interactivo» y la nota de datos de muestra. Cabecera con logotipo (SVG del gato dibujado en código), navegación y conmutador de tema. La navegación resuelve el `hidden md:flex` con un panel de menú accesible. Desde el 15-11-2026 es `position: fixed`: no reserva alto, flota sobre la portada y su altura (`--hh`) sigue alimentando la tablist fija y los anclajes |
| — | Portada fotográfica (`.od-portada`) | Foto del taller a sangre, una pantalla de alto, por detrás del menú. Es decorativa (`aria-hidden`, `pointer-events: none`, z-index 35 bajo el 50 de la cabecera) y en navegadores con líneas de tiempo de scroll se encoge hasta una banda de `--hh` + `--od-portada-banda` (efecto «cover to fixed header»). Su alto en el flujo lo reserva `html body` con `padding-block-start: 100svh`; sin soporte o con movimiento reducido se queda quieta ocupando una pantalla |
| 2258 – 2373 | Hero | Cinta decorativa con el claim, tarjeta principal con el H1, la foto (`assets/stock/camiseta-cats.jpg`), dos CTA y la nota de muestra |
| 2374 – 2451 | `#beneficios` | Franja de 4 ventajas con icono y texto corto (`.swipe` en móvil) |
| 2452 – 2471 | `#aviso-taller` | Banner de oferta: piezas listas para envío y personalización en caliente sin pedido mínimo |
| 2472 – 2835 | `#tienda` | Encabezado del catálogo, `<nav role="tablist">` con 5 botones (`tab-cat-*`) y 5 paneles con 19 `<article>` en total. Solo el panel activo es visible: los otros cuatro llevan `hidden` |
| 2836 – 3083 | `#proceso` | 4 pasos numerados con ilustración SVG y un CTA de lote al final |
| 3084 – 3146 | `#resenas` | Bloque **«Compromisos del taller»**: 3 tarjetas con datos que el cliente confirmó (desde 1 unidad, muestra antes de imprimir, respuesta de 10:00 a 17:00) |
| 3147 – 3389 | `#contacto` | Formulario (columna principal) y tarjeta lateral con WhatsApp, dirección, horarios y envíos |
| 3390 – 3471 | `<footer class="site-footer">` | 4 columnas (marca, productos, el taller, visítanos), aviso legal y barra inferior |
| 3472 – 3487 | Widget de WhatsApp | Botón flotante (`position: fixed`) |

### Anclas disponibles

`#beneficios` · `#aviso-taller` · `#tienda` · `#cat-regalos` · `#cat-cuadros` · `#cat-textiles` ·
`#cat-papeleria` · `#cat-identificacion` · `#proceso` · `#resenas` · `#contacto` · `#aviso-legal` ·
`#form-contacto`

---

## 7. El catálogo como modelo de datos

Es la parte más estructurada de la página y la que más se toca.

**5 pestañas** (`role="tab"`, un `<button>` cada una) y **5 paneles** (`role="tabpanel"`, un
`<section>` cada uno). La relación es por atributos ARIA:

```html
<button role="tab" id="tab-cat-regalos" aria-controls="cat-regalos" data-categoria="regalos">
<section id="cat-regalos" role="tabpanel" aria-labelledby="tab-cat-regalos" hidden>
```

Los 19 productos viven como `<article data-od-id="producto-<slug>">` dentro de su panel:

| Panel | id | Productos | nº |
| --- | --- | --- | --- |
| Regalos personalizados | `cat-regalos` | Tazas, Tazas mágicas, Botellas, Mousepads, Bolsas, Relojes, Chapas para mascotas | 7 |
| Cuadros y fotografías | `cat-cuadros` | Cuadros de piedra, Cuadros de fotos (A6–A3), Cuadros de fotos en aluminio (A4) | 3 |
| Estampados textiles | `cat-textiles` | Telas de 1, 2 y 3 colores, Tela con imágenes (hasta A3) | 4 |
| Papelería corporativa | `cat-papeleria` | Tarjetas de presentación, Tarjetas de presentación PVC | 2 |
| Identificación corporativa | `cat-identificacion` | Lanyards, Credenciales, Credenciales PVC | 3 |

**Ficha de producto**: espacio visual con un SVG dibujado en código (las fotos reales aún no han
llegado), nombre del producto y un botón «Cotizar» con `data-producto="<nombre>"`. Ese atributo es
lo que conecta el catálogo con el formulario.

**El desplegable del formulario** replica la misma taxonomía: 5 `<optgroup>` con los 19 productos y
«Otro soporte personalizado» al final. Si añades un producto, actualiza las tres cosas: ficha,
pestaña/panel y opción del desplegable.

> Nota: la categoría «Estampados textiles» agrupa telas por número de colores porque así lo pidió
> el cliente. Los polerones (su producto estrella) **no** tienen categoría propia todavía: es una
> decisión pendiente.

---

## 8. JavaScript

Todo vive en `build/app.js` (≈340 líneas), dentro de una IIFE, sin dependencias. Se engancha por
`id` y por atributos, nunca por posición en el DOM.

| Bloque | Funciones | Qué hace |
| --- | --- | --- |
| Tema | `leerTema`, `guardarTema`, `preferenciaSistema`, `aplicarTema`, `conectarBoton` | Alterna `data-theme` en `<html>` y guarda la elección en `localStorage` (`sublikat-tema`). La primera visita sigue la preferencia del sistema. El tema se aplica **antes del primer pintado** para evitar el parpadeo |
| Pestañas | `iniciarCategorias`, `mostrar`, `activarPorHash` | Muestra un panel y oculta el resto; recuerda la categoría en `localStorage` (`sublikat-categoria`); **lee el hash de la URL** y abre esa categoría, además de reaccionar a `hashchange`. Por eso un enlace a `#cat-textiles` abre la pestaña correcta |
| Formulario | `iniciarFormulario`, `entradaDe`, `cajaDeError`, `limpiarCampo`, `marcarCampo`, `errorDe`, `privacidadPendiente`, `refrescarResumen` | Valida al salir del campo (no en cada pulsación), inyecta el mensaje de error junto al campo, mantiene el resumen de errores con enlace a cada campo y anuncia los cambios con `aria-describedby`. **No envía nada**: al enviar correcto muestra el panel de confirmación |
| Prellenado | `iniciarCotizacion` | Cada botón «Cotizar» escribe «Consulta sobre: &lt;producto&gt;» en el textarea del mensaje y le da el foco |

Ids que el JS necesita: `theme-toggle`, `form-contacto`, `error-summary`, `error-summary-list`,
`exito-contacto`, `exito-nombre`, `form-reiniciar`, `contacto-nombre`, `contacto-email`,
`contacto-producto`, `contacto-mensaje`, `contacto-privacidad`, y los `id` de las 5 pestañas.

---

## 9. Convenciones y contratos que hay que respetar

**Identidad y Layout**

- Mobile-first. Contenedor máximo 1200 px. Espaciado en múltiplos de 8.
- Objetivos táctiles de 44 px mínimo; botones principales de 48 px de alto.
- Una sola etiqueta `<h1>` por página; jerarquía `<h2>` de sección, `<h3>`/`<h4>` dentro.
- Bordes de tinta de 2 – 2,5 px, esquinas de 12 a 16 px, sombra plana desplazada (estilo sticker).

**Accesibilidad**

- Contraste mínimo 4,5:1 en texto (3:1 en iconos y gráficos). Los dos colores que no llegan
  están vetados como texto (§5).
- Foco visible en todos los elementos interactivos: anillo de 3 px con `var(--focus)`.
- `prefers-reduced-motion` respetado en `build/motion.css`: con movimiento reducido, el contenido
  se muestra completo y sin desplazamientos.
- **Prohibido** `user-scalable=no`: el zoom del navegador debe funcionar.
- Errores de formulario con texto además de color.
- Iconos: SVG en línea, trazo 2,2, `currentColor`. **Nada de emoji como icono.**

**Marcado para la app**

- Cada sección, tarjeta repetida, paso y CTA lleva `data-od-id` (hay 36). Es lo que permite que el
  modo comentario apunte a un fragmento concreto. Si añades un elemento repetido, dale su
  `data-od-id`.
- Las pestañas usan el patrón ARIA completo (`role="tab"`, `aria-selected`, `aria-controls`,
  `role="tabpanel"`, `aria-labelledby`).

**Contenido**

- Los datos de ejemplo van etiquetados como ejemplo: «Ejemplo», «Dato de muestra», «Prototipo
  interactivo», «Datos de ejemplo».
- **No inventar precios, características técnicas, plazos de entrega ni condiciones comerciales.**
  Tampoco datos fiscales (la razón social y el RUT siguen sin llegar).

---

## 10. Qué es real y qué es relleno

| Elemento | Estado |
| --- | --- |
| Datos de la empresa (dirección, horarios, WhatsApp, Instagram, correo) | reales, del cuestionario |
| Las 19 fichas y las 5 categorías | reales, del catálogo del cliente |
| Fotos de producto | **de ejemplo**, generadas con Stitch (ver `assets/stock/credits.json`) |
| Precios | no hay ninguno publicado; se cotizan uno a uno |
| Reseñas | no hay reseñas; el bloque muestra compromisos verificables del taller |
| Formulario | valida y muestra confirmación, **pero no envía** a ningún servidor |
| Pasarela de pago | ninguna (Mercado Pago está pedido, no implementado) |
| Logotipo | el SVG del gato es propio y provisional; falta el logo real del cliente |
| Dominio | el cliente aún no tiene `sublikat.cl`; no hay `canonical` ni `og:image` |

Para el logo real y las fotos reales hay un sitio previsto en el proyecto: las fotos de ejemplo
están en `assets/stock/` con su `credits.json`, y el logo y las fotos definitivos deben llegar por el
enlace de la carpeta que el cliente prometió.

---

## 11. Pendientes abiertos

El detalle por sector está en `PENDIENTES-CLIENTE.md`. Resumen:

| Sector | Estado |
| --- | --- |
| 2 — Datos de empresa | aplicado lo que había; faltan Razón social y RUT, número de local, sábados, enlace de Maps, qué correo se publica y qué dominio comprar |
| 6 — Defectos | aplicado: anclas rotas, pie, reseñas ficticias, desplegable |
| 1 — Identidad y tono | **cerrado por el cliente**: vio las propuestas violeta y tríada y no lo convencieron; se mantiene crema + Chewy. Sigue pendiente la reescritura a «usted» y el humor mínimo en los textos |
| 4 — Producto y catálogo | falta la categoría de los polerones, el estado «disponible ya / a pedido» y los precios |
| 3 — Comercio | falta checkout, sección de FAQ con las 6 dudas, montos de envío y textos legales |
| — Movimiento | **implementado** (`build/motion.css`, filas 1, 2, 3, 4, 6, 9, 10 y 11). Fuera por decisión: filas 5, 7, 8 y 12. Pendiente solo `od lint`, que no corre fuera de la app |

---

## 12. Checklist para el que entra

- [ ] Abrir `index.html` en el navegador y recorrerlo en claro, en oscuro y en móvil.
- [ ] Leer `DESIGN.md` (sistema visual), `MOTION.md` (movimiento) y `PENDIENTES-CLIENTE.md` (pendientes).
- [ ] Si tocas estilos: edita `build/tokens.css` o el CSS de la sección y ejecuta `build\actualizar-portada.ps1`.
- [ ] Si tocas movimiento: edita `build/motion.css` y ejecuta el script (zona `OD:MOTION`). **La portada
      es la excepción**: su bloque vive en `index.html` y no se reensambla desde `build/`; si lo copias
      de vuelta a `build/motion.css`, la regla `.od-portada` pierde la cascada contra `html .od-portada`.
- [ ] Si añades un producto: ficha + panel + opción del desplegable (los tres sitios).
- [ ] Mantén `data-od-id` en todo lo que se repita o se pueda señalar.
- [ ] No uses nada de `archive/` para construir: es historial.
- [ ] El catálogo está conciliado: 19 productos en `build/data/catalogo.json` = 19 fichas en la página.
- [ ] Ejecutar `actualizar-portada.ps1` dos veces da el mismo archivo (verificado el 2026-11-12).
- [ ] No inventes precios ni datos legales.
- [ ] Antes de entregar: `od lint index.html` debe dar 0 avisos (P0, P1 y P2).
- [ ] Para exportar: `od export index.html --project ac4fb290-73f6-42ee-832a-2b7e8942205b --format html|pdf|image`
  (la ruta del fichero debe ser **relativa** a la carpeta del proyecto).

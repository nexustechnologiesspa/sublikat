# Auditoría técnica y propuesta de migración a React + Vite

## Alcance y criterio de lectura

**Hechos comprobados:** este inventario toma como fuente de verdad `../index.html`, la página activa en la raíz de Sublikat. Contiene el HTML, cuatro bloques `<style>` y el script de aplicación; no enlaza una hoja CSS ni un archivo JavaScript local. Los recursos enumerados son los que esa página referencia directamente.

**Fuera de alcance como fuente:** `build/sections/` y sus scripts no se utilizaron para reconstruir contenido ni comportamiento. Hay comentarios dentro de `index.html` que describen el origen histórico de algunos cambios en `build/`, pero no constituyen una dependencia de ejecución. Las capturas previas son referencias históricas, no sustituyen una línea base tomada de `index.html`.

**Recomendación:** durante la migración, preservar contenido, orden, nombres de anclas, recursos, estados y comportamiento tal como están. Resolver cualquier discrepancia de contenido explícitamente con Sublikat; no “normalizarla” al extraer datos.

## 1. Inventario de la web actual

### Contenido, recursos y servicios

| Recurso o dependencia | Hecho comprobado |
|---|---|
| Página y metadatos | `index.html` en español (`lang="es"`), título y descripción SEO, Open Graph (`es_CL`) y favicon SVG. |
| Tipografías | Nunito para cuerpo y Fraunces para titulares; ambas se solicitan a Google Fonts. Hay `preconnect` a `fonts.googleapis.com` y `fonts.gstatic.com`. |
| CSS utilitario | Tailwind se carga en tiempo de ejecución desde `https://cdn.tailwindcss.com`. |
| Fotografía de portada | Cuatro variantes dentro de `assets/portada/`: `quita-la-luz-2150.jpg`, `quita-la-luz-1440.jpg`, `quita-la-luz-1024.jpg` y `quita-la-luz-movil.jpg`; se eligen mediante CSS según ancho y orientación. |
| Fotografía de producto | `assets/stock/camiseta-cats.jpg`, en el héroe, con carga eager y texto alternativo. |
| Ilustraciones de ventajas | `assets/beneficios/pedidos-unidad.jpg`, `personalizacion.jpg`, `muestra-impresion.jpg` y `atencion-whatsapp.jpg`, con texto alternativo y carga lazy. |
| Iconografía | Logo e iconos dibujados como SVG en línea (marca, productos, pasos, contacto, controles y WhatsApp); no se detecta una biblioteca de iconos externa. |
| Acciones externas | Enlaces de WhatsApp (`wa.me`, número +56 9 4940 9253), Instagram `@sublikat.cl` y correo `pedidos@sublikat.cl`; los botones de WhatsApp abren nueva pestaña con `rel="noopener noreferrer"`. |
| Formulario | Validación y confirmación de demostración en cliente. El propio código indica que **no envía datos a servidor**. La confirmación es local y reiniciable. |
| Otras dependencias | No se observan API, `fetch`, CMS, router ni librería de animación. Las interacciones se implementan en JavaScript propio. |

### Mapa de secciones y orden real del DOM

El orden siguiente es el que debe conservarse, incluidos los bloques que no son `<section>`:

1. **Cabecera y navegación** (`#site-header`): marca/logo, navegación de escritorio y menú móvil, conmutador de tema.
2. **Portada fotográfica** (`.od-portada`, sin id de navegación): imagen de fondo decorativa y marca/lema ocultos a tecnologías de asistencia.
3. **Héroe** (bloque `.od-hero`, sin wrapper `<section>`): cinta de taller y verificación; título “Polerones y productos personalizados a su medida”; descripción; CTA “Explorar productos” y “Solicitar cotización”; nota de pedidos; foto “Camiseta Cats”.
4. **Ventajas del taller** (`#beneficios`): cuatro tarjetas ilustradas; en escritorio compatible se transforman en pista horizontal fijada durante el scroll; en móvil se pueden recorrer horizontalmente.
5. **Aviso de taller** (`#aviso-taller`): aviso de piezas disponibles y personalizaciones sin pedido mínimo.
6. **Catálogo** (`#tienda`): encabezado, pestañas de categorías y panel único visible por vez, con tarjetas de productos y enlaces “Cotizar”.
   - Regalos personalizados: 7.
   - Cuadros y fotografías: 3.
   - Estampados textiles: 5 (incluye la tarjeta “Polerones”).
   - Papelería corporativa: 2.
   - Identificación corporativa: 3.
7. **Cómo trabajamos** (`#proceso`): cuatro pasos ilustrados y CTA de cotización.
8. **Compromisos del taller** (`#resenas`): bloque de presentación y tres tarjetas de compromisos; no son reseñas publicadas.
9. **Contacto y presupuesto** (`#contacto`): formulario con resumen de errores y confirmación de demostración, más tarjeta lateral de WhatsApp, dirección, horario, despacho y garantía.
10. **Pie de página**: marca, accesos a categorías y secciones, contacto y aviso legal de demostración.
11. **Widget flotante de WhatsApp**: persistente visualmente y compacto después de cierto scroll.

**Elementos compartidos:** navegación de cabecera y pie; contenedor central `.main-container` / `.od-secciones`; tarjetas con lenguaje visual “sticker”; botones y enlaces de cotización; tres marcos de desplazamiento horizontal (`.swipe-marco`) para ventajas, pasos y compromisos; enlace flotante de WhatsApp. Los SVG y estilos de tarjetas se repiten entre secciones.

**Navegación y CTA:** enlaces de ancla a `#tienda`, `#contacto`, `#resenas` y paneles `#cat-*`. La cabecera enlaza Tienda, Cómo funciona, Compromisos y Contacto. El CTA principal lleva a Tienda; las cotizaciones y varios CTA del proceso llevan a Contacto. Los enlaces de tarjetas de producto prellenan el mensaje del formulario con el producto y enfocan ese campo.

**Discrepancia comprobada que requiere decisión funcional:** el título del catálogo indica “20 productos en 5 categorías”; los contadores visibles suman 20 y el panel textil presenta cinco tarjetas, incluida “Polerones”. El selector del formulario, en cambio, ofrece cuatro productos textiles y no incluye “Polerones”. No corregir ni cambiar el conteo al migrar sin autorización.

## 2. Inventario CSS

### Organización actual y sistema visual

**Hechos comprobados:**

- Hay cuatro bloques CSS en el documento: base/reset/utilidades, tokens, estilos de componentes/secciones y movimiento. No hay CSS local enlazado desde el HTML.
- Los colores y dimensiones reutilizables se definen como custom properties en `:root`; existen valores separados para tema claro (`data-theme="light"`) y oscuro (`data-theme="dark"`).
- Paleta central: fondos lavanda claro `#f3f1f8` y pizarra oscuro `#2b2933`; tinta `#413f4b`; acento violeta `#4f2cf5`; amarillo `#f5df2b`; oliva/éxito `#b5a94e`; más superficies, bordes, estados, WhatsApp y sombras por tema.
- Tokens comunes incluyen tipografías, radios, bordes, foco, espacios, ritmo vertical, altura visual de la portada y duración/easing de movimiento.
- El diseño combina utilidades Tailwind con clases de componente propias (`.od-*`, `.feature-card`, `.cat-tab`, `.review-*`, `.contact-*`, `.site-footer`, etc.). Los bloques de CSS también incluyen reglas específicas de portada, catálogo, formulario y pie.
- Breakpoints explícitos del CSS: móvil hasta 767 px, 768 px en adelante, 1024 px en adelante, hasta 479 px, 768–1023 px y 1024–1279 px; Tailwind CDN aporta además sus breakpoints utilitarios estándar, usados por clases como `sm:`, `md:` y `lg:`.
- El diseño responsive usa rejillas que pasan a carruseles horizontales con scroll-snap en móvil; cabecera y navegación se adaptan; el recorte/foco de la imagen de portada varía por ancho y orientación. La pista horizontal fijada de ventajas solo se activa a partir de 768 px cuando se cumplen las condiciones de soporte y movimiento.
- Hay estados hover, focus-visible y active para enlaces, botones, fichas, pestañas, formulario, footer y WhatsApp. La pestaña seleccionada tiene estado visual y semántico propio; los errores del formulario tienen estados de campo y mensajes asociados.
- Se configura foco visible global y el desplazamiento suave se desactiva con `prefers-reduced-motion: reduce`.

**Recomendación:** separar globales/tokens de estilos de sección, pero portar primero las reglas y valores sin rediseño ni “limpieza” amplia. No reescribir simultáneamente utilidades Tailwind y CSS propio: la comparación visual debe poder atribuir diferencias a un cambio concreto.

## 3. Auditoría de animaciones y Scroll-Driven Animations

La implementación es CSS nativa; no hay GSAP, Framer Motion ni listeners de scroll destinados a reproducir estas animaciones. Se usan `@supports` y `prefers-reduced-motion: no-preference` para limitar las animaciones de scroll. El estado de respaldo mantiene contenido visible; con movimiento reducido se deshabilita movimiento y se restauran opacidad/posición/recorte.

| Zona y efecto | Timeline / rango / keyframes | Dependencias que deben sobrevivir |
|---|---|---|
| Ventajas, balanceo y hover de ilustración | `floating` cada 4 s; escala/rotación al hover. Se detiene en movimiento reducido. | No combinar transformaciones de forma que el hover deje de aplicarse; móvil mantiene la presentación horizontal, no el pin. |
| Ventajas, pista fijada en escritorio | `view-timeline-name: --pin-ventajas` en `#beneficios`; `.pin-pista` consume la timeline con `animation-range: contain 0% contain 100%`; `od-pin-mover` desplaza la fila horizontal. `--pin-top` depende de `--hh` y la banda de portada. La introducción consume la misma timeline. | Requiere el contenedor `#beneficios`, `.pin-vista`, pista e hijos en el orden/relación actual; se limita a ancho ≥768 px y soporte de `view()`. |
| Entrada de pestañas del catálogo | `panelIn`, animación temporal de 280 ms para `[role="tabpanel"]:not([hidden])`; se desactiva con movimiento reducido. | Las pestañas y paneles conservan `role`, ids, `aria-controls` y atributo `hidden`. |
| Barra de lectura | `scroll(root block)`; `od-progress-grow`, escala horizontal de 0 a 1. | Elemento `.od-progress` fijo fuera del flujo y scroll raíz. |
| Sombra de cabecera | `scroll(root block)`, rango `0–150px`; `od-header-shadow` cambia opacidad. | No debe cambiar la altura medida de la cabecera; `--hh` también determina offset de anclas y portada. |
| Entrada del héroe | Animación temporal `od-hero-enter` (240 ms, con delays escalonados) sobre claim, título, descripción, CTA, nota, imagen y cinta. | Aplicada a hojas del árbol para evitar que desplazamientos se sumen. Respaldo visible si se reduce movimiento. |
| Tarjetas, contacto y pie al entrar | `view()` con rangos de entrada: `od-reveal-rise` (fichas, `entry 0%` a `entry 90%`); `od-fade-only` para contenido del contacto; `od-fade-rise` para pie. | El contacto evita desplazar elementos que contienen campos/foco. Las tarjetas activas cambian con las pestañas. |
| Compromisos, tarjetas escalonadas | Timeline nombrada `--od-rejilla` declarada en `.od-stagger`, eje block; hijos con `animation-range` escalonados; `od-rejilla-fade` cambia opacity y scale. | La timeline pertenece a la rejilla y no a sus tarjetas: en móvil `.swipe` es un contenedor de scroll horizontal y un `view()` de sus hijos podría quedar sin recorrido útil. |
| Imagen del héroe | Cortina temporal `od-hero-curtain` (620 ms) y parallax ligado a `scroll(root block)` durante `0–700px`, `od-hero-parallax`. | Ambas animaciones van en la imagen, con timelines y rangos múltiples; la escala base 1.14 evita descubrir bordes. |
| Pasos del proceso en escritorio | `view()` de cada `.od-step` en salida (`exit 0–100%`, con offsets escalonados); `od-step-recede` reduce escala/opacidad. | Solo escritorio; no reordena DOM ni usa sticky. La línea vertical del proceso está expresamente retirada y no debe resucitarse por error. |
| Iconos dentro de tarjetas | Timeline nombrada `--od-ficha` en cada `.od-reveal`; `od-ficha-curtain` en el recuadro y `od-icon-settle` en SVG. | La timeline se declara en la ficha, no en el SVG: el recuadro tiene `overflow:hidden`. Mantener anidamiento y selecciones descendientes. |
| Sombras de carrusel móvil | `.swipe` declara `scroll-timeline: --od-desliz inline`; `.swipe-marco` expone el nombre con `timeline-scope`; `od-scroll-shadow` anima propiedades registradas `--od-can-scroll-l/r`. | Depende de `@property`, los dos pseudo-elementos del wrapper y el eje inline. Se limita a móvil y se retira con movimiento reducido. |
| Portada que se contrae | `scroll(root block)`, `0–90vh`: `od-portada-encoger` reduce el marco de `100svh` a altura de cabecera más banda; `od-portada-recorte` desplaza background-position; `od-portada-desvanecer` desvanece marca/velo en `0–45vh`. | La portada es fixed y sale del flujo; `body` reserva `100svh`. La altura final usa `--hh` medido por JS y `--od-portada-banda`. Cada breakpoint controla imagen y punto focal. |

**Líneas de tiempo con nombre comprobadas:** `--pin-ventajas`, `--od-rejilla`, `--od-ficha` y `--od-desliz`; se usan `view-timeline-name`, `scroll-timeline` y `timeline-scope`. Hay `animation-range` con rangos `entry`, `exit`, `contain` y distancias en px/vh, además de timelines raíz `scroll(root block)` y una animación temporal con timeline `auto`.

**Qué puede romperse en React:** envolver una tarjeta o cambiar su contenedor puede alterar el contenedor de scroll que determina `view()`. Separar/portalizar nodos puede romper el alcance de timelines nombradas. Desmontar paneles de categorías cambia la disponibilidad de anclas, foco, ids y estado inicial de animación. Cambiar orden del DOM altera los offsets por `:nth-child`. Reemplazar `hidden` por `display` condicionado, renombrar clases/ids, cambiar overflow o mover `.swipe` respecto de `.swipe-marco` puede cortar la timeline. El CSS de portada depende de la altura de cabecera calculada desde JS.

**Recomendación central:** mover estas reglas a CSS de Vite conservándolas literalmente al principio; no sustituirlas por efectos JS ni librerías. Migrar un bloque a la vez y verificar tanto soporte como fallback en cada navegador objetivo.

## 4. Inventario JavaScript

Existe un único script inline en el `<head>`, una IIFE en modo estricto, con inicialización al estar disponible el DOM. Funcionalidades detectadas:

| Funcionalidad actual | Comportamiento y destino recomendado |
|---|---|
| Tema claro/oscuro | Lee/escribe `localStorage` (`sublikat-tema`), usa preferencia del sistema si no hay guardado y actualiza `data-theme`, iconos y atributos accesibles. **React:** estado/hook de tema; conservar aplicación temprana antes del primer pintado para evitar flash. |
| Formulario | Valida nombre, email, producto, mensaje y privacidad; añade/quita errores y resumen enlazado; enfoca el primer error; confirma localmente sin envío y permite reiniciar. **React:** componente `Contact` con estado de formulario y función de validación reutilizable; mantener exactamente la semántica y dejar explícito que la confirmación no envía datos. |
| Cotización desde catálogo | Al pulsar enlace con `data-producto`, rellena “Consulta sobre: …” si el texto está vacío y enfoca el textarea. **React:** pasar handler/dato de producto a la tarjeta; no manipular el valor fuera del estado del formulario. |
| Pestañas de catálogo | Maneja click, flechas, Home/End, foco, `aria-selected`, `tabindex`, panel `hidden`, almacenamiento (`sublikat-categoria`), cambios de hash y scroll para alinear panel bajo la barra fija.<br>**React:** estado de categoría y navegación accesible por teclado; preservar ids/anchors y persistencia. Mantener todos los paneles montados con `hidden` es lo más fiel al DOM actual. |
| Medición de cabecera | Actualiza `--hh` en resize/load y al cambiar la ubicación móvil del tema.<br>**React:** efecto con limpieza; considerar `ResizeObserver` si la cabecera puede cambiar sin resize, conservando el valor consumido por CSS. |
| Menú móvil | Alterna `hidden`, `aria-expanded`/label; cierra al elegir enlace o Escape y devuelve foco al botón.<br>**React:** estado en `Header`; conservar Escape, cierre al navegar y foco. |
| Conmutador en menú móvil | Mueve el mismo nodo de tema bajo 768 px y lo devuelve a la barra en escritorio; escucha media query.<br>**React:** preferir renderizado en el destino adecuado sin duplicar ids ni listeners; mantener estado y posición de teclado accesibles. |
| Carruseles | Para cada `.swipe`, añade indicadores decorativos y actualiza el punto activo con listener pasivo de scroll.<br>**React:** renderizar los indicadores declarativamente y actualizar desde `onScroll`/referencia; limpiar cualquier listener manual. |
| Pestaña activa centrada | Desplaza la lista horizontal para centrar la pestaña pulsada.<br>**React:** handler del componente de catálogo, manteniendo el scroll suave existente. |
| Navegación activa | `IntersectionObserver` marca `aria-current` en enlaces cuando intersectan tienda, proceso, compromisos o contacto.<br>**React:** efecto/hook con `disconnect()` en cleanup; mantener margen y targets actuales. |
| WhatsApp flotante compacto | Listener pasivo de scroll activa clase `compact` cuando `scrollY > 400`.<br>**React:** hook con cleanup o alternativa CSS; mantener umbral/estados visuales sin duplicar el listener. |

**Puede seguir en CSS/HTML:** scroll suave, scroll-snap, animaciones nativas, estados visuales y enlaces `wa.me` son responsabilidades CSS/navegador, no lógica React. No se encontró una función JavaScript separada de scroll que sustituya a las Scroll-Driven Animations.

**Riesgo específico de React:** la validación y la manipulación actual de nodos se hacen con `document`, creación de elementos, `classList`, atributos y listeners. Copiar ese script sin adaptación produciría dos fuentes de estado y puede dejar listeners duplicados en montajes/desmontajes (incluido Strict Mode). La migración debe asignar cada estado interactivo a un componente y limpiar efectos.

## 5. Arquitectura React + Vite propuesta

Estructura sugerida, acotada a las secciones y comportamientos que existen:

```text
Sublikat/
├─ index.html
├─ public/
│  └─ assets/                 # Mantener rutas favicon, portada, beneficios y stock
├─ src/
│  ├─ main.jsx                # Punto de montaje React
│  ├─ App.jsx                 # Solo composición global, sin markup de secciones
│  ├─ components/
│  │  ├─ SiteHeader/
│  │  ├─ ReadingProgress/
│  │  └─ WhatsAppWidget/
│  ├─ sections/
│  │  ├─ Hero/
│  │  ├─ Benefits/
│  │  ├─ WorkshopNotice/
│  │  ├─ Catalog/
│  │  │  ├─ Catalog.jsx
│  │  │  ├─ ProductCard.jsx
│  │  │  └─ catalog.data.js
│  │  ├─ Process/
│  │  ├─ Commitments/
│  │  ├─ Contact/
│  │  └─ SiteFooter/
│  ├─ hooks/                  # Solo efectos compartidos: tema, medida, observer
│  ├─ utils/                  # Validación y helpers de cotización sin DOM
│  └─ styles/
│     ├─ tokens.css
│     ├─ base.css
│     ├─ components.css
│     └─ motion.css           # CSS nativo existente, no reemplazar por JS
└─ docs/
```

**Recomendaciones de organización:**

- Cada sección mantiene su JSX y CSS local (o un CSS de sección junto a ella); `App.jsx` compone únicamente cabecera, portada/barra, secciones y pie.
- Mantener en `public/assets/` la estructura `assets/` permite conservar referencias de portada que actualmente se resuelven desde CSS, además de favicon e imágenes. Si luego se importan como módulos, hacerlo de forma explícita y comprobar rutas con el `base` del despliegue.
- El catálogo puede usar datos para evitar repetir tarjetas, pero debe extraer nombres, descripciones, orden, SVG y atributos del `index.html` vigente y conservar la discrepancia del selector para resolverla por decisión, no durante el refactor.
- No hace falta introducir router para una página única: anchors y paneles actuales cubren la navegación. No hace falta dependencia de animación.
- `main.jsx` importa estilos globales y monta `App`; mantener en `index.html` title, description, Open Graph, lang, favicon y el punto de montaje.

## 6. Estrategia de migración progresiva

1. **Fijar línea base y alcance.** Guardar capturas reproducibles de la página vigente antes de cambios; registrar anchos, tema, navegador, scroll y estados interactivos. Revisar con Sublikat la discrepancia del catálogo/formulario.
2. **Preparar Vite y React.** Solo tras autorización: definir la raíz de aplicación y el punto de montaje sin eliminar metadatos ni tocar configuración de Vercel como parte de esta fase.
3. **Incorporar recursos.** Copiar/servir los recursos existentes preservando estructura y nombres; revisar que cada URL responda y no cambien recortes ni variante responsive.
4. **Crear estilos globales.** Trasladar base, tokens y estilos de movimiento desde `index.html` a CSS global/separado, sin cambiar valores, cascade, orden, `@supports`, media queries ni keyframes.
5. **Migrar componentes compartidos.** Cabecera y menú, conmutador de tema, portada/barra de lectura, widget de WhatsApp y pie. Comparar y validar cada componente.
6. **Migrar secciones individualmente.** Héroe → ventajas → aviso → catálogo → proceso → compromisos → contacto. Mantener contenido, orden, headings, ids, atributos, SVG, clases y wrappers; desplegar cada sección en una rama de trabajo y comparar antes de continuar.
7. **Migrar interacciones.** Pasar estado/eventos a React por componente. Probar teclado, foco, persistencia, navegación por hash, errores, selección de categoría, prellenado de presupuesto y menú.
8. **Conservar y validar Scroll-Driven Animations.** No traducirlas a hooks ni introducir bibliotecas. Probar cada timeline con soporte, con movimiento reducido y en fallback sin soporte; revisar especialmente wrappers y paneles del catálogo.
9. **Pruebas visuales y funcionales.** Comparar línea base y Vite en viewport idéntico, tema claro/oscuro, scroll y estado de carga equivalentes. Revisar regresiones semánticas y recursos rotos.
10. **Preparar despliegue Vercel.** Tras aprobación: comprobar directorio raíz del proyecto, comando de build y directorio de salida de Vite, variables/rutas base si aplican y preview deployment; no modificar configuración durante esta auditoría.

## 7. Riesgos identificados

| Riesgo | Consecuencia posible | Mitigación propuesta |
|---|---|---|
| Compatibilidad de Scroll-Driven Animations, en especial Safari/iOS | Pin, reveal, ranges o timelines nombradas pueden no activarse o variar por versión; animar opacidad inicial sin fallback puede ocultar contenido. | `@supports` estricto y fallback visible; probar versiones móviles/Safari objetivo y verificar las animaciones, no solo el render estático. |
| Timelines nombradas y wrappers | Cambiar ancestros, `overflow`, `timeline-scope`, orden o montaje puede cambiar el scroller/eje/timeline o dejar animaciones sin progreso. | Preservar el árbol DOM crítico y anotar qué nodo declara y consume cada timeline; pruebas visuales por sección. |
| Orden y montaje condicional | `:nth-child`, delays, selectores descendientes y anchors dejan de corresponder; paneles desmontados pierden estado/hash. | Mantener orden y paneles presentes con `hidden`; modificar el DOM por una razón concreta y revisar selectores afectados. |
| Rutas de imágenes | En Vite cambian las reglas de resolución de URLs, en especial fondos CSS, favicon y subrutas de despliegue. | Preservar directorio `public/assets`, revisar cada URL del build/preview y confirmar recortes por breakpoint. |
| JavaScript que manipula DOM | Conflicto entre el DOM imperativo y render React; estados accesibles desincronizados, listeners duplicados y fugas. | Convertir lógica en estado/props; usar refs solo para medidas/enfoque; limpiar listeners, media queries y observers. |
| Fuentes externas y Tailwind CDN | Red, privacidad o disponibilidad afectan tipografía/estilos; el CDN calcula CSS en el cliente y puede causar variaciones/retardo. | Medir con y sin red externa; preservar cargas y fallback durante equivalencia. Evaluar compilación/localización de Tailwind solo después de comprobar paridad de clases y layout. |
| Accesibilidad | Regresión de labels, foco, teclado de tabs, `aria-current`, resumen de errores, reduced motion o contraste en ambos temas. | Pruebas teclado/lector de pantalla y auditoría en light/dark; mantener semántica, foco y los fallbacks actuales. |
| Rendimiento | Carga de utilidades/CDN, imágenes de portada de varios tamaños, renderizado de muchas tarjetas y listeners de scroll. | Comparar transferencia, render y layout shift; mantener lazy loading de ventajas y evitar trabajo repetido en scroll. |
| SEO y compartición | Una SPA puramente cliente puede ofrecer contenido/metadatos menos accesibles a crawlers o vistas previas que el HTML actual. | Preservar metadatos y HTML semántico; verificar HTML final y vista previa social. Evaluar prerender si el requisito SEO lo exige. |
| Vercel/rutas de despliegue | Build/output o `base` incorrectos rompen assets; una salida SPA puede requerir reglas de fallback según rutas futuras. | Confirmar estructura, build de producción y preview bajo la configuración aprobada; no cambiar Vercel en esta fase. |
| Contenido inconsistente | El recuento 20/textiles 5 no coincide con las opciones de formulario (19 productos enumerados en categorías y falta Polerones). | Obtener decisión expresa; usar una fuente de datos única solo después de cerrar contenido y revisar todos los enlaces de cotización. |

## 8. Plan de pruebas

### Línea base visual

- Capturar la página servida desde el `index.html` vigente antes de migrar; no depender exclusivamente de capturas anteriores, que pueden describir otra versión.
- Usar los mismos navegador/versión, sistema, escala, fuente cargada, ancho/alto, tema, datos locales y posición de scroll en ambas versiones.
- Viewports mínimos: móvil estrecho (375 px), móvil ancho (≈430 px), tablet (768 px), escritorio (1280 px) y una anchura intermedia cercana al breakpoint (767/768 px). Comprobar vertical y orientación móvil horizontal.
- Tomar página completa y recortes por sección, en tema claro y oscuro; comparar además la portada al inicio, a mitad de su colapso y tras su colapso.
- Usar diff de imagen/píxeles o superposición; investigar diferencias por tipografía, altura de cabecera, anchos, saltos de línea, recorte, spacing y estado de scroll. No aceptar una captura “parecida” como sustituto de probar la interacción.

### Pruebas funcionales y de accesibilidad

- Anclas y navegación de header/footer; enlace activo; hash directo a cada categoría; navegación con flechas/Home/End y foco en tabs; centrado de pestaña móvil.
- Persistencia del tema y categoría tras recarga; respuesta a preferencia del sistema cuando no existe tema guardado; traslado del control de tema entre menú móvil y escritorio.
- Cotización de cada producto: prellenado correcto cuando el textarea está vacío, sin sobrescribir texto existente, y foco en el campo.
- Formulario: validación individual y submit, cada caso de error y resumen enlazado, foco en primer error, checkbox de privacidad, confirmación sin envío de red y reinicio.
- WhatsApp: destino y texto, apertura segura, widget visible/compacto a ambos lados del umbral de 400 px.
- Carruseles: desplazamiento táctil/trackpad, snap, indicadores, accesibilidad y ausencia de desbordamiento horizontal de página.
- `prefers-reduced-motion: reduce`: contenido visible, sin desplazamientos/reveals, sin smooth scrolling ni balanceo; verificar por separado fallback en navegador sin `scroll()`/`view()`.
- Teclado, foco visible, labels/descripciones, roles y nombres accesibles; comprobar light/dark y zoom/reflow.
- Consola sin errores, solicitudes sin 404 y carga correcta de fuentes/imagenes; Lighthouse o auditoría equivalente como evidencia secundaria, no reemplazo de pruebas de paridad.

## 9. Criterios de aceptación

La migración futura estará lista para aceptación cuando:

1. El sitio conserva textos, orden de secciones, headings, imágenes, iconos, enlaces, metadatos y contenido del `index.html` vigente; cualquier discrepancia está resuelta por decisión explícita.
2. Se mantienen los breakpoints, recortes de portada, cuadrículas/carruseles, temas y apariencia en los viewports comparados, sin diferencias visuales no aprobadas.
3. Los CTA, menú, tema, tabs, persistencia, formulario de demostración, prellenado de cotización, WhatsApp y pie mantienen su comportamiento y atributos accesibles.
4. Las Scroll-Driven Animations siguen siendo CSS nativo; las timelines nombradas y sus scrollers funcionan en navegadores objetivo; en movimiento reducido o sin soporte el contenido queda legible y en su sitio.
5. `App.jsx` compone los componentes y secciones; cada sección puede evolucionar en su módulo sin concentrar su marcado en el punto de entrada.
6. No hay errores de consola, assets rotos, navegación por teclado bloqueada ni regresiones de responsive/overflow; el build de producción y el preview Vercel aprobado sirven la página y todos sus recursos.
7. La paridad se acredita con capturas en las mismas condiciones que la línea base y una lista de pruebas funcionales ejecutadas, no solo con una compilación exitosa.

## 10. Cierre de esta fase

Esta auditoría no implementa React ni cambia el sitio. El único entregable de la fase es este documento; la preparación de Vite, la instalación de dependencias, la corrección del catálogo o cualquier modificación de despliegue requieren autorización posterior.

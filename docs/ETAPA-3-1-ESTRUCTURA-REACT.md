# Sublikat — Etapa 3.1: estructura principal React

## Alcance y estado

La composición React y los componentes provisionales se prepararon en la rama
`feat/react-vite-migration`, sobre el commit `670afed refactor: separar estilos
y preparar recursos`. La fuente de referencia continúa siendo
[`archive/index-original.html`](./archive/index-original.html).

Esta subetapa establece la arquitectura y las relaciones DOM necesarias para
continuar la migración. Los componentes todavía no contienen la página completa:
no se afirma equivalencia visual ni funcional con el sitio original.

## Composición de la aplicación

`src/App.jsx` solo importa y ordena los componentes. El orden de los hijos
directos de React reproduce el original:

1. `ReadingProgress`: `<div class="od-progress" aria-hidden="true">`.
2. `Header`: `<header id="site-header" class="… od-header">`.
3. `Portada`: `.od-portada[aria-hidden="true"]`, fuera de `<main>`.
4. `<main>` con `.od-secciones` y las secciones.
5. `Footer`: `<footer class="site-footer od-reveal-soft" role="contentinfo">`.
6. `WhatsAppWidget`: `<div class="od-was" data-od-id="widget-whatsapp">`.

`Portada` es un componente adicional a la lista solicitada porque el HTML
original la sitúa entre la cabecera y `<main>`, no dentro del Hero. No se añadió
un contenedor alrededor de ella.

Dentro de `.od-secciones`, Hero devuelve un fragmento con sus dos nodos hermanos
directos originales: la franja previa (`.mb-6.flex.flex-wrap.items-center…`) y
la tarjeta `.od-hero`. Después aparecen, en orden, `#beneficios`,
`#aviso-taller`, `#tienda`, `#proceso`, `#resenas` y `#contacto`. Hero no es una
sección `<section>` ni tiene ID propio.

## Componentes y correspondencia con el original

| Componente | Archivo | Raíz y relaciones preservadas |
| --- | --- | --- |
| `ReadingProgress` | `src/components/ReadingProgress/ReadingProgress.jsx` | `.od-progress[aria-hidden="true"]`, primer hijo. |
| `Header` | `src/components/Header/Header.jsx` | `header#site-header.od-header` y sus clases de posición/ancho. Su contenido y sus controles siguen pendientes. |
| `Portada` | `src/components/Portada/Portada.jsx` | `.od-portada` con `.od-portada__foto`, `__velo` y `__marca`; mantiene el texto decorativo y `aria-hidden`. |
| `Hero` | `src/sections/Hero/Hero.jsx` | Fragmento sin wrapper; conserva el nodo `.od-hero`, `.od-hero__body`, `.od-hero__title` y el H1 original. |
| `Benefits` | `src/sections/Benefits/Benefits.jsx` | `section#beneficios[data-od-id="beneficios-taller"][aria-label]`; `.pin-vista` contiene `.pin-intro` y `.swipe-marco > .swipe.pin-pista`. |
| `WorkshopNotice` | `src/sections/WorkshopNotice/WorkshopNotice.jsx` | `section#aviso-taller[data-od-id="aviso-taller"][aria-label]`. |
| `Catalog` | `src/sections/Catalog/Catalog.jsx` | `section#tienda[data-od-id="catalogo-productos"][aria-labelledby="heading-catalogo"]` y el H2 enlazado. |
| `Process` | `src/sections/Process/Process.jsx` | `section#proceso[data-od-id="proceso-taller"][aria-labelledby="heading-proceso"]`; conserva `.swipe-marco > .swipe.od-steps.od-stagger.od-stagger-2`. |
| `Commitments` | `src/sections/Commitments/Commitments.jsx` | `section#resenas[data-od-id="resenas"][aria-labelledby="reviews-title"]`; conserva `.swipe-marco > .reviews-grid.swipe.od-stagger`. |
| `Contact` | `src/sections/Contact/Contact.jsx` | `section#contacto[data-od-id="contacto"][aria-labelledby="contact-heading"]` y su H2 enlazado. |
| `Footer` | `src/sections/Footer/Footer.jsx` | `footer.site-footer.od-reveal-soft[role="contentinfo"]`, hermano de `<main>`. |
| `WhatsAppWidget` | `src/components/WhatsAppWidget/WhatsAppWidget.jsx` | `.od-was[data-od-id="widget-whatsapp"]`, hermano del footer. |

Se preservan los IDs, clases y atributos del esqueleto documentado, incluidos
`data-od-id`, `aria-label`, `aria-labelledby`, `aria-hidden` y
`role="contentinfo"`. Los destinos de `aria-labelledby` presentes en los stubs
existen en el DOM. El navegador confirmó seis secciones `<section>` directas en
`.od-secciones`; las dos raíces restantes son los nodos de Hero.

## Dependencias del DOM que deben conservarse

- `src/styles/base.css` aplica `.od-secciones > * + *`; el orden y la relación de
  hijos directos afectan al espaciado. El fragmento de Hero evita insertar un
  wrapper y conserva sus dos nodos hermanos.
- En Beneficios, `#beneficios > .pin-vista`, `.pin-intro`,
  `.swipe-marco > .swipe.pin-pista` y la timeline `--pin-ventajas` deben
  permanecer relacionados como en el HTML original.
- En Proceso, la timeline y los efectos de pasos dependen de
  `.swipe-marco > .swipe.od-steps.od-stagger.od-stagger-2` y del orden de los
  futuros `.od-step`.
- En Compromisos, `.swipe-marco > .reviews-grid.swipe.od-stagger` contiene la
  rejilla que declara `--od-rejilla`; sus elementos consumen esa timeline.
- Las futuras fichas de catálogo usan `.od-reveal` y `--od-ficha`. Los
  carruseles usan `.swipe` y `--od-desliz`; `.swipe-marco` expone esa timeline
  mediante `timeline-scope`.
- El catálogo original relaciona cinco pestañas (`tab-cat-regalos`,
  `tab-cat-cuadros`, `tab-cat-textiles`, `tab-cat-papeleria`,
  `tab-cat-identificacion`) con los paneles `cat-regalos`, `cat-cuadros`,
  `cat-textiles`, `cat-papeleria` y `cat-identificacion` mediante
  `aria-controls`/`aria-labelledby`. Esas interacciones y nodos se incorporarán
  al migrar el contenido del catálogo; no se simulan en este esqueleto.
- La cabecera original contiene `#theme-toggle`, `#menu-btn`, `#menu-movil` y
  `#menu-tema`, además de los enlaces de navegación. El nodo compartido de tema
  y sus listeners aún no se implementan.
- Los IDs del formulario, los estados de validación/confirmación, las fichas y
  enlaces del footer y el enlace operativo de WhatsApp continúan en el HTML
  archivado; no se han migrado en esta subetapa.

Las cuatro hojas CSS continúan importándose desde `src/main.jsx` en el orden
existente (`base.css`, `tokens.css`, `components.css`, `motion.css`). No se
modificaron los estilos ni las animaciones nativas `scroll()`/`view()`, sus
timelines, rangos, keyframes o reglas `prefers-reduced-motion`.

## Verificaciones

- `npm run build`: **correcto**. Vite 8.3.8 transformó 31 módulos y generó
  `dist/index.html`, el bundle JavaScript y un bundle CSS de 70.42 kB.
- `npm run dev -- --host 127.0.0.1`: el servidor respondió **HTTP 200**.
- Navegador integrado: React montó el árbol dentro de `#root`; se verificó el
  orden de sus seis hijos directos, los ocho hijos de `.od-secciones` y los
  destinos de `aria-labelledby`.
- Bundle de producción: incluye selectores de base/componentes y las referencias
  a `animation-timeline`, `--pin-ventajas`, `--od-rejilla`, `--od-ficha` y
  `--od-desliz`.
- `git diff --check`: **sin errores**.
- Se observó una advertencia de consola de `cdn.tailwindcss.com`, ya presente en
  el punto de entrada existente; no se cambió como parte de esta etapa.

## Archivos y límites de cambio

Se modificó `src/App.jsx`; se crearon los componentes descritos arriba y este
informe. No se modificaron `src/main.jsx`, las hojas CSS, el HTML archivado,
configuraciones, Vercel, `build/` ni `qa/`. El build dejó sus resultados en el
directorio ignorado `dist/`.

Al comenzar ya figuraban `.gitignore` modificado y `public/` sin seguimiento en
el estado del árbol de trabajo. Se conservaron sin cambios. No se creó ningún
commit ni se hizo push.

## Pendiente para la Etapa 3.2

Migrar el contenido original de cada sección y los componentes globales,
preservando textos, imágenes, IDs, atributos accesibles y estructuras de
contenedor. Después se migrarán las interacciones y se harán pruebas visuales y
funcionales contra el HTML original. Esta preparación no declara la página
equivalente ni autoriza iniciar la siguiente etapa.

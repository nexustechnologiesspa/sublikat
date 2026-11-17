# Sublikat — Etapa 3.7b: Footer en React

## Alcance y archivos modificados

Se migró el Footer desde el bloque `OD:FOOTER` de `docs/archive/index-original.html` al componente React existente.

Archivos modificados:

- `src/sections/Footer/Footer.jsx`
- `docs/ETAPA-3-7B-FOOTER-REACT.md` (este informe)

No se modificaron `App.jsx`, otros componentes, CSS, HTML original, recursos, configuración ni dependencias.

## Estructura y contenido migrados

El Footer mantiene su raíz semántica (`footer`, `role="contentinfo"`, `site-footer od-reveal-soft`) y `.main-container`. Dentro de este se recrearon, en el orden original:

1. `.footer-grid` con cuatro columnas: marca y descripción, Productos, El Taller y Visítanos.
2. Aviso legal con `id="aviso-legal"`.
3. `.footer-bottom` con copyright fijo de 2026 y `nav aria-label="Enlaces legales"`.

Se migraron literalmente los textos de marca, descripción, distintivo de demostración, encabezados, enlaces, dirección, horario, aviso legal y copyright. Se conservaron las listas semánticas y los encabezados `<h4>`. No se añadió contenido dinámico.

## Enlaces conservados

Se comprobaron los 13 destinos del Footer:

- Productos: `#cat-regalos`, `#cat-cuadros`, `#cat-textiles`, `#cat-papeleria`, `#cat-identificacion`.
- El Taller: `#contacto`, `#resenas`, `#contacto`, `https://wa.me/56949409253`, `https://www.instagram.com/sublikat.cl/`, `mailto:pedidos@sublikat.cl`.
- Barra inferior: `#aviso-legal`, `#contacto`.

«Cómo trabajamos» conserva `#contacto`, como pide el alcance. No se añadieron `target="_blank"`, handlers ni cancelación del comportamiento nativo. En navegador se verificó la activación del enlace a `#cat-textiles` (que seleccionó el panel correspondiente) y del enlace a `#aviso-legal`.

## Adaptaciones JSX, estilos y animación

- `class` se convirtió en `className`; los atributos SVG se adaptaron a JSX.
- El SVG continúa inline, decorativo (`aria-hidden="true"`) y conserva dimensiones 28 × 28, `viewBox`, namespace y geometría. La comprobación en navegador comparó los siete elementos SVG y sus atributos geométricos.
- Los estilos existentes de `components.css`, `base.css`, `tokens.css` y `motion.css` se reutilizan sin cambios. No se añadieron dependencias ni CSS.
- `App.jsx` permanece intacto y sigue montando el Footer después de `main` y antes de `WhatsAppWidget`.

## Build y comprobaciones

- `npm run build`: **correcto** (Vite transformó 34 módulos).
- `git diff --check`: **correcto**.
- Navegador: un Footer, cuatro columnas y `#aviso-legal` único.
- Navegador: textos requeridos presentes; los 13 enlaces coinciden exactamente con las etiquetas y destinos especificados.
- Navegador: SVG inline, decorativo y con los atributos y geometría esperados.
- Navegador: no hay atributos de handlers inline ni `target` en enlaces del Footer.
- Navegador: orden `main` → Footer → WhatsAppWidget confirmado.
- Desktop (1440 px): rejilla de cuatro columnas; el navegador soporta `animation-timeline: view()` y calcula `od-fade-rise`, timeline `view()` y el rango configurado.
- Móvil (390 px): rejilla de dos columnas, primera y última columna a ancho completo, sin overflow horizontal; barra inferior permite wrapping.
- Movimiento reducido: el Footer queda con animación desactivada, opacidad 1 y sin traslación.
- No se realizó comparación de capturas; no se declara equivalencia visual. Se inspeccionaron geometría y estilos computados en navegador.

## Limitaciones y advertencias

- No se probaron todos los enlaces externos haciendo navegación fuera del sitio; sus `href` se comprobaron directamente en el DOM.
- El navegador emitió el aviso existente de Tailwind CDN en `index.html`; no se modificó ni se añadió esa dependencia.
- La animación depende de la compatibilidad nativa con Scroll-Driven Animations y conserva el fallback y `prefers-reduced-motion` existentes.

No se ejecutó `git add`, commit, push ni despliegue.

# Etapa 3.10 — Recuperación de Compromisos en React

## Fuentes inspeccionadas

- `docs/archive/index-original.html`, bloque `OD:COMPROMISOS`, líneas 3936–3999.
- `src/sections/Commitments/Commitments.jsx`, implementación anterior.
- `src/App.jsx`, composición de secciones.
- `src/main.jsx`, estilos cargados y punto de montaje.
- `src/styles/components.css`: `.sticker-badge`, títulos, `.reviews-section`, `.reviews-header`, `.rating-summary-card`, `.reviews-grid`, `.review-card`, `.review-quote`, `.review-author-wrap`, `.author-meta`, `.author-name`, `.author-role` y reglas responsive.
- `src/styles/motion.css`: reglas de movimiento reducido y timeline `--od-rejilla` para `#resenas .od-stagger`.
- Script original `iniciarCarruseles()` en `docs/archive/index-original.html`, líneas 771–788.

## Estructura original

El bloque contiene, en orden:

1. `<section class="reviews-section" aria-labelledby="reviews-title" id="resenas" data-od-id="resenas">`.
2. `.reviews-header`, con distintivo, título y subtítulo a un lado; al otro, `.rating-summary-card` con perfil y texto descriptivo.
3. `.swipe-marco` y una rejilla `.reviews-grid.swipe.od-stagger` con tres artículos:
   - `compromiso-minimo`
   - `compromiso-muestra`
   - `compromiso-atencion`
4. Cada artículo contiene el texto del compromiso y un bloque de autor con nombre y descripción.

El bloque original no contiene imágenes, SVG ni iconos inline ni referencias a recursos. Su presentación gráfica proviene de las clases y estilos de tarjetas existentes; no se añadieron recursos ni iconos nuevos.

## Elementos recuperados

- Distintivo «Compromisos del taller», título y subtítulo completos.
- Perfil «Perfil verificado en Google Maps» y su descripción.
- Los tres compromisos, en el orden original, con sus textos, identificadores y datos de autor.
- El carrusel `.swipe` y los tres puntos que el JavaScript original insertaba después de cada elemento `.swipe`.
- El punto activo se actualiza al desplazarse y el listener se elimina al desmontar el componente.

## Clases y estilos preservados

Se mantuvieron las clases y atributos del HTML original, adaptando `class` a `className`. No se modificaron CSS ni se incorporaron clases nuevas.

En escritorio, `.reviews-grid` conserva la rejilla de tres columnas. Las reglas móviles existentes cambian el carrusel a desplazamiento horizontal y muestran `.dots`; `.dots span.on` conserva el estilo del punto activo. La animación escalonada sigue usando `#resenas .od-stagger` y la timeline CSS `--od-rejilla`; el movimiento reducido continúa bajo las reglas globales existentes.

## Integración

`src/App.jsx` ya monta `<Commitments />` entre `<Process />` y `<Contact />`. No se modificó la composición.

## Pruebas realizadas

- `npm run build`: correcto; Vite transformó 34 módulos y generó los archivos de producción.
- `git diff --check`: correcto.
- Navegador integrado, con la sección visible a 1440, 768 y 390 px: tres artículos presentes en cada medida.
- A 1440 px, la página no presentó overflow horizontal.
- A 390 px, la rejilla fue desplazable y la página no presentó overflow horizontal. Los indicadores reflejaron:
  - Inicio: `[true, false, false]`
  - Tercer compromiso: `[false, false, true]`
  - Regreso al inicio: `[true, false, false]`
- A 768 px se observó overflow horizontal global de 16 px. Al ocultar temporalmente solo el carrusel de Compromisos, el ancho de documento no cambió; al ocultar temporalmente todos los elementos `.swipe`, volvió al ancho visible. La evidencia apunta a otro carrusel de la página, no a esta sección. No se modificaron estilos ni otras secciones para corregirlo.
- No se registraron errores de consola ni solicitudes fallidas durante la comprobación. El navegador mostró una advertencia ya existente sobre `cdn.tailwindcss.com` en producción; no es un error atribuible a Compromisos.

No se realizó una comparación visual directa, captura contra captura, con el HTML original; por ello no se afirma equivalencia visual.

## Archivos modificados

- `src/sections/Commitments/Commitments.jsx`
- `docs/ETAPA-3-10-COMPROMISOS-REACT.md`

No se modificaron `App.jsx`, CSS, otras secciones, recursos, dependencias ni configuración.

## Conclusión

Compromisos recupera en React la estructura, el contenido y las clases del bloque original. El build y las comprobaciones funcionales/responsive de la sección finalizaron correctamente. Queda registrada una observación de overflow global a 768 px atribuible a otros carruseles y pendiente la comparación visual directa con el original.

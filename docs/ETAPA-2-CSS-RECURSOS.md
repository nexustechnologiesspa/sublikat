# Etapa 2 — Migración de CSS y recursos

## Alcance y estado

Preparación realizada en `feat/react-vite-migration`, sobre el commit de Etapa 1 `25ae046 chore: preparar infraestructura React y Vite`. Los cambios conocidos que ya estaban pendientes de Etapa 1 (`.gitignore` y `public/assets/.gitkeep`) se conservaron. No se migraron secciones a JSX ni se modificaron Vercel, `build/` o `qa/`.

La fuente consultada fue `docs/archive/index-original.html`; su SHA-256 al finalizar es `D756CD629474D7886DF8B1924B81A823645DDB7EED939E1A23EE6AE0745818C2`. La pantalla de React sigue siendo provisional, por lo que este trabajo no declara equivalencia visual completa.

## 1. Inventario de recursos

El HTML original tiene **10 recursos locales referenciados**: nueve imágenes y un favicon SVG. Todos los recursos locales usados se encontraron en `assets/`; no se encontraron rutas absolutas del equipo.

| Recurso | Referencia original | Uso y resultado |
| --- | --- | --- |
| Favicon `favicon.svg` | `assets/favicon.svg` en el HTML | Se conserva en `assets/` y se enlaza desde el nuevo `index.html`. |
| Cuatro fondos de portada | `assets/portada/quita-la-luz-{2150,1440,1024,movil}.jpg` en CSS; el archivo `1440` aparece en dos reglas | Se mantienen nombres y subcarpetas; Vite los incorpora al build. |
| Cuatro ilustraciones de beneficios | `assets/beneficios/{pedidos-unidad,personalizacion,muestra-impresion,atencion-whatsapp}.jpg` en `<img>` | Copiadas al build en sus rutas originales. |
| Imagen de producto | `assets/stock/camiseta-cats.jpg` en `<img>` | Copiada al build en su ruta original. |
| Iconos e ilustraciones SVG | SVG inline en el HTML | No son archivos externos y no requieren copia independiente. |
| Tipografías | Google Fonts: Nunito y Fraunces | No existen archivos de fuente locales; se conservan los enlaces externos y `preconnect`. |
| Utilidades CSS | `https://cdn.tailwindcss.com` | Se conserva el script externo original; no se agregó Tailwind al proyecto local. |

El JavaScript original no carga recursos locales mediante `fetch`, `XMLHttpRequest`, `Image` ni inserciones dinámicas de recursos. WhatsApp, Instagram y correo son enlaces de acción, no archivos que deban copiarse. Los `README.md`, `assets/productos/catalogo.json` y `assets/productos/credits.json` no están referenciados por la página y se excluyeron deliberadamente del build.

## 2. Ubicación y configuración de Vite

Los originales permanecen en `assets/`; no se movieron, renombraron, comprimieron ni convirtieron. El espacio `public/assets/` de Etapa 1 sigue como placeholder.

- En desarrollo, Vite sirve los originales en las rutas `/assets/...`.
- Para producción, `vite.config.js` conserva el nombre y la subruta de los recursos que Vite emite desde CSS o el HTML.
- Un plugin de build copia únicamente las cinco imágenes usadas por `<img>` en el HTML original que no forman parte del bundle de la pantalla provisional: las cuatro de beneficios y la imagen de stock.
- Así `dist/assets/` contiene los diez recursos usados, sin duplicar imágenes dentro del árbol fuente. Los archivos generados coinciden byte a byte con sus originales.
- `publicDir: 'public'` se mantiene disponible para recursos públicos que se incorporen en etapas posteriores.

Las cinco referencias CSS originales a `assets/portada/...` se expresan como `/assets/portada/...` en el CSS extraído. Al estar ahora en hojas CSS externas, la ruta raíz conserva el mismo destino público que tenían desde el HTML raíz.

El nuevo `index.html` conserva el CDN de Tailwind, el favicon, los enlaces y conexiones previas de Google Fonts. No se añadieron dependencias npm.

## 3. Hojas CSS y comparación con el original

Los cuatro bloques `<style>` se extrajeron completos, en el orden original y sin reformatear declaraciones:

| Bloque en el archivo archivado | Hoja creada | Contenido |
| --- | --- | --- |
| `OD:BASE` (2.432 caracteres) | `src/styles/base.css` | Reglas globales, cuerpo, foco, estructura y reglas base responsive. |
| `OD:TOKENS` (6.568 caracteres) | `src/styles/tokens.css` | Variables de tema, tipografía, colores, espacios, radios, sombras y tiempos. |
| `OD:ESTILOS` (38.173 caracteres) | `src/styles/components.css` | Componentes y estilos específicos de portada, héroe, ventajas, catálogo, contacto y pie. |
| `OD:MOTION` (23.003 caracteres) | `src/styles/motion.css` | Bloque dedicado a movimiento ligado al scroll. |

`src/main.jsx` carga `base.css`, `tokens.css`, `components.css` y `motion.css`, respetando el orden de los bloques originales. Aunque se sugirió cargar tokens antes que base, el comentario original de `OD:BASE` indica que esa hoja se carga primero; se conservó el orden real para no alterar la cascada.

**Diferencias comprobadas:** la comparación textual confirma que los bloques extraídos coinciden con el origen tras el único ajuste descrito: cinco URL de fondos pasan de relativas a raíz-absolutas. No se cambiaron selectores, declaraciones, especificidad, clases, media queries, variables, keyframes, tiempos ni rangos.

El bloque `OD:ESTILOS` contiene reglas de movimiento propias de componentes, entre ellas `floating`, `panelIn`, `od-pin-mover`, la timeline `--pin-ventajas` y sus reglas de movimiento reducido. Se mantienen junto a esos estilos para preservar el orden y las dependencias del bloque original. Por la misma razón, algunas reglas `prefers-reduced-motion` permanecen en `base.css` y `components.css`; no se duplicaron ni reordenaron.

## 4. Scroll-Driven Animations

Se conservan literalmente las reglas fuente de `scroll()`, `view()`, `animation-timeline`, `animation-range`, `timeline-scope`, `view-timeline-name`, `scroll-timeline`, `@property`, `@keyframes`, `@supports` y `prefers-reduced-motion`.

Las cuatro referencias críticas siguen presentes: `--pin-ventajas`, `--od-rejilla`, `--od-ficha` y `--od-desliz`. Contando reglas CSS y excluyendo menciones dentro de comentarios, la hoja original y el CSS generado contienen los mismos 20 `@keyframes`, 26 declaraciones `animation-timeline` y 20 `animation-range`. También se conservan un `timeline-scope`, tres `view-timeline-name`, un `scroll-timeline` y las reglas de movimiento reducido.

No existe una declaración explícita `animation-fill-mode`; los valores de relleno están en los shorthands originales (`both` y `forwards`) y permanecen sin cambios. Se desactivó la minificación de CSS en el build para evitar que simplifique rangos u otras declaraciones. El CSS generado coincide con la concatenación de las cuatro hojas fuente, aparte de las cinco rutas rebasedas.

## 5. Validaciones

| Comprobación | Resultado |
| --- | --- |
| `npm run build` | Correcto con Vite 8.3.8; 19 módulos transformados. Generó `dist/` y un CSS de 70,42 kB sin minificación. |
| Recursos en desarrollo | Los 10 recursos usados respondieron HTTP 200 en `127.0.0.1:5173`, con MIME de imagen correcto. |
| Recursos en vista previa | Los mismos 10 respondieron HTTP 200 en `127.0.0.1:4173`. |
| Integridad de recursos | Los diez archivos de `dist/assets/` son byte a byte idénticos a los originales. |
| CSS fuente vs. original | Los cuatro bloques se compararon; coincidencia exacta salvo el ajuste de las cinco rutas CSS. |
| Animaciones en CSS generado | Los identificadores y propiedades requeridos están presentes; conteos de keyframes, timelines y rangos coinciden con la fuente. |
| Fuentes en navegador | Nunito 600 y Fraunces 600 quedaron cargadas en la vista previa. |
| Montaje React | Desarrollo y vista previa siguen mostrando la pantalla provisional; no se observaron errores de consola ni de página. |
| Rutas absolutas locales | No se encontraron rutas del equipo en estilos, configuración ni `index.html`. |
| Archivo archivado y árboles protegidos | Hash intacto; sin cambios en `assets/`, `build/`, `qa/` ni `docs/archive/index-original.html`. |

`git diff --check` señala espacios finales que ya están en los bloques CSS originales. Se conservaron deliberadamente según el requisito de no reescribir ni reformatear el CSS; el build no reporta errores.

## 6. Recursos pendientes y decisiones técnicas

- **Sin recursos locales usados faltantes:** las 10 referencias locales originales están disponibles en desarrollo y vista previa. Los archivos JSON y README no referenciados no se exponen en `dist/`.
- **Dependencia externa:** Tailwind CDN muestra en consola una advertencia de que el CDN no está destinado a producción. Se mantuvo porque pertenece al sistema original y esta etapa prohíbe agregar Tailwind local; decidir su sustitución requiere autorización en otra etapa.
- **Fuentes externas:** Google Fonts se cargó en la prueba de navegador, pero requiere conectividad al servicio externo.
- **Manifiesto para futuras imágenes:** las imágenes `<img>` que no se importen desde módulos deben añadirse a la lista de `vite.config.js` o importarse desde código al migrar secciones. Las imágenes de portada referenciadas por CSS se incorporan automáticamente.
- **Validación visual integral:** queda pendiente hasta que las secciones existan en React. No se declara equivalencia visual completa.

No se hizo commit ni push. La Etapa 3 no se inició.

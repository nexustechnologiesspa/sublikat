# Sublikat — Etapa 3.5: auditoría previa a la migración del catálogo

## Alcance y fuentes

Esta auditoría es de inspección. No se modificaron componentes, estilos,
JavaScript, HTML archivado ni recursos.

Fuentes consultadas:

- `docs/archive/index-original.html`: catálogo, líneas 3326–3704; control de
  categorías, líneas 567–693; centrado de pestañas, líneas 791–800; registro de
  inicialización, líneas 828–845.
- `src/sections/Catalog/Catalog.jsx`: componente provisional actual.
- `src/App.jsx` y `src/main.jsx`: orden de composición y carga de estilos.
- `src/styles/base.css`, `tokens.css`, `components.css` y `motion.css`.
- `index.html`, `package.json` y `vite.config.js`.

Estado inicial comprobado: rama `feat/react-vite-migration`, HEAD
`dc7e051 feat: migrar beneficios y aviso a React`, checkout limpio.

## Inventario y estructura DOM

El bloque original comienza en `OD:CATALOGO` (línea 3326) y termina en la línea
3704. La raíz es:

```html
<section aria-labelledby="heading-catalogo"
         class="space-y-8"
         id="tienda"
         data-od-id="catalogo-productos">
```

En `App.jsx`, el catálogo es un hijo directo de `.od-secciones`, después de
`WorkshopNotice` y antes de `Process`. El componente React actual conserva la
raíz y el título `20 productos en 5 categorías`, pero todavía no contiene la
cabecera completa, pestañas ni paneles.

Orden y jerarquía original:

1. Cabecera en `div.flex.flex-col.md:flex-row...`.
   - Columna principal: distintivo decorativo con punto y texto «Catálogo del
     taller», `h2#heading-catalogo` y descripción.
   - Columna complementaria: tarjeta de ejemplo con etiquetas «Ejemplo» y
     «Lista de productos del taller».
2. `nav.od-tablist[role="tablist"][aria-label="Categorías del catálogo"]`.
   - Cinco botones `button[role="tab"]`, cada uno con un `span` contador.
3. Cinco paneles `section[role="tabpanel"]`, en el mismo orden de las pestañas.
   Cada panel contiene un encabezado `h3`, el contador textual y un `div.grid`
   con sus tarjetas.
4. Cada tarjeta es un `article` con un contenedor de contenido, un marco de
   icono SVG, un `h4`, descripciones opcionales y un enlace «Cotizar».

No hay wrapper entre la sección raíz, la navegación y los paneles. Tampoco hay
imágenes `<img>` en las tarjetas; las ilustraciones son SVG inline.

### Categorías, pestañas y paneles

| Orden | Categoría | `data-categoria` | ID de pestaña | ID del panel | Conteo |
|---:|---|---|---|---|---:|
| 1 | Regalos personalizados | `regalos` | `tab-cat-regalos` | `cat-regalos` | 7 |
| 2 | Cuadros y fotografías | `cuadros` | `tab-cat-cuadros` | `cat-cuadros` | 3 |
| 3 | Estampados textiles | `textiles` | `tab-cat-textiles` | `cat-textiles` | 5 |
| 4 | Papelería corporativa | `papeleria` | `tab-cat-papeleria` | `cat-papeleria` | 2 |
| 5 | Identificación corporativa | `identificacion` | `tab-cat-identificacion` | `cat-identificacion` | 3 |

Cada pestaña tiene `type="button"`, `aria-controls` apuntando al panel,
`aria-selected`, `tabindex` y `data-categoria`. El texto visible incluye el
nombre y un `span` con el conteo. Cada panel tiene `role="tabpanel"`,
`aria-labelledby` apuntando a su pestaña, `data-od-id` igual a su propio ID y
la clase `space-y-4 scroll-mt-24`. En el HTML estático, `cat-regalos` es el
único panel sin `hidden`; los otros cuatro lo tienen. El JavaScript puede
cambiar ese estado al iniciar.

### Estructura común de las tarjetas

Las 20 tarjetas conservan este patrón:

```text
article[data-od-id="producto-*"]
└─ div
   ├─ div.relative.w-full.aspect-square...overflow-hidden...
   │  └─ svg.w-20.h-20.tx-ink[aria-hidden="true"]
   ├─ [distintivo opcional]
   ├─ h4.font-display...
   └─ [p descriptivo opcional]
└─ a[href="#contacto"][data-producto="..."] «Cotizar»
```

La clase común del `article` es
`bg-surface ink-border-thick rounded-sticker shadow-offset p-5 flex flex-col justify-between group hover:translate-y-[-2px] transition-transform od-reveal`.
La única excepción es **Polerones**, que no tiene `od-reveal`. Todos los
enlaces «Cotizar» usan las clases
`mt-4 w-full min-h-[48px] px-4 inline-flex items-center justify-center gap-2 rounded-sticker ink-border-thick bg-transparent tx-ink font-extrabold text-sm hover:bg-soft focus:outline-none focus:ring-4 focus:ring-[var(--focus)] transition-colors`,
`href="#contacto"` y `data-producto` con el nombre exacto del producto.

Cada SVG tiene `viewBox="0 0 48 48"`, `fill="none"`,
`stroke="currentColor"`, `stroke-width="2.2"`, trazos redondeados y
`aria-hidden="true"`. Los iconos son decorativos y no tienen `alt`, `title` ni
archivo/ruta independiente.

## Inventario de los veinte productos

El orden siguiente es el orden DOM original. En la columna «Imagen y alt» se
describe el SVG inline; **no existe `src` ni texto `alt` de imagen** en ninguna
tarjeta. «Clases» remite a la clase común descrita arriba. Los enlaces de todas
las filas son «Cotizar» a `#contacto`, con `data-producto` igual al nombre.

| Orden | Categoría | Producto | Descripción / distintivo | Imagen y alt | Clases | Atributos adicionales |
|---:|---|---|---|---|---|---|
| 1 | Regalos personalizados | Tazas | — | SVG de taza; sin ruta/alt | Comunes + `.od-reveal` | `data-od-id="producto-tazas"`; `data-producto="Tazas"` |
| 2 | Regalos personalizados | Tazas mágicas | — | SVG de taza con destellos; sin ruta/alt | Comunes + `.od-reveal` | `data-od-id="producto-tazas-magicas"`; `data-producto="Tazas mágicas"` |
| 3 | Regalos personalizados | Botellas | — | SVG de botella; sin ruta/alt | Comunes + `.od-reveal` | `data-od-id="producto-botellas"`; `data-producto="Botellas"` |
| 4 | Regalos personalizados | Mousepads | — | SVG de mousepad con ratón; sin ruta/alt | Comunes + `.od-reveal` | `data-od-id="producto-mousepads"`; `data-producto="Mousepads"` |
| 5 | Regalos personalizados | Bolsas | — | SVG de bolsa con asas; sin ruta/alt | Comunes + `.od-reveal` | `data-od-id="producto-bolsas"`; `data-producto="Bolsas"` |
| 6 | Regalos personalizados | Relojes | — | SVG de reloj; sin ruta/alt | Comunes + `.od-reveal` | `data-od-id="producto-relojes"`; `data-producto="Relojes"` |
| 7 | Regalos personalizados | Chapas para mascotas | — | SVG de placa con huella; sin ruta/alt | Comunes + `.od-reveal` | `data-od-id="producto-chapas-mascotas"`; `data-producto="Chapas para mascotas"` |
| 8 | Cuadros y fotografías | Cuadros de piedra | — | SVG de cuadro con motivo orgánico; sin ruta/alt | Comunes + `.od-reveal` | `data-od-id="producto-cuadros-piedra"`; `data-producto="Cuadros de piedra"` |
| 9 | Cuadros y fotografías | Cuadros de fotos | Formatos desde A6 hasta A3 | SVG de fotografía enmarcada; sin ruta/alt | Comunes + `.od-reveal` | `data-od-id="producto-cuadros-fotos"`; `data-producto="Cuadros de fotos"` |
| 10 | Cuadros y fotografías | Cuadros de fotos en aluminio | Formato A4 | SVG de marco con diagonal; sin ruta/alt | Comunes + `.od-reveal` | `data-od-id="producto-cuadros-aluminio"`; `data-producto="Cuadros de fotos en aluminio"` |
| 11 | Estampados textiles | Polerones | Distintivo «Producto destacado». «Estampado a todo color con su diseño, desde 1 unidad. Modelos, tallas y colores por confirmar.» | SVG de polerón; sin ruta/alt | Comunes, **sin `.od-reveal`** | `data-od-id="producto-polerones"`; `data-producto="Polerones"` |
| 12 | Estampados textiles | Estampado en telas de 1 color | — | SVG de prenda con un círculo; sin ruta/alt | Comunes + `.od-reveal` | `data-od-id="producto-estampado-1-color"`; `data-producto="Estampado en telas de 1 color"` |
| 13 | Estampados textiles | Estampado en telas de 2 colores | — | SVG de prenda con dos círculos; sin ruta/alt | Comunes + `.od-reveal` | `data-od-id="producto-estampado-2-colores"`; `data-producto="Estampado en telas de 2 colores"` |
| 14 | Estampados textiles | Estampado en telas de 3 colores | — | SVG de prenda con tres círculos; sin ruta/alt | Comunes + `.od-reveal` | `data-od-id="producto-estampado-3-colores"`; `data-producto="Estampado en telas de 3 colores"` |
| 15 | Estampados textiles | Estampado en tela con imágenes | Formatos de hasta A3 | SVG de prenda con marco de imagen; sin ruta/alt | Comunes + `.od-reveal` | `data-od-id="producto-estampado-imagenes"`; `data-producto="Estampado en tela con imágenes"` |
| 16 | Papelería corporativa | Tarjetas de presentación | — | SVG de tarjeta con líneas de texto; sin ruta/alt | Comunes + `.od-reveal` | `data-od-id="producto-tarjetas-presentacion"`; `data-producto="Tarjetas de presentación"` |
| 17 | Papelería corporativa | Tarjetas de presentación PVC | — | SVG de tarjeta con diagonales; sin ruta/alt | Comunes + `.od-reveal` | `data-od-id="producto-tarjetas-pvc"`; `data-producto="Tarjetas de presentación PVC"` |
| 18 | Identificación corporativa | Lanyards | — | SVG de lanyard con credencial; sin ruta/alt | Comunes + `.od-reveal` | `data-od-id="producto-lanyards"`; `data-producto="Lanyards"` |
| 19 | Identificación corporativa | Credenciales | — | SVG de credencial con retrato/líneas; sin ruta/alt | Comunes + `.od-reveal` | `data-od-id="producto-credenciales"`; `data-producto="Credenciales"` |
| 20 | Identificación corporativa | Credenciales PVC | — | SVG de credencial con diagonales; sin ruta/alt | Comunes + `.od-reveal` | `data-od-id="producto-credenciales-pvc"`; `data-producto="Credenciales PVC"` |

Verificación estática: cinco paneles; 7 + 3 + 5 + 2 + 3 = **20 artículos**.
El catálogo contiene cero etiquetas `<img>` y cero rutas `src` de producto;
por tanto, no hay rutas de imágenes de producto que puedan faltar o estar
malformadas. Los elementos visuales de las tarjetas son los SVG inline
inventariados arriba.

## Interacciones JavaScript originales

### Selección y estado de categorías

`iniciarCategorias()` (líneas 581–693) busca
`[role="tab"][data-categoria]`. No usa delegación; registra `click` y
`keydown` en cada botón.

1. **Estado inicial:** intenta leer `localStorage["sublikat-categoria"]`.
   Si coincide con un `data-categoria`, esa categoría se elige; si no, se usa
   el índice 0 (`regalos`). Los errores de acceso a `localStorage` se ignoran
   mediante `try/catch`.
2. **Actualización:** `mostrar(indice, moverFoco, desplazar)` establece
   `aria-selected="true"` y `tabindex="0"` en la pestaña activa; a las otras
   les asigna `"false"` y `"-1"`. Busca el panel mediante `aria-controls`,
   retira `hidden` del activo y lo añade a los demás. No cambia una clase
   `active`; el CSS consume el estado de `aria-selected`.
3. **Persistencia:** cada llamada a `mostrar` intenta guardar el
   `data-categoria` activo bajo `sublikat-categoria`.
4. **Clic:** activa la pestaña, conserva el foco nativo del botón y solicita
   alinear el panel bajo la barra fija.
5. **Teclado:** `ArrowRight` y `ArrowDown` avanzan; `ArrowLeft` y `ArrowUp`
   retroceden; la navegación envuelve en ambos extremos. `Home` y `End` van
   a la primera y última categoría. Estas teclas previenen su acción por
   defecto, activan el panel, mueven el foco al botón nuevo y solicitan el
   desplazamiento vertical. `Enter` y `Space` no tienen código propio: la
   activación la proporciona el botón HTML nativo.
6. **Hash inicial y cambios:** después de restaurar la categoría guardada,
   `activarPorHash()` busca si el hash coincide con el ID de un panel
   (`#cat-regalos`, `#cat-cuadros`, etc.). Si coincide, esa categoría
   prevalece. Un listener global `hashchange` repite la búsqueda. La
   activación por hash no mueve explícitamente el foco ni llama a la rutina
   de alineación.

`volverAlaLista()` mide el `top` calculado y alto de `.od-tablist`, añade
12 px de respiro y evita el scroll si el panel ya comienza por debajo de ese
techo. Si debe alinear, usa scroll suave salvo que
`prefers-reduced-motion: reduce` esté activo; entonces usa `auto`. Después
revisa una vez el desplazamiento al evento `scrollend` o tras un timeout y
corrige el desvío si supera 2 px.

### Comportamientos adicionales relacionados

- `centrarPestanaActiva()` registra un listener `click` en cada
  `[role="tab"]`. Desplaza horizontalmente su padre (el `nav`) para centrar la
  pestaña, con `behavior: "smooth"`. Solo se invoca por clic; la ruta de
  teclado no centra la barra. Este listener no consulta
  `prefers-reduced-motion`.
- `iniciarCotizacion()` registra un listener por cada `a[data-producto]`.
  Al hacer clic busca `#contacto-mensaje`; si no existe, termina. Si el campo
  está vacío, escribe `Consulta sobre: <data-producto>\n`; si ya contiene
  texto, lo conserva. En ambos casos enfoca el campo. No cancela el enlace
  nativo a `#contacto`.
- `iniciarEnlaceActivo()` incluye el ID `tienda` entre las secciones
  observadas con `IntersectionObserver`; actualiza `aria-current` en el enlace
  correspondiente del menú principal.
- `iniciar()` invoca la inicialización al `DOMContentLoaded` o de inmediato
  si el documento ya está cargado. Los listeners de pestañas y `hashchange`
  son directos y no tienen limpieza porque el HTML es una página estática.

### Evaluación de accesibilidad

**Hechos:** hay `role="tablist"`, nombre accesible de la lista, botones con
`role="tab"`, relaciones `aria-controls`/`aria-labelledby`, estado
`aria-selected`, `tabindex` itinerante, paneles `role="tabpanel"` y ocultación
nativa con `hidden`. Las etiquetas de las pestañas incluyen el nombre y la
cantidad. Los SVG de producto se excluyen del árbol accesible con
`aria-hidden="true"`.

**Evaluación:** implementa el núcleo del patrón de pestañas ARIA y activación
automática al desplazarse por flechas, pero es una variante propia, no una
implementación literal del patrón APG:

- No declara `aria-orientation`; por defecto la lista se interpreta como
  horizontal.
- También asigna avanzar/retroceder a `ArrowDown`/`ArrowUp` aunque la lista es
  horizontal.
- Los paneles no tienen `tabindex`. Todos contienen enlaces de cotización, por
  lo que sí contienen elementos enfocables, pero el foco no se lleva al panel
  al cambiar de categoría.
- El centrado con scroll suave por clic no comprueba movimiento reducido.
- La navegación por teclado no centra horizontalmente la pestaña recién
  activada.

Estas diferencias deben conservarse durante una migración de equivalencia; su
posible mejora requiere una decisión aparte.

## Dependencias CSS y animaciones

Los cuatro estilos extraídos se importan en `src/main.jsx` en este orden:
`base.css`, `tokens.css`, `components.css`, `motion.css`. `index.html` también
carga Tailwind desde CDN; muchas clases de estructura del catálogo son
utilidades de Tailwind.

| Archivo | Reglas relevantes | Dependencia del catálogo |
|---|---|---|
| `base.css` | `[hidden]:not([hidden="until-found" i]) { display:none !important }`; `[role="tabpanel"]:not([hidden])` usa `panelIn .28s ease-out`; `html .od-secciones > * + *` separa secciones. | Los paneles inactivos dependen del atributo `hidden`; no reemplazarlo solo por opacidad o clases. |
| `tokens.css` | `--font-body: Nunito`, `--font-display: Fraunces`; colores `--surface`, `--ink`, `--accent-fill`, `--on-accent`, `--accent-hover`, `--soft-2`, `--line`, `--focus`; radios, espaciado y sombras. Hay variantes claro/oscuro. | Alimenta el texto, estados de pestaña, bordes, fondos e iconos. |
| `components.css` | `html [role="tablist"]` sticky bajo cabecera/portada, `z-index:30`, snap horizontal y scrollbar oculto; `.cat-tab` y estados `:hover`, `[aria-selected="true"]`, `:focus-visible`; estilos de producto por `[data-od-id^="producto-"]`; ajustes móvil. | La barra requiere seguir siendo el `nav` desplazable; el estado visual depende de `aria-selected`; selectores de productos dependen del prefijo de `data-od-id`. |
| `motion.css` | Animación de entrada `.od-reveal`; timeline por tarjeta `--od-ficha`; reset para movimiento reducido; definición global de `.swipe-marco`/`.swipe` y `--od-desliz`. | Las tarjetas deben conservar su árbol interno para el efecto de cortina e icono. `--od-desliz` no es usado por el markup del catálogo. |

Detalles responsive comprobados en `components.css`:

- La navegación tiene `overflow-x-auto`, `scroll-snap-type: x proximity` y
  scrollbar oculto. Cada `.cat-tab` tiene `scroll-snap-align: center`.
- La utilidad del grid del HTML original define dos columnas y, desde `lg`,
  tres (`grid-cols-2 lg:grid-cols-3`), con gaps responsive.
- Hasta 767 px, las fichas `data-od-id^="producto-"` bajan su padding a 12 px,
  los SVG a 3.5 rem, los `h4` a 18 px, los enlaces a una altura mínima de 44 px
  y los párrafos a 12.5 px.
- El panel visible tiene una animación `panelIn` de opacidad y 10 px de
  desplazamiento; se desactiva bajo `prefers-reduced-motion: reduce`.
- La regla global de movimiento reducido desactiva animaciones, opacidad/
  transformaciones de `.od-reveal` y sus elementos, así como animaciones de
  SVG; `@supports (animation-timeline: view())` y
  `prefers-reduced-motion: no-preference` delimitan las animaciones nativas.

### Timelines y relaciones DOM

| Timeline | Declaración y consumidores | Aplicación al catálogo |
|---|---|---|
| `--od-ficha` | En `motion.css`, cada `.od-reveal` declara `view-timeline-name: --od-ficha` dentro de `@supports (animation-timeline: view())` y `prefers-reduced-motion: no-preference`. `.od-reveal > div > div` consume la timeline para `od-ficha-curtain` (`entry 0%` a `entry 90%`); su SVG descendiente consume `od-icon-settle` (`entry 0%` a `entry 60%`). | Se aplica a 19 tarjetas con `.od-reveal`. La clase está ausente en Polerones, así que esa tarjeta no declara la timeline ni anima su marco/icono por estas reglas. |
| `--od-desliz` | En móvil, `.swipe-marco` declara `timeline-scope: --od-desliz`; `.swipe` declara `scroll-timeline: --od-desliz inline`; los pseudo-elementos del marco consumen la timeline para sombras laterales. Solo bajo soporte de `animation-timeline: scroll()` y movimiento permitido. | No hay `.swipe` ni `.swipe-marco` en el catálogo: la barra de pestañas es el único overflow horizontal del catálogo y no usa esta timeline. No introducirla como sustitución de la navegación. |

La jerarquía crítica de la animación por ficha es
`.od-reveal > div > div > svg`; además,
`[data-od-id^="producto-"] > div > div` colorea el marco del icono. Insertar
wrappers entre esos niveles cambia los selectores y la referencia de timeline.
Los límites de componente React no afectan CSS, pero los nodos DOM que cada
componente emite sí.

## Recursos y dependencias externas

- **Imágenes de producto:** ninguna; el bloque contiene 20 SVG inline y cero
  etiquetas `<img>`, `src` o rutas de imagen.
- **Iconografía:** 20 SVG inline, uno por tarjeta; no se encontró una librería
  externa de iconos ni referencias a sprites.
- **Fuentes:** `Fraunces` y `Nunito` se cargan desde Google Fonts; los tokens
  declaran fallbacks serif y sans-serif.
- **Tailwind:** `index.html` carga `https://cdn.tailwindcss.com`; no aparece en
  `dependencies`/`devDependencies` de `package.json`. El catálogo usa muchas
  utilidades como `grid-cols-2`, `lg:grid-cols-3`, `gap-3` y variantes
  responsive.
- **Vite:** `vite.config.js` copia imágenes de Beneficios y Portada, pero no
  hay imágenes de catálogo que añadir a esa lista. El SVG inline no requiere
  copiar recursos.
- **Otros externos del head:** favicon local; conexión y stylesheet de Google
  Fonts. No hay un recurso externo cargado por una tarjeta individual.

La dependencia de Tailwind CDN implica dependencia de red y una advertencia de
producción conocida; migrar/utilizar Tailwind local es una decisión de
infraestructura fuera de esta auditoría.

## Arquitectura React recomendada

Propuesta, sin crear archivos en esta etapa:

```text
src/sections/Catalog/
  Catalog.jsx          # sección raíz y estado seleccionado
  CatalogTabs.jsx     # nav/tablist y botones; devuelve el nav sin wrapper
  CatalogPanel.jsx    # section/tabpanel y su grid, sin wrapper intermedio
  ProductCard.jsx     # article original, icono, textos y enlace de cotización
  catalogData.js      # categorías, IDs, conteos y datos de productos
```

`Catalog.jsx` debería conservar `section#tienda` y componer en orden cabecera,
`CatalogTabs` y los cinco `CatalogPanel`. La navegación y paneles deben ser
hermanos en el mismo nivel que el original. `CatalogTabs` mantendría IDs,
`aria-controls`, `aria-selected`, `tabIndex` y `data-categoria`; los paneles
mantendrían ID, `role`, `aria-labelledby`, `data-od-id` y `hidden`.

`ProductCard` debe emitir el `article[data-od-id]` y la estructura directa
original. `catalogData.js` puede guardar el icono como clave estable para un
mapa local de SVG inline, junto con nombre, descripción opcional, distintivo,
`data-od-id` y valor `data-producto`. No usar imágenes de producto ni una
librería de iconos inexistente en el origen.

Mantener un único estado React de categoría activa, y derivar de él
`aria-selected`, `tabIndex` y `hidden`; no sincronizarlo con mutaciones DOM
paralelas. Efectos para `hashchange` deben tener cleanup. La inicialización
debe probar la categoría guardada y luego el hash, respetando la precedencia
original. Los enlaces de cotización deben mantener `href="#contacto"` y
prefill/focus del campo, preferiblemente mediante un handler React que no
reemplace la navegación nativa.

## Riesgos, diferencias y plan de migración

### Comportamiento que debe preservarse

- Cinco categorías y 20 tarjetas en el orden de esta auditoría.
- Textos, conteos, IDs, clases, `data-*`, iconos SVG, foco de botones y enlaces.
- Estado inicial, persistencia `sublikat-categoria` y activación por hash.
- Teclado, `aria-selected`, `tabindex`, atributos `hidden` y relaciones ARIA.
- Alineación vertical del panel y centrado horizontal de pestaña por clic.
- Prefill del campo de contacto y foco, sin borrar texto ya escrito.
- Estructura `.od-reveal > div > div > svg` y animaciones CSS nativas.
- La ausencia de `.od-reveal` en Polerones hasta que se decida expresamente
  cambiarla.

### Diferencias/limitaciones existentes que no deben corregirse en silencio

- Polerones es la única tarjeta sin `.od-reveal`; el comentario CSS habla de
  19 fichas animadas. No se puede deducir si es intencional.
- La tablist no declara orientación; admite flechas verticales además de las
  horizontales.
- El centrado suave por clic no consulta `prefers-reduced-motion`, a diferencia
  del ajuste vertical del panel.
- El centrado horizontal se ejecuta en clic, no en la navegación por teclado.
- El panel activo no usa `tabindex`; contiene enlaces enfocables.
- Las fotografías de producto no existen todavía por decisión de contenido:
  la descripción del catálogo dice que se incorporarán al confirmar la línea
  definitiva. No inventarlas ni considerar ausentes sus rutas.

### Tareas y aceptación

1. **Modelar los datos.** Representar cinco categorías y 20 productos con IDs,
   orden, textos, badges, clave de SVG y relación de cotización.
   **Aceptación:** conteos `7, 3, 5, 2, 3`, total 20; nombres, datos e IDs
   coinciden con la tabla.
2. **Migrar la tarjeta.** Reproducir el DOM y los SVG inline; conservar el
   enlace, atributos y clases.
   **Aceptación:** no hay `img` inventadas; todos los enlaces tienen
   `href="#contacto"` y el valor `data-producto` correcto; confirmar por
   separado si se conserva la falta de `.od-reveal` de Polerones.
3. **Migrar paneles y tablist.** Mantener el orden y las relaciones de IDs,
   atributos ARIA y estado oculto.
   **Aceptación:** cinco pestañas y paneles únicos; una sola selección activa;
   los cuatro paneles inactivos están ocultos; estilos activos y foco visibles.
4. **Migrar interacción.** Replicar clic, teclas, persistencia, hash, foco,
   alineación del panel y centrado del nav; implementar listeners con cleanup
   donde React requiera efectos.
   **Aceptación:** probar flechas, Home/End, Enter/Space nativos, selección
   guardada, hash directo/hashchange, campo vacío/no vacío y movimiento
   reducido. Comparar expresamente los casos existentes antes de considerar
   mejoras.
5. **Conservar CSS y timelines.** No añadir wrappers; conservar clases y la
   jerarquía de cada tarjeta. No convertir scroll animations a JavaScript.
   **Aceptación:** revisar computed styles y entrada de las fichas; comprobar
   el comportamiento de movimiento reducido y verificar que no se introduce
   `--od-desliz` en el catálogo.
6. **Validación responsive y regresión.** Comparar la página original con
   React en tamaños móvil y escritorio; revisar navegación horizontal,
   rejilla, foco, consola y build.
   **Aceptación:** sin errores de consola; todas las categorías/productos
   accesibles; layout responsive y build correctos. Las imágenes de producto
   no aplican hasta que el contenido las proporcione.

### Mejoras opcionales, sujetas a autorización

Evaluar por separado declarar `aria-orientation="horizontal"`, decidir si las
flechas verticales se conservan, respetar movimiento reducido en el centrado
horizontal y si hace falta `tabindex="0"` en paneles. Revisar también si la
excepción `.od-reveal` de Polerones es intencional. Ninguna de estas mejoras
forma parte de la migración de equivalencia sin decisión explícita.

## Limitaciones de esta auditoría

La comprobación de estructura y conteos fue estática sobre el HTML fuente; no
se ejecutó build ni se hicieron pruebas de navegador o capturas, dado que esta
etapa solicita inspección y documentación. Las observaciones de interacción
se derivan del código JavaScript original. La decisión sobre Polerones,
Tailwind CDN y las mejoras de accesibilidad queda pendiente.

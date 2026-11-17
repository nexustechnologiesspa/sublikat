# Sublikat — Etapa 3.6b: ProductCard y SVG

## Fuentes inspeccionadas

- `docs/ETAPA-3-5-AUDITORIA-CATALOGO.md`
- `docs/ETAPA-3-6A-MODELADO-DATOS.md`
- `docs/archive/index-original.html`, bloque `OD:CATALOGO`, en particular las
  tarjetas desde `producto-tazas` hasta `producto-credenciales-pvc`.
- `src/sections/Catalog/catalogData.js`
- `src/styles/components.css`, reglas `html [data-od-id^="producto-"]` y
  `html [data-od-id^="producto-"] > div > div`.
- `src/styles/motion.css`, reglas `.od-reveal > div > div` y
  `.od-reveal > div > div > svg` asociadas a `--od-ficha`.

## Componente y estructura

`src/sections/Catalog/ProductCard.jsx` exporta `ProductCard`, que recibe el
objeto `product` del modelo actual. Produce el mismo árbol relevante que las
tarjetas originales, sin wrappers adicionales:

```text
article[data-od-id]
├─ div
│  ├─ div.relative.w-full.aspect-square...overflow-hidden...
│  │  └─ svg.w-20.h-20.tx-ink[aria-hidden="true"]
│  ├─ div de distintivo (solo si existe)
│  ├─ h4
│  └─ p descriptivo (solo si existe)
└─ a[href="#contacto"][data-producto] «Cotizar»
```

La relación `.od-reveal > div > div > svg` queda intacta. La clase
`od-reveal` se agrega según `product.hasOdReveal`: está presente en las
diecinueve tarjetas correspondientes y ausente en Polerones. Los productos
sin descripción no generan un `<p>` vacío. Las clases y variantes del título,
la descripción y el distintivo conservan las diferencias del HTML original.
El CTA mantiene su enlace nativo; no se añadieron prellenado ni gestión de
foco.

`src/sections/Catalog/ProductIcons.jsx` exporta `ProductIcon`. El objeto
`iconShapes` resuelve explícitamente cada `svgKey` al dibujo original. Los
veinte SVG comparten los atributos de raíz originales:
`class="w-20 h-20 tx-ink"`, `viewBox="0 0 48 48"`, `fill="none"`,
`stroke="currentColor"`, `stroke-width="2.2"`,
`stroke-linecap="round"`, `stroke-linejoin="round"` y
`aria-hidden="true"`. Los atributos React se serializan a sus nombres SVG
correspondientes. Las geometrías y atributos de sus elementos hijos se
copiaron del HTML archivado.

Una clave desconocida provoca un `Error` explícito con la clave recibida; no
se sustituye por un icono genérico ni se omite silenciosamente.

## Correspondencia de SVG

| `svgKey` | Producto (`data-od-id`) |
|---|---|
| `cup` | Tazas (`producto-tazas`) |
| `magic-cup` | Tazas mágicas (`producto-tazas-magicas`) |
| `bottle` | Botellas (`producto-botellas`) |
| `mousepad` | Mousepads (`producto-mousepads`) |
| `bag` | Bolsas (`producto-bolsas`) |
| `watch` | Relojes (`producto-relojes`) |
| `pet-tag` | Chapas para mascotas (`producto-chapas-mascotas`) |
| `stone-frame` | Cuadros de piedra (`producto-cuadros-piedra`) |
| `photo-frame` | Cuadros de fotos (`producto-cuadros-fotos`) |
| `aluminum-photo-frame` | Cuadros de fotos en aluminio (`producto-cuadros-aluminio`) |
| `hoodie` | Polerones (`producto-polerones`) |
| `one-color-textile` | Estampado en telas de 1 color (`producto-estampado-1-color`) |
| `two-color-textile` | Estampado en telas de 2 colores (`producto-estampado-2-colores`) |
| `three-color-textile` | Estampado en telas de 3 colores (`producto-estampado-3-colores`) |
| `image-textile` | Estampado en tela con imágenes (`producto-estampado-imagenes`) |
| `business-card` | Tarjetas de presentación (`producto-tarjetas-presentacion`) |
| `pvc-business-card` | Tarjetas de presentación PVC (`producto-tarjetas-pvc`) |
| `lanyard` | Lanyards (`producto-lanyards`) |
| `credential` | Credenciales (`producto-credenciales`) |
| `pvc-credential` | Credenciales PVC (`producto-credenciales-pvc`) |

Las claves se mantienen en el modelo de datos existente; no se modificó ese
módulo.

## Validaciones

- **Render aislado:** Vite cargó los componentes con `ssrLoadModule`; React
  renderizó las veinte tarjetas con `renderToStaticMarkup`, sin integrarlas en
  `Catalog.jsx`.
- **Comparación con el original:** se comparó el markup renderizado de cada
  `data-od-id` con su tarjeta original, normalizando únicamente los espacios
  entre etiquetas. Las veinte tarjetas coincidieron, incluyendo sus SVG
  serializados, jerarquía, clases, textos, atributos y enlace.
- **Claves SVG:** las veinte claves del modelo son únicas y resolvieron a un
  SVG; se comprobó además que una clave desconocida produce el error esperado.
- **Contenido condicional y CTA:** se verificó la presencia de `<p>` solo
  cuando hay descripción, `href="#contacto"`, `data-producto` y texto
  «Cotizar» en las veinte tarjetas.
- **Animaciones:** se comprobó en el markup renderizado que Polerones no recibe
  `od-reveal` y que las otras diecinueve tarjetas sí lo conservan. La
  estructura requerida por `--od-ficha` permanece idéntica.
- **Build:** `npm run build` terminó correctamente con Vite 8.3.8.
  La composición principal todavía no importa estas tarjetas; por eso el build
  por sí solo no las verifica. La comprobación SSR aislada cubrió ambos
  componentes directamente.
- **Dependencias:** no se instalaron paquetes ni se crearon archivos
  auxiliares para el render aislado.

## Archivos y límites

Archivos nuevos:

- `src/sections/Catalog/ProductCard.jsx`
- `src/sections/Catalog/ProductIcons.jsx`
- `docs/ETAPA-3-6B-PRODUCT-CARD-SVG.md`

No se integraron las tarjetas en los paneles. No se modificaron
`Catalog.jsx`, `App.jsx`, CSS, HTML archivado, datos, recursos, configuración
ni dependencias. No se hizo commit, push ni despliegue.

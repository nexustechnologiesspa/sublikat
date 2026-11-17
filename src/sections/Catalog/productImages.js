import { catalogProducts } from './catalogData.js';

/**
 * Fotografía de cada ficha del catálogo.
 *
 * Los maestros viven en `assets/productos/<categoria>/` como JPEG de 1200 × 1200 y no se
 * publican. Lo que se empaqueta son las variantes que genera `npm run fotos`:
 * `-480` y `-960`, en AVIF (preferido) y WebP (respaldo). La tarjeta elige el tamaño con
 * `<picture>` + `srcset`, así que un móvil descarga ~5 KB y un escritorio retine ~15 KB
 * por ficha en vez de los ~80 KB del JPEG maestro.
 */
const conjuntos = {
  avif480: import.meta.glob('../../../assets/productos/*/*-480.avif', {
    eager: true,
    import: 'default'
  }),
  avif960: import.meta.glob('../../../assets/productos/*/*-960.avif', {
    eager: true,
    import: 'default'
  }),
  webp480: import.meta.glob('../../../assets/productos/*/*-480.webp', {
    eager: true,
    import: 'default'
  }),
  webp960: import.meta.glob('../../../assets/productos/*/*-960.webp', {
    eager: true,
    import: 'default'
  })
};

const porProducto = new Map();

for (const [variante, modulos] of Object.entries(conjuntos)) {
  for (const [ruta, url] of Object.entries(modulos)) {
    const nombre = ruta.split('/').pop().replace(/-\d+\.(?:avif|webp)$/, '');
    if (!porProducto.has(nombre)) porProducto.set(nombre, {});
    porProducto.get(nombre)[variante] = url;
  }
}

/** Texto alternativo de cada foto; debe coincidir con `assets/productos/catalogo.json`. */
const textos = {
  'producto-tazas': 'Taza blanca de cerámica con un estampado botánico de líneas coral',
  'producto-tazas-magicas':
    'Taza negra mate con un estampado floral coral que aparece con el calor',
  'producto-botellas': 'Botella térmica color crema con una banda geométrica coral',
  'producto-mousepads': 'Mousepad rectangular de tela con curvas impresas en coral y mostaza',
  'producto-bolsas': 'Bolsa de tela cruda con un motivo geométrico coral estampado',
  'producto-relojes': 'Reloj de pulsera con esfera y correa estampadas en tonos coral',
  'producto-chapas-mascotas':
    'Chapa redonda de metal con el perfil de un perro dibujado en línea coral',
  'producto-cuadros-piedra': 'Cuadro de piedra con un paisaje abstracto en tonos tierra y coral',
  'producto-cuadros-fotos': 'Marco negro con una lámina de hojas y montañas en tonos cálidos',
  'producto-cuadros-aluminio': 'Cuadro de aluminio con un diseño geométrico de arcos en coral',
  'producto-polerones':
    'Polerón de algodón color crema con un estampado geométrico coral y mostaza',
  'producto-estampado-1-color':
    'Camiseta doblada con un estampado circular a una sola tinta coral',
  'producto-estampado-2-colores':
    'Camiseta doblada con un estampado botánico en coral y mostaza',
  'producto-estampado-3-colores':
    'Camiseta doblada con un estampado botánico en tres tintas: coral, mostaza y café',
  'producto-estampado-imagenes':
    'Camiseta doblada con una impresión a todo color de hojas en tonos cálidos',
  'producto-tarjetas-presentacion':
    'Mazo de tarjetas de presentación de papel grueso con un símbolo coral',
  'producto-tarjetas-pvc': 'Tarjeta de PVC brillante con un patrón geométrico coral y crema',
  'producto-lanyards': 'Lanyard de cinta estampada con mosquetón metálico y portacredencial',
  'producto-credenciales': 'Credencial impresa en funda transparente con lanyard oscuro',
  'producto-credenciales-pvc':
    'Credencial rígida de PVC con silueta genérica y código de barras'
};

/**
 * Ancho real que ocupa la foto de la ficha: ~324 px en la rejilla de tres columnas,
 * ~304 px en la de dos con el contenedor ancho y ~129 px en un móvil de 390 px.
 */
export const productImageSizes =
  '(min-width: 1024px) 330px, (min-width: 640px) 310px, 33vw';

const crear = (dataOdId) => {
  const nombre = dataOdId.replace(/^producto-/, '');
  const fotos = porProducto.get(nombre);
  const alt = textos[dataOdId];
  if (!fotos || !alt) return null;

  return {
    alt,
    avif: `${fotos.avif480} 480w, ${fotos.avif960} 960w`,
    webp: `${fotos.webp480} 480w, ${fotos.webp960} 960w`,
    fallback: fotos.webp960
  };
};

export const productImages = Object.fromEntries(
  catalogProducts.map((product) => [product.dataOdId, crear(product.dataOdId)])
);

const incompletas = catalogProducts.filter(
  (product) => !productImages[product.dataOdId]
);

if (incompletas.length > 0) {
  throw new Error(
    `Faltan fotos o texto alternativo para: ${incompletas
      .map((product) => product.dataOdId)
      .join(', ')}. Ejecuta "npm run fotos".`
  );
}

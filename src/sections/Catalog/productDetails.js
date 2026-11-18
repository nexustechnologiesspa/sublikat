import { catalogCategories } from './catalogData.js';

/**
 * Contenido de apoyo del catálogo (tarjeta y ficha ampliada).
 *
 * Vive fuera de `catalogData.js` a propósito: el modelo del catálogo conserva
 * nombres, categorías, fotos y descripciones de producto; este módulo solo
 * aporta la redacción de las fichas. Nada aquí inventa materiales, medidas ni
 * precios: todo sale de lo que ya afirma el sitio (envío de ilustración, foto
 * o logo, archivos PNG/SVG/boceto, muestra antes de imprimir, pedidos desde
 * una unidad) o de las características ya aprobadas de cada producto.
 */

/**
 * Personalización por categoría. Son opciones del servicio, no propiedades
 * inventadas del producto: describen qué puede aportar el cliente.
 */
const detallesPorCategoria = {
  regalos: {
    summary:
      'Detalles personalizados que se recuerdan. Elige tu diseño y lo preparamos para regalar.',
    features: [
      { icon: 'quality', label: 'Material de calidad' },
      { icon: 'palette', label: 'Diseño a tu medida' },
      { icon: 'gift', label: 'Ideal para regalar' }
    ],
    detailExtra:
      'Aceptamos pedidos desde una sola unidad y revisamos la muestra contigo antes de imprimir.',
    personalization: [
      { icon: 'palette', label: 'Tu diseño, foto o ilustración' },
      { icon: 'sparkles', label: 'Revisión de la muestra antes de imprimir' },
      { icon: 'box', label: 'Pedidos desde 1 unidad' }
    ]
  },
  cuadros: {
    summary:
      'Tus fotos y diseños impresos con nitidez, listos para dar vida a cualquier pared.',
    features: [
      { icon: 'print', label: 'Impresión de alta calidad' },
      { icon: 'ruler', label: 'Medidas a tu elección' },
      { icon: 'frame', label: 'Listo para colgar' }
    ],
    detailExtra:
      'Envíanos tu archivo y revisamos una muestra digital antes de imprimir.',
    personalization: [
      { icon: 'frame', label: 'Tus fotos y diseños impresos' },
      { icon: 'print', label: 'Archivos en PNG, SVG o boceto' },
      { icon: 'sparkles', label: 'Revisión de la muestra antes de imprimir' }
    ]
  },
  textiles: {
    summary:
      'Tu diseño estampado en telas suaves y resistentes, desde una sola unidad.',
    features: [
      { icon: 'shirt', label: 'Tela de algodón' },
      { icon: 'color', label: 'Color duradero' },
      { icon: 'box', label: 'Desde 1 unidad' }
    ],
    detailExtra:
      'Aceptamos PNG, SVG o boceto y trabajamos desde una sola unidad.',
    personalization: [
      { icon: 'shirt', label: 'Tu diseño estampado en la tela' },
      { icon: 'print', label: 'Archivos en PNG, SVG o boceto' },
      { icon: 'box', label: 'Pedidos desde 1 unidad' }
    ]
  },
  papeleria: {
    summary:
      'Tarjetas con acabado profesional para que tu marca cause una buena primera impresión.',
    features: [
      { icon: 'layers', label: 'Material de calidad' },
      { icon: 'print', label: 'Impresión a color' },
      { icon: 'sparkles', label: 'Acabado profesional' }
    ],
    detailExtra:
      'Envía tu logo y revisamos la muestra digital antes de imprimir.',
    personalization: [
      { icon: 'card', label: 'Diseño con la identidad de tu marca' },
      { icon: 'print', label: 'Tu logo en PNG o SVG' },
      { icon: 'sparkles', label: 'Revisión de la muestra antes de imprimir' }
    ]
  },
  identificacion: {
    summary:
      'Credenciales y lanyards resistentes para identificar a tu equipo con tu propio diseño.',
    features: [
      { icon: 'card', label: 'Material resistente' },
      { icon: 'print', label: 'Impresión full color' },
      { icon: 'quality', label: 'Listo para usar' }
    ],
    detailExtra:
      'Revisamos la muestra digital antes de imprimir para que el resultado quede como lo imaginas.',
    personalization: [
      { icon: 'card', label: 'Diseño con la identidad de tu marca' },
      { icon: 'color', label: 'Impresión a todo color' },
      { icon: 'sparkles', label: 'Revisión de la muestra antes de imprimir' }
    ]
  }
};

/** Descripción breve de cada ficha y, si hace falta, sus tres características. */
const detallesPorProducto = {
  'producto-tazas': {
    summary:
      'Diseños únicos para cada ocasión. Sorprende con una taza con tu estilo.',
    features: [
      { icon: 'cup', label: 'Cerámica de alta calidad' },
      { icon: 'palette', label: 'Diseños a tu medida' },
      { icon: 'gift', label: 'Ideal para regalar' }
    ]
  },
  'producto-tazas-magicas': {
    summary:
      'Un diseño que aparece con el calor. Un regalo original que sorprende.',
    features: [
      { icon: 'cup', label: 'Cerámica de calidad' },
      { icon: 'sparkles', label: 'Efecto con el calor' },
      { icon: 'gift', label: 'Ideal para regalar' }
    ]
  },
  'producto-botellas': {
    summary:
      'Botellas térmicas personalizadas para llevar tu diseño a todas partes.'
  },
  'producto-mousepads': {
    summary:
      'Superficie cómoda y estable, personalizada con el diseño que elijas.'
  },
  'producto-bolsas': {
    summary:
      'Bolsas de tela reutilizables con tu estampado, ideales para el día a día.'
  },
  'producto-relojes': {
    summary:
      'Relojes con correa y esfera personalizadas para un detalle distinto.'
  },
  'producto-chapas-mascotas': {
    summary: 'Chapas resistentes con el nombre o la cara de tu mascota.'
  },
  'producto-cuadros-piedra': {
    summary: 'Cuadros de piedra con acabado natural y tu diseño impreso.'
  },
  'producto-cuadros-fotos': {
    summary: 'Tus fotos favoritas enmarcadas y listas para colgar.'
  },
  'producto-cuadros-aluminio': {
    summary: 'Impresión sobre aluminio con un acabado moderno y resistente.'
  },
  'producto-polerones': {
    summary:
      'Polerones de algodón estampados a todo color, desde una sola unidad.',
    features: [
      { icon: 'shirt', label: 'Tela de algodón' },
      { icon: 'palette', label: 'Estampado full color' },
      { icon: 'box', label: 'Desde 1 unidad' }
    ]
  },
  'producto-estampado-1-color': {
    summary: 'Estampado a una tinta, limpio y definido, sobre la tela que elijas.'
  },
  'producto-estampado-2-colores': {
    summary: 'Dos tintas combinadas para dar más vida a tu diseño.'
  },
  'producto-estampado-3-colores': {
    summary: 'Tres tintas para estampados con más detalle y contraste.'
  },
  'producto-estampado-imagenes': {
    summary: 'Impresión a todo color para reproducir tus fotos y diseños.'
  },
  'producto-tarjetas-presentacion': {
    summary: 'Tarjetas impresas en papel grueso con el acabado de tu marca.'
  },
  'producto-tarjetas-pvc': {
    summary: 'Tarjetas de PVC resistentes y brillantes, ideales para el uso diario.'
  },
  'producto-lanyards': {
    summary: 'Lanyards estampados con mosquetón y portacredencial.'
  },
  'producto-credenciales': {
    summary: 'Credenciales impresas y protegidas, listas para tu equipo.'
  },
  'producto-credenciales-pvc': {
    summary: 'Credenciales rígidas de PVC con impresión a todo color.'
  }
};

/** Invitación a la consulta; el precio y los detalles se confirman por WhatsApp. */
const invitacion = {
  title: '¿Tienes una idea diferente?',
  text: 'Cuéntanos qué imaginas y revisamos tu diseño antes de imprimir.'
};

const categoriasPorSlug = new Map(
  catalogCategories.map((category) => [category.dataCategoria, category])
);

function getCategoryContent(product) {
  const categoryDetails = detallesPorCategoria[product.category];
  if (!categoryDetails) {
    throw new Error(
      `Falta el contenido de tarjeta para la categoría "${product.category}".`
    );
  }
  return categoryDetails;
}

function getProductContent(product) {
  const categoryDetails = getCategoryContent(product);
  const productDetails = detallesPorProducto[product.dataOdId] ?? {};

  return {
    summary:
      productDetails.summary ?? product.description ?? categoryDetails.summary,
    features: productDetails.features ?? categoryDetails.features
  };
}

/** Resumen y tres características de la tarjeta del catálogo. */
export function getCardDetails(product) {
  return getProductContent(product);
}

/**
 * Contenido de la ficha ampliada.
 *
 * La descripción es el resumen propio del producto más una frase de servicio
 * de su categoría. Las características técnicas son exactamente las tres
 * características ya aprobadas; si `catalogData` trae una descripción corta
 * (por ejemplo "Formato A4"), se añade como cuarta línea en lugar de
 * repetirla aquí. Los bloques sin datos se devuelven vacíos para que el
 * componente los omita.
 */
export function getProductDetail(product) {
  const category = categoriasPorSlug.get(product.category);
  if (!category) {
    throw new Error(
      `El producto "${product.dataOdId}" no pertenece a ninguna categoría.`
    );
  }

  const categoryDetails = getCategoryContent(product);
  const { summary, features } = getProductContent(product);
  const shortDescription =
    product.description && product.description.length <= 40
      ? product.description
      : null;

  return {
    categoryName: category.name,
    badge: product.badge ?? 'Personalizable',
    summary,
    description: `${summary} ${categoryDetails.detailExtra}`,
    personalization: categoryDetails.personalization,
    features,
    specs: [
      ...features.map((feature) => feature.label),
      ...(shortDescription ? [shortDescription] : [])
    ],
    invitation: invitacion
  };
}

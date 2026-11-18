/**
 * Contenido de apoyo de las tarjetas del catálogo.
 *
 * Vive fuera de `catalogData.js` a propósito: el modelo del catálogo conserva
 * nombres, categorías y fotos, y este módulo solo aporta la descripción breve
 * y las tres características visuales de cada ficha. Así el componente no
 * repite información de producto y el modelo no cambia.
 */

const detallesPorCategoria = {
  regalos: {
    summary:
      'Detalles personalizados que se recuerdan. Elige tu diseño y lo preparamos para regalar.',
    features: [
      { icon: 'quality', label: 'Material de calidad' },
      { icon: 'palette', label: 'Diseño a tu medida' },
      { icon: 'gift', label: 'Ideal para regalar' }
    ]
  },
  cuadros: {
    summary:
      'Tus fotos y diseños impresos con nitidez, listos para dar vida a cualquier pared.',
    features: [
      { icon: 'print', label: 'Impresión de alta calidad' },
      { icon: 'ruler', label: 'Medidas a tu elección' },
      { icon: 'frame', label: 'Listo para colgar' }
    ]
  },
  textiles: {
    summary:
      'Tu diseño estampado en telas suaves y resistentes, desde una sola unidad.',
    features: [
      { icon: 'shirt', label: 'Tela de algodón' },
      { icon: 'color', label: 'Color duradero' },
      { icon: 'box', label: 'Desde 1 unidad' }
    ]
  },
  papeleria: {
    summary:
      'Tarjetas con acabado profesional para que tu marca cause una buena primera impresión.',
    features: [
      { icon: 'layers', label: 'Material de calidad' },
      { icon: 'print', label: 'Impresión a color' },
      { icon: 'sparkles', label: 'Acabado profesional' }
    ]
  },
  identificacion: {
    summary:
      'Credenciales y lanyards resistentes para identificar a tu equipo con tu propio diseño.',
    features: [
      { icon: 'card', label: 'Material resistente' },
      { icon: 'print', label: 'Impresión full color' },
      { icon: 'quality', label: 'Listo para usar' }
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

export function getCardDetails(product) {
  const categoryDetails = detallesPorCategoria[product.category];
  if (!categoryDetails) {
    throw new Error(
      `Falta el contenido de tarjeta para la categoría "${product.category}".`
    );
  }

  const productDetails = detallesPorProducto[product.dataOdId] ?? {};

  return {
    summary:
      productDetails.summary ?? product.description ?? categoryDetails.summary,
    features: productDetails.features ?? categoryDetails.features
  };
}

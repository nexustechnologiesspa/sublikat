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
    features: [
      { icon: 'quality', label: 'Material de calidad' },
      { icon: 'palette', label: 'Diseño a su medida' },
      { icon: 'gift', label: 'Ideal para regalar' }
    ],
    detailExtra:
      'Aceptamos pedidos desde una sola unidad y revisamos la muestra con usted antes de imprimir.',
    personalization: [
      { icon: 'palette', label: 'Su diseño, foto o ilustración' },
      { icon: 'box', label: 'Pedidos desde 1 unidad' }
    ]
  },
  cuadros: {
    features: [
      { icon: 'print', label: 'Impresión de alta calidad' },
      { icon: 'palette', label: 'Su foto o diseño' },
      { icon: 'frame', label: 'Listo para colgar' }
    ],
    detailExtra:
      'Envíenos su archivo y revisamos una muestra digital antes de imprimir.',
    personalization: [
      { icon: 'frame', label: 'Sus fotos y diseños impresos' },
      { icon: 'print', label: 'Archivos en PNG, SVG o boceto' }
    ]
  },
  textiles: {
    features: [
      { icon: 'shirt', label: 'Tela de algodón' },
      { icon: 'color', label: 'Color duradero' },
      { icon: 'box', label: 'Desde 1 unidad' }
    ],
    detailExtra:
      'Aceptamos PNG, SVG o boceto y trabajamos desde una sola unidad.',
    personalization: [
      { icon: 'shirt', label: 'Su diseño estampado en la tela' },
      { icon: 'print', label: 'Archivos en PNG, SVG o boceto' },
      { icon: 'box', label: 'Pedidos desde 1 unidad' }
    ]
  },
  papeleria: {
    features: [
      { icon: 'layers', label: 'Material de calidad' },
      { icon: 'print', label: 'Impresión a color' },
      { icon: 'sparkles', label: 'Acabado profesional' }
    ],
    detailExtra:
      'Envíenos su logo y revisamos la muestra digital antes de imprimir.',
    personalization: [
      { icon: 'card', label: 'Diseño con la identidad de su marca' },
      { icon: 'print', label: 'Su logo en PNG o SVG' }
    ]
  },
  identificacion: {
    features: [
      { icon: 'card', label: 'Material resistente' },
      { icon: 'print', label: 'Impresión a todo color' },
      { icon: 'quality', label: 'Listo para usar' }
    ],
    detailExtra:
      'Revisamos la muestra digital antes de imprimir para que el resultado quede como usted lo imagina.',
    personalization: [
      { icon: 'card', label: 'Diseño con la identidad de su marca' },
      { icon: 'color', label: 'Impresión a todo color' }
    ]
  }
};

/** Descripción breve de cada ficha y, si hace falta, sus tres características. */
const detallesPorProducto = {
  'producto-tazas': {
    summary:
      'Taza de cerámica con su diseño, foto o logo. Un regalo personal o un detalle para su equipo.',
    features: [
      { icon: 'cup', label: 'Cerámica de alta calidad' },
      { icon: 'palette', label: 'Su diseño, foto o logo' },
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
      'Botellas térmicas personalizadas para llevar su diseño a todas partes.'
  },
  'producto-mousepads': {
    summary:
      'Superficie cómoda y estable, personalizada con el diseño que usted elija.'
  },
  'producto-bolsas': {
    summary:
      'Bolsas de tela reutilizables con su estampado, ideales para el día a día.'
  },
  'producto-relojes': {
    summary:
      'Relojes con correa y esfera personalizadas para un detalle distinto.'
  },
  'producto-chapas-mascotas': {
    summary: 'Chapas resistentes con el nombre o la cara de su mascota.'
  },
  'producto-cuadros-piedra': {
    summary: 'Cuadros de piedra con acabado natural y su diseño impreso.'
  },
  'producto-cuadros-fotos': {
    summary: 'Sus fotos favoritas impresas en formatos de A6 a A3.'
  },
  'producto-cuadros-aluminio': {
    summary: 'Impresión sobre aluminio con un acabado moderno y resistente.'
  },
  'producto-polerones': {
    summary:
      'Polerones de algodón estampados a todo color, desde una sola unidad.',
    features: [
      { icon: 'shirt', label: 'Tela de algodón' },
      { icon: 'palette', label: 'Estampado a todo color' },
      { icon: 'box', label: 'Desde 1 unidad' }
    ]
  },
  'producto-estampado-1-color': {
    summary: 'Estampado a una tinta, limpio y definido, sobre la tela que usted elija.'
  },
  'producto-estampado-2-colores': {
    summary: 'Dos tintas combinadas para dar más vida a su diseño.'
  },
  'producto-estampado-3-colores': {
    summary: 'Tres tintas para estampados con más detalle y contraste.'
  },
  'producto-estampado-imagenes': {
    summary: 'Impresión a todo color para reproducir sus fotos y diseños.'
  },
  'producto-tarjetas-presentacion': {
    summary: 'Tarjetas impresas en papel grueso con el acabado de su marca.'
  },
  'producto-tarjetas-pvc': {
    summary: 'Tarjetas de PVC resistentes y brillantes, ideales para el uso diario.'
  },
  'producto-lanyards': {
    summary: 'Lanyards estampados con mosquetón y portacredencial.'
  },
  'producto-credenciales': {
    summary: 'Credenciales impresas y protegidas, listas para su equipo.'
  },
  'producto-credenciales-pvc': {
    summary: 'Credenciales rígidas de PVC con impresión a todo color.'
  }
};

/** Invitación a la consulta; el precio y los detalles se confirman por WhatsApp. */
const invitacion = {
  title: '¿Tiene una idea distinta?',
  text: 'Cuéntenos qué necesita y le decimos cómo hacerlo.'
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
      productDetails.summary ?? product.description ?? '',
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

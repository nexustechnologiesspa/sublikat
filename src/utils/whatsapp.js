/** Número del taller en formato internacional, sin signos ni espacios. */
export const WHATSAPP_NUMBER = '56949400253';

/** El mismo número, tal como se muestra en la página. */
export const WHATSAPP_DISPLAY = '+56 9 4940 0253';

export function whatsappLink(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/** Mensaje general: botón flotante, tarjeta de contacto y pie. */
export const generalQuoteLink = whatsappLink(
  'Hola Sublikat, quiero cotizar un producto personalizado.'
);

/** Mensaje de las tarjetas y la ficha ampliada: nombra el producto. */
export function productQuoteLink(productName) {
  return whatsappLink(
    `Hola Sublikat, quiero cotizar: ${productName}. ¿Me pueden ayudar?`
  );
}

/** La ficha ampliada usa el mismo mensaje que la tarjeta. */
export const productDetailLink = productQuoteLink;

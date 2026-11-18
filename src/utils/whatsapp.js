/** Número del taller en formato internacional, sin signos ni espacios. */
export const WHATSAPP_NUMBER = '56949409253';

export function whatsappLink(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function productQuoteLink(productName) {
  return whatsappLink(
    `Hola Sublikat, quiero cotizar ${productName}. ¿Me pueden ayudar?`
  );
}

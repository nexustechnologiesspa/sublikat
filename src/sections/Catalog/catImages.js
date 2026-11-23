/**
 * Imagen del gato de Sublikat presentando cada producto (mockup).
 *
 * Los maestros viven en `assets/gato/catalogo/<producto>.jpg` y se publican las
 * variantes `-480` y `-960` en WebP. La tarjeta muestra al gato con el producto
 * y, al pasar el mouse o enfocar la tarjeta, deja ver la foto real del producto.
 * Si un producto aún no tiene imagen del gato, la tarjeta muestra solo la foto.
 */
const webp480 = import.meta.glob('../../../assets/gato/catalogo/*-480.webp', {
  eager: true,
  import: 'default'
});
const webp960 = import.meta.glob('../../../assets/gato/catalogo/*-960.webp', {
  eager: true,
  import: 'default'
});

const porNombre = new Map();
const registrar = (modulos, clave) => {
  for (const [ruta, url] of Object.entries(modulos)) {
    const nombre = ruta.split('/').pop().replace(/-\d+\.webp$/, '');
    if (!porNombre.has(nombre)) porNombre.set(nombre, {});
    porNombre.get(nombre)[clave] = url;
  }
};
registrar(webp480, 'w480');
registrar(webp960, 'w960');

export function getCatImage(product) {
  const nombre = product.dataOdId.replace(/^producto-/, '');
  const fotos = porNombre.get(nombre);
  if (!fotos?.w480 || !fotos?.w960) return null;
  return {
    alt: `El gato de Sublikat presentando ${product.name.toLowerCase()}`,
    webp: `${fotos.w480} 480w, ${fotos.w960} 960w`,
    fallback: fotos.w960
  };
}

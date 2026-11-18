import { useRef, useState } from 'react';
import { ProductIcon } from './ProductIcons.jsx';
import { productGallerySizes } from './productImages.js';

/**
 * Galería de la ficha ampliada: foto principal y, solo cuando hay más de una
 * fotografía real, la fila de miniaturas con su estado seleccionado.
 */
export default function ProductGallery({ photos, name, svgKey, idPrefix }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const thumbRefs = useRef([]);
  const canSwitch = photos.length > 1;
  const active = photos[activeIndex] ?? photos[0] ?? null;

  if (!active) {
    return (
      <div className="product-gallery product-gallery--empty">
        <ProductIcon svgKey={svgKey} />
      </div>
    );
  }

  const handleThumbKeyDown = (index, event) => {
    if (!canSwitch) return;

    let next = null;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      next = (index + 1) % photos.length;
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      next = (index - 1 + photos.length) % photos.length;
    } else if (event.key === 'Home') {
      next = 0;
    } else if (event.key === 'End') {
      next = photos.length - 1;
    }
    if (next === null) return;

    event.preventDefault();
    setActiveIndex(next);
    thumbRefs.current[next]?.focus();
  };

  return (
    <div className="product-gallery">
      <div className="product-gallery__stage">
        <picture key={active.fallback}>
          <source type="image/avif" srcSet={active.avif} sizes={productGallerySizes} />
          <source type="image/webp" srcSet={active.webp} sizes={productGallerySizes} />
          <img
            src={active.fallback}
            alt={active.alt}
            width="960"
            height="960"
            decoding="async"
          />
        </picture>
      </div>

      {canSwitch && (
        <div
          className="product-gallery__thumbs"
          role="group"
          aria-label={`Fotografías de ${name}`}
        >
          {photos.map((photo, index) => (
            <button
              key={photo.fallback}
              type="button"
              ref={(element) => {
                thumbRefs.current[index] = element;
              }}
              className="product-gallery__thumb"
              aria-pressed={index === activeIndex}
              aria-label={`Ver foto ${index + 1} de ${photos.length}: ${photo.alt}`}
              onClick={() => setActiveIndex(index)}
              onKeyDown={(event) => handleThumbKeyDown(index, event)}
            >
              <img
                src={photo.thumb ?? photo.fallback}
                alt=""
                width="480"
                height="480"
                loading="lazy"
                decoding="async"
              />
            </button>
          ))}
        </div>
      )}

      <p
        className="sr-only"
        id={`${idPrefix}-galeria-estado`}
        aria-live="polite"
      >
        {canSwitch
          ? `Foto ${activeIndex + 1} de ${photos.length} de ${name}.`
          : `Fotografía de ${name}.`}
      </p>
    </div>
  );
}

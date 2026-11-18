import { CardIcon, WhatsAppGlyph } from './CardIcons.jsx';
import { ProductIcon } from './ProductIcons.jsx';
import { getCardDetails } from './productDetails.js';
import { productImages, productImageSizes } from './productImages.js';
import { productQuoteLink } from '../../utils/whatsapp.js';

export default function ProductCard({ product, onOpen }) {
  const photo = productImages[product.dataOdId];
  const { summary, features } = getCardDetails(product);
  const badge = product.badge ?? 'Personalizable';
  const titleId = `${product.dataOdId}-titulo`;

  return (
    <article
      className={product.hasOdReveal ? 'product-card od-reveal' : 'product-card'}
      data-od-id={product.dataOdId}
      aria-labelledby={titleId}
    >
      {/* Toda la tarjeta abre la ficha ampliada. Es un botón real para que
          funcione con teclado y lectores de pantalla; la acción de WhatsApp
          queda por encima y conserva su propio enlace. */}
      <button
        type="button"
        className="product-card__open"
        aria-label={`Ver ficha de ${product.name}`}
        onClick={(event) => onOpen?.(product, event.currentTarget)}
      />

      <div className="product-card__media">
        {photo ? (
          <picture>
            <source type="image/avif" srcSet={photo.avif} sizes={productImageSizes} />
            <source type="image/webp" srcSet={photo.webp} sizes={productImageSizes} />
            <img
              src={photo.fallback}
              alt={photo.alt}
              width="960"
              height="960"
              loading="lazy"
              decoding="async"
            />
          </picture>
        ) : (
          <ProductIcon svgKey={product.svgKey} />
        )}
        <span className="product-card__badge">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path
              d="m12 3 2.6 6.1 6.6.6-5 4.3 1.5 6.5L12 17.2 6.3 20.5l1.5-6.5-5-4.3 6.6-.6L12 3Z"
              fill="currentColor"
            />
          </svg>
          {badge}
        </span>
      </div>

      <div className="product-card__body">
        <h4 className="product-card__title" id={titleId}>
          {product.name}
        </h4>
        <p className="product-card__desc">{summary}</p>
        <hr className="product-card__rule" />
        <ul
          className="product-card__features"
          aria-label={`Características de ${product.name}`}
        >
          {features.map((feature) => (
            <li className="product-card__feature" key={feature.label}>
              <CardIcon name={feature.icon} />
              <span>{feature.label}</span>
            </li>
          ))}
        </ul>
        <a
          className="product-card__cta"
          href={productQuoteLink(product.name)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Cotizar ${product.name} por WhatsApp`}
        >
          <WhatsAppGlyph className="product-card__cta-icon" />
          <span className="product-card__cta-label">Cotizar por WhatsApp</span>
          <svg
            className="product-card__cta-arrow"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
          >
            <path d="m9 6 6 6-6 6" />
          </svg>
        </a>
      </div>
    </article>
  );
}

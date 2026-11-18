import { CardIcon } from './CardIcons.jsx';
import { ProductIcon } from './ProductIcons.jsx';
import { getCardDetails } from './productDetails.js';
import { productImages, productImageSizes } from './productImages.js';
import { productQuoteLink } from '../../utils/whatsapp.js';

function WhatsAppGlyph() {
  return (
    <svg
      className="product-card__cta-icon"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Z" />
      <path d="M17.5 14.4c-.3-.15-1.7-.84-2-.94-.27-.1-.46-.15-.65.15-.19.3-.75.94-.92 1.13-.17.2-.34.22-.63.08-.29-.15-1.23-.45-2.34-1.44-.86-.77-1.44-1.72-1.61-2.01-.17-.29-.02-.45.13-.6.13-.13.29-.34.44-.51.15-.17.2-.29.29-.48.1-.2.05-.36-.03-.51-.07-.15-.65-1.57-.89-2.15-.24-.56-.48-.49-.65-.5h-.56c-.2 0-.51.07-.78.36-.26.3-1.02.99-1.02 2.42s1.04 2.81 1.19 3c.15.2 2.05 3.13 4.96 4.39.69.3 1.23.48 1.65.61.7.22 1.33.19 1.83.12.56-.09 1.72-.7 1.96-1.38.24-.68.24-1.26.17-1.38-.07-.12-.26-.2-.55-.35Z" />
    </svg>
  );
}

export default function ProductCard({ product }) {
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
          <WhatsAppGlyph />
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

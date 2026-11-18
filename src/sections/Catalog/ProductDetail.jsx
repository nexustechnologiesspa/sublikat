import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { WhatsAppGlyph } from './CardIcons.jsx';
import ProductFeatures from './ProductFeatures.jsx';
import ProductGallery from './ProductGallery.jsx';
import { getProductDetail } from './productDetails.js';
import { getProductPhotos } from './productImages.js';
import { productDetailLink } from '../../utils/whatsapp.js';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Ficha ampliada de un producto del catálogo.
 *
 * Se monta en un portal sobre `<body>` para que ningún contenedor con
 * `transform` o `overflow` recorte el modal. Mientras está abierta bloquea el
 * desplazamiento del fondo, atrapa el foco y lo devuelve a la tarjeta que la
 * abrió al cerrarse.
 */
export default function ProductDetail({ product, onClose, returnFocusTo }) {
  const detail = getProductDetail(product);
  const photos = getProductPhotos(product);
  const dialogRef = useRef(null);
  const pointerDownOnBackdrop = useRef(false);
  const titleId = `${product.dataOdId}-ficha-titulo`;
  const descId = `${product.dataOdId}-ficha-desc`;
  const idPrefix = `${product.dataOdId}-ficha`;

  useEffect(() => {
    const html = document.documentElement;
    const scrollbarWidth = window.innerWidth - html.clientWidth;
    const previousOverflow = html.style.overflow;
    const previousPadding = html.style.paddingRight;
    const opener =
      returnFocusTo?.current ?? (document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null);

    html.classList.add('product-detail-open');
    html.style.overflow = 'hidden';
    if (scrollbarWidth > 0) html.style.paddingRight = `${scrollbarWidth}px`;

    dialogRef.current?.focus({ preventScroll: true });

    return () => {
      html.classList.remove('product-detail-open');
      html.style.overflow = previousOverflow;
      html.style.paddingRight = previousPadding;
      opener?.focus({ preventScroll: true });
    };
  }, [returnFocusTo]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;

      const dialog = dialogRef.current;
      if (!dialog) return;

      const focusable = Array.from(dialog.querySelectorAll(FOCUSABLE)).filter(
        (element) => element.offsetParent !== null
      );

      if (focusable.length === 0) {
        event.preventDefault();
        dialog.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (!dialog.contains(active)) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handlePointerDown = (event) => {
    pointerDownOnBackdrop.current = event.target === event.currentTarget;
  };

  const handleClick = (event) => {
    if (pointerDownOnBackdrop.current && event.target === event.currentTarget) {
      onClose();
    }
    pointerDownOnBackdrop.current = false;
  };

  return createPortal(
    <div
      className="product-detail"
      onMouseDown={handlePointerDown}
      onClick={handleClick}
    >
      <div
        className="product-detail__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        tabIndex={-1}
        ref={dialogRef}
      >
        <button
          type="button"
          className="product-detail__close"
          onClick={onClose}
          aria-label={`Cerrar ficha de ${product.name}`}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
            aria-hidden="true"
            focusable="false"
          >
            <path d="m6 6 12 12M18 6 6 18" />
          </svg>
        </button>

        <div className="product-detail__body">
          <div className="product-detail__media">
            <ProductGallery
              photos={photos}
              name={product.name}
              svgKey={product.svgKey}
              idPrefix={idPrefix}
            />
          </div>

          <div className="product-detail__content">
            <p className="product-detail__category">{detail.categoryName}</p>

            <div className="product-detail__titles">
              <h2 className="product-detail__title" id={titleId}>
                {product.name}
              </h2>
              <span className="product-detail__badge">{detail.badge}</span>
            </div>

            <p className="product-detail__desc" id={descId}>
              {detail.description}
            </p>

            <ProductFeatures
              idPrefix={idPrefix}
              personalization={detail.personalization}
              specs={detail.specs}
              invitation={detail.invitation}
            />

            <div className="product-detail__footer">
              <a
                className="product-detail__cta"
                href={productDetailLink(product.name)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Cotizar ${product.name} por WhatsApp`}
              >
                <WhatsAppGlyph className="product-detail__cta-icon" />
                <span className="product-detail__cta-label">
                  Cotizar por WhatsApp
                </span>
                <svg
                  className="product-detail__cta-arrow"
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
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

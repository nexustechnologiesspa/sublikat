import { ProductIcon } from './ProductIcons.jsx';

const cardClasses =
  'bg-surface ink-border-thick rounded-sticker shadow-offset p-5 flex flex-col justify-between group hover:translate-y-[-2px] transition-transform';
const quoteLinkClasses =
  'mt-4 w-full min-h-[48px] px-4 inline-flex items-center justify-center gap-2 rounded-sticker ink-border-thick bg-transparent tx-ink font-extrabold text-sm hover:bg-soft focus:outline-none focus:ring-4 focus:ring-[var(--focus)] transition-colors';

export default function ProductCard({ product }) {
  const titleClasses = product.badge
    ? 'font-display text-2xl tx-ink leading-snug mt-2'
    : 'font-display text-2xl tx-ink leading-snug mt-4';
  const descriptionClasses = product.badge
    ? 'text-xs tx-muted font-semibold leading-snug mt-1'
    : 'text-sm tx-muted mt-1 font-semibold';

  return (
    <article
      className={product.hasOdReveal ? `${cardClasses} od-reveal` : cardClasses}
      data-od-id={product.dataOdId}
    >
      <div>
        <div className="relative w-full aspect-square ink-border rounded-sticker overflow-hidden bg-soft flex items-center justify-center">
          <ProductIcon svgKey={product.svgKey} />
        </div>
        {product.badge && (
          <div className="inline-flex items-center gap-1.5 bg-accent tx-onfill rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider mt-3">
            {product.badge}
          </div>
        )}
        <h4 className={titleClasses}>{product.name}</h4>
        {product.description && (
          <p className={descriptionClasses}>{product.description}</p>
        )}
      </div>
      <a
        href="#contacto"
        data-producto={product.dataProducto}
        className={quoteLinkClasses}
      >
        Cotizar
      </a>
    </article>
  );
}

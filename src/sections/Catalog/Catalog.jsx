import ProductCard from './ProductCard.jsx';
import { catalogCategories, catalogProducts } from './catalogData.js';

export default function Catalog() {
  return (
    <section
      aria-labelledby="heading-catalogo"
      className="space-y-8"
      id="tienda"
      data-od-id="catalogo-productos"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface ink-border-sm rounded-full text-xs font-bold uppercase tracking-wider tx-ink mb-2 shadow-offset-sm">
            <span className="w-2 h-2 rounded-full bg-accent inline-block"></span>
            Catálogo del taller
          </div>
          <h2
            id="heading-catalogo"
            className="font-display text-4xl md:text-5xl tx-ink leading-tight"
          >
            20 productos en 5 categorías
          </h2>
          <p className="text-base tx-ink font-semibold mt-1 max-w-2xl">
            Cada ficha muestra el tipo de producto y abre su cotización con el nombre ya escrito. El precio y la fotografía de cada producto se incorporan al confirmar la línea definitiva.
          </p>
        </div>
        <div className="bg-surface ink-border rounded-sticker px-3 py-2 text-xs font-bold tx-ink flex items-center gap-2 shadow-offset-sm self-start md:self-auto">
          <span className="bg-accent tx-onfill px-2 py-0.5 rounded text-[10px] uppercase font-black">
            Ejemplo
          </span>
          <span>Lista de productos del taller</span>
        </div>
      </div>

      <nav
        role="tablist"
        aria-label="Categorías del catálogo"
        className="bg-surface ink-border rounded-sticker shadow-offset-sm p-2 flex gap-2 overflow-x-auto od-tablist"
      >
        {catalogCategories.map((category) => {
          const isInitialTab = category.order === 1;

          return (
            <button
              key={category.dataCategoria}
              type="button"
              role="tab"
              id={category.tabId}
              aria-controls={category.panelId}
              aria-selected={isInitialTab}
              tabIndex={isInitialTab ? 0 : -1}
              data-categoria={category.dataCategoria}
              className="cat-tab"
            >
              {category.name}{' '}
              <span className="text-[11px] font-black">{category.productCount}</span>
            </button>
          );
        })}
      </nav>

      {catalogCategories.map((category) => (
        <section
          key={category.dataCategoria}
          id={category.panelId}
          role="tabpanel"
          aria-labelledby={category.tabId}
          data-od-id={category.panelId}
          className="space-y-4 scroll-mt-24"
          hidden={category.order !== 1}
        >
          <div className="flex flex-wrap items-baseline gap-3">
            <h3 className="font-display text-3xl tx-ink">{category.name}</h3>
            <span className="text-xs font-bold tx-muted uppercase tracking-wider">
              {category.productCount} productos
            </span>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {catalogProducts
              .filter((product) => product.category === category.dataCategoria)
              .map((product) => (
                <ProductCard key={product.dataOdId} product={product} />
              ))}
          </div>
        </section>
      ))}
    </section>
  );
}

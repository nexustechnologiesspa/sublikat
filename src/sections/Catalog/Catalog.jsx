import { useEffect, useRef, useState } from 'react';
import ProductCard from './ProductCard.jsx';
import { catalogCategories, catalogProducts } from './catalogData.js';

const categoryStorageKey = 'sublikat-categoria';
const defaultCategory = catalogCategories[0].dataCategoria;

function getCategoryFromHash(hash) {
  const panelId = (hash || '').replace('#', '');
  return catalogCategories.find((category) => category.panelId === panelId);
}

function getInitialActiveCategory() {
  if (typeof window === 'undefined') return defaultCategory;

  const hashCategory = getCategoryFromHash(window.location.hash);
  if (hashCategory) return hashCategory.dataCategoria;

  try {
    const storedCategory = window.localStorage.getItem(categoryStorageKey);
    const category = catalogCategories.find(
      (item) => item.dataCategoria === storedCategory
    );
    if (category) return category.dataCategoria;
  } catch {
    // Keep the default category when storage is unavailable.
  }

  return defaultCategory;
}

function persistActiveCategory(dataCategoria) {
  try {
    window.localStorage.setItem(categoryStorageKey, dataCategoria);
  } catch {
    // Category changes still work when storage is unavailable.
  }
}

function getTablistCeiling() {
  const tablist = document.querySelector('.od-tablist');
  if (!tablist) return 0;
  const stickyTop = parseFloat(window.getComputedStyle(tablist).top);
  return (Number.isNaN(stickyTop) ? 0 : stickyTop) + tablist.offsetHeight + 12;
}

export default function Catalog() {
  const [activeCategory, setActiveCategory] = useState(getInitialActiveCategory);
  const initialActiveCategory = useRef(activeCategory);
  const alignmentFrame = useRef(null);
  const alignmentCleanup = useRef(null);
  const quoteFocusFrame = useRef(null);

  const cancelPendingAlignment = () => {
    if (alignmentFrame.current !== null) {
      window.cancelAnimationFrame(alignmentFrame.current);
      alignmentFrame.current = null;
    }
    if (alignmentCleanup.current) {
      alignmentCleanup.current();
    }
  };

  const alignPanel = (panel) => {
    if (!panel) return;

    const ceiling = getTablistCeiling();
    const panelTop = panel.getBoundingClientRect().top;
    if (panelTop >= ceiling - 1) return;

    let smooth = true;
    try {
      smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch {
      // Preserve the original smooth-scroll fallback.
    }

    window.scrollTo({
      top: Math.max(0, window.pageYOffset + panelTop - ceiling),
      behavior: smooth ? 'smooth' : 'auto'
    });

    let timeoutId = null;
    let corrected = false;
    const cleanupCorrection = () => {
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
        timeoutId = null;
      }
      window.removeEventListener('scrollend', adjustCorrection);
      if (alignmentCleanup.current === cleanupCorrection) {
        alignmentCleanup.current = null;
      }
    };
    const adjustCorrection = () => {
      if (corrected) return;
      corrected = true;
      cleanupCorrection();
      if (!panel.isConnected) return;

      const offset = panel.getBoundingClientRect().top - getTablistCeiling();
      if (Math.abs(offset) > 2) {
        window.scrollBy({ top: offset, behavior: 'auto' });
      }
    };

    alignmentCleanup.current = cleanupCorrection;
    if (smooth) {
      window.addEventListener('scrollend', adjustCorrection, { once: true });
    }
    timeoutId = window.setTimeout(adjustCorrection, smooth ? 900 : 60);
  };

  const schedulePanelAlignment = (panelId) => {
    cancelPendingAlignment();
    alignmentFrame.current = window.requestAnimationFrame(() => {
      alignmentFrame.current = null;
      alignPanel(document.getElementById(panelId));
    });
  };

  const selectCategory = (category) => {
    setActiveCategory(category.dataCategoria);
    persistActiveCategory(category.dataCategoria);
  };

  const handleTabClick = (category, event) => {
    selectCategory(category);
    schedulePanelAlignment(category.panelId);

    const tab = event.currentTarget;
    const tablist = tab.parentNode;
    tablist.scrollTo({
      left: tab.offsetLeft - (tablist.clientWidth - tab.offsetWidth) / 2,
      behavior: 'smooth'
    });
  };

  const handleTabKeyDown = (index, event) => {
    let destination = null;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      destination = (index + 1) % catalogCategories.length;
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      destination = (index - 1 + catalogCategories.length) % catalogCategories.length;
    } else if (event.key === 'Home') {
      destination = 0;
    } else if (event.key === 'End') {
      destination = catalogCategories.length - 1;
    }
    if (destination === null) return;

    event.preventDefault();
    const category = catalogCategories[destination];
    selectCategory(category);
    document.getElementById(category.tabId)?.focus();
    schedulePanelAlignment(category.panelId);
  };

  const handleProductQuote = (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const link = target.closest('a[data-producto]');
    if (!link || !event.currentTarget.contains(link)) return;

    const productName = link.getAttribute('data-producto');
    const message = document.getElementById('contacto-mensaje');
    if (productName === null || !message) return;

    if (message.value.trim() === '') {
      message.value = `Consulta sobre: ${productName}\n`;
    }
    message.focus();
    if (quoteFocusFrame.current !== null) {
      window.cancelAnimationFrame(quoteFocusFrame.current);
    }
    quoteFocusFrame.current = window.requestAnimationFrame(() => {
      quoteFocusFrame.current = null;
      if (message.isConnected) message.focus();
    });
  };

  useEffect(() => {
    const activateFromHash = () => {
      const category = getCategoryFromHash(window.location.hash);
      if (!category) return;
      setActiveCategory(category.dataCategoria);
      persistActiveCategory(category.dataCategoria);
    };

    persistActiveCategory(initialActiveCategory.current);
    activateFromHash();
    window.addEventListener('hashchange', activateFromHash);
    return () => window.removeEventListener('hashchange', activateFromHash);
  }, []);

  useEffect(
    () => () => {
      cancelPendingAlignment();
      if (quoteFocusFrame.current !== null) {
        window.cancelAnimationFrame(quoteFocusFrame.current);
      }
    },
    []
  );

  return (
    <section
      aria-labelledby="heading-catalogo"
      className="space-y-8"
      id="tienda"
      data-od-id="catalogo-productos"
      onClick={handleProductQuote}
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
          const isActive = category.dataCategoria === activeCategory;

          return (
            <button
              key={category.dataCategoria}
              type="button"
              role="tab"
              id={category.tabId}
              aria-controls={category.panelId}
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              data-categoria={category.dataCategoria}
              className="cat-tab"
              onClick={(event) => handleTabClick(category, event)}
              onKeyDown={(event) =>
                handleTabKeyDown(category.order - 1, event)
              }
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
          hidden={category.dataCategoria !== activeCategory}
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

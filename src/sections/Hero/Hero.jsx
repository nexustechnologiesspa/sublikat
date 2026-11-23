export default function Hero() {
  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2.5 bg-awning tx-awningink px-4 py-2 sticker-tag text-xs sm:text-sm font-semibold od-parallax">
          <span className="w-2.5 h-2.5 rounded-full bg-inkfill inline-block animate-pulse" />
          <span>Taller de sublimación y estampados en Maipú, Santiago</span>
        </div>
      </div>

      <div className="bg-surface sticker-border sticker-shadow-lg p-6 sm:p-10 lg:p-12 relative overflow-hidden od-hero">
        <div className="absolute -top-10 -right-10 w-24 h-24 bg-awning opacity-60 rotate-45 pointer-events-none od-hero__deco" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 od-hero__body">
            <h1 className="font-display text-4xl sm:text-5xl lg:text-[62px] leading-[1.08] tx-ink tracking-tight od-hero__title">
              Polerones y productos personalizados a su medida
            </h1>

            <p className="tx-ink text-base sm:text-lg leading-relaxed max-w-xl font-semibold opacity-95 od-hero__lead">
              Estampamos su diseño en polerones, tazas, cuadros y artículos
              corporativos. Desde un regalo de una unidad hasta el pedido
              completo de su empresa.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 od-hero__ctas">
              <a
                href="#tienda"
                data-od-id="cta-ver-productos"
                className="h-[48px] min-w-[170px] px-7 bg-accent tx-onfill border border-transparent sticker-shadow-md font-semibold text-base flex items-center justify-center gap-2.5 transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--focus)]"
                role="button"
              >
                <span>Explorar productos</span>
                <svg
                  className="w-5 h-5 fill-none stroke-current"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </a>

              <a
                href="#contacto"
                className="h-[48px] min-w-[170px] px-6 bg-surface tx-ink sticker-border sticker-shadow-md font-semibold text-base flex items-center justify-center gap-2 hover-bg-soft transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--focus)]"
                role="button"
              >
                <svg
                  className="w-5 h-5 tx-ink"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  viewBox="0 0 24 24"
                >
                  <rect x="4" y="3" width="16" height="6" rx="2" />
                  <path d="M12 9v4M8 13h8v2a2 2 0 01-2 2h-4a2 2 0 01-2-2v-2zM12 17v4" />
                </svg>
                <span>Solicitar cotización</span>
              </a>
            </div>

            <div className="pt-2 flex items-center gap-2 text-xs tx-muted od-hero__note">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-awning tx-awningink font-semibold text-[11px] border bd-ink">
                ✓
              </span>
              <span>
                Aceptamos pedidos desde 1 unidad, con muestra antes de imprimir.
              </span>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center od-hero__media-col">
            <div className="relative w-full max-w-[420px] aspect-square">
              <div className="absolute -top-4 -right-3 sm:-right-4 z-20 bg-awning tx-awningink px-4 py-1.5 font-body text-[.72rem] font-semibold border bd-ink rounded-full select-none flex items-center gap-1.5 od-hero__tape">
                <span>Con su diseño</span>
              </div>

              <div className="w-full h-full bg-surface sticker-border sticker-shadow-lg p-2.5 sm:p-3 flex flex-col od-hero__media">
                <div className="w-full h-full sticker-border overflow-hidden relative bg-soft">
                  <img
                    src="assets/stock/camiseta-cats.jpg"
                    alt="Camiseta estampada con una ilustración de gato"
                    className="w-full h-full object-cover object-center"
                    loading="eager"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

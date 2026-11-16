export default function WorkshopNotice() {
  return (
    <section
      id="aviso-taller"
      data-od-id="aviso-taller"
      aria-label="Aviso de taller"
      className="relative"
    >
      <div className="bg-awning ink-border-thick rounded-sticker shadow-offset py-3 px-6 flex items-center justify-between flex-wrap gap-4 overflow-hidden">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-surface ink-border-sm tx-ink" aria-hidden="true">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M13 2 4.5 13.5H11l-1 8.5 8.5-11.5H12l1-8.5Z" />
            </svg>
          </span>
          <p className="font-extrabold tx-ink text-base md:text-lg tracking-wide">
            ¡Piezas listas para envío inmediato y personalizaciones en caliente,
            sin pedido mínimo!
          </p>
        </div>
        <div className="bg-surface tx-ink text-xs font-black uppercase px-3 py-1.5 rounded-sticker ink-border-sm tracking-wider">
          • Lote de prueba artesanal •
        </div>
      </div>
    </section>
  );
}

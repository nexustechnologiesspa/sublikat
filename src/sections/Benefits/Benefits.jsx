export default function Benefits() {
  return (
    <section
      id="beneficios"
      data-od-id="beneficios-taller"
      aria-label="Ventajas del taller"
    >
      <div className="pin-vista">
        <div className="pin-intro">
          <h2 className="font-display text-3xl md:text-4xl tx-ink leading-tight">
            Ventajas del taller
          </h2>
          <p className="pin-intro__hint" aria-hidden="true">
            Sigue bajando →
          </p>
        </div>
        <div className="swipe-marco">
          <div className="swipe pin-pista grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5" />
        </div>
      </div>
    </section>
  );
}

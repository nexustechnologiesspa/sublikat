export default function Process() {
  return (
    <section
      aria-labelledby="heading-proceso"
      className="bg-surface ink-border-thick rounded-sticker shadow-offset-lg p-6 md:p-10"
      id="proceso"
      data-od-id="proceso-taller"
    >
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2
          id="heading-proceso"
          className="font-display text-4xl md:text-5xl tx-ink leading-tight mb-2"
        >
          Cómo trabajamos
        </h2>
      </div>
      <div className="swipe-marco">
        <div className="swipe grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative od-steps od-stagger od-stagger-2" />
      </div>
    </section>
  );
}

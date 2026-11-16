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
          <h2
            id="heading-catalogo"
            className="font-display text-4xl md:text-5xl tx-ink leading-tight"
          >
            20 productos en 5 categorías
          </h2>
        </div>
      </div>
    </section>
  );
}

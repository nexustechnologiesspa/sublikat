export default function Commitments() {
  return (
    <section
      className="reviews-section"
      aria-labelledby="reviews-title"
      id="resenas"
      data-od-id="resenas"
    >
      <div className="reviews-header">
        <div>
          <h2 id="reviews-title" className="section-title">
            Los compromisos que cumplimos en cada pedido
          </h2>
        </div>
      </div>
      <div className="swipe-marco">
        <div className="reviews-grid swipe od-stagger" />
      </div>
    </section>
  );
}

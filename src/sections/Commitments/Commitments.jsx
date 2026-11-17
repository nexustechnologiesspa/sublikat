import { useEffect, useRef, useState } from 'react';

const commitmentIndexes = [0, 1, 2];

export default function Commitments() {
  const trackRef = useRef(null);
  const [activeCommitmentIndex, setActiveCommitmentIndex] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;

    const updateActiveCommitment = () => {
      const total = track.children.length;
      const max = track.scrollWidth - track.clientWidth;
      const activeIndex =
        max > 0
          ? Math.round((track.scrollLeft / max) * (total - 1))
          : 0;

      setActiveCommitmentIndex((currentIndex) =>
        currentIndex === activeIndex ? currentIndex : activeIndex
      );
    };

    track.addEventListener('scroll', updateActiveCommitment, {
      passive: true
    });
    updateActiveCommitment();

    return () =>
      track.removeEventListener('scroll', updateActiveCommitment);
  }, []);

  return (
    <section
      className="reviews-section"
      aria-labelledby="reviews-title"
      id="resenas"
      data-od-id="resenas"
    >
      <div className="reviews-header">
        <div>
          <span className="sticker-badge">Compromisos del taller</span>
          <h2 id="reviews-title" className="section-title">
            Los compromisos que cumplimos en cada pedido
          </h2>
          <p className="section-subtitle">
            Sin promesas de plazos exactos: estos son los puntos que se cumplen
            en cada pedido.
          </p>
        </div>

        <div className="rating-summary-card">
          <div className="author-meta">
            <span className="author-name">Perfil verificado en Google Maps</span>
            <span className="author-role">
              Las reseñas de clientes aparecerán en este bloque
            </span>
          </div>
        </div>
      </div>

      <div className="swipe-marco">
        <div
          ref={trackRef}
          className="reviews-grid swipe od-stagger"
        >
          <article className="review-card" data-od-id="compromiso-minimo">
            <div>
              <p className="review-quote">
                Sin pedido mínimo ni lotes obligatorios: cada encargo se cotiza
                por separado.
              </p>
            </div>
            <div className="review-author-wrap">
              <div className="author-meta">
                <span className="author-name">Desde una unidad</span>
                <span className="author-role">
                  Cantidad mínima por pedido
                </span>
              </div>
            </div>
          </article>

          <article className="review-card" data-od-id="compromiso-muestra">
            <div>
              <p className="review-quote">
                Previsualización real con prueba de color y visto bueno antes de
                mandar a producción.
              </p>
            </div>
            <div className="review-author-wrap">
              <div className="author-meta">
                <span className="author-name">Muestra antes de imprimir</span>
                <span className="author-role">
                  Aprobación del diseño
                </span>
              </div>
            </div>
          </article>

          <article className="review-card" data-od-id="compromiso-atencion">
            <div>
              <p className="review-quote">
                Consultas atendidas de lunes a viernes, de 10:00 a 17:00, por
                WhatsApp o correo.
              </p>
            </div>
            <div className="review-author-wrap">
              <div className="author-meta">
                <span className="author-name">
                  Atención directa del taller
                </span>
                <span className="author-role">
                  Lunes a viernes, de 10:00 a 17:00
                </span>
              </div>
            </div>
          </article>
        </div>
        <div className="dots" aria-hidden="true">
          {commitmentIndexes.map((index) => (
            <span
              key={index}
              className={index === activeCommitmentIndex ? 'on' : undefined}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

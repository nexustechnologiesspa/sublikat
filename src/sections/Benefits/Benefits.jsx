import { useEffect, useRef, useState } from 'react';

const benefitCards = [
  {
    image: 'pedidos-unidad.jpg',
    alt: 'Ilustración de ejemplo: una taza de cerámica ilustrada junto a una caja de regalo',
    title: 'Pedidos desde una unidad',
    description: 'También para empresas: cada encargo se cotiza por separado.'
  },
  {
    image: 'personalizacion.jpg',
    alt: 'Ilustración de ejemplo: una camiseta, un bolso de tela y una taza con el mismo diseño impreso',
    title: 'Personalización de productos',
    description: 'Polerones, tazas, textiles, papelería e identificación.'
  },
  {
    image: 'muestra-impresion.jpg',
    alt: 'Ilustración de ejemplo: una prueba de diseño en arcilla sobre una taza, marcada con una aprobación',
    title: 'Muestra antes de imprimir',
    description: 'Revisamos su diseño y lo aprobamos con usted.'
  },
  {
    image: 'atencion-whatsapp.jpg',
    alt: 'Ilustración de ejemplo: un teléfono con mensajes de chat y un reloj, atención por WhatsApp',
    title: 'Atención de lunes a viernes',
    description: 'De 10:00 a 17:00, por WhatsApp o por correo.'
  }
];

export default function Benefits() {
  const trackRef = useRef(null);
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;

    const updateActiveCard = () => {
      const total = track.children.length;
      const max = track.scrollWidth - track.clientWidth;
      const activeIndex =
        max > 0
          ? Math.round((track.scrollLeft / max) * (total - 1))
          : 0;

      setActiveCardIndex((currentIndex) =>
        currentIndex === activeIndex ? currentIndex : activeIndex
      );
    };

    track.addEventListener('scroll', updateActiveCard, { passive: true });
    updateActiveCard();

    return () => track.removeEventListener('scroll', updateActiveCard);
  }, []);

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
          <div
            ref={trackRef}
            className="swipe pin-pista grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5"
          >
            {benefitCards.map((card) => (
              <article
                key={card.image}
                className="feature-card bg-surface sticker-border sticker-shadow-md hover:translate-y-[-2px] transition-transform"
              >
                <div className="feature-card__tile">
                  <img
                    className="card-illustration"
                    src={`assets/beneficios/${card.image}`}
                    alt={card.alt}
                    width="640"
                    height="640"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div>
                  <h3 className="font-display text-xl tx-ink leading-none mb-1">
                    {card.title}
                  </h3>
                  <p className="text-xs tx-muted font-bold leading-tight">
                    {card.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
          <div className="dots" aria-hidden="true">
            {benefitCards.map((card, index) => (
              <span
                key={card.image}
                className={index === activeCardIndex ? 'on' : undefined}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

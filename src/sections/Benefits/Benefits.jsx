import { useEffect, useRef, useState } from 'react';

const benefitCards = [
  {
    image: 'pedidos-unidad.jpg',
    alt: 'Una taza de cerámica ilustrada junto a una caja de regalo',
    title: 'Pedidos desde una unidad',
    description: 'Un regalo o cien piezas para su empresa: cada encargo se cotiza a su medida.'
  },
  {
    image: 'personalizacion.jpg',
    alt: 'Una camiseta, un bolso de tela y una taza con el mismo diseño impreso',
    title: 'Su diseño en 20 productos',
    description: 'Polerones, tazas, textiles, papelería e identificación.'
  },
  {
    image: 'muestra-impresion.jpg',
    alt: 'Una prueba de diseño en arcilla sobre una taza, marcada con una aprobación',
    title: 'Muestra antes de imprimir',
    description: 'Revisamos su diseño y lo aprobamos con usted.'
  },
  {
    image: 'atencion-whatsapp.jpg',
    alt: 'Un teléfono con mensajes de chat, atención por WhatsApp',
    title: 'Atención directa por WhatsApp',
    description: 'Le responde una persona del taller, sin intermediarios.'
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
      aria-label="Por qué elegir Sublikat"
    >
      <div className="pin-vista">
        <div className="pin-intro">
          <h2 className="font-display text-3xl md:text-4xl tx-ink leading-tight">
            Por qué elegir Sublikat
          </h2>
          <p className="pin-intro__hint" aria-hidden="true">
            Deslice para ver más
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

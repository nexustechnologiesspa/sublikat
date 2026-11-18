import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArtDesign, ArtPrint, ArtProof, ArtShip } from './ProcessArt.jsx';

/* ==========================================================
   Sublikat · «Cómo trabajamos» (propuesta B, 18-11-2026)
   Misma identidad que «Ventajas del taller» y el catálogo:
   titular a la izquierda, tarjetas blancas con recuadro lavanda,
   ilustraciones en tonos pastel y el violeta solo como acento
   (el número del paso activo, como la pestaña activa de la tienda).

   Movimiento, discreto:
   1. Al entrar en pantalla las tarjetas suben en cascada.
   2. Las ilustraciones flotan suavemente, como en «Ventajas».
   3. Una presentación automática recorre los pasos: el número
      se pinta de violeta, la tarjeta sube 2 px y su ilustración
      cuenta su pequeña historia. Se pausa con el ratón encima.
   4. En móvil es el carrusel de siempre; el paso activo es el
      centrado.
   Con movimiento reducido todo se ve quieto y completo.
   Estilos en src/styles/process.css.
   ========================================================== */

const AUTOPLAY_MS = 3600;

const steps = [
  {
    title: 'Elija su producto y su diseño',
    text: 'Envíenos su ilustración, foto o logo. Si el archivo no tiene buena calidad, le avisamos antes de seguir.',
    chip: 'Aceptamos PNG, SVG o boceto',
    Art: ArtDesign,
  },
  {
    title: 'Revisamos y aprobamos la muestra',
    text: 'Le enviamos una imagen de cómo quedará su producto. No imprimimos nada hasta contar con su visto bueno.',
    chip: 'Muestra digital antes de imprimir',
    Art: ArtProof,
  },
  {
    title: 'Imprimimos y estampamos',
    text: 'Usamos la técnica adecuada para cada material, para que el diseño no se agriete ni se borre.',
    chip: 'Técnica según cada material',
    Art: ArtPrint,
  },
  {
    title: 'Despacho o retiro',
    text: 'Control de acabado, empaque reforzado y despacho por Blue Express o retiro en el taller. Le entregamos el número de seguimiento.',
    chip: 'Despacho por Blue Express o retiro en taller',
    Art: ArtShip,
  },
];

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M20 6L9 17l-5-5"
        stroke="currentColor"
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9 5l7 7-7 7"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Process() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [motionOk, setMotionOk] = useState(false);
  const [isWide, setIsWide] = useState(false);
  const [listVisible, setListVisible] = useState(false);
  const [paused, setPaused] = useState(false);

  /* Antes del primer pintado: así el estado inicial oculto nunca
     parpadea y, sin JS o con movimiento reducido, todo se ve. */
  useLayoutEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: no-preference)');
    const wideQuery = window.matchMedia('(min-width: 768px)');
    const update = () => {
      setMotionOk(motionQuery.matches);
      setIsWide(wideQuery.matches);
    };

    update();
    motionQuery.addEventListener('change', update);
    wideQuery.addEventListener('change', update);

    return () => {
      motionQuery.removeEventListener('change', update);
      wideQuery.removeEventListener('change', update);
    };
  }, []);

  /* Entrada (una sola vez) y visibilidad de la lista para la presentación. */
  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return undefined;

    const revealables = section.querySelectorAll('.pr-reveal');

    if (!('IntersectionObserver' in window)) {
      revealables.forEach((element) => {
        element.dataset.inview = 'true';
      });
      setListVisible(true);
      return undefined;
    }

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.dataset.inview = 'true';
          revealObserver.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -15% 0px' }
    );

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => setListVisible(entry.isIntersecting),
      { threshold: 0.35 }
    );

    revealables.forEach((element) => revealObserver.observe(element));
    visibilityObserver.observe(track);

    return () => {
      revealObserver.disconnect();
      visibilityObserver.disconnect();
    };
  }, []);

  /* Móvil: el paso activo es el centrado en el carrusel. */
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;

    const updateActiveStep = () => {
      const max = track.scrollWidth - track.clientWidth;
      if (max <= 0) return;
      const nextIndex = Math.round((track.scrollLeft / max) * (steps.length - 1));
      setActiveStepIndex((currentIndex) =>
        currentIndex === nextIndex ? currentIndex : nextIndex
      );
    };

    track.addEventListener('scroll', updateActiveStep, { passive: true });
    return () => track.removeEventListener('scroll', updateActiveStep);
  }, []);

  /* Escritorio y tablet: presentación automática. */
  const autoplay = motionOk && isWide && listVisible && !paused;

  useEffect(() => {
    if (!autoplay) return undefined;
    const timer = window.setTimeout(() => {
      setActiveStepIndex((index) => (index + 1) % steps.length);
    }, AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [autoplay, activeStepIndex]);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="heading-proceso"
      className="pr"
      id="proceso"
      data-od-id="proceso-taller"
      data-anim={motionOk ? 'on' : undefined}
    >
      <header className="pr-head pr-reveal">
        <div>
          <span className="sticker-badge">Paso a paso</span>
          <h2 id="heading-proceso" className="section-title">
            Cómo trabajamos
          </h2>
          <p className="pr-head__lead">
            Desde que elige el producto hasta que lo recibe, con su aprobación
            antes de imprimir.
          </p>
        </div>
        <p className="pr-head__hint" aria-hidden="true">
          4 pasos · de su idea a su puerta
        </p>
      </header>

      <div className="swipe-marco">
        <ol
          ref={trackRef}
          className="swipe pr-steps pr-reveal"
          aria-label="Pasos del proceso"
          onMouseLeave={() => setPaused(false)}
        >
          {steps.map(({ title, text, chip, Art }, index) => (
            <li
              key={title}
              className={`pr-step${index === activeStepIndex ? ' is-active' : ''}`}
              style={{ '--i': index }}
              onMouseEnter={() => {
                setPaused(true);
                setActiveStepIndex(index);
              }}
            >
              <article className="feature-card pr-card bg-surface sticker-border sticker-shadow-md">
                <div className="feature-card__tile pr-tile">
                  <span className="pr-num font-display" aria-hidden="true">
                    {index + 1}
                  </span>
                  <div className="pr-float">
                    <Art />
                  </div>
                </div>

                <div className="pr-copy">
                  <p className="pr-label">Paso 0{index + 1}</p>
                  <h3 className="font-display text-xl tx-ink leading-tight mb-2">
                    {title}
                  </h3>
                  <p className="pr-text">{text}</p>
                </div>

                <p className="pr-check">
                  <span className="tx-success">
                    <CheckIcon />
                  </span>
                  <span>{chip}</span>
                </p>
              </article>

              {index < steps.length - 1 && (
                <span className="pr-chevron" aria-hidden="true">
                  <ChevronIcon />
                </span>
              )}
            </li>
          ))}
        </ol>
        <div className="dots" aria-hidden="true">
          {steps.map((step, index) => (
            <span
              key={step.title}
              className={index === activeStepIndex ? 'on' : undefined}
            />
          ))}
        </div>
      </div>

      <div className="pr-cta pr-reveal bg-surface sticker-border sticker-shadow-md">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-full bg-awning ink-border-sm flex items-center justify-center font-display text-xl tx-ink shrink-0">
            ★
          </span>
          <div>
            <h3 className="font-display text-xl tx-ink">
              ¿Tiene un encargo para su equipo, empresa o evento?
            </h3>
            <p className="text-xs tx-muted font-bold">
              Precios por volumen para empresas, con cotización a medida y sin
              compromiso.
            </p>
          </div>
        </div>
        <a
          href="#contacto"
          className="min-h-[44px] px-6 py-2.5 bg-inkfill tx-onfill font-bold text-sm rounded-sticker ink-border shadow-offset-sm btn-press hover-bg-inkfillhov focus:outline-none focus:ring-4 focus:ring-[var(--focus)] flex items-center justify-center shrink-0"
        >
          Solicitar cotización
        </a>
      </div>
    </section>
  );
}

import { useEffect, useRef, useState } from 'react';

const stepIndexes = [0, 1, 2, 3];

export default function Process() {
  const trackRef = useRef(null);
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;

    const updateActiveStep = () => {
      const total = track.children.length;
      const max = track.scrollWidth - track.clientWidth;
      const nextIndex =
        max > 0
          ? Math.round((track.scrollLeft / max) * (total - 1))
          : 0;

      setActiveStepIndex((currentIndex) =>
        currentIndex === nextIndex ? currentIndex : nextIndex
      );
    };

    track.addEventListener('scroll', updateActiveStep, { passive: true });
    updateActiveStep();

    return () => track.removeEventListener('scroll', updateActiveStep);
  }, []);

  return (
    <section
      aria-labelledby="heading-proceso"
      className="bg-surface ink-border-thick rounded-sticker shadow-offset-lg p-6 md:p-10"
      id="proceso"
      data-od-id="proceso-taller"
    >
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-awning ink-border-sm rounded-full text-xs font-black uppercase tracking-wider tx-ink mb-2 shadow-offset-sm">
          <span>El método artesanal paso a paso</span>
        </div>
        <h2
          id="heading-proceso"
          className="font-display text-4xl md:text-5xl tx-ink leading-tight mb-2"
        >
          Cómo trabajamos
        </h2>
        <p className="text-base tx-ink font-semibold">
          Desde que elige el producto hasta que recibe su pedido. Con supervisión
          humana y una muestra que usted aprueba antes de imprimir.
        </p>
      </div>

      <div className="swipe-marco">
        <div
          ref={trackRef}
          className="swipe grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative od-steps od-stagger od-stagger-2"
        >
          <div className="bg-soft ink-border rounded-sticker shadow-offset-sm p-5 flex flex-col justify-between relative group hover-bg-soft2 transition-colors od-step">
            <div className="absolute -top-3.5 left-5 bg-accent tx-onfill text-xs font-black px-3 py-1 rounded-full ink-border-sm shadow-offset-sm uppercase tracking-wider">
              Paso 01
            </div>

            <div>
              <div className="w-full h-36 bg-surface ink-border rounded-sticker mb-4 p-3 flex items-center justify-center shadow-inner">
                <svg
                  viewBox="0 0 120 100"
                  className="w-full h-full max-h-28"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-label="Ilustración de archivo y lienzo de diseño"
                >
                  <rect
                    x="18"
                    y="16"
                    width="84"
                    height="68"
                    rx="8"
                    fill="#ffffff"
                    stroke="#413f4b"
                    strokeWidth="2.5"
                  />
                  <rect
                    x="24"
                    y="22"
                    width="72"
                    height="46"
                    rx="4"
                    fill="#f3f1f8"
                    stroke="#413f4b"
                    strokeWidth="1.8"
                  />
                  <path
                    d="M30 62L46 42L58 56L68 46L88 64H30V62Z"
                    fill="#b5a94e"
                    stroke="#413f4b"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="76"
                    cy="34"
                    r="7"
                    fill="#f5df2b"
                    stroke="#413f4b"
                    strokeWidth="1.8"
                  />
                  <g transform="rotate(-30 90 20)">
                    <rect
                      x="80"
                      y="8"
                      width="8"
                      height="34"
                      rx="2"
                      fill="#4f2cf5"
                      stroke="#413f4b"
                      strokeWidth="1.8"
                    />
                    <polygon
                      points="80,42 88,42 84,50"
                      fill="#f5df2b"
                      stroke="#413f4b"
                      strokeWidth="1.8"
                    />
                    <polygon points="82.5,47 85.5,47 84,50" fill="#413f4b" />
                  </g>
                  <circle
                    cx="24"
                    cy="22"
                    r="3"
                    fill="#4f2cf5"
                    stroke="#413f4b"
                    strokeWidth="1.2"
                  />
                  <circle
                    cx="96"
                    cy="22"
                    r="3"
                    fill="#4f2cf5"
                    stroke="#413f4b"
                    strokeWidth="1.2"
                  />
                  <circle
                    cx="96"
                    cy="68"
                    r="3"
                    fill="#4f2cf5"
                    stroke="#413f4b"
                    strokeWidth="1.2"
                  />
                  <circle
                    cx="24"
                    cy="68"
                    r="3"
                    fill="#4f2cf5"
                    stroke="#413f4b"
                    strokeWidth="1.2"
                  />
                </svg>
              </div>

              <h3 className="font-display text-2xl tx-ink mb-2 leading-snug">
                Elija su producto y su diseño
              </h3>
              <p className="text-sm tx-ink font-semibold leading-relaxed">
                Envíenos su ilustración, foto o logo. Si necesita ayuda,
                ajustamos la resolución para que no pierda ningún detalle.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t bd-ink/20 flex items-center gap-1.5 text-xs font-bold tx-ink">
              <span className="tx-success">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </span>
              <span>Aceptamos PNG, SVG o boceto</span>
            </div>
          </div>

          <div className="bg-soft ink-border rounded-sticker shadow-offset-sm p-5 flex flex-col justify-between relative group hover-bg-soft2 transition-colors od-step">
            <div className="absolute -top-3.5 left-5 bg-awning tx-awningink text-xs font-black px-3 py-1 rounded-full ink-border-sm shadow-offset-sm uppercase tracking-wider">
              Paso 02
            </div>

            <div>
              <div className="w-full h-36 bg-surface ink-border rounded-sticker mb-4 p-3 flex items-center justify-center shadow-inner">
                <svg
                  viewBox="0 0 120 100"
                  className="w-full h-full max-h-28"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-label="Ilustración de simulación y revisión de color"
                >
                  <rect
                    x="22"
                    y="16"
                    width="60"
                    height="70"
                    rx="6"
                    fill="#ffffff"
                    stroke="#413f4b"
                    strokeWidth="2.5"
                  />
                  <line
                    x1="32"
                    y1="28"
                    x2="68"
                    y2="28"
                    stroke="#413f4b"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <line
                    x1="32"
                    y1="38"
                    x2="72"
                    y2="38"
                    stroke="#413f4b"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <line
                    x1="32"
                    y1="48"
                    x2="55"
                    y2="48"
                    stroke="#413f4b"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <rect
                    x="42"
                    y="58"
                    width="34"
                    height="20"
                    rx="4"
                    fill="#b5a94e"
                    stroke="#413f4b"
                    strokeWidth="1.8"
                  />
                  <path
                    d="M52 68L56 72L66 62"
                    stroke="#ffffff"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="76"
                    cy="42"
                    r="18"
                    fill="#f3f1f8"
                    stroke="#413f4b"
                    strokeWidth="2.5"
                  />
                  <circle
                    cx="76"
                    cy="42"
                    r="13"
                    fill="#f5df2b"
                    fillOpacity="0.3"
                    stroke="#413f4b"
                    strokeWidth="1"
                  />
                  <path
                    d="M70 34C73 31 78 31 82 34"
                    stroke="#ffffff"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M88 56L102 70"
                    stroke="#413f4b"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M88 56L100 68"
                    stroke="#4f2cf5"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <h3 className="font-display text-2xl tx-ink mb-2 leading-snug">
                Revisamos y aprobamos la muestra
              </h3>
              <p className="text-sm tx-ink font-semibold leading-relaxed">
                Le enviamos una previsualización real con prueba de color. No
                imprimimos nada hasta contar con su visto bueno.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t bd-ink/20 flex items-center gap-1.5 text-xs font-bold tx-ink">
              <span className="tx-success">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </span>
              <span>Muestra digital antes de imprimir</span>
            </div>
          </div>

          <div className="bg-soft ink-border rounded-sticker shadow-offset-sm p-5 flex flex-col justify-between relative group hover-bg-soft2 transition-colors od-step">
            <div className="absolute -top-3.5 left-5 bg-success tx-onfill text-xs font-black px-3 py-1 rounded-full ink-border-sm shadow-offset-sm uppercase tracking-wider">
              Paso 03
            </div>

            <div>
              <div className="w-full h-36 bg-surface ink-border rounded-sticker mb-4 p-3 flex items-center justify-center shadow-inner">
                <svg
                  viewBox="0 0 120 100"
                  className="w-full h-full max-h-28"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-label="Ilustración de plancha térmica de sublimación"
                >
                  <rect
                    x="20"
                    y="66"
                    width="80"
                    height="14"
                    rx="4"
                    fill="#413f4b"
                    stroke="#413f4b"
                    strokeWidth="2"
                  />
                  <rect
                    x="26"
                    y="60"
                    width="68"
                    height="6"
                    rx="2"
                    fill="#ffffff"
                    stroke="#413f4b"
                    strokeWidth="1.8"
                  />
                  <rect
                    x="24"
                    y="38"
                    width="72"
                    height="14"
                    rx="3"
                    fill="#f5df2b"
                    stroke="#413f4b"
                    strokeWidth="2.5"
                  />
                  <path
                    d="M60 38V22H78"
                    stroke="#413f4b"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <rect
                    x="74"
                    y="18"
                    width="16"
                    height="8"
                    rx="3"
                    fill="#4f2cf5"
                    stroke="#413f4b"
                    strokeWidth="1.8"
                  />
                  <rect
                    x="30"
                    y="42"
                    width="22"
                    height="7"
                    rx="1.5"
                    fill="#413f4b"
                  />
                  <text
                    x="33"
                    y="48"
                    fontFamily="'Nunito', sans-serif"
                    fontSize="6"
                    fontWeight="900"
                    fill="#ffffff"
                  >
                    200°C
                  </text>
                  <path
                    d="M38 32C36 28 40 24 38 20"
                    stroke="#4f2cf5"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M48 30C46 26 50 22 48 18"
                    stroke="#4f2cf5"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M58 32C56 28 60 24 58 20"
                    stroke="#4f2cf5"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M34 60H86"
                    stroke="#b5a94e"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <h3 className="font-display text-2xl tx-ink mb-2 leading-snug">
                Imprimimos y sublimamos
              </h3>
              <p className="text-sm tx-ink font-semibold leading-relaxed">
                Inyectamos pigmentos especiales que gasifican a 200°C. La tinta
                se funde en la fibra: sin plásticos gomosos ni grietas.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t bd-ink/20 flex items-center gap-1.5 text-xs font-bold tx-ink">
              <span className="tx-success">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </span>
              <span>Tintas que se fijan en la fibra</span>
            </div>
          </div>

          <div className="bg-soft ink-border rounded-sticker shadow-offset-sm p-5 flex flex-col justify-between relative group hover-bg-soft2 transition-colors od-step">
            <div className="absolute -top-3.5 left-5 bg-inkfill tx-onfill text-xs font-black px-3 py-1 rounded-full ink-border-sm shadow-offset-sm uppercase tracking-wider">
              Paso 04
            </div>

            <div>
              <div className="w-full h-36 bg-surface ink-border rounded-sticker mb-4 p-3 flex items-center justify-center shadow-inner">
                <svg
                  viewBox="0 0 120 100"
                  className="w-full h-full max-h-28"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-label="Ilustración de caja de envío protegida"
                >
                  <polygon
                    points="60,18 98,34 60,50 22,34"
                    fill="#f5df2b"
                    stroke="#413f4b"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                  />
                  <polygon
                    points="22,34 60,50 60,86 22,70"
                    fill="#f3f1f8"
                    stroke="#413f4b"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                  />
                  <polygon
                    points="98,34 60,50 60,86 98,70"
                    fill="#e4e1ef"
                    stroke="#413f4b"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                  />
                  <polygon
                    points="54,20 66,25 66,85 54,80"
                    fill="#4f2cf5"
                    fillOpacity="0.9"
                    stroke="#413f4b"
                    strokeWidth="1.8"
                  />
                  <circle cx="42" cy="62" r="5" fill="#413f4b" />
                  <circle cx="38" cy="54" r="2" fill="#413f4b" />
                  <circle cx="43" cy="52" r="2" fill="#413f4b" />
                  <circle cx="48" cy="55" r="2" fill="#413f4b" />
                  <rect
                    x="70"
                    y="52"
                    width="18"
                    height="12"
                    rx="2"
                    fill="#ffffff"
                    stroke="#413f4b"
                    strokeWidth="1.5"
                  />
                  <line
                    x1="74"
                    y1="56"
                    x2="84"
                    y2="56"
                    stroke="#413f4b"
                    strokeWidth="1.5"
                  />
                  <line
                    x1="74"
                    y1="60"
                    x2="80"
                    y2="60"
                    stroke="#413f4b"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>

              <h3 className="font-display text-2xl tx-ink mb-2 leading-snug">
                Producción y entrega
              </h3>
              <p className="text-sm tx-ink font-semibold leading-relaxed">
                Control de acabado, empaque reforzado y despacho por Blue
                Express o retiro en el taller. Le entregamos el número de
                seguimiento del envío.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t bd-ink/20 flex items-center gap-1.5 text-xs font-bold tx-ink">
              <span className="tx-success">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </span>
              <span>Despacho por Blue Express o retiro en taller</span>
            </div>
          </div>
        </div>
        <div className="dots" aria-hidden="true">
          {stepIndexes.map((index) => (
            <span
              key={index}
              className={index === activeStepIndex ? 'on' : undefined}
            />
          ))}
        </div>
      </div>

      <div className="mt-10 bg-soft ink-border rounded-sticker p-4 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-full bg-awning ink-border-sm flex items-center justify-center font-display text-xl tx-ink shrink-0">
            ★
          </span>
          <div>
            <h4 className="font-display text-xl tx-ink">
              ¿Tiene un encargo para su equipo, empresa o evento?
            </h4>
            <p className="text-xs tx-ink font-semibold">
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

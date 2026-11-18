/* ==========================================================
   Sublikat · Ilustraciones de «Cómo trabajamos»
   Un SVG por paso, dibujado con los colores de la marca.
   Los colores viven en tokens.css (--pr-*) y se aplican con
   clases de process.css: aquí no hay ni un hexadecimal.
   Las piezas que se mueven llevan una clase `pr-a-*`; el
   movimiento solo corre en la tarjeta activa (process.css).
   ========================================================== */

/* Paso 1 · Elija su producto y su diseño: lienzo + lápiz que dibuja */
export function ArtDesign() {
  return (
    <svg viewBox="0 0 160 120" className="pr-svg" aria-hidden="true">
      <g className="pr-a-spark pr-a-spark--1">
        <path className="pr-ln pr-st-c" d="M14 26 L6 20" />
        <path className="pr-ln pr-st-c" d="M12 38 L3 38" />
        <path className="pr-ln pr-st-c" d="M22 17 L18 8" />
      </g>

      <rect className="pr-paper pr-st" x="22" y="20" width="106" height="80" rx="10" />
      <path className="pr-st" d="M22 33 H128" />
      <circle className="pr-f-violet" cx="31" cy="26.5" r="2.6" />
      <circle className="pr-f-yellow" cx="39" cy="26.5" r="2.6" />
      <circle className="pr-f-olive" cx="47" cy="26.5" r="2.6" />

      <rect className="pr-sky pr-st-thin" x="30" y="40" width="90" height="48" rx="5" />
      <circle className="pr-f-yellow pr-st-thin pr-a-sun" cx="100" cy="53" r="7.5" />
      <path className="pr-f-olive pr-st-thin" d="M32 86 L56 58 L69 72 L84 52 L118 86 Z" strokeLinejoin="round" />
      <path className="pr-f-olivedark" d="M69 72 L84 52 L95 66 L84 64 Z" />

      <path className="pr-a-draw pr-ln pr-st-violet" d="M34 94 C50 90 62 98 78 94 S104 90 116 94" />

      <g className="pr-a-pencil">
        <g transform="translate(116 90) rotate(35)">
          <polygon className="pr-wood pr-st-thin" points="-5.5,-16 5.5,-16 0,0" strokeLinejoin="round" />
          <polygon className="pr-f-ink" points="-2,-5.5 2,-5.5 0,0" />
          <rect className="pr-f-violet pr-st-thin" x="-5.5" y="-60" width="11" height="44" rx="2" />
          <rect className="pr-paper pr-st-thin" x="-5.5" y="-68" width="11" height="8" />
          <rect className="pr-f-olivedark pr-st-thin" x="-5.5" y="-77" width="11" height="9" rx="3" />
        </g>
      </g>
    </svg>
  );
}

/* Paso 2 · Revisamos y aprobamos la muestra: lupa que repasa la prueba */
export function ArtProof() {
  return (
    <svg viewBox="0 0 160 120" className="pr-svg" aria-hidden="true">
      <g className="pr-a-spark pr-a-spark--2">
        <path className="pr-ln pr-st-c" d="M136 22 L144 12" />
        <path className="pr-ln pr-st-c" d="M142 34 L152 30" />
        <path className="pr-ln pr-st-c" d="M126 16 L128 5" />
      </g>

      <rect className="pr-paper pr-st" x="32" y="12" width="70" height="92" rx="9" />
      <path className="pr-ln-soft" d="M44 30 H88" />
      <path className="pr-ln-soft" d="M44 42 H82" />
      <path className="pr-ln-soft" d="M44 54 H72" />

      <g className="pr-a-check">
        <rect className="pr-f-olive pr-st" x="42" y="68" width="26" height="26" rx="6" />
        <path className="pr-ln pr-st-paper" d="M49 81 L54 86 L62 76" />
      </g>

      <g className="pr-a-lens">
        <path className="pr-st-handle" d="M118 74 L136 92" />
        <path className="pr-st-handle-fill" d="M118 74 L136 92" />
        <circle className="pr-lens pr-st" cx="104" cy="60" r="19" />
        <path className="pr-ln pr-st-paper" d="M93 54 C96 48 102 46 108 47" />
      </g>
    </svg>
  );
}

/* Paso 3 · Imprimimos y sublimamos: la hoja sale con la tinta */
export function ArtPrint() {
  return (
    <svg viewBox="0 0 160 120" className="pr-svg" aria-hidden="true">
      <defs>
        <clipPath id="pr-clip-salida">
          <rect x="10" y="67" width="140" height="53" />
        </clipPath>
      </defs>

      <g className="pr-a-spark pr-a-spark--3">
        <path className="pr-ln pr-st-c" d="M134 18 L142 8" />
        <path className="pr-ln pr-st-c" d="M140 30 L151 26" />
        <path className="pr-ln pr-st-c" d="M124 12 L125 2" />
      </g>

      <rect className="pr-paper pr-st" x="52" y="10" width="56" height="26" rx="3" />
      <rect className="pr-body pr-st" x="24" y="28" width="112" height="46" rx="11" />
      <rect className="pr-bodytop" x="27" y="31" width="106" height="11" rx="8" />
      <rect className="pr-screen pr-st-thin" x="96" y="46" width="28" height="10" rx="2.5" />
      <circle className="pr-f-violet" cx="38" cy="51" r="3" />
      <circle className="pr-f-yellow" cx="47" cy="51" r="3" />
      <circle className="pr-f-olive" cx="56" cy="51" r="3" />
      <rect className="pr-slot" x="38" y="63" width="84" height="6" rx="3" />

      <g clipPath="url(#pr-clip-salida)">
        <g className="pr-a-paper">
          <path className="pr-paper pr-st" d="M44 66 H116 L126 112 H34 Z" strokeLinejoin="round" />
          <g className="pr-a-ink">
            <circle className="pr-ink-1" cx="72" cy="94" r="11" />
            <circle className="pr-ink-2" cx="88" cy="94" r="11" />
            <circle className="pr-ink-3" cx="80" cy="82" r="11" />
          </g>
        </g>
      </g>
    </svg>
  );
}

/* Paso 4 · Producción y entrega: la caja sale con cinta Sublikat */
export function ArtShip() {
  return (
    <svg viewBox="0 0 160 120" className="pr-svg" aria-hidden="true">
      <g className="pr-a-speed">
        <path className="pr-ln pr-st" d="M8 52 H30" />
        <path className="pr-ln pr-st" d="M14 64 H34" />
        <path className="pr-ln pr-st" d="M6 76 H28" />
      </g>

      <g className="pr-a-box">
        <polygon className="pr-boxtop pr-st" points="80,22 120,39 80,56 40,39" strokeLinejoin="round" />
        <polygon className="pr-boxleft pr-st" points="40,39 80,56 80,100 40,83" strokeLinejoin="round" />
        <polygon className="pr-boxright pr-st" points="120,39 80,56 80,100 120,83" strokeLinejoin="round" />
        <polygon className="pr-f-yellow" points="56,33 64,29.5 104,46.5 96,50" />
        <polygon className="pr-f-yellow" points="96,50 104,46.5 104,89.5 96,93" />
        <polygon className="pr-paper pr-st-thin" points="48,62 68,70.5 68,82 48,73.5" strokeLinejoin="round" />
        <path className="pr-st-thin" d="M52 69 L64 74" />
        <path className="pr-st-thin" d="M52 74 L60 77.5" />
      </g>

      <g className="pr-a-pin">
        <path
          className="pr-f-violet pr-st"
          d="M134 4 a11 11 0 0 1 11 11 c0 9 -11 20 -11 20 s-11 -11 -11 -20 a11 11 0 0 1 11 -11 z"
          strokeLinejoin="round"
        />
        <circle className="pr-paper" cx="134" cy="15" r="4" />
      </g>
    </svg>
  );
}

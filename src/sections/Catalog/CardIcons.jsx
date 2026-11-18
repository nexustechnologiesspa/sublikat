const iconShapes = {
  cup: (
    <>
      <path d="M4.5 8h11v6.5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5V8Z" />
      <path d="M15.5 10h1.6a2.4 2.4 0 0 1 0 4.8h-1.6" />
      <path d="M3.5 20.5h13.5" />
    </>
  ),
  quality: (
    <>
      <path d="M12 3.5 14 8l4.8.5-3.6 3.2 1 4.7L12 14.2l-4.2 2.2 1-4.7-3.6-3.2L10 8l2-4.5Z" />
    </>
  ),
  palette: (
    <>
      <path d="M12 3.5a8.5 8.5 0 1 0 0 17h1a2 2 0 0 0 1.5-3.3 2 2 0 0 1 1.5-3.3H18a3 3 0 0 0 3-3A8.5 8.5 0 0 0 12 3.5Z" />
      <circle cx="7.8" cy="10.2" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="10.4" cy="7.4" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="14.2" cy="7" r="0.9" fill="currentColor" stroke="none" />
    </>
  ),
  gift: (
    <>
      <rect x="3.5" y="8.5" width="17" height="12" rx="1.5" />
      <path d="M3.5 12.5h17M12 8.5v12" />
      <path d="M12 8.5S10.8 4 8.3 4a2.2 2.2 0 0 0 0 4.5H12Zm0 0S13.2 4 15.7 4a2.2 2.2 0 0 1 0 4.5H12Z" />
    </>
  ),
  print: (
    <>
      <path d="M7 8V4.5h10V8" />
      <rect x="4" y="8" width="16" height="7" rx="1.5" />
      <path d="M7 12.5V19.5h10v-7" />
      <path d="M7 15.8h10" />
    </>
  ),
  ruler: (
    <>
      <g transform="rotate(-10 12 12)">
        <rect x="2.8" y="8.6" width="18.4" height="6.8" rx="1.2" />
        <path d="M7 10.5v2M10 10v2M13 9.5v2M16 9v2" />
      </g>
    </>
  ),
  frame: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="1.5" />
      <path d="m6.5 16 3.5-4 2.5 2.8 2.3-2.2 2.7 3.4" />
      <circle cx="14.5" cy="8.8" r="1.1" />
    </>
  ),
  shirt: (
    <>
      <path d="M8.5 4.5 5 6.2l-1.8 4 2.9 1.3V20h11.8v-8.5l2.9-1.3-1.8-4-3.5-1.7a3.8 3.8 0 0 1-7 0Z" />
    </>
  ),
  color: (
    <>
      <path d="M12 3.5s5.5 5.1 5.5 9a5.5 5.5 0 0 1-11 0c0-3.9 5.5-9 5.5-9Z" />
    </>
  ),
  box: (
    <>
      <path d="m12 3.5 8 4.2v8.6L12 20.5l-8-4.2V7.7l8-4.2Z" />
      <path d="m4 7.7 8 4.3 8-4.3M12 12v8.5M8 5.6l8 4.3" />
    </>
  ),
  layers: (
    <>
      <path d="m12 3.5 8.5 4.2L12 12 3.5 7.7 12 3.5Z" />
      <path d="m4 12 8 4 8-4M4 16.2l8 4 8-4" />
    </>
  ),
  sparkles: (
    <>
      <path d="M12 3.5 13.3 8l4.5 1.3-4.5 1.3L12 15l-1.3-4.4L6.2 9.3 10.7 8 12 3.5Z" />
      <path d="m18.3 14.4.6 2 2 .6-2 .6-.6 2-.6-2-2-.6 2-.6.6-2Z" />
    </>
  ),
  card: (
    <>
      <rect x="2.8" y="5" width="18.4" height="14" rx="2" />
      <path d="M2.8 9.5h18.4M6.5 15h4" />
    </>
  )
};

export function CardIcon({ name }) {
  if (!Object.prototype.hasOwnProperty.call(iconShapes, name)) {
    throw new Error(`Icono de tarjeta desconocido: "${name}".`);
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {iconShapes[name]}
    </svg>
  );
}

/** Glifo relleno de WhatsApp, compartido por la tarjeta y la ficha ampliada. */
export function WhatsAppGlyph({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Z" />
      <path d="M17.5 14.4c-.3-.15-1.7-.84-2-.94-.27-.1-.46-.15-.65.15-.19.3-.75.94-.92 1.13-.17.2-.34.22-.63.08-.29-.15-1.23-.45-2.34-1.44-.86-.77-1.44-1.72-1.61-2.01-.17-.29-.02-.45.13-.6.13-.13.29-.34.44-.51.15-.17.2-.29.29-.48.1-.2.05-.36-.03-.51-.07-.15-.65-1.57-.89-2.15-.24-.56-.48-.49-.65-.5h-.56c-.2 0-.51.07-.78.36-.26.3-1.02.99-1.02 2.42s1.04 2.81 1.19 3c.15.2 2.05 3.13 4.96 4.39.69.3 1.23.48 1.65.61.7.22 1.33.19 1.83.12.56-.09 1.72-.7 1.96-1.38.24-.68.24-1.26.17-1.38-.07-.12-.26-.2-.55-.35Z" />
    </svg>
  );
}

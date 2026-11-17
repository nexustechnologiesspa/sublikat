const iconShapes = {
  cup: (
    <>
      <path d="M10 14h20v14a10 10 0 0 1-10 10h0a10 10 0 0 1-10-10V14z"></path>
      <path d="M30 18h4a5 5 0 0 1 0 10h-4"></path>
      <path d="M9 10h22"></path>
    </>
  ),
  'magic-cup': (
    <>
      <path d="M11 21h17v9a8 8 0 0 1-8 8h-1a8 8 0 0 1-8-8z"></path>
      <path d="M28 24h3a4 4 0 0 1 0 8h-3"></path>
      <path d="M38 8l1.5 3.6L43 13l-3.5 1.4L38 18l-1.5-3.6L33 13l3.5-1.4z"></path>
      <path d="M14 10l1 2.4L17.5 13l-2.5 1L14 16.5 13 14l-2.5-1L13 12z"></path>
    </>
  ),
  bottle: (
    <>
      <path d="M18 6h12v6l4 7v17a4 4 0 0 1-4 4H18a4 4 0 0 1-4-4V19l4-7z"></path>
      <path d="M18 12h12"></path>
    </>
  ),
  mousepad: (
    <>
      <rect x="6" y="12" width="36" height="24" rx="4"></rect>
      <rect x="20" y="18" width="8" height="13" rx="4"></rect>
    </>
  ),
  bag: (
    <>
      <path d="M12 16h24l-3 24a4 4 0 0 1-4 3H19a4 4 0 0 1-4-3z"></path>
      <path d="M18 16v-4a6 6 0 0 1 12 0v4"></path>
    </>
  ),
  watch: (
    <>
      <path d="M20 4h8v8h-8z"></path>
      <circle cx="24" cy="27" r="13"></circle>
      <path d="M24 20v7l4 3"></path>
    </>
  ),
  'pet-tag': (
    <>
      <circle cx="24" cy="24" r="15"></circle>
      <ellipse cx="24" cy="29" rx="6" ry="4.5"></ellipse>
      <circle cx="17" cy="21" r="2"></circle>
      <circle cx="31" cy="21" r="2"></circle>
      <circle cx="21" cy="17" r="1.8"></circle>
      <circle cx="27" cy="17" r="1.8"></circle>
    </>
  ),
  'stone-frame': (
    <>
      <rect x="8" y="8" width="32" height="32" rx="3"></rect>
      <path d="M16 29c-2-4 1-9 5-10s9 1 10 6-2 9-7 10-7-2-8-6z"></path>
    </>
  ),
  'photo-frame': (
    <>
      <rect x="8" y="10" width="32" height="28" rx="3"></rect>
      <circle cx="17" cy="19" r="3"></circle>
      <path d="M12 34l9-10 5 5 4-4 6 9z"></path>
    </>
  ),
  'aluminum-photo-frame': (
    <>
      <rect x="8" y="8" width="32" height="32" rx="2"></rect>
      <rect x="13" y="13" width="22" height="22" rx="1"></rect>
      <path d="M13 31l17-17"></path>
    </>
  ),
  hoodie: (
    <>
      <path d="M17 8l7 6 7-6 9 6-5 6v20H13V20l-5-6 9-6z"></path>
      <path d="M24 14v16"></path>
    </>
  ),
  'one-color-textile': (
    <>
      <path d="M17 7l-9 6 4 8 5-3v22h18V18l5 3 4-8-9-6a9 9 0 0 1-18 0z"></path>
      <circle cx="24" cy="27" r="4" fill="currentColor" stroke="none"></circle>
    </>
  ),
  'two-color-textile': (
    <>
      <path d="M17 7l-9 6 4 8 5-3v22h18V18l5 3 4-8-9-6a9 9 0 0 1-18 0z"></path>
      <circle cx="21" cy="27" r="3.6" fill="currentColor" stroke="none"></circle>
      <circle cx="29" cy="27" r="3.6" fill="currentColor" stroke="none"></circle>
    </>
  ),
  'three-color-textile': (
    <>
      <path d="M17 7l-9 6 4 8 5-3v22h18V18l5 3 4-8-9-6a9 9 0 0 1-18 0z"></path>
      <circle cx="18.5" cy="27" r="3.2" fill="currentColor" stroke="none"></circle>
      <circle cx="24" cy="29" r="3.2" fill="currentColor" stroke="none"></circle>
      <circle cx="29.5" cy="27" r="3.2" fill="currentColor" stroke="none"></circle>
    </>
  ),
  'image-textile': (
    <>
      <path d="M17 7l-9 6 4 8 5-3v22h18V18l5 3 4-8-9-6a9 9 0 0 1-18 0z"></path>
      <rect x="18" y="20" width="12" height="9" rx="1.5"></rect>
      <path d="M18 27l4-4 3 3 2-2 3 3"></path>
    </>
  ),
  'business-card': (
    <>
      <rect x="6" y="14" width="36" height="20" rx="3"></rect>
      <path d="M12 21h13"></path>
      <path d="M12 27h19"></path>
    </>
  ),
  'pvc-business-card': (
    <>
      <rect x="6" y="14" width="36" height="20" rx="3"></rect>
      <path d="M16 14l-8 20"></path>
      <path d="M24 14l-8 20"></path>
    </>
  ),
  lanyard: (
    <>
      <path d="M24 5a8 8 0 0 1 8 8v7"></path>
      <path d="M24 5a8 8 0 0 0-8 8v7"></path>
      <rect x="16" y="20" width="16" height="19" rx="2"></rect>
    </>
  ),
  credential: (
    <>
      <path d="M21 16v-4a3 3 0 0 1 6 0v4"></path>
      <rect x="11" y="16" width="26" height="24" rx="3"></rect>
      <rect x="16" y="22" width="7" height="7" rx="1"></rect>
      <path d="M27 23h6M27 28h6"></path>
    </>
  ),
  'pvc-credential': (
    <>
      <path d="M21 16v-4a3 3 0 0 1 6 0v4"></path>
      <rect x="11" y="16" width="26" height="24" rx="3"></rect>
      <path d="M13 33l8-17"></path>
      <path d="M21 40l8-17"></path>
    </>
  )
};

export function ProductIcon({ svgKey }) {
  if (!Object.prototype.hasOwnProperty.call(iconShapes, svgKey)) {
    throw new Error(`Unknown product SVG key: "${svgKey}"`);
  }

  return (
    <svg
      className="w-20 h-20 tx-ink"
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {iconShapes[svgKey]}
    </svg>
  );
}

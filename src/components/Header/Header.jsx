import { useEffect, useLayoutEffect, useRef, useState } from 'react';

const themeStorageKey = 'sublikat-tema';
const navigationItems = [
  { href: '#tienda', label: 'Tienda' },
  { href: '#proceso', label: 'Cómo funciona' },
  { href: '#resenas', label: 'Compromisos' },
  { href: '#contacto', label: 'Contacto' }
];

const sectionIds = navigationItems.map(({ href }) => href.slice(1));

function getInitialTheme() {
  try {
    const storedTheme = window.localStorage.getItem(themeStorageKey);
    if (storedTheme) return storedTheme;
  } catch {
    // Keep the system preference as the fallback when storage is unavailable.
  }

  try {
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  } catch {
    return 'light';
  }
}

export default function Header() {
  const [theme, setTheme] = useState(getInitialTheme);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(
    () => window.matchMedia?.('(max-width: 767px)').matches ?? false
  );
  const [activeSection, setActiveSection] = useState(null);
  const headerRef = useRef(null);
  const menuButtonRef = useRef(null);
  const isDark = theme === 'dark';

  useLayoutEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (!window.matchMedia) return undefined;

    const query = window.matchMedia('(max-width: 767px)');
    const updateViewport = () => setIsMobile(query.matches);

    updateViewport();
    if (query.addEventListener) {
      query.addEventListener('change', updateViewport);
      return () => query.removeEventListener('change', updateViewport);
    }

    query.addListener(updateViewport);
    return () => query.removeListener(updateViewport);
  }, []);

  useLayoutEffect(() => {
    if (!headerRef.current) return;
    document.documentElement.style.setProperty(
      '--hh',
      `${headerRef.current.offsetHeight}px`
    );
  }, [isMobile, menuOpen]);

  useEffect(() => {
    const measureHeader = () => {
      if (!headerRef.current) return;
      document.documentElement.style.setProperty(
        '--hh',
        `${headerRef.current.offsetHeight}px`
      );
    };

    measureHeader();
    window.addEventListener('resize', measureHeader);
    window.addEventListener('load', measureHeader);
    return () => {
      window.removeEventListener('resize', measureHeader);
      window.removeEventListener('load', measureHeader);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return undefined;

    const closeOnEscape = (event) => {
      if (event.key !== 'Escape') return;
      setMenuOpen(false);
      menuButtonRef.current?.focus();
    };

    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [menuOpen]);

  useEffect(() => {
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    if (!sections.length) return undefined;

    let frame = 0;

    const update = () => {
      frame = 0;

      const cssHeaderHeight = parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue('--hh')
      );
      const headerHeight =
        headerRef.current?.offsetHeight ||
        (Number.isFinite(cssHeaderHeight) ? cssHeaderHeight : 72);

      // Línea de referencia: un poco por debajo de la cabecera, dentro del
      // tercio superior del viewport. La sección que la cruza es la activa.
      const line = headerHeight + (window.innerHeight - headerHeight) * 0.35;

      let current = null;
      let lastPassed = null;

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= line) lastPassed = section.id;
        if (rect.top <= line && rect.bottom > line) current = section.id;
      });

      setActiveSection(current ?? lastPassed);
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    window.addEventListener('load', onScroll);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.removeEventListener('load', onScroll);
    };
  }, []);

  const toggleTheme = () => {
    const nextTheme = isDark ? 'light' : 'dark';
    setTheme(nextTheme);

    try {
      window.localStorage.setItem(themeStorageKey, nextTheme);
    } catch {
      // The visual theme still changes when storage is unavailable.
    }
  };

  const closeMenu = () => setMenuOpen(false);

  const themeToggle = (
    <button
      type="button"
      id="theme-toggle"
      className="h-[44px] w-[44px] bg-surface bd-ink tx-ink sticker-border sticker-shadow-sm flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[var(--focus)] transition-transform hover:-translate-y-[2px] active:translate-y-[1px]"
      aria-pressed={isDark}
      aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      data-listo="1"
      onClick={toggleTheme}
    >
      <span className="od-tema-etiqueta" aria-hidden="true">
        {isDark ? 'Modo claro' : 'Modo oscuro'}
      </span>
      <svg
        data-icon="sol"
        className={`w-5 h-5${isDark ? ' hidden' : ''}`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="4.2" />
        <path d="M12 2.6v2M12 19.4v2M2.6 12h2M19.4 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M18.7 5.3l-1.4 1.4M6.7 17.3l-1.4 1.4" />
      </svg>
      <svg
        data-icon="luna"
        className={`w-5 h-5${isDark ? '' : ' hidden'}`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M20.2 14.8A8.6 8.6 0 019.2 3.8a8.6 8.6 0 1011 11z" />
      </svg>
    </button>
  );

  const renderNavigationLinks = (mobile = false) =>
    navigationItems.map(({ href, label }) => {
      const targetId = href.slice(1);
      const isActive = activeSection === targetId;

      return (
        <a
          key={targetId}
          href={href}
          aria-current={isActive ? 'true' : undefined}
          onClick={() => {
            setActiveSection(targetId);
            if (mobile) closeMenu();
          }}
        >
          {label}
        </a>
      );
    });

  return (
    <header
      ref={headerRef}
      id="site-header"
      className="sticky top-0 z-50 w-full max-w-[1200px] mx-auto px-4 sm:px-6 pt-3 pb-3 od-header"
    >
      <div className="bg-surface sticker-border sticker-shadow-md px-5 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <a
          href="#"
          className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-[var(--line)] rounded-lg"
        >
          <div className="w-11 h-11 bg-awning sticker-border flex items-center justify-center sticker-shadow-sm flex-shrink-0">
            <svg
              className="w-7 h-7 tx-ink"
              viewBox="0 0 32 32"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="6,12 9,4 14,8" fill="#f3f1f8" />
              <polygon points="26,12 23,4 18,8" fill="#f3f1f8" />
              <path
                d="M6 13C6 21 10 24 16 24C22 24 26 21 26 13C26 11 25 9 24 8C20 9.5 12 9.5 8 8C7 9 6 11 6 13Z"
                fill="#ffffff"
              />
              <path d="M10 14Q12 11 14 14" strokeWidth="2.5" />
              <path d="M18 14Q20 11 22 14" strokeWidth="2.5" />
              <polygon
                points="15,17 17,17 16,18.5"
                fill="#413f4b"
                stroke="none"
              />
              <path d="M14 19Q16 21 18 19" />
              <line x1="7" y1="16" x2="4" y2="15" />
              <line x1="7" y1="18" x2="4" y2="19" />
              <line x1="25" y1="16" x2="28" y2="15" />
              <line x1="25" y1="18" x2="28" y2="19" />
            </svg>
          </div>
          <div>
            <span className="font-display text-3xl leading-none tx-ink block">
              Sublikat
            </span>
            <span className="text-[11px] font-extrabold uppercase tracking-widest tx-muted block -mt-0.5">
              Taller de estampados
            </span>
          </div>
        </a>

        <nav className="hidden md:flex items-center gap-7 tx-ink font-bold text-sm tracking-wide">
          {renderNavigationLinks()}
        </nav>

        {!isMobile && themeToggle}

        <button
          ref={menuButtonRef}
          type="button"
          id="menu-btn"
          className="md:hidden h-[44px] w-[44px] bg-surface tx-ink sticker-border sticker-shadow-sm flex items-center justify-center"
          aria-expanded={menuOpen}
          aria-controls="menu-movil"
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>

        <nav
          id="menu-movil"
          className="menu-movil basis-full w-full"
          aria-label="Menú móvil"
          hidden={!menuOpen}
        >
          {renderNavigationLinks(true)}
          <div
            className="menu-movil__tema"
            id="menu-tema"
            hidden={!isMobile}
          >
            {isMobile ? themeToggle : null}
          </div>
        </nav>
      </div>
    </header>
  );
}

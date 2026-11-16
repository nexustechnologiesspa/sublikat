# Sublikat — Etapa 3.2b: Header y WhatsAppWidget

## Auditoría previa del comportamiento original

La fuente consultada fue `docs/archive/index-original.html`; las reglas de
presentación permanecen en `src/styles/` y se cargan desde `src/main.jsx`.

- **Navegación:** el header contiene el logotipo enlazado a `#`, enlaces a
  `#tienda`, `#contacto`, `#resenas` y `#contacto`, y una versión móvil con los
  mismos destinos.
- **Menú móvil:** `#menu-btn` alterna `hidden` en `#menu-movil`, `aria-expanded`
  y su nombre accesible. Los enlaces lo cierran. `Escape` también lo cierra y
  devuelve el foco al botón.
- **Tema:** la clave de persistencia es `sublikat-tema`; sin valor guardado se
  consulta `prefers-color-scheme`. El tema se refleja en `html[data-theme]`,
  `aria-pressed`, `aria-label`, `title` y los iconos/texto del botón.
- **Posición del control de tema:** a un ancho máximo de 767 px, el botón
  existente se mueve a `#menu-tema`; a partir de 768 px vuelve a la cabecera.
  El cambio de posición requiere volver a medir `--hh`.
- **Navegación activa:** un `IntersectionObserver` con `rootMargin: "-35% 0px
  -55% 0px"` observa `#tienda`, `#proceso`, `#resenas` y `#contacto`, y actualiza
  `aria-current` de los enlaces del header.
- **WhatsApp:** el enlace abre una pestaña nueva, incluye el mensaje y el número
  originales. Un listener pasivo añade `.compact` únicamente cuando
  `window.scrollY > 400`; al bajar a 400 o menos la retira.

Dependencias compartidas: `data-theme` alimenta los tokens de ambos temas;
`--hh` se utiliza en reglas de cabecera, portada y anclajes; el observador
depende de los IDs de las secciones. El CSS existente controla el aspecto y la
visibilidad responsive del menú y del widget.

## Migración y archivos modificados

- `src/components/Header/Header.jsx`: reemplazó el stub por el header original y
  su comportamiento React.
- `src/components/WhatsAppWidget/WhatsAppWidget.jsx`: reemplazó el stub por el
  widget original y su listener de scroll.
- `docs/ETAPA-3-2B-HEADER-WHATSAPP.md`: este informe.

No se modificaron `App.jsx`, secciones, Portada, ReadingProgress, hojas CSS,
HTML archivado, recursos ni configuraciones.

### Header

Se preservaron la jerarquía, los textos, clases, IDs, destinos, SVG del logotipo
y controles, atributos ARIA y `data-listo="1"` del tema. React mantiene estos
estados:

- `theme`: único estado claro/oscuro compartido por el control, que se renderiza
  una sola vez y cambia de ubicación según el breakpoint.
- `menuOpen`: visibilidad del menú y valores de `aria-expanded`/`aria-label`.
- `isMobile`: ubicación del control según `(max-width: 767px)`.
- `activeSection`: valor de `aria-current` de los enlaces observados.

El tema se inicializa desde `localStorage` o la preferencia del sistema, se
aplica a `html[data-theme]` y se persiste en `sublikat-tema` al alternarlo. El
menú cierra por enlace o Escape; Escape devuelve el foco al botón. La medición
de `--hh` se conserva en montaje, carga, resize y cambios de menú/viewport.
Los efectos limpian listeners y desconectan el `IntersectionObserver`.

### WhatsAppWidget

Se preservaron el atributo `data-od-id`, enlace exacto, número, mensaje,
`target`, `rel`, etiqueta accesible, texto e icono SVG. Un estado booleano
controla la clase `.compact`; el listener pasivo usa el umbral estricto
`scrollY > 400`, evita actualizaciones si el estado no cambia y se elimina al
desmontar.

## Pruebas y resultados

- `npm run build`: **correcto** con Vite 8.3.8 (31 módulos transformados).
- Servidor de desarrollo: carga correcta en navegador y respuesta HTTP 200.
- Menú móvil: al abrir, `aria-expanded="true"` y `#menu-movil` visible; Escape
  lo cierra, actualiza ARIA y devuelve el foco a `#menu-btn`. Seguir un enlace
  actualiza el hash y cierra el menú.
- Breakpoint: a 767 px hay un único `#theme-toggle` dentro de `#menu-tema`; a
  768 px continúa habiendo uno, situado en la cabecera.
- Tema: el control de escritorio cambió de claro a oscuro, actualizó ARIA y
  `localStorage`; tras recargar se mantuvo oscuro. El mismo control, ya situado
  en el menú móvil, volvió a claro y el estado persistió tras otra recarga. Se
  restauró el valor de almacenamiento que había antes de la prueba.
- Navegación activa: al navegar a `#tienda`, los enlaces de escritorio y móvil
  correspondientes recibieron `aria-current="true"`.
- WhatsApp: se verificaron el `href` completo
  (`https://wa.me/56949409253?text=Hola%20Sublikat,%20quiero%20cotizar%20un%20estampado`),
  `target="_blank"`, `rel="noopener noreferrer"`, texto y `aria-label`. No se
  abrió el sitio externo.
- Umbral: en `scrollY=400` no se aplica `.compact`; en `401` sí; al volver a
  `400` se retira.
- DOM/ARIA: se comprobó la estructura y unicidad de `#menu-btn`, `#menu-movil`,
  `#menu-tema` y `#theme-toggle`.
- Consola: cero errores de la aplicación durante las pruebas. Se observó la
  advertencia ya existente de `cdn.tailwindcss.com`.
- `git diff --check`: **sin errores**.

No se compararon capturas con la página original; no se declara equivalencia
visual completa.

## Diferencias y pendientes

No se identificaron diferencias funcionales pendientes dentro de estos dos
componentes. Las demás secciones de la aplicación siguen siendo provisionales;
su contenido e interacciones no forman parte de esta etapa.

## Límites de alcance

El trabajo se realizó en `feat/react-vite-migration`, sobre
`d6ee631 docs: verificar portada y progreso de lectura`. No se instalaron
dependencias, no se cambió Tailwind, no se modificaron animaciones CSS ni
archivos fuera del alcance indicado. No se hizo commit ni push.

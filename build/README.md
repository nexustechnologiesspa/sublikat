# build/ — la fuente de verdad del sitio

> **Aviso (2026-11-16): `index.html` va por delante de `build/`.** Desde el 2026-11-15 se editó la
> página directamente (copy de héroe, ventajas y avisos cambiada a mano), así que los parciales de
> `build/sections/` **no reproducen** el contenido actual. Mientras no se resincronice todo el cuerpo,
> `actualizar-portada.ps1` **revertiría** ese copy: no se ejecuta sin revisar antes. Las secciones que
> sí se han espejado (ventajas, 2026-11-16) están marcadas abajo. `index.html` manda.

Aquí vive todo lo que se inyecta en `index.html`. `index.html` es un archivo **generado**: no se
edita a mano, se regenera.

```powershell
powershell -File build\actualizar-portada.ps1
```

Ese comando reconstruye las páginas que existan. Hoy **solo existe `index.html`**: las otras cuatro
(`tienda.html`, `personalizados.html`, `cotizar.html`, `contacto.html`) no están en disco y el script
avisa de que se omiten.

> **Nota sobre el catálogo (resuelto el 2026-11-12):** `data/catalogo.json` declara **19** productos y
> la portada tiene **19** fichas, con los mismos ids. Ejecutar el ensamblador es seguro: la página
> resultante es idéntica y una segunda ejecución da el mismo archivo byte a byte. Las fichas y las
> pestañas se generan desde `data/catalogo.json` con `templates/ficha.html` y
> `templates/pestana.html`, así que **los ganchos `od-*` de cada ficha viven en la plantilla**.

---

## 1. Estructura

```
build/
  actualizar-portada.ps1   El ensamblador: mete cada origen en su zona OD:
  actualizar-inicio.ps1     Reconstruye la portada desde la plantilla
  aplicar-contenido.ps1    Vuelca contenido-inicio.json en la página
  ganchos-scroll.ps1       Añade las clases od-* al markup (idempotente)
  limpiar-hex.ps1          Comprueba que el color solo viva en los tokens

  tokens.css               LOS TOKENS: un bloque por tema, sin alias
  motion.css               El movimiento ligado al scroll (zona OD:MOTION), implementado
  css/                      El CSS, un archivo por sección
    base.css                 reset, tipografía y utilidades base
    components.css           botones, tarjetas, badges, campos y utilidades de color
    header.css               cabecera, navegación y menú móvil
    hero.css                 héroe
    beneficios.css           ventajas del taller
    aviso.css                aviso de taller
    catalogo.css             pestañas, paneles y fichas
    proceso.css              método de trabajo
    compromisos.css          compromisos del taller
    contacto.css             formulario, ficha del taller y confirmación
    footer.css               pie de página
    widget.css               botón flotante de WhatsApp
  app.js                   Tema, pestañas, formulario, menú móvil, carruseles
  sections/                Los parciales de la página (el cuerpo)
    header.html              aviso de prototipo + cabecera
    hero.html                héroe
    beneficios.html          ventajas del taller
    aviso.html               aviso de taller
    catalogo.html            catálogo (las pestañas y fichas las genera el script)
    proceso.html             método de trabajo
    compromisos.html          compromisos del taller
    contacto.html            formulario y contacto (las opciones las genera el script)
    footer.html              pie de página
    widget-whatsapp.html     botón flotante de WhatsApp
  data/catalogo.json       El modelo del catálogo: 5 categorías y 19 productos (los de la página)
  icons/                   Un SVG por producto (19), insertados en línea en las fichas
  templates/               Plantillas de lo que genera el script
    pestana.html             la pestaña de una categoría
    ficha.html               la ficha de un producto
  exito-contacto.html      Panel de confirmación del formulario
```

Los ficheros del rediseño violeta, `index2.html`, las pantallas de Stitch y el antiguo
`theme-toggle.html` **no están aquí**: se archivaron en `archive/` el 2026-11-12. `build/` solo
contiene lo que se inyecta en la página.

## 2. Orden de carga

**CSS** (cuatro bloques en el `<head>`):

| Zona | Fichero | Qué aporta |
|---|---|---|
| `OD:BASE` | `css/base.css` | reset, tipografía y utilidades base |
| `OD:TOKENS` | `tokens.css` | las variables de diseño (una definición por tema) |
| `OD:ESTILOS` | `css/components.css` + los archivos de sección | componentes compartidos y estilos de cada sección, en el orden de la página |
| `OD:MOTION` | `motion.css` | movimiento ligado al scroll; va al final para poder neutralizarlo con el guard de movimiento reducido |

**JavaScript:** un solo bloque (`OD:APP`) con `app.js`, dentro del `<head>` —entre `OD:TOKENS` y
`OD:ESTILOS`—. No depende del orden del DOM porque espera a `DOMContentLoaded`.

**Cuerpo:** diez parciales en el orden de la página (`OD:HEADER`, `OD:HERO`, `OD:BENEFICIOS`,
`OD:AVISO`, `OD:CATALOGO`, `OD:PROCESO`, `OD:COMPROMISOS`, `OD:CONTACTO`, `OD:EXITO`, `OD:FOOTER`,
`OD:WIDGET`).

## 3. Cómo regenerar

```powershell
powershell -File build\ganchos-scroll.ps1       # 1. ganchos od-* en parciales e index.html
powershell -File build\actualizar-portada.ps1   # 2. reconstruye el HTML
powershell -File build\ganchos-scroll.ps1       # 3. no-op: comprueba que no falta ninguno
& $env:OD_NODE_BIN $env:OD_BIN lint index.html # 4. 0 avisos
```

El paso 1 va **antes** de ensamblar: los ganchos son marcado y viven en los parciales, así que si
solo se tocan en `index.html` el ensamblador los borra. El paso 3 es la comprobación de que los dos
lados están sincronizados: si aplica algo, es que faltaba en el origen.

El ensamblador es **idempotente**: dos ejecuciones seguidas dan el mismo fichero. Si una zona falta
(en una restauración desde el historial), la reinserta en su sitio.

Antes de dar por buena cualquier cambio, compara las capturas:

```powershell
node qa\capturar-linea-base.mjs qa\comparacion   # capturas nuevas
```

y compáralas con las de `qa/baseline/capturas/`.

## 4. Cómo agregar un producto

Se edita **solo** `build/data/catalogo.json` y se regenera. El script rehace las pestañas, los
paneles, las fichas y las opciones del desplegable.

```json
{
  "id": "termos",
  "nombre": "Termos",
  "nota": "Capacidad de 500 ml",
  "icono": "producto-termos.svg",
  "selectValor": "termos",
  "selectTexto": "Termos de 500 ml",
  "dataProducto": "Termos"
}
```

- El `icono` es el SVG de `build/icons/`, que se inserta **en línea** en la ficha (no como
  `<img>`: los iconos usan `stroke="currentColor"` y como imagen externa perderían el color).
- Se añade el `id` a la lista `productos` de su categoría en el mismo JSON.
- Si el producto lleva nota, va en `nota` y se imprime bajo el título.

## 5. Cómo cambiar un token

El color vive **solo** en `build/tokens.css`, en un bloque por tema:

```css
:root,
[data-theme="light"] {
  --accent: #d4573f;   /* acción, CTA, pestaña activa, foco */
}
[data-theme="dark"] {
  --accent: #d4573f;
}
```

Se cambia el valor, se ejecuta `actualizar-portada.ps1` y se comprueba con `od lint` y las capturas.
**Ningún color vive como hexadecimal suelto** en `build/css/`: todo se referencia con `var(--…)`
(`build/limpiar-hex.ps1` lo comprueba).

Si hace falta un token nuevo, se declara en el bloque que corresponda y se usa con `var(--…)`.

## 6. Cómo cambiar el movimiento

El movimiento vive **solo** en `build/motion.css`, que se inyecta en la zona `OD:MOTION`. Las reglas
completas y la matriz por sección están en `MOTION.md`.

- Solo se animan `transform`, `translate` y `opacity`.
- El estado inicial (`opacity: 0`) va dentro de `@supports (animation-timeline: view())` **y** de
  `@media (prefers-reduced-motion: no-preference)`, para que sin soporte se vea todo.
- Sin librerías, sin listeners de `scroll` y sin `requestAnimationFrame`.
- Los ganchos `od-*` están en el marcado (48 elementos, 51 clases); se añaden con
  `ganchos-scroll.ps1`, que es idempotente.

El archivo está implementado desde el 2026-11-12 con las filas 1, 2, 3, 4, 6, 9, 10 y 11 de la matriz:
barra de lectura, sombra de cabecera, entrada del héroe y apariciones al entrar en pantalla. El
2026-11-14 se le.sumaron cuatro demos más de `scroll-driven-animations.style`, una por sección: la
foto del héroe que se retira al bajar (demo 5), la columna vertebral del proceso (demo 15), el icono de
la ficha que se asienta (demo 6) y las sombras de borde de los carruseles (demo 14). La animación del
aviso legal y la del cambio de pestaña quedan fuera por decisión del cliente.

Las demos nuevas **no cambian el markup**: la línea del proceso son pseudo-elementos de la rejilla y
el segmento de móvil es un pseudo-elemento de la tarjeta. El mapa completo por sección está en
`MOTION.md` §6 y las mediciones en `qa/movimiento-implementado.md` §12.

Si hay que quitar el movimiento, basta con vaciar la zona `OD:MOTION`: el resto de capas y el texto
visible no dependen de ella.

## 7. Convenciones

- Cada sección tiene su archivo de CSS. Lo que usen varias secciones va a `components.css`.
- Los identificadores que crea el JavaScript (`.has-error`, `.compact`, `.on`) no se deben borrar del
  CSS.
- `data-od-id` va siempre como atributo propio, nunca dentro del valor de `class`.
- Los textos con datos de ejemplo se etiquetan como ejemplo; no se inventan precios, plazos ni
  condiciones comerciales.

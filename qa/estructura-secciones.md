# Un `<main>` y un parcial por sección

> **Documento de etapa.** Describe la estructura del cuerpo tal como estaba cuando se escribió. La
> referencia a la zona `OD:SCROLL` es **histórica**: hoy esa capa se llama `OD:ESTILOS` y el
> movimiento tiene zona propia (`OD:MOTION`). Ver `qa/orden-proyecto.md`.

**Fecha:** 12 de noviembre de 2026
**Alcance:** la estructura del cuerpo de `index.html` y el montaje por zonas de `build/`.
**Naturaleza de la etapa:** refactor puro. Cero cambios visuales, de contenido o de comportamiento.

---

## 1. Resultado

El cuerpo de la portada ya no es un bloque de HTML escrito a mano: son **diez parciales** en
`build/sections/`, montados por `build/actualizar-portada.ps1` en un orden fijo, con **un solo
`<main>`** que envuelve todo el contenido.

```
body
├─ aviso de prototipo + cabecera ..............  build/sections/header.html      (OD:HEADER)
├─ main                                        ← único <main>, sin clases
│  ├─ div w-full max-w-[1200px] … pt-4 …      ← el contenedor que antes era <main>
│  │  ├─ héroe .................................  build/sections/hero.html        (OD:HERO)
│  │  ├─ beneficios ...........................  build/sections/beneficios.html  (OD:BENEFICIOS)
│  │  └─ div py-10 px-4 md:px-8 sel-awning …   ← envoltorio conservado (paddings)
│  │     └─ div max-w-[1200px] mx-auto space-y-16   ← el contenedor que antes era <main>
│  │        ├─ aviso de taller ..................  build/sections/aviso.html       (OD:AVISO)
│  │        ├─ catálogo ..........................  build/sections/catalogo.html    (OD:CATALOGO)
│  │        ├─ proceso ...........................  build/sections/proceso.html     (OD:PROCESO)
│  │        └─ pie contextual (legal y prototipo) → sigue en index.html
│  └─ div main-container ....................... ← el contenedor que antes era <main>
│     ├─ compromisos ............................  build/sections/compromisos.html (OD:COMPROMISOS)
│     └─ contacto ...............................  build/sections/contacto.html    (OD:CONTACTO)
├─ pie de página ................................  build/sections/footer.html      (OD:FOOTER)
└─ botón flotante de WhatsApp ...................  build/sections/widget-whatsapp.html (OD:WIDGET)
```

## 2. Los `<main>` repetidos y los contenedores

La página tenía **tres `<main>`**: el contenedor general, uno anidado dentro del envoltorio del
aviso y otro para compromisos y contacto. Además había dos envoltorios que afectan al
espaciado (padding vertical y `space-y-16`).

Regla aplicada: **se conserva la geometría, se cambia la etiqueta**.

| Antes | Ahora | Por qué |
|---|---|---|
| `<main class="w-full max-w-[1200px] mx-auto px-4 sm:px-6 pt-4 sm:pt-6">` | `<div class="…">` + un `<main>` sin clases por encima | El `<main>` nuevo es un envoltorio neutro; los dos contenedores que ya existían siguen aplicando exactamente los mismos anchos y paddings |
| `<main class="max-w-[1200px] mx-auto space-y-16">` | `<div class="max-w-[1200px] mx-auto space-y-16">` | `space-y-16` separa las secciones: quitarlo cambiaría el espaciado, así que se conserva |
| `<main class="main-container">` | `<div class="main-container">` | Igual: la clase define el ancho del bloque |
| `<div class="py-10 px-4 md:px-8 sel-awning sel-ink">` | igual | Aporta el padding vertical del bloque y los colores de selección |

En HTML, `main` y `div` se renderizan igual (`display: block`, sin márgenes por defecto), así que
el cambio de etiqueta no altera ni un píxel. Verificado con las capturas.

## 3. Los parciales

| Fichero | Zona | Contenido |
|---|---|---|
| `build/sections/header.html` | `OD:HEADER` | aviso de prototipo + `<header id="site-header">` con su navegación y conmutador |
| `build/sections/hero.html` | `OD:HERO` | cinta decorativa, columna de texto con el H1 y los CTA, columna de la foto |
| `build/sections/beneficios.html` | `OD:BENEFICIOS` | `#beneficios` con las 4 ventajas |
| `build/sections/aviso.html` | `OD:AVISO` | `#aviso-taller`, el banner de piezas listas |
| `build/sections/catalogo.html` | `OD:CATALOGO` | `#tienda`: encabezado, pestañas y los 5 paneles con las 19 fichas |
| `build/sections/proceso.html` | `OD:PROCESO` | `#proceso`: los 4 pasos y el CTA de lote |
| `build/sections/compromisos.html` | `OD:COMPROMISOS` | `#resenas`: «Compromisos del taller» |
| `build/sections/contacto.html` | `OD:CONTACTO` | `#contacto`: formulario, panel de confirmación (`OD:EXITO` dentro) y tarjeta lateral |
| `build/sections/footer.html` | `OD:FOOTER` | pie de página con sus cuatro columnas y el aviso legal |
| `build/sections/widget-whatsapp.html` | `OD:WIDGET` | botón flotante de WhatsApp |

El markup se movió **tal cual**: no se añadió, quitó ni reformateó ninguna etiqueta, texto,
clase o `data-od-id`.

## 4. El script

`build/actualizar-portada.ps1` ahora tiene dos grupos de zonas:

- **Cabecera del documento:** `OD:BASE`, `OD:TOKENS`, `OD:SCROLL`, `OD:APP` (CSS y JS).
- **Cuerpo:** las diez zonas de sección, en el orden de la tabla anterior, y al final `OD:EXITO`
  (el panel de confirmación, que vive dentro del parcial de contacto).

Añadido: `Asegurar-Zona-Orden`, que inserta una zona que falte **justo después del cierre de la
zona anterior**, para que el orden del documento se respete aunque el host restaure una versión
antigua del HTML.

`OD:CABECERA` y `OD:PIE` se renombraron a `OD:HEADER` y `OD:FOOTER` para que coincidan con el
nombre de su parcial.

## 5. Anclas, enlaces y accesibilidad

| Comprobación | Resultado |
|---|---|
| Anclas exigidas (`#tienda`, `#proceso`, `#resenas`, `#contacto`, `#beneficios`, `#aviso-taller`, `#aviso-legal`, `#cat-*`) | 12 de 12 presentes |
| Enlaces internos (`href="#…"`) | 41 enlaces, 11 destinos, **0 rotos** |
| `<main>` | 1 |
| `<header>` / `<footer>` | 1 / 2 (el contextual y el de página) |
| Roles ARIA | 5 `tab`, 5 `tabpanel`, 1 `contentinfo`; todos los `aria-controls` apuntan a paneles existentes |
| `<h1>` | 1 |
| `data-od-id` | 36, los mismos que antes |
| Ids que usa el JavaScript | los 5 del formulario + `theme-toggle`, `form-contacto`, `error-summary`, `exito-contacto`, `site-header`, `menu-btn`, `menu-movil`: todos presentes |

## 6. Pruebas

| Prueba | Resultado |
|---|---|
| `powershell -File build/actualizar-portada.ps1` | `index.html reconstruido (136.624 caracteres)`; las otras cuatro páginas siguen sin existir y se omiten |
| `od lint index.html` | **clean — 0 hallazgos (P0 0 · P1 0 · P2 0)** |
| Capturas contra la línea base (21 PNG, 375/768/1280 px, claro y oscuro, 5 pestañas) | 15 de 21 idénticas al píxel; las 6 restantes difieren dentro del ruido de captura medido (hasta 0,59 % en 768 oscuro) |
| Ruido de la propia captura (misma página, dos ejecuciones) | 17 de 21 idénticas; las 4 restantes difieren en 0,004 %–8,2 %, con la misma firma y las mismas zonas (última fila del catálogo y el `<select>` del formulario) |
| Enlaces internos | 0 rotos |

El ruido procede del control nativo `<select>` y de la última fila del catálogo, cuyo pintado
depende del scroll. Está documentado en `qa/baseline/README.md`.

## 7. Archivos

### Creados

- `build/sections/header.html`, `hero.html`, `beneficios.html`, `aviso.html`, `catalogo.html`,
  `proceso.html`, `compromisos.html`, `contacto.html`, `footer.html`, `widget-whatsapp.html`.
- `qa/estructura-secciones.md` — este informe.

### Modificados

- `build/actualizar-portada.ps1` — zonas del cuerpo en orden, `Asegurar-Zona-Orden`, lectura de
  los parciales desde `build/sections/`.
- `index.html` — nuevo esqueleto del cuerpo: un `<main>`, diez zonas, tres `<main>` convertidos
  en `<div>` con sus clases intactas.

### Movidos y eliminados

| Antes | Ahora |
|---|---|
| `build/cabecera.html` | `build/sections/header.html` |
| `build/pie.html` | `build/sections/footer.html` |
| `build/widget-whatsapp.html` | `build/sections/widget-whatsapp.html` |

Los tres ficheros originales se eliminaron: ahora hay una sola fuente para cada bloque.

## 8. Pendientes que esta etapa no toca

- **El pie contextual con la información legal y de prototipo** sigue en `index.html`, dentro del
  envoltorio del aviso, entre `OD:PROCESO` y el cierre del `div`. No es una de las diez secciones
  del encargo y no tiene parcial propio.
- **`build/theme-toggle.html`**: era el fragmento del conmutador de la versión anterior y ya no lo
  usaba ningún script (el conmutador vive dentro de `header.html`). **Archivado** en
  `archive/referencias/fragmentos/` el 2026-11-12.
- **Los tres campos del formulario que faltan** (`Cantidad`, `Información del diseño` y `Medio de
  contacto`) siguen fuera del formulario: `build/app.js` valida los cinco campos que existen, así
  que no da error, pero el formulario no ofrece esas casillas.
- **Los cuatro `<main>` del histórico**: ya no quedan más que uno; el resto de la web (las otras
  cuatro páginas) aún no existe.

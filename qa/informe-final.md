# Informe final — validación del refactor

**Fecha:** 12 de noviembre de 2026
**Alcance:** validar el refactor de `build/` y documentar el proyecto.
**Naturaleza:** verificación; los tres defectos que aparecieron se corrigieron en el origen.

> **Documento de etapa.** Las cifras son las del momento en que se cerró el refactor (137.967
> caracteres). Desde entonces la página ha crecido a **147 624 caracteres / 3487 líneas** y el
> ensamblador se revalidó. El estado vigente está en `qa/orden-proyecto.md` §11. En particular, el
> catálogo quedó conciliado en **19 productos** (dato y página coinciden, comprobado el 2026-11-12):
> la cifra «24» que circuló en otros documentos era un error, no un desfase. El movimiento ligado al
> scroll está implementado y medido en navegador: `qa/movimiento-implementado.md`.

---

## 1. Resultado

| Comprobación | Resultado |
|---|---|
| `powershell -File build\actualizar-portada.ps1` | `index.html reconstruido (137.967 caracteres)`, idempotente (mismo `sha256` en dos ejecuciones) |
| `od lint index.html` | **clean — 0 hallazgos (P0 0 · P1 0 · P2 0)** |
| Pruebas funcionales y de accesibilidad (`qa/probar-portada.mjs`) | **52 de 52 superadas** (eran 25 al cerrar el refactor; el arnés creció con las demos de movimiento, la regresión de la portada, la foto responsive y la ubicación del conmutador de tema) |
| Capturas contra la línea base (375/768/1280 px, claro y oscuro, 5 pestañas) | 17 de 21 idénticas al píxel; las 4 restantes dentro del ruido medido |
| Selectores de CSS sin uso | **ninguno** |

## 2. Pruebas funcionales (Playwright, Chrome headless)

| Prueba | Resultado |
|---|---|
| Menú móvil: abre, cierra con Escape y `aria-expanded` | correcto (`hidden` + `display: none` al cerrar) |
| Las 5 pestañas cambian de panel | correcto: un solo panel visible y `aria-selected` al día |
| Teclado en las pestañas | correcto: `→` avanza y `Fin` salta a la última |
| Carruseles | 3 carruseles con sus 3 indicadores `.dots` |
| Formulario: envío vacío | muestra el resumen con 3 errores (Nombre, Correo, Detalles) y marca los campos con `aria-invalid` |
| Formulario: confirmación | el clic en «Revisar mi consulta» confirma, con el nombre del formulario y el formulario oculto |
| Formulario: «Enviar otra consulta» | reinicia el formulario y vuelve a ocultar la confirmación |
| Botón de tema | alterna claro/oscuro, guarda en `localStorage` y actualiza `aria-pressed` y el icono |
| Widget de WhatsApp | enlace a `wa.me/56949409253`, `target="_blank`, etiqueta accesible, fijo y dentro de la pantalla |
| Sin scroll horizontal | correcto a 375, 768 y 1280 px (`scrollWidth` = `clientWidth`) |
| Errores de consola | **ninguno** |

## 3. Accesibilidad

| Comprobación | Resultado |
|---|---|
| Foco visible | `outline` o `box-shadow` de foco en la pestaña, el conmutador y los campos |
| Contraste en modo claro | 11,72 – 14,48 (mínimo AA: 4,5) |
| Contraste en modo oscuro | 11,40 – 13,34 |
| Un solo `<h1>` | 1 |
| Un solo `<main>` | 1 |
| Identificadores duplicados | 0 (46 ids únicos) |

## 4. Defectos encontrados y corregidos

1. **El menú móvil no se cerraba.** La regla `html .menu-movil[hidden] { display: none !important }` había quedado en `build/css/base.css`, y como `build/css/header.css` se carga después, la regla `html .menu-movil { display: grid }` la ganaba. Corregido: la regla vuelve a `header.css`, detrás de la que la acompaña. **Lo introdujo la etapa del CSS por sección**, y no lo detectaron las capturas porque solo se ve al cerrar el menú.
2. **La confirmación del formulario nunca aparecía.** El panel se oculta con la clase `hidden` de Tailwind, y el JavaScript solo quitaba el atributo `hidden`. Corregido en `build/app.js`: ahora quita también la clase. **Defecto previo al refactor**, no lo introdujo esta serie de etapas.
3. **Un 404 en cada carga.** El navegador pedía `/favicon.ico` y la página no declaraba ninguno. Añadido `assets/favicon.svg` (la marca del gato, dibujo propio) y su `<link rel="icon">` en el `<head>`.

### Observación, no defecto

En la prueba automatizada, el **segundo** envío (después de que el resumen de errores se inserta en
el formulario) no llega a disparar el evento `submit`; hay que repetirlo con `requestSubmit()`. En
una página limpia, el mismo clic funciona y la confirmación aparece ✓. Lo causa el desplazamiento
del botón cuando se inserta el resumen, no la página: en un navegador real el usuario ve el
formulario ya movido y hace clic donde está el botón.

## 5. Diferencias visuales frente a la línea base

| Captura | Diferencia |
|---|---|
| 6 capturas de página completa (375 y 1280 px, claro y oscuro) | 0 px |
| `completa-768-light` | 4 px (0,0001 %), antialiasing |
| `completa-768-dark` | 290 px (0,0046 %), antialiasing |
| 4 capturas de sección del catálogo | 1 % – 2,9 %, en la última fila de tarjetas |

Las tres diferencias medidas son **ruido del proceso de captura**, no del contenido: comparando
**la misma página** en dos ejecuciones se obtiene exactamente la misma firma (0,0046 % en 768
oscuro, la misma banda de la última fila). Está documentado en `qa/baseline/README.md`.

## 6. Documentación

- `build/README.md` (nuevo): estructura de carpetas, cómo regenerar, cómo agregar un producto, cómo
  cambiar un token y el orden de carga de CSS y JS.
- `ARQUITECTURA.md` actualizado en §2 (zonas), §3 (mapa de ficheros) y §4 (capas de CSS).
- `qa/` con un informe por etapa: `auditoria.md`, `refactor-build.md`, `estructura-secciones.md`,
  `css-por-seccion.md`, `catalogo-desde-datos.md`, `tailwind-clases.md` y este.

### Añadido después de este informe

| Fecha | Qué | Dónde está medido |
| --- | --- | --- |
| 2026-11-14 | Cinco demos de scroll-driven animations (héroe, fichas, proceso, sombras de carrusel, portada) | `qa/movimiento-implementado.md` §12 y §13, `MOTION.md` |
| 2026-11-15 | Cabecera `fixed` sobre la portada y portada que se encoge hasta una banda bajo el menú; panel `#exito-contacto` restaurado; banda al ras del menú; retirada la línea del proceso; foto de portada responsive | `qa/movimiento-implementado.md` §15, `MOTION.md` §11.4 |
| 2026-11-16 | El conmutador de tema se muda dentro del menú de hamburguesa en móvil y vuelve a la barra al ensanchar | `qa/movimiento-implementado.md` §15.9 |

El arnés pasó de 25 a **54 pruebas**: las 25 funcionales y de accesibilidad del refactor, más las de
movimiento, las de la portada, la de la foto responsive, las tres de la ubicación del conmutador y las dos
del regreso al principio del catálogo.

## 7. Pendientes

- **El CDN de Tailwind**: sigue en la portada. El recuento de clases está en
  `qa/tailwind-clases.md` y falta decidir entre compilarlo en `build/` (A) o reescribir las 224
  utilidades como CSS propio (B).
- **La paleta**: cerrada el 2026-11-12 en crema con tipografía Chewy. El rediseño violeta con Archivo
  y la tríada están archivados en `archive/referencias/pendiente-violeta/` y
  `archive/referencias-paletas/`.
- **El formulario** conserva cinco campos: faltan «Cantidad», «Información del diseño» y «Medio de
  contacto», que sí existen en `cotizar.html`.
- **El `<head>`** no tiene origen en `build/`: los `<meta>`, el `<title>` y el `<link>` del
  favicon se editan en `index.html`. Una zona `OD:HEAD` lo arreglaría.
- **`index2.html`** ya está archivado en `archive/referencias/` (era una copia obsoleta con dos
  defectos de markup ya corregidos). **`build/theme-toggle.html`** también se archivó, en
  `archive/referencias/fragmentos/`: ningún script lo usaba (el conmutador vive dentro de
  `header.html`).

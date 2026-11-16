# Ordenamiento del proyecto Sublikat

**Fecha:** 12 de noviembre de 2026
**Alcance:** dejar el proyecto en una sola sede, con un solo artefacto canónico, una sola dirección
visual y una capa de movimiento con nombre propio, **sin cambiar la página**.
**Naturaleza de la etapa:** orden y documentación. Cero cambios visuales, de contenido o de
comportamiento. La única modificación del marcado son clases `od-*` que no tienen estilo activo.

---

## 1. Las dos decisiones que abrieron la etapa

| Pregunta | Decisión |
| --- | --- |
| ¿Dónde vive el proyecto? | En la carpeta de Open Design (`…\data\projects\ac4fb290-…`). `Documents\AI_OPERATING_SYSTEM\projects\Sublikat2.0` está vacía y **no** se usa |
| ¿Qué dirección visual se queda? | **Crema `#f4e6c8` + Chewy**. Violeta/Archivo y la tríada se retiran: el cliente las vio y no lo convencieron |

---

## 2. El diagnóstico que motivó el orden

Cuatro desincronizaciones, todas capaces de envenenar un re-análisis del movimiento:

| Capa | Lo que decía | Lo que había |
| --- | --- | --- |
| `DESIGN.md` | Existía `build/scroll-animations.css` y una zona `OD:SCROLL` | Ese archivo se eliminó en el refactor de CSS por sección y `OD:SCROLL` se renombró a `OD:ESTILOS` |
| `DESIGN.md` y `ARQUITECTURA.md` | Tríada magenta/cyan y rediseño violeta | `index.html` estaba en crema/Chewy |
| `ARQUITECTURA.md` | 5 páginas y `src/` como fuente editable | Solo `index.html`; `src/` no participaba en nada |
| Panel de artefactos | 15 páginas | 11 manifiestos apuntaban a HTML que no existía |

---

## 3. Qué se archivó (no se borró)

Todo lo retirado está en `archive/`, con 16 ficheros. Nada de ahí se usa para construir.

| Origen | Destino | Qué es |
| --- | --- | --- |
| `index.html` (copia previa) | `archive/baseline/index-2026-11-12.html` | Instantánea antes de tocar nada. 138 308 bytes |
| `index2.html` | `archive/referencias/index2.html` | Copia obsoleta de la portada, con dos defectos de markup ya corregidos |
| `src/` | `archive/referencias/src/` | `04-modo-oscuro.html` y `05-movil.html`: montajes de Stitch que no heredan tokens |
| `build/pendiente-violeta/` | `archive/referencias/pendiente-violeta/` | 9 ficheros del rediseño violeta con Archivo (`tokens.css`, `base.css`, `widget.css`, `scroll-animations.css`, `app.js`, `cabecera.html`, `pie.html`, `theme-toggle.html`, `exito-contacto.html`) |
| `AdobeColor-Triada-Sublikat.jpeg` | `archive/referencias-paletas/` | Tríada del cliente, descartada |
| `AdobeColor-Complementarios-Sublikat.jpeg` | `archive/referencias-paletas/` | Segunda extracción de Adobe Color, descartada |
| `build/theme-toggle.html` | `archive/referencias/fragmentos/theme-toggle.html` | Fragmento del conmutador de la versión anterior. Ningún script lo usaba: el conmutador vive dentro de `header.html` |

**Por qué archivar y no borrar:** son el registro de lo que se propuso y se rechazó. Si dentro de
tres meses alguien pregunta «¿por qué no se usó la paleta del cliente?», la respuesta está en disco.

---

## 4. Qué se eliminó

**14 manifiestos `.artifact.json`** de páginas que no existen. Sin ellos, el panel de artefactos deja
de ofrecer páginas fantasma.

| Grupo | Ficheros |
| --- | --- |
| Raíz (7) | `contacto`, `cotizar`, `personalizados`, `portada-movil`, `portada-oscuro`, `tienda`, `index2` |
| `src/` (7) | `01-hero`, `02-productos-proceso`, `03-resenas-contacto`, `04-modo-oscuro`, `05-movil`, `06-portada-oscuro`, `07-portada-movil` |

Queda **un solo manifiesto**: `index.html.artifact.json`. (Y el de `qa/baseline/`, que es la captura
de QA y se conserva a propósito.)

Ningún fichero de contenido se borró.

---

## 5. Qué se creó

### `build/motion.css` (2755 bytes, 80 líneas al crearse)

Fuente única del movimiento, con nombre propio y sin la ambigüedad de «scroll-animations». Contiene:

- La cabecera con las cinco reglas que toda animación futura debe cumplir.
- El **guard de movimiento reducido**: `@media (prefers-reduced-motion: reduce)` que neutraliza
  `animation`, `opacity` y `translate` en los **26 selectores** de gancho (todos los que existen en el
  marcado, más los tres `od-reveal-*` que aún no se usan). Hoy son **27**, con la barra de lectura.
- Un **patrón de referencia comentado**: cómo se escribirá cada reveal cuando se apruebe. Comentado
  a propósito para que el ordenamiento no cambie ni un píxel.

**No contenía ninguna animación activa** cuando se creó. Verificado entonces: 0 hexadecimales y 0
reglas de animación fuera del guard y del bloque comentado. Desde el 2026-11-12 sí anima (ver §11). La zona `OD:MOTION` de `index.html` es una copia exacta de este
archivo (comprobado por contenido, no a ojo).

### Documentos

| Documento | Qué contiene |
| --- | --- |
| `MOTION.md` | Las 5 reglas, personalidad, intensidad B propuesta, 3 familias, mapa de secciones, **matriz aprobable** (12 filas), fases F1–F4, 9 demos descartados, 5 trampas, verificación |
| `SECTION-MAP.md` | Las 9 secciones con ancla, `data-od-id`, parcial, CSS y líneas reales; restricciones por sección; tabla de los 47 ganchos; qué tocar y qué no |
| `qa/scroll-demos.md` | Los 15 demos de scroll-driven-animations.style con técnica y veredicto: 6 entran, 9 se descartan |
| `qa/orden-proyecto.md` | Este informe |

---

## 6. Qué se modificó

| Fichero | Cambio |
| --- | --- |
| `index.html` | Zona `OD:MOTION` nueva tras `OD:ESTILOS`; 3 tokens de movimiento en `OD:TOKENS`; 47 elementos con clases `od-*` (54 clases); corregido `<footer class="site-footer" od-reveal-soft>` → `<footer class="site-footer od-reveal-soft">` |
| `build/tokens.css` | Tokens `--motion-ease-out`, `--motion-enter`, `--motion-stagger` |
| `build/actualizar-portada.ps1` | `$cssMotion`, `Asegurar-Zona-Orden 'MOTION' 'ESTILOS'` y `Reemplazar-Zona 'MOTION'` |
| `build/ganchos-scroll.ps1` | Reescrito con los anclajes reales de la portada crema/Chewy; idempotente |
| `build/README.md` | `motion.css` en la estructura, 4 capas CSS, sección «Cómo cambiar el movimiento», nota del catálogo, una sola página |
| `DESIGN.md` | Dirección aprobada, tablas de color reales, psicología del color, Chewy definitiva, estructura del proyecto, historial de dirección, sección de animación reescrita, sector 1 cerrado, «Tanda 1» violeta eliminada |
| `ARQUITECTURA.md` | Diagrama de build, 16 zonas, mapa de ficheros, 4 capas, tokens reales, anatomía con líneas reales, pendientes y checklist |
| `PENDIENTES-CLIENTE.md` | Sector 1 cerrado, 1.1 y 1.3 actualizados, 7.2 y 7.11 a crema/Chewy, registro de cambios corregido, «Estado real de la portada» en lugar de «tanda 1» |
| `qa/baseline/README.md` | La advertencia decía que la línea base era «anterior al rediseño aprobado» y que `build/` tenía violeta. Corregido: la crema/Chewy **es** la dirección vigente |
| `qa/informe-final.md`, `qa/catalogo-desde-datos.md`, `qa/estructura-secciones.md` | Rutas de lo archivado y estado de la paleta |

---

## 7. Verificación

| Prueba | Cómo | Resultado |
| --- | --- | --- |
| La página no cambió de texto | Comparar el texto visible (sin `<style>`, `<script>` ni etiquetas) contra `archive/baseline/` | **Idéntico**: 7788 caracteres en los dos |
| Las zonas `OD:` están completas | Contar apertura y cierre de las 19 zonas | **Todas 1/1** |
| Los bloques `<style>` cuadran | Contar `<style>` y `</style>` | **4 / 4** |
| Los tokens de movimiento están en las dos fuentes | Buscar `--motion-enter` en `index.html` y en `build/tokens.css` | **1 / 1** |
| `motion.css` no tiene color propio | Buscar `#rrggbb` | **0** |
| `motion.css` no anima nada | Buscar `animation-timeline` | **3 coincidencias, todas en comentarios o en el guard** |
| El aplicador de ganchos es idempotente | Ejecutarlo dos veces | **45 la primera, 0 la segunda** (y 2 más al añadir el gancho de contacto, 0 al repetir). Cifra de esta etapa; tras mover los ganchos a los parciales es **28 / 0** — ver §10.2 |
| El pie quedó bien formado | Inspeccionar el `<footer>` | **`class="site-footer od-reveal-soft"`** |
| Los anclajes existen | Contar `data-od-id` | **36** |
| Nada de `archive/` se usa para construir | Revisar el script y los parciales | **Solo `build/`** |
| El conmutador huérfano ya no está en `build/` | Buscar `build/theme-toggle.html` | **No existe**: en `archive/referencias/fragmentos/` |

### Lo que no se pudo verificar

- **`od lint index.html`**: el CLI `od` no está en PATH en este entorno. Queda pendiente ejecutarlo
  desde la app antes de entregar.
- **Comparación de capturas**: la línea base visual está en `qa/baseline/capturas/` (21 capturas) y
  no se regeneró. Como el texto visible es idéntico y el CSS no cambió, no debería haber diferencia;
  aun así, una captura nueva antes de implementar el movimiento cerraría el círculo.

---

## 8. Lo que queda pendiente

| # | Pendiente | Dónde |
| --- | --- | --- |
| 1 | Aprobar o recortar la matriz de movimiento | `MOTION.md` §6 |
| 2 | Añadir el gancho de contacto (`.od-reveal-soft` en título y entradilla) | **Hecho**, ver §9.1 |
| 3 | ~~Decidir el catálogo: 24 en `build/data/catalogo.json` vs 19 en la página~~ | **Resuelto, ver §10.1**: son 19 en los dos lados |
| 4 | `od lint index.html` a 0 avisos | App de Open Design (el CLI no está en disco, ver §10.5) |
| 5 | Captura de línea base nueva (opcional) | `qa/capturar-linea-base.mjs` |
| 6 | ~~Retirar `build/theme-toggle.html`~~ | **Hecho**: archivado en `archive/referencias/fragmentos/` |

**El bloqueo del punto 3 ya no existe.** Aquella sospecha de que los datos declaraban 24 productos se
comprobó y era falsa: el JSON declara 19, los mismos ids que la página. Lo que sigue bloqueando la
implementación del movimiento es solo el punto 1, que es una decisión, no una tarea.

---

## 9. Cierre de pendientes (segunda pasada)

Cuatro cosas que quedaron abiertas en la primera pasada y ya están hechas. Ninguna cambia la página.

### 9.1 Gancho de contacto

`build/ganchos-scroll.ps1` gana un bloque `$exactos` para los casos en los que el gancho no va al
final de un `class=""`. Con él se añadió `.od-reveal-soft` al `<h2 id="contact-heading">` y a la
entradilla de contacto. **El formulario no lleva gancho de opacidad**: nunca se oculta, solo se
desplaza, para no romper el foco del teclado ni el resumen de errores.

```
Ganchos aplicados: 2      (primera pasada tras el cambio)
Ganchos aplicados: 0      (segunda pasada: idempotente)
```

Total en el marcado: **47 elementos con al menos un gancho**, 54 clases `od-*` de movimiento.

### 9.2 Conmutador huérfano

`build/theme-toggle.html` no lo usaba ningún script (el conmutador vive dentro de `header.html`) y
solo lo citaba la documentación. Se movió a `archive/referencias/fragmentos/`. `build/` contiene
ahora **solo lo que se inyecta** en la página.

### 9.3 Avisos de documento histórico

`qa/auditoria.md`, `qa/css-por-seccion.md`, `qa/refactor-build.md` y `qa/estructura-secciones.md` son
informes de etapa y citaban `build/pendiente-violeta/`, `OD:SCROLL` y `build/scroll-animations.css`
como si fueran estado actual. Cada uno lleva ahora un aviso al principio que dice que es histórico y
remite a este informe. No se reescribieron: son el registro de lo que pasó.

### 9.4 Verificación conjunta de referencias

Pasada con `Select-String` sobre todos los `.md` del proyecto excluyendo `archive/`, buscando
`scroll-animations`, `OD:SCROLL` y `pendiente-violeta/`. Resultado:

| Documento | Coincidencias | Veredicto |
| --- | --- | --- |
| `DESIGN.md`, `MOTION.md`, `SECTION-MAP.md`, `build/README.md` | 0 | Limpios |
| `ARQUITECTURA.md` | 1 | Mapa de `archive/`: describe una ruta archivada. Correcto |
| `PENDIENTES-CLIENTE.md` | 3 | Registro de cambios y tabla «lo que NO está en disco». Correcto |
| `qa/auditoria.md`, `qa/css-por-seccion.md`, `qa/refactor-build.md`, `qa/estructura-secciones.md` | 9 | Informes de etapa, ahora con aviso de histórico |
| `qa/orden-proyecto.md` | 3 | Este informe: describe lo que se retiró |

**Cero coincidencias presentan algo retirado como estado vigente.**

---

## 10. Cierre de pendientes (tercera pasada)

La ronda que desbloqueó el ensamblador. El resultado más importante no es una corrección: es que el
bloqueo que frenaba el proyecto **no existía**. Los demás hallazgos sí eran defectos reales.

### 10.1 El catálogo: 19, no 24

La documentación arrastraba la cifra «24 productos en `build/data/catalogo.json`» y la usaba para
prohibir ejecutar el ensamblador. Se comprobó contra el fichero y contra la página:

| Comprobación | Resultado |
| --- | --- |
| Productos declarados en el JSON (`productos[]`) | **19** |
| Referencias de producto dentro de `categorias[]` | **19**, todas únicas |
| Fichas en `index.html` (`data-od-id="producto-*"`) | **19** |
| Ids solo en el JSON / solo en la página | **ninguno / ninguno** |
| `opciones_extra` | 1 (va aparte, no es producto) |

La cifra 24 era un error de la documentación, no un desfase de datos. Lo confirma la prueba real:

| Prueba | Resultado |
| --- | --- |
| Ensamblar la página actual | 1 línea de diferencia (una línea en blanco) |
| Segunda ejecución, SHA-256 | **idéntico byte a byte** |
| `ganchos-scroll.ps1` después de ensamblar | **0 aplicados** |
| Texto visible vs baseline | **idéntico**, 7788 caracteres |

Las advertencias del catálogo se sustituyeron por notas de «resuelto el 2026-11-12» en
`ARQUITECTURA.md` (3 sitios), `build/README.md` (2), `PENDIENTES-CLIENTE.md` (2), `SECTION-MAP.md` y
`MOTION.md` §11, y el checklist de `ARQUITECTURA.md` pasó de «no ejecutes» a «el catálogo está
conciliado».

### 10.2 Los ganchos vivían en el sitio equivocado

**Los 10 parciales de `build/sections/` tenían cero ganchos.** Los 47 elementos con `od-*` estaban
solo en `index.html`, que es un fichero generado. Es decir: el primer ensamblado habría borrado los
ganchos y `motion.css` se habría quedado sin a qué aplicarse.

`build/ganchos-scroll.ps1` se reescribió para aplicar sobre `index.html` **y** sobre los parciales:

```
Ganchos aplicados: 28     (primera pasada: solo los parciales, index ya los tenía)
Ganchos aplicados: 0      (segunda pasada: idempotente)
```

El orden de trabajo queda fijado y documentado en `build/README.md` §3:

1. `ganchos-scroll.ps1` — pone los ganchos en el origen.
2. `actualizar-portada.ps1` — ensambla.
3. `ganchos-scroll.ps1` — debe dar **0**; si aplica algo, faltaba en un parcial.
4. `od lint index.html` — desde la app.

### 10.3 La plantilla de las fichas no llevaba gancho

Las 19 fichas no están escritas en el parcial: las genera el ensamblador desde
`build/templates/ficha.html` con `data/catalogo.json`. La plantilla no llevaba `od-reveal`, así que
cualquier regeneración habría dejado las fichas sin gancho aunque `index.html` lo tuviera. Añadido a
la plantilla.

### 10.4 Un `</main>` huérfano en Beneficios

`build/sections/beneficios.html` cerraba `</main>` dentro del parcial, de modo que la página acababa
con **dos `</main>` y un `</main>` fuera de sitio**. Corregido en el parcial y en `index.html`: ahora
hay 1 `<main>` y 1 `</main>`.

No cambia nada visual: la única regla que depende de `<main>` es `html main a[role="button"]`
(`build/css/components.css:532`) y solo alcanza a 2 enlaces del héroe, que están dentro.

### 10.5 Verificador de balance de marcado

Se escribió un comprobador con pila de etiquetas que ignora elementos vacíos (`img`, `br`, `input`…),
autocierres, comentarios y el contenido de `<script>`/`<style>`, y que trata como aviso los cierres
implícitos de etiquetas opcionales (`p`, `li`, `td`…).

| Fichero | Resultado |
| --- | --- |
| 10 parciales de `build/sections/` | **OK** |
| `index.html` | **OK** |
| `build/exito-contacto.html` | **OK** |
| `build/templates/ficha.html`, `pestana.html` | **OK** |
| **Total** | **14 ficheros, 0 errores** |

**El verificador está validado contra un control**: ejecutado sobre
`archive/baseline/index-2026-11-12.html` detecta los tres defectos históricos (dos `</main>` y un
`</div>` huérfano). Es decir, el «0 errores» actual mide algo, no es un falso positivo.

### 10.6 Líneas reales

> **Estado previo al movimiento.** Esta tabla mide el fichero tal como quedó en la tercera pasada.
> Con la capa de movimiento ya implementada, los rangos vigentes son los de §11.3.

El ensamblador no reproduce una línea en blanco, así que el fichero pasó de 3332 a **3330 líneas**
(141 901 bytes). Los rangos de `ARQUITECTURA.md` y `SECTION-MAP.md` se midieron sobre el fichero
final, no se estimaron:

| Bloque | Líneas |
| --- | --- |
| Aviso de prototipo + cabecera | 2026 – 2100 |
| Héroe | 2101 – 2216 |
| `#beneficios` | 2217 – 2294 |
| `#aviso-taller` | 2295 – 2314 |
| `#tienda` | 2315 – 2678 |
| `#proceso` | 2679 – 2926 |
| `#resenas` | 2927 – 2989 |
| `#contacto` | 2990 – 3232 |
| Pie | 3233 – 3314 |
| Widget de WhatsApp | 3315 – 3330 |

### 10.7 Verificación final

| Prueba | Resultado |
| --- | --- |
| Zonas `OD:` abren/cierran 1:1 | **19 / 19**, 0 fallos |
| `<style>` / `</style>` | **4 / 4** |
| Zona `OD:MOTION` = `build/motion.css` | **idéntica** (comparada por contenido) |
| Hexadecimales en la capa de movimiento | **0** |
| Animaciones activas | **0** |
| `data-od-id` | **36** |
| Elementos con gancho | **47** (54 clases) |
| `<main>` / `</main>` | **1 / 1** |
| Texto visible vs baseline | **idéntico** |
| Balance de marcado | **14 ficheros, 0 errores** |

### 10.8 Lo que sigue abierto

| # | Pendiente | Por qué |
| --- | --- | --- |
| 1 | Aprobar o recortar la matriz de `MOTION.md` §6 | Es una decisión del cliente: qué se anima y qué no |
| 2 | `od lint index.html` | El CLI `od` no está en disco ni en PATH (`$env:OD_NODE_BIN` y `$env:OD_BIN` vacíos); solo corre desde dentro de la app |
| 3 | Captura de línea base nueva | Opcional; el texto y el CSS no cambiaron |

Ninguno de los tres depende de más trabajo de orden. El punto 1 es el que desbloquea implementar el
movimiento: con los 47 ganchos puestos, el guard de 26 selectores y los tokens en las dos fuentes,
escribir `build/motion.css` y ensamblar es todo lo que falta.

### 10.9 Un aviso de proceso para el futuro

La zona `OD:MOTION` de `index.html` estuvo desincronizada de `build/motion.css` sin que se notara, y
ahora se sabe por qué: **todo lo que se edite a mano en `index.html` se pierde al ensamblar, salvo el
`<head>` y el pie contextual.** La página no es la fuente; `build/` lo es. De ahí el flujo de tres
pasos. Quien edite `index.html` directamente está escribiendo sobre un fichero que se va a
sobrescribir.

---

## 11. Cierre de pendientes (cuarta pasada): el movimiento

El cliente aprobó las filas **1, 2, 3, 4, 6, 9, 10 y 11** de la matriz de `MOTION.md` §6. Las filas
5, 7, 8 y 12 quedan fuera.

### 11.1 Qué se escribió

`build/motion.css` pasó de andamiaje a **233 líneas**, **6 bloques `@keyframes`** y un guard de
**27 selectores**:

| Fila | Efecto | Técnica |
| --- | --- | --- |
| 1 | Barra de lectura de 3 px | `scroll(root block)` + `scaleX` |
| 2 | Sombra de la cabecera | `opacity` de un `::after`, rango `0 150px` |
| 3 | Entrada del héroe escalonada | Animación de tiempo con `--motion-stagger` |
| 4 y 9 | Beneficios y compromisos | `view-timeline-name` en la rejilla, hijos por nombre |
| 6 | Las 19 fichas del catálogo | `view()`, `entry 0% entry 60%` |
| 10 y 11 | Contacto y pie | Solo opacidad |

Elemento nuevo en el marcado: `<div class="od-progress" aria-hidden="true">` al principio de
`build/sections/header.html`.

### 11.2 Dos defectos corregidos

1. **Los pasos del proceso se animaban** sin estar aprobados (fila 8). Llevaban `od-reveal` desde el
   script de ganchos, y la rejilla del proceso comparte `od-stagger`/`od-stagger-2` con beneficios.
   Se quitó `od-reveal` de los cuatro pasos (en el parcial **y** en la lista del script, para que no
   se reañada) y las reglas de rejilla se acotaron a `#beneficios` y `#resenas`.
2. **El rango de las fichas dejaba opacidades a medias.** Con `entry 25% cover 50%`, una ficha que ya
   estaba a la vista al cambiar de pestaña se quedaba translúcida hasta hacer scroll. Se cambió a
   `entry 0% entry 60%`.

### 11.3 Líneas reales (vigentes)

El fichero pasó de 3330 a **3487 líneas** (147 624 bytes). La tabla de §10.6 es el estado anterior.
Medido sobre el fichero final:

| Bloque | Líneas |
| --- | --- |
| Aviso de prototipo + cabecera | 2179 – 2257 |
| Héroe | 2258 – 2373 |
| `#beneficios` | 2374 – 2451 |
| `#aviso-taller` | 2452 – 2471 |
| `#tienda` | 2472 – 2835 |
| `#proceso` | 2836 – 3083 |
| `#resenas` | 3084 – 3146 |
| `#contacto` | 3147 – 3389 |
| Pie | 3390 – 3471 |
| Widget de WhatsApp | 3472 – 3487 |

La zona `OD:MOTION` ocupa **1940 – 2176** (237 líneas dentro de `index.html`) y la barra de lectura
está en la **2182**.

### 11.4 Verificación

`qa/movimiento-implementado.md` recoge las mediciones completas. Resumen:

| Prueba | Resultado |
| --- | --- |
| Zonas `OD:` | **19 / 19**, 0 fallos |
| Zona `OD:MOTION` = `build/motion.css` | **idéntica** |
| Hexadecimales en la zona | **0** |
| Animaciones activas | **6** (`@keyframes` 6, `animation-timeline` 9) |
| Selectores del guard | **27** |
| Elementos con gancho | **48** (51 clases) |
| `data-od-id` | **36** |
| Barra de lectura | `scaleX` 0 → 1 |
| Altura de cabecera | **101 px** constante |
| Proceso | `animation-name: none` |
| Movimiento reducido | todo a opacidad 1, sin barra, rotaciones intactas |
| Sin JS | contenido visible |
| Texto visible vs baseline | **idéntico** (7788 caracteres) |
| Balance de marcado | **14 ficheros, 0 errores** |
| Ensamblador idempotente | **mismo SHA-256** en dos ejecuciones |

### 11.5 Lo que sigue abierto

| # | Pendiente | Por qué |
| --- | --- | --- |
| 1 | `od lint index.html` | El CLI `od` no existe en disco ni en PATH; solo corre desde dentro de la app |
| 2 | Prueba a mano en móvil real | El CDP se hizo en Chrome headless; toca comprobar con el pulgar el `.swipe` del catálogo y el cambio de pestaña |
| 3 | Filas 8 y 12 | Fuera por decisión. La 8 puede exigir tocar marcado; la 12 es CSS puro |
| 4 | Firefox y Safari | Firefox cae en el estado seguro por el `@supports`; Safari 26+ soporta las líneas de tiempo, sin verificar aquí |
| 5 | Captura de línea base nueva | Opcional; el texto visible no cambió |

Ninguno bloquea la entrega. El movimiento es reversible sin tocar `index.html`: vaciar la zona
`OD:MOTION` o quedarse con el bloque base y el guard de `build/motion.css`.

# Sublikat — Etapa 3.6d: interacciones de pestañas

## Alcance

Se implementaron en React las interacciones de las cinco pestañas del catálogo
original, manteniendo el DOM y sus clases. No se implementó el prefill del
formulario «Cotizar» ni se modificaron otros componentes, estilos o datos.

## Implementación

En `src/sections/Catalog/Catalog.jsx`:

- Un único estado, `activeCategory`, determina `aria-selected`, `tabIndex` y
  `hidden`.
- La categoría inicial respeta la prioridad: hash válido del ID de panel,
  categoría válida de `localStorage["sublikat-categoria"]` y, finalmente,
  `regalos`.
- La lectura/escritura de `localStorage` está protegida con `try/catch`.
  Seleccionar por clic o teclado persiste la categoría, pero no modifica el
  hash. Un `hashchange` válido activa y persiste su panel; uno vacío o
  desconocido no cambia la selección.
- Flechas izquierda/derecha y arriba/abajo recorren las pestañas de forma
  circular. `Home` y `End` van a los extremos. Solo esas teclas reconocidas
  cancelan su comportamiento predeterminado; teclado mueve el foco al destino.
  Enter y Space conservan la activación nativa del botón.
- El clic centra horizontalmente la pestaña con el cálculo original y alinea
  verticalmente el panel si está por encima del umbral. El teclado alinea el
  panel y mueve el foco, sin centrar horizontalmente. El desplazamiento
  vertical usa movimiento suave salvo con `prefers-reduced-motion: reduce`,
  tolerancia de 1 px para evitar el scroll inicial innecesario, corrección
  única cuando el desvío supera 2 px y esperas originales de 900/60 ms.
- Se limpia el listener `hashchange`, el `requestAnimationFrame`, el listener
  `scrollend` y el timeout de corrección cuando se reemplaza una alineación o
  se desmonta el componente.

## Validaciones

| Comprobación | Resultado |
|---|---|
| `npm run build` | Pasó. Vite generó el bundle de producción. |
| Estructura interactiva | 5 pestañas, 5 paneles, 20 tarjetas y todas las relaciones `aria-controls` / `aria-labelledby` presentes. |
| Estado tras clic en las cinco categorías | Pasó: una pestaña seleccionada y con `tabIndex=0`, panel correspondiente visible, cuatro paneles ocultos y categoría persistida. |
| Inicialización y sincronización URL/storage | Pasó: hash de panel prevalece sobre storage; storage válido inicializa la categoría; storage inválido cae en `regalos`; hashchange válido actualiza la categoría y storage; hash desconocido no cambia la selección. |
| Teclado, foco y activación nativa | Pasó: flechas en ambos sentidos, wrapping en los extremos, `Home`, `End`, foco en destino, Enter y Space generan el clic nativo. |
| Centrado horizontal | Pasó en viewport 390 × 844: destino calculado 147,5 px y resultado 147 px (diferencia 0,5 px). El teclado no invoca el centrado horizontal explícito. |
| Alineamiento vertical | Pasó con clic y teclado en movimiento normal, y con clic en movimiento reducido. Se observó el `behavior` esperado (`smooth`/`auto`) y el panel quedó alineado con una variación máxima observada de aproximadamente 2,1 px en movimiento normal y menor de 0,01 px en movimiento reducido. |
| Limpieza de callbacks de alineación | Pasó en interacción: dos clics consecutivos dejaron una sola alineación ejecutada; el listener `scrollend` registrado fue retirado y no quedaron listeners pendientes. |
| Estructura de animaciones del catálogo | Pasó en DOM: 20 tarjetas, 19 `.od-reveal`, Polerones sin `.od-reveal` y 19 coincidencias de `.od-reveal > div > div > svg`. No se modificó CSS. |
| Desmontaje y limpieza de `hashchange` | Revisado estáticamente: los efectos devuelven sus funciones de limpieza. No se forzó el desmontaje de la raíz React desde el navegador compartido. |

Las interacciones se probaron en la página de desarrollo compartida. Se
guardaron y restauraron el valor original de `sublikat-categoria`, la URL, el
viewport y la preferencia de movimiento al finalizar. No se simuló un bloqueo
del navegador sobre `localStorage`.

## Archivos

- Modificado: `src/sections/Catalog/Catalog.jsx`.
- Creado: `docs/ETAPA-3-6D-INTERACCIONES-PESTANAS.md`.

Sin cambios en `Header.jsx`, `App.jsx`, `Contact.jsx`, `ProductCard.jsx`,
`catalogData.js`, CSS ni animaciones. No se realizó commit, push ni despliegue.

## Revisión puntual: encabezado y cancelación de scroll

- **Encabezado:** el párrafo de `Catalog.jsx` coincide con
  `docs/archive/index-original.html` (bloque `OD:CATALOGO`, línea 3336). Ambos
  dicen «El precio y la fotografía…»; no hay una diferencia «Elprecio» que
  corregir.
- **Dos clics antes del `requestAnimationFrame`:** se retuvo temporalmente el
  callback para reproducir ambos clics antes de ejecutarlo. El segundo clic
  canceló el primer frame; quedó un callback y al liberarlo activó
  `papeleria`.
- **Dos clics después de iniciar el scroll suave:** se confirmó que el primer
  `window.scrollTo({ behavior: "smooth" })` ya se había solicitado antes del
  segundo clic. La nueva selección retiró el listener `scrollend` y canceló
  el timeout de la alineación antigua. La segunda alineación retargeteó el
  scroll suave al panel nuevo; al terminar, `papeleria` quedó activa y
  alineada. El panel anterior estaba oculto y no se consultó su geometría:
  no se ejecutó una corrección antigua contra la selección nueva. Los dos
  listeners registrados se retiraron y no quedaron callbacks pendientes.
- **Comparación con el original:** el HTML original no cancela los callbacks
  de una selección anterior; una corrección tardía puede medir el panel que ya
  quedó oculto. La implementación React conserva el scroll suave nativo y
  deja que un `scrollTo` posterior lo retargetee, pero cancela el listener y
  timeout obsoletos para no corregir una pestaña inactiva. No hace falta
  interrumpir adicionalmente el scroll nativo: las categorías ocupan la misma
  posición de panel y la nueva alineación lo reemplaza cuando aún se necesita.
- **Resultado de la revisión:** no se requirió corregir código. No cambiaron
  texto, diseño, clases, estructura DOM ni animaciones. Se volvió a comprobar
  el build y las interacciones de pestañas; los resultados de esta revisión
  están incluidos arriba.

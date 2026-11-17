# Sublikat — Sistema de diseño

Taller de sublimación y estampados con carácter: cálido, artesanal y juguetón (mascota gato),
pero ordenado y confiable para comprar.

## Marca

- Personalidad: cercano, claro, con humor felino dosificado. Sin promesas que no se puedan probar.
- Estética de sticker: bordes de tinta gruesos, sombra plana desplazada, sin degradados fuertes.
- La mascota gato es una ilustración propia provisional, no el logotipo oficial de Sublikat.

**Dirección aprobada (2026-11-12):** crema y Chewy. El cliente vio las propuestas violeta y tríada y
no lo convencieron, así que se retiraron del proyecto: no quedan en `build/` ni en la portada. La web
conserva la estética de sticker cálida y la mascota. El trato de «usted» y los compromisos del
cuestionario siguen vigentes; lo que falta está en `PENDIENTES-CLIENTE.md`.

## Color

La paleta es la **crema del prototipo aprobado**. Vive en `build/tokens.css`, que es la única fuente:
ningún otro archivo declara hexadecimales, todo se referencia con `var(--…)`. Los ratios de la tabla
están calculados sobre los valores reales de los tokens.

### Modo claro
| Rol | Token | Hex | Uso | Contraste |
| --- | --- | --- | --- | --- |
| Fondo | `--bg` | `#f4e6c8` | Fondo general de página | — |
| Superficie | `--surface` | `#fffaf1` | Tarjetas, cabecera y campos | — |
| Superficie alternativa | `--soft` / `--soft-2` | `#f4e6c8` / `#f8eed7` | Chips, bloques de apoyo y hover | — |
| Texto / tinta | `--ink` | `#3b2417` | Texto principal y bordes | 13,9:1 sobre superficie |
| Texto secundario | `--muted` | `#6a4f3b` | Ayudas, notas y pies de campo | 7,2:1 sobre superficie |
| Líneas | `--line` / `--line-soft` | `#3b2417` / `#c9ad80` | Bordes de tinta y separadores suaves | — |
| Acento | `--accent` | `#d4573f` | Iconos, cintas y bordes de foco | 3,9:1: solo display |
| Acento de texto y botón | `--accent-fill` | `#c04a33` | Botón principal y enlaces | 4,7:1 con texto crema |
| Hover del botón | `--accent-hover` | `#b8462f` | Estado hover | — |
| Toldo / cinta | `--awning` | `#f7c948` | Toldo, cinta del héroe y distintivos | 9,2:1 con tinta |
| Confianza / éxito | `--success` / `--success-text` | `#6fa96b` / `#467a49` | Checks y confirmaciones | 4,9:1 el texto |
| WhatsApp | `--whatsapp` | `#25d366` | Solo el botón de WhatsApp | 4,8:1 con tinta |
| Foco | `--focus` | `#d4573f` | Anillo de foco | 3,9:1 sobre superficie |

### Modo oscuro
| Rol | Token | Hex | Uso | Contraste |
| --- | --- | --- | --- | --- |
| Fondo | `--bg` | `#2a1c14` | Fondo de página | — |
| Superficie | `--surface` | `#3b2417` | Tarjetas y cabecera | — |
| Superficie alternativa | `--soft` / `--soft-2` | `#39271c` / `#4a3223` | Chips y bloques de apoyo | — |
| Texto | `--ink` | `#f4e6c8` | Texto principal | 11,7:1 sobre superficie |
| Texto secundario | `--muted` | `#d9c4a5` | Ayudas y notas | 8,5:1 sobre superficie |
| Líneas | `--line` | `#5a4130` | Bordes y separadores | — |
| Acento de texto | `--accent-ink` | `#f0947c` | Enlaces y texto de acento | 6,4:1 sobre superficie |
| Toldo / cinta | `--awning` | `#f7c948` | Igual que en claro | 9,2:1 con tinta |
| Foco | `--focus` | `#f7c948` | Anillo de foco | 10,5:1 sobre fondo |

### Reglas de contraste
- Todo texto debe cumplir 4,5:1 contra su fondo. Texto grande e iconos: mínimo 3:1.
- `--awning` (`#f7c948`) es decorativo (toldo o cinta) y siempre lleva texto de tinta encima: 9,2:1. Nunca como fondo de texto pequeño en otro color.
- `--accent` (`#d4573f`) da 3,9:1 sobre superficie: es color de display (iconos, cintas, distintivos, borde de foco), nunca texto pequeño. Para texto y rellenos con letra pequeña se usa `--accent-fill` (`#c04a33`, 4,7:1 con texto crema).
- El verde de confianza solo se usa con su variante de texto `--success-text` (`#467a49`, 4,9:1 sobre superficie). `--success` es relleno, no texto.
- Botón principal: fondo `--accent-fill` con texto `--on-accent`. Hover `--accent-hover`. Ambas combinaciones están por encima de 4,5:1.
- Texto secundario: `--muted` (`#6a4f3b`, 7,2:1) en modo claro y `--muted` (`#d9c4a5`, 8,5:1) en modo oscuro.
- Botón de WhatsApp: verde `--whatsapp` con texto de tinta `--on-whatsapp` (4,8:1).
- En modo oscuro los colores se eligen de forma independiente, no se invierten automáticamente.

### Cómo se reparte el color (psicología del color)

La paleta no se aplica por gusto: cada color tiene un significado y un solo territorio. Un color
puesto donde no le toca deja de significar nada.

| Color | Qué comunica | Dónde puede aparecer | Dónde no puede aparecer |
| --- | --- | --- | --- |
| Coral `--accent` `#d4573f` | Acción, calor y carácter de taller | Iconos, cintas, distintivos de producto, borde de foco y la pestaña activa | En texto pequeño: da 3,9:1. Para eso existe `--accent-fill` |
| Coral profundo `--accent-fill` `#c04a33` | Acción que se puede pulsar | Botón principal y enlaces de texto | Como decoración grande: si todo es coral, el botón deja de destacar |
| Amarillo `--awning` `#f7c948` | Energía y atención | El toldo de la cabecera, la cinta del héroe, el banner de aviso y los distintivos: un gesto por bloque | En iconos, cuadros o chips. Repartido deja de ser un acento y pasa a ser papel pintado |
| Verde `--success` / `--success-text` | Confianza y verificación | Mensajes de calidad, garantía, muestra previa y estados correctos | En acciones: el verde tranquiliza, no convence |
| Crema `--bg` `#f4e6c8` y superficie `--surface` `#fffaf1` | Oficio, papel y calidez | Fondo de página, tarjetas, cabecera y campos | Detrás de texto sin comprobar contraste: la tinta `--ink` está calculada contra ellas |
| Tinta `--ink` `#3b2417` | Estructura y lectura | Texto, bordes, sombras y contornos de sticker | Como relleno grande: la página se vuelve marrón y pierde aire |

Frecuencias de referencia: el coral ocupa menos de un 10% de la pantalla, el amarillo aparece una
sola vez por bloque, el verde solo en mensajes de confianza y el crema es el color por defecto.


## Tipografía

- Títulos: **Chewy 400**. Móvil 28-42 px, escritorio hasta 56 px, interlineado 1,05.
- Cuerpo: **Nunito 600**, 16 px, interlineado 1,45.
- Máximo 2 familias. Texto de interfaz en Nunito.
- Longitud de línea: 65-75 caracteres en escritorio, 35-60 en móvil.
- **Chewy es definitiva.** El cliente vio las alternativas (violeta con Archivo y la tríada) y no lo
  convencieron, así que la tipografía de titular no cambia. El trato de «usted» sigue siendo el
  registro de los textos, pero no arrastra un cambio de familia tipográfica.

## Forma y espacio

- Bordes finos de 1 px con `var(--line)`, ya en tono pizarra. Nada de bordes de tinta gruesos.
- Esquinas de 16 px en tarjetas y contenedores; las píldoras y las etiquetas redondas.
- Sombras suaves en tres niveles (`--e-sh-1` etiquetas y estado activo, `--e-sh-2` tarjetas y
  botones, `--e-sh-3` la foto del héroe y los elementos destacados). En modo oscuro, las mismas
  estructuras en negro. Nada de sombras desplazadas tipo pegatina.
- Sin degradados fuertes, sin glassmorphism, sin brillos.
- Espaciado en múltiplos de 8 px.
- **Ritmo vertical entre secciones: 56 px en móvil, 88 px desde 768 px y 112 px desde 1024 px.** Vive en
  el token `--espacio-seccion` y lo aplica la regla `html .od-secciones > * + *`, que da a todas las
  secciones el mismo aire: ningún parcial lleva ya un margen suelto entre secciones.
- Contenedor máximo de 1200 px, centrado.

## Componentes

### Botones
- Principal: fondo `#d4573f`, texto `#fffaf1`, alto mínimo 48 px, esquinas de 12 px, borde de tinta de 2 px, sombra plana desplazada.
- Secundario: borde de tinta de 2 px, fondo transparente, texto de tinta.
- WhatsApp: fondo `#25d366` solo para el botón de contacto de WhatsApp.
- Objetivos táctiles de al menos 44 × 44 px, con 8 px de separación entre objetivos adyacentes.

### Tarjeta de producto
- Foto cuadrada (1:1), servida con `<picture>` en AVIF y WebP a 480 y 960 px; el maestro JPEG de
  1200 px no se publica. Con `loading="lazy"` y el atributo `sizes` ajustado al ancho real de la tarjeta.
- Etiqueta de estado: "Listo para despacho" o "Personalizado a pedido".
- Nombre del producto.
- Precio con IVA indicado.
- Botón de acción.
- Aviso legal junto al precio.

### Franja de confianza
- 4 iconos con texto corto, una sola familia de iconos con grosor de trazo uniforme.

### Pasos del proceso
- Numerados, con ilustración en cada paso.

### Reseña
- Texto, nombre, fecha y fuente.

### Formulario
- Etiquetas visibles en todos los campos (el placeholder no sustituye a la etiqueta).
- Texto de ayuda bajo el campo.
- Mensaje de error con texto además del color, junto al campo, y resumen de errores al inicio con enlace a cada campo.
- Validación al salir del campo, no en cada pulsación.

### Aviso legal (junto al precio)
Texto de ejemplo pendiente de validar con abogado:
- Producto listo: derecho a retracto de 10 días.
- Producto personalizado: sin derecho a retracto.

## Reglas

- Mobile-first. Un solo H1 por pantalla.
- Modo claro y modo oscuro.
- Datos de ejemplo siempre marcados como ejemplo.
- Contenido real y coherente: nombres, precios, fechas y estados verosímiles entre sí.
- Imágenes con texto alternativo descriptivo.
- Estados de foco visibles en todos los elementos interactivos.
- Respeta `prefers-reduced-motion`.

## Página unificada (versión entregada)

`index.html` es la versión única de la portada: reúne en un solo documento el héroe, la franja de
confianza, el catálogo, los pasos del proceso, las reseñas, el formulario y el pie, y funciona como
respuesta única desde 375 px hasta 1200 px. Las pantallas sueltas de Google Stitch están en
`archive/referencias/src/` y no forman parte del entregable.

- **Modo claro y oscuro en la misma página.** Un conmutador en la cabecera cambia el atributo
  `data-theme` de `<html>`. La paleta de los dos modos sale de variables CSS en un único bloque
  (`--bg`, `--ink`, `--surface`, `--accent-fill`, `--awning`, `--success`, `--line`…). La elección
  se recuerda en el navegador y, si no hay elección previa, sigue la preferencia del sistema.
- **El conmutador se muda al menú en móvil** (16-11-2026): por debajo de 768 px el mismo botón deja la
  barra y pasa a ser una fila más de la hamburguesa, a todo el ancho, con la etiqueta escrita («Modo
  oscuro» / «Modo claro») junto al icono; al ensanchar vuelve a su hueco, delante de la hamburguesa. Es el
  **mismo nodo** movido en el DOM, no una copia: conserva listener, `aria-pressed` y estado del icono. En
  la barra la etiqueta se oculta y el nombre accesible sigue viniendo del `aria-label`.
- **Contraste auditado en los dos modos**, con los valores corregidos indicados arriba.
- **Formulario vivo:** valida al salir del campo, resume los errores con enlace a cada campo, avisa
  con texto además de color y muestra una confirmación simulada. No envía nada a ningún servidor:
  es una demostración de interfaz.
- Una sola etiqueta H1 en toda la página y objetivos táctiles de 44 px como mínimo.

## Estructura del proyecto

```
index.html                 Entrada única: la portada completa (claro + oscuro)
DESIGN.md                  Este documento: el sistema de diseño
ARQUITECTURA.md            Traspaso técnico: cómo está construida la página, parte por parte
MOTION.md                  Reglas, propuesta y matriz del movimiento ligado al scroll
SECTION-MAP.md             Sección → ancla → parcial → CSS → ganchos de movimiento
PENDIENTES-CLIENTE.md      Checklist vivo de lo que falta del cliente, por sectores
build/                     Fuente viva de la página
  tokens.css               Paleta y tokens de los dos modos (única fuente de hexadecimales)
  motion.css               Movimiento ligado al scroll (zona OD:MOTION)
  app.js                   Conmutador de tema, pestañas y validación del formulario
  actualizar-portada.ps1   Ensambla CSS, secciones y fragmentos dentro de index.html
  ganchos-scroll.ps1       Añade las clases od-* al marcado (idempotente)
  limpiar-hex.ps1          Pasada que verifica que no haya hexadecimales fuera de :root
  patch-imagenes.ps1       Corrige rutas de imagen y recalcula credits.json
  css/                     Un archivo por capa y por sección (ver build/css/README.md)
  sections/                Un parcial por sección de la página
  data/catalogo.json       Modelo de datos del catálogo (pestañas, fichas, opciones)
  templates/               Plantillas de las fichas y de las pestañas
  icons/                   SVG en línea de los 19 productos
assets/stock/              Fotos de producto locales + credits.json
archive/                   Historial de lo retirado, no se usa para construir
  baseline/                Copia de index.html previa al ordenamiento
  referencias/             index2.html, pantallas de Stitch y el rediseño violeta
  referencias-paletas/     Los dos JPEG de AdobeColor (tríada y complementarios)
qa/                        Un informe por etapa, con pruebas y resultados
```

**Qué se retiró y dónde está**

- El rediseño violeta con Archivo, las pantallas de Stitch (`04-modo-oscuro`, `05-movil`) y
  `index2.html` están en `archive/`, no se borraron. Ninguno participa en la construcción.
- Los dos JPEG de AdobeColor (tríada y complementarios) están en `archive/referencias-paletas/`:
  son referencia histórica, no la paleta vigente.
- Los manifiestos `.artifact.json` de páginas que no existen (`contacto`, `cotizar`,
  `personalizados`, `portada-*`, `tienda` y los de `src/`) se eliminaron para que el panel de
  artefactos no muestre páginas fantasma.

**Cómo se cambia la marca ahora**

- `index.html` es autónomo: no depende de `build/` para abrirse. Se abre tal cual.
- La paleta vive en `build/tokens.css`, no aquí ni dentro de la página. Para cambiar un color,
  edita ese fichero y ejecuta `powershell -File build/actualizar-portada.ps1`: el script vuelca el
  CSS y los fragmentos dentro de `index.html`, entre los marcadores `<!-- OD:... -->`.
- El movimiento vive en `build/motion.css` y se inyecta en la zona `OD:MOTION`, justo después de
  `OD:ESTILOS`. Las reglas y la matriz están en `MOTION.md`.
- Lo mismo con `build/app.js` (conmutador de tema, pestañas y validación del formulario).
- `build/patch-imagenes.ps1` deja las rutas de imagen bien según el nivel de carpeta y recalcula el
  campo `usado_en` de `assets/stock/credits.json`. Úsalo cuando sustituyas las fotos por las reales.

**Rutas de las imágenes**

`index.html` usa `assets/stock/…`. Los ficheros archivados en `archive/referencias/src/` usaban
`../assets/stock/…`; si alguna vez se restauran, hay que devolverlos a la raíz y ajustar la ruta.

## Encaje con el cuestionario del cliente (2026-11-11)

Fuente: cuestionario de 53 preguntas respondido por Ronald Peschke (Sublikat) el 2026-11-11.
Este apartado **no modifica la página**: es la lista de lo que habría que cambiar y por qué, y de lo
que ya cumple. Contradice a propósito algunas reglas de este documento (estética de sticker, humor
felino, «datos de ejemplo»): **manda el cuestionario del cliente**, y estas reglas quedan pendientes
de reescritura cuando se implemente el cambio.

**Estado 2026-11-12:** los sectores 2 (datos de empresa) y 6 (defectos) están aplicados en la
portada. El **sector 1 quedó cerrado por decisión del cliente**: vio las propuestas violeta y tríada
y no lo convencieron, así que se mantiene crema + Chewy y no hay cambio de familia tipográfica. Del
sector 1 solo sigue vivo el registro de «usted» y el humor mínimo en los textos. Los sectores 3 y 4
siguen pendientes; el detalle de lo que espera al cliente está en `PENDIENTES-CLIENTE.md`.

**Resumen:** el encaje es fuerte en la mecánica (catálogo, cotización, WhatsApp, muestra previa,
móvil) y flojo en identidad y en datos. El punto que más superficie toca es el tono: el cliente
dice explícitamente que no quiere que la web se vea «infantil», con tono de «usted» y humor mínimo,
pero **aceptó la estética de sticker y la tipografía Chewy** al descartar las alternativas. La
segunda brecha es de datos: hoy la página muestra dirección, horarios, teléfono, país y nombre de la
empresa inventados.

### 1. Identidad, estilo y tono

| Lo que respondió el cliente | Qué hay hoy en la portada | Estado y decisión |
| --- | --- | --- |
| «¿Cómo NO quieres que se vea tu web?» → **Infantil** | Estética declarada «de sticker», tipografía de titular **Chewy** (redondeada, infantil), paleta cálida y textos muy cercanos («Lo que dicen en el barrio», «michis», «mesa de planchado», «supervisión humana y felina») | **Cerrado:** se propusieron violeta/Archivo y tríada; el cliente no las quiso. Se conservan los stickers y Chewy; el registro se baja solo en los textos, no en la tipografía. |
| «¿El gato y las ilustraciones son parte fija de la marca?» → «Sí, siempre» | Gato y stickers propios en cabecera, pasos y reseñas | **Se conserva**: la ilustración no se toca, solo el tono de los textos que la rodean. |
| «¿Cómo prefieres hablarle a tus clientes?» → «De usted» | Tuteo en toda la página («tu camiseta», «te respondemos», «tu boceto») | Pasar a «usted» en héroe, proceso, formulario y confirmación. Sigue pendiente. |
| «¿Cuánto humor quieres en los textos?» → **1** (mínimo) | Humor felino en titulares y reseñas | El humor se queda en la ilustración, no en los textos. |
| «Describe Sublikat en tres palabras» → «Bueno, bonito barato» | La portada no enuncia propuesta de valor | Escribir el argumento «bueno, bonito y barato» en el héroe, respaldado con lo que él sí sostiene: calidad de tintas, precio, atención cercana. |
| «Si tienes colores oficiales, escríbelos» → **vacío** | Paleta crema / coral / verde definida por nosotros | **Cerrado por descarte:** sin colores oficiales del cliente y con sus dos alternativas rechazadas, la paleta crema es la vigente. Vive en `build/tokens.css`. |
| «3 sitios que te gustan» / «3 que no» → **vacío** | — | Ya no bloquea: la dirección visual está cerrada. Queda como dato útil si algún día se replantea la identidad. |

### 2. Datos de empresa y contacto

| Dato del cliente | Qué hay hoy | Cambio necesario |
| --- | --- | --- |
| Dirección: **Bocaccio 866, Maipú, Santiago** | «Calle del Taller 12, Local B, 28001 Madrid» | Corregir dirección y número de Local. |
| Horarios: **lunes a viernes de 10:00 a 17:00** | «Lunes a Viernes: 9:30 a 14:00 y 16:30 a 19:30» | Corregir horario, y alinearlo con «respondo yo de 10:00 a 17:00». |
| Teléfono/WhatsApp: **+56949409253** | `wa.me/34600000000` (número inventado) | Sustituir en los dos enlaces de WhatsApp: el widget flotante y la tarjeta de «respuesta rápida». |
| Instagram: **@sublikat.cl** | No aparece ningún enlace a Instagram | Añadirlo: el cliente escribe por Instagram y quiere «que me conozca y me siga en redes». |
| Correo: **rolakun@gmail.com** | `pedidos@sublikat.cl` | Confirmar cuál se publica o mostrar ambos (pedidos / contacto). |
| Razón social y RUT | «Sublikat Taller de Estampados S.L.» (inventada) | Quitar el nombre inventado o dejarlo en hueco hasta que envíen Razón social y RUT. |
| Google Maps: perfil verificado | Las reseñas citan «Google Maps» como fuente, sin enlace | Enlazar el perfil y mantener los mismos nombre, dirección y teléfono (coherencia local). |
| Dominio: «No, quiero comprarlo» | Solo `title` y `description`; sin canonical ni Open Graph | Hace falta dominio (sublikat.cl es el nombre que ya usa), URL canónica, `og:title`, `og:description`, `og:image` y favicon antes de publicar. |

### 3. Comercio: precios, pago y entrega

| Respuesta del cliente | Qué hay hoy | Cambio necesario |
| --- | --- | --- |
| «¿Cómo quieres cobrar en la web?» → tarjeta de crédito o débito, transferencia, cuotas, **Mercado Pago** | El formulario no cobra: valida y muestra «No se ha enviado ningún dato a ningún servidor» | Integrar Mercado Pago (cubre tarjeta, cuotas y transferencia) o, en una primera entrega, mostrar los medios de pago y el enlace real. La confirmación actual debe dejar de decir que es una demostración. |
| «¿Cómo entregas los pedidos?» → **retiro en el taller** y **Blueexpress** | Solo «Envíos a toda la península» | Nombrar retiro en Maipú con dirección y Blueexpress. |
| «¿Cobras el despacho?» → gratis sobre un monto | No hay envío gratis ni monto | Falta el monto: hay que preguntárselo antes de escribirlo. |
| «¿Emites boleta o factura?» → ambas, con SII | Aviso legal «de ejemplo», sin datos fiscales | Pie con Razón social, RUT y datos de facturación; el aviso de retracto sigue pendiente de validación jurídica. |
| Dudas que le saltan antes de comprar: **plazos, calidad y durabilidad, precio, cantidad mínima, despacho y cómo pagar** | No hay sección de preguntas frecuentes (el pie enlaza `#faq` y esa sección no existe) | Es el contenido natural de una sección de preguntas frecuentes: seis respuestas con datos reales del taller. |
| Precios de los 11 a 20 productos listos | Las fichas no muestran precio (no se inventan) | Pedirle la lista de precios. Mientras tanto, marcar «precio a consultar» en vez de dejar la ficha sin ese dato. |
| «¿Cuál es la cantidad mínima?» → desde 1 unidad | Aviso «SIN PEDIDO MÍNIMO» ✓ | Coherente. Ojo: el bloque de proceso ofrece «precios por volumen desde 10 unidades», que contradice el mínimo real. |
| «¿Cuánto demora un pedido personalizado?» → 1 a 3 días | La franja de confianza promete «Listo en 24 h» | Ajustar la franja al plazo real y eliminar la promesa de plazo exacto, que él no puede hacer. |
| «¿Muestras una prueba antes de producir?» → siempre | Paso 02 del proceso: previsualización y visto bueno antes de imprimir ✓ | Alineado. |
| «¿Qué cosas no puedes prometer?» → plazos exactos, diseño incluido | El proceso ofrece «diseño mixto incluido» en lotes | Quitar «diseño incluido» de cualquier texto. |

### 4. Producto y catálogo

| Respuesta del cliente | Qué hay hoy | Cambio necesario |
| --- | --- | --- |
| «¿Qué producto quisieras vender más?» → **Polerones** | El H1 es «Tu camiseta, estampada como ninguna otra» y ningún producto se llama polerón | Destacar los polerones: H1 o bloque destacado del héroe, ficha propia y opción en el desplegable del formulario. |
| «¿Qué productos venderás al lanzar?» → tazas, poleras, mousepads, termos | Catálogo con 19 productos en 5 categorías | Mantener las 5 categorías y marcar los 4 de lanzamiento como «disponible ya», frente al resto «a pedido». |
| «Más a pedido que listos» | La navegación separa por tipo de producto (5 pestañas), no por «listo» vs. «a pedido» | Decisión de arquitectura: pestañas «Listos / Personalizados» o mantener las 5 y añadir el estado en cada ficha. |
| Formatos, medidas, materiales y cuidados que entrega siempre | Hay formatos (PNG, SVG o boceto) y garantía; no hay medidas, materiales ni cuidados por producto | Ficha ampliada por producto con medidas, material, cuidado de lavado y plazo. |
| «¿Cómo prefieres recibir los diseños?» → por WhatsApp | El formulario admite texto; el widget de WhatsApp lleva mensaje prellenado | Enlace explícito «enviar diseño por WhatsApp» con el número real y la indicación de formatos aceptados. |

### 5. Lo que ya está bien (alineado con lo que quiere)

| Requisito del cliente | Cómo está resuelto hoy |
| --- | --- |
| «Tus clientes compran más con celular» | Mobile-first, objetivos táctiles de 44 px como mínimo, sin scroll horizontal |
| «Que cotice un producto personalizado» | 19 botones «Cotizar» que prellenan el formulario con el producto elegido |
| «Que me escriba por WhatsApp» | Widget flotante siempre visible + tarjeta de respuesta rápida |
| «Muestra al cliente antes de producir» | Paso 02 del proceso, con visto bueno antes de imprimir |
| «Formatos de archivo aceptados» | Paso 01: PNG, SVG o boceto, con ajuste de resolución |
| «Desde 1 unidad» | Aviso de taller «sin pedido mínimo» |
| Ilustraciones y gato de marca | Se conservan, como marca fija |
| Estructura del catálogo | 5 categorías, 19 fichas sin duplicados, pestañas accesibles con un solo panel visible |
| Base de calidad | Contraste ≥ 4,5:1 auditado en los dos modos, foco visible, `prefers-reduced-motion`, sin `user-scalable=no` |

### 6. Defectos que hay que corregir sí o sí (ajenos al cuestionario)

| Defecto | Detalle |
| --- | --- |
| 7 anclas rotas | `#camisetas`, `#tazas`, `#sudaderas`, `#lotes`, `#como-trabajamos`, `#calidad` y `#faq` no tienen destino: apuntan a un catálogo de 4 productos que ya no existe |
| Pie desactualizado | «Catálogo en stock express», «Guía de tintas y fijado» y «Preguntas frecuentes» apuntan a secciones inexistentes |
| Reseñas ficticias | Tres reseñas inventadas (Marta Salcedo, Álvaro Gómez, Elena Valero) presentadas bajo «Opiniones verificadas» con fuente Google Maps e Instagram | Usar las reseñas reales del perfil verificado o quitar la sección; en cualquier caso, quitar «verificadas» mientras sean de ejemplo |
| Select del formulario | Ofrece 4 opciones genéricas (tazas, camisetas, sudaderas, lote) en vez de los productos reales | offerings reales, empezando por polerones |
| Formulario sin envío | La confirmación dice que no se envía nada | Necesario para poder cobrar: pasarela de pago (ver punto 3) |

### 7. Datos que hay que pedirle al cliente antes de cerrar

1. Razón social y RUT.
2. Colores oficiales.
3. Enlace a la carpeta con logo, fotos y documentos (logo de buena calidad y fotos «buenas y suficientes»: desbloquea logo real y las 19 fotos de producto).
4. Los 3 sitios que le gustan y los 3 que no.
5. Monto mínimo de compra para despacho gratis.
6. Lista de precios de los 11 a 20 productos listos para comprar.
7. Medidas, materiales, cuidados de lavado, formatos y garantía por producto.
8. Qué hacer con el nombre «Sublikat Taller de Estampados S.L.» y con el aviso legal de retracto (validación de abogado).

**Contexto de plazo y presupuesto que da el cliente:** sitio deseado para el 2026-11-30, presupuesto de
$1.000.000 a $2.000.000, y cinco páginas imaginadas (Inicio, Tienda de productos listos, Productos
personalizados, Cotizar, Contacto y retiro). La portada actual cubre Inicio + Tienda + Cotizar en un
solo documento; «Productos personalizados» y «Contacto y retiro» son secciones que aún no existen.

## Historial de dirección visual

| Fecha | Dirección | Estado |
|---|---|---|
| 2026-11-11 | Tríada del cliente (magenta `#f52c93`, cyan `#2cddf5`, amarillo `#f5df2b`) | Descartada por el cliente |
| 2026-11-11 | Rediseño violeta (`#4f2cf5`) con titulares Archivo | Descartada por el cliente |
| 2026-11-12 | **Crema `#f4e6c8` + Chewy**, estética de sticker | **Vigente** |

Las dos primeras están archivadas en `archive/referencias/` y `archive/referencias-paletas/`. No se
borraron para conservar el registro, pero **no se usan para construir** y no deben citarse como
estado actual. Si alguna vez se retoman, hay que volver a abrirlas como propuesta y no como base.


## Sistema de animación por desplazamiento (Scroll-Driven Animations)

`build/motion.css` es la fuente única del movimiento del sitio. Se inyecta en `index.html` con la
zona `OD:MOTION`, justo después de `OD:ESTILOS`, igual que el resto de capas. El color, el
comportamiento y el movimiento tienen así una única fuente de verdad. La matriz sección → demo →
técnica vive en `MOTION.md` y el mapa de anclas en `SECTION-MAP.md`.

**Estado actual:** implementado con las filas 1, 2, 3, 4, 6, 9, 10 y 11 de la matriz: barra de lectura,
sombra de cabecera, entrada del héroe y apariciones al entrar en pantalla. Las filas 5, 7, 8 y 12
quedan fuera por decisión del cliente. El detalle y las mediciones están en `MOTION.md` y
`qa/movimiento-implementado.md`.

### Regla de oro

El contenido es visible por defecto. Todos los estados iniciales (`opacity: 0`) están declarados
dentro de `@supports (animation-timeline: view())` y de `@media (prefers-reduced-motion:
no-preference)`. Un navegador sin soporte —o con movimiento reducido— muestra la página completa
sin ejecutar una línea de JavaScript.

### Tres familias de movimiento

| Familia | Qué hace | Dónde |
|---|---|---|
| **Reveal** | Opacidad 0→1 con desplazamiento de 16-24 px o escala 0.97→1 | Beneficios, fichas del catálogo, pasos del proceso, compromisos, pie |
| **Parallax** | Desplazamiento vertical sutil de 18 px en capas decorativas | Cinta y sello del héroe (`.od-parallax`) |
| **Progress** | Una línea que se completa al avanzar el scroll | Barra de lectura de la cabecera (`.od-progress`). La línea del proceso se retiró el 15-11-2026 |

### Animación por sección

- **Cabecera** (`.od-header`): `fixed` sobre la portada, **sin fondo propio** para que la foto se vea
  dentro de su relleno; solo la tarjeta del menú (`bg-surface`) es opaca. Sombra que aparece entre los
  primeros 150 px de scroll (`animation-timeline: scroll(root)`). No cambia de tamaño ni de altura:
  `--hh` sigue siendo válido para la tablist fija y para el `scroll-margin-top` de los anclajes.
- **Portada fotográfica** (`.od-portada`): foto a sangre de una pantalla por detrás del menú que, al
  bajar, se encoge hasta una banda fina justo debajo de él (`cover to fixed header`): `block-size` de
  `100svh` a `--hh` + `--od-portada-banda` en `0 90vh`, con el `background-position` de la foto viajando
  de `50% 0` a `50% 100%` y el nombre apagándose en `0 45vh`. Es decorativa (`pointer-events: none`, z 35
  bajo el menú) y su reserva de alto la pone `body`. Con movimiento reducido se queda quieta en el flujo.
- **La foto de la portada es responsive**: un archivo por tramo de ancho (`-movil.jpg` vertical de
  554 × 1200 para móvil, `-1440.jpg` para tablet y apaisado, `-2150.jpg` desde 1280 px) y foco horizontal
  por ancho en `--od-portada-foco-x` (68 % en tablet vertical). En vertical, `cover` solo muestra ~554 px
  de ancho: servir el original completo era descargar 287 KB para tirar el 74 %.
- **Héroe** (`.od-hero`, `.od-hero__*`): entrada coordinada al cargar (claim, título, descripción,
  CTAs, nota, imagen, cinta y sello con desfase). El H1 nunca se oculta: solo se desplaza. La cinta
  del toldo añade parallax. No lleva `animation-timeline` porque ya está en pantalla al cargar.
- **Aviso del taller**: sin animación. Es un aviso legal: aparece completo.
- **Beneficios** (`.od-stagger.od-stagger-2` + `.od-fade`): entrada progresiva de las cuatro
  tarjetas con desfase por columna.
- **Catálogo** (`.od-reveal` en cada ficha, `.od-tablist`): las 19 fichas aparecen al entrar en
  pantalla, con desfase por columna en escritorio. Al cambiar de pestaña solo se anima el panel
  visible: los paneles ocultos (`hidden`) no generan línea de tiempo.
- **Proceso** (`.od-steps`, `.od-step`): al salir por arriba cada paso se reduce al 96 % con 8 % de
  escalonado (apilado ligero). **Sin línea de recorrido**: la «columna vertebral» de la demo 15 se
  retiró el 15-11-2026 porque se leía como un subrayado a medias sobre las píldoras «Paso NN», que ya
  numeran los pasos.
- **Compromisos** (`.reviews-grid.swipe.od-stagger`): entrada escalonada de las tres tarjetas.
- **Contacto** (`#contacto`): título y entradilla con opacidad; el formulario y la tarjeta de
  contacto solo se desplazan, nunca se ocultan, para no comprometer el foco del teclado ni la
  validación.
- **Pie** (`.site-footer.od-reveal-soft`): entrada discreta al llegar al final.

### Compatibilidad

- Chromium 115+ soporta `animation-timeline: view()` y `scroll()` de forma nativa.
- Safari 26+ soporta `animation-timeline`; en versiones anteriores la página se muestra completa
  gracias al fallback de `@supports`.
- Firefox mantiene el contenido visible sin animación (el bloque `@supports` no se aplica), sin
  script adicional.
- Fallback verificado: sin soporte, sin JavaScript y con movimiento reducido, la página conserva
  su composición, su contraste y su navegabilidad.

### Accesibilidad y rendimiento

- `@media (prefers-reduced-motion: reduce)` neutraliza todas las animaciones y devuelve el
  contenido a su estado visible; el scroll nunca se bloquea ni se altera.
- Solo se animan `transform`, `translate` y `opacity`. Nunca `width`, `height`, `top`, `left`,
  `margin` ni `padding`; no hay Layout Shift ni recálculo constante del layout.
- Sin `will-change` indiscriminado, sin librerías, sin listeners de `scroll` y sin
  `requestAnimationFrame`.
- En móvil se acortan los desplazamientos, el parallax se desactiva y el escalonado se reduce.
- Las fichas con `hover: translate-y` se animan con la propiedad `translate`, no con `transform`,
  para no anular el hover aprobado.

### Ganchos semánticos

`.od-header`, `.od-hero`, `.od-hero__body`, `.od-hero__media-col`, `.od-hero__claim`,
`.od-hero__title`, `.od-hero__lead`, `.od-hero__ctas`, `.od-hero__note`, `.od-hero__media`,
`.od-hero__deco`, `.od-hero__tape`, `.od-parallax`, `.od-stagger`, `.od-stagger-2`, `.od-fade`,
`.od-reveal`, `.od-reveal-soft`, `.od-reveal-left`, `.od-reveal-right`, `.od-reveal-scale`,
`.od-tablist`, `.od-steps`, `.od-step` (estas dos últimas solo para el apilado ligero y los reveals;
su línea de recorrido se retiró el 15-11-2026).

Se aplican con `build/ganchos-scroll.ps1`, que es idempotente: deja **48 elementos** con al menos un
gancho (51 clases `od-*`) y en la segunda pasada aplica 0. No toca la composición ni los textos del
diseño aprobado. Ya está implementado en `build/motion.css`; no hay que volver a tocar el HTML.

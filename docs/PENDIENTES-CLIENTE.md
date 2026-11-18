# Sublikat — Pendientes del cliente e implementación por sector

Documento de trabajo para completar el cuestionario del 2026-11-11 (53 preguntas respondidas por
Ronald Peschke) y convertir la portada actual en la web que el taller pidió.

**Cómo se usa:** marca cada casilla cuando llegue la respuesta, escribe la respuesta en la columna
correspondiente y avisa qué sector se implementa. Cada bloque se puede resolver por separado: el
sector 2 (datos de empresa) no depende de nada y desbloquea correcciones inmediatas.

El detalle completo de qué hay hoy en la página y qué habría que cambiar está en `DESIGN.md`, sección
**«Encaje con el cuestionario del cliente (2026-11-11)»**. Este documento es la lista de trabajo.

---

## Resumen del estado

| | |
| --- | --- |
| Lo que hay | Portada única (`index.html`) con 5 pestañas de categoría, 19 fichas, widget de WhatsApp, formulario de cotización y modo claro/oscuro |
| Lo que pide el cliente | Estética moderna, minimalista y corporativa, con trato de «usted» y humor mínimo; datos reales de la empresa; cobro en línea; retiro y envío en Chile; FAQ con sus 6 dudas; polerones como producto estrella |
| Brecha principal | Tono de los textos: hoy la página usa tuteo y humor de barrio; el cliente pidió «usted» y humor mínimo. La identidad visual **ya está cerrada** (crema + Chewy) |
| Brecha secundaria | Datos: dirección, horarios, teléfono, país y razón social hoy son inventados |
| Plazo y presupuesto del cliente | Sitio el 2026-11-30, presupuesto de $1.000.000 a $2.000.000 |

---

## Orden de implementación sugerido

1. ~~**Sector 6 — Defectos**~~ · **aplicado el 2026-11-11**.
2. ~~**Sector 2 — Datos de empresa**~~ · **aplicado el 2026-11-11** con los datos disponibles (siguen pendientes RUT, local, sábados, correo publicado, Maps y dominio).
3. ~~**Sector 1 — Identidad y tono**~~ · **cerrado el 2026-11-12**: el cliente vio las propuestas violeta y tríada y no lo convencieron, así que se mantiene crema + Chewy. Solo sigue vivo el paso a «usted» y el humor mínimo en los textos.
4. **Sector 4 — Producto y catálogo** (necesita precios, launch y decisión de polerones).
5. **Sector 3 — Comercio** (necesita pasarela, montos y textos legales: va al final porque toca el flujo de compra).

---

## Sector 1 — Identidad, estilo y tono

**Estado:** cerrado el 2026-11-12 · **Pendiente solo:** reescritura de textos a «usted» y humor mínimo

**Cerrado el 2026-11-12:** el cliente vio las dos propuestas de identidad —el rediseño violeta con
titulares Archivo y la tríada de Adobe Color (magenta `#f52c93`, cyan `#2cddf5`, amarillo `#f5df2b`,
oliva `#a39c67`, ciruela `#75465e`, petróleo `#457075`)— y **ninguna lo convenció**. Se mantiene la
dirección que ya estaba en disco: paleta crema `#f4e6c8` con tinta `#3b2417`, coral `#d4573f` y
toldo `#f7c948`, y **Chewy** como tipografía de titular. Las dos propuestas están archivadas en
`archive/referencias/pendiente-violeta/` y `archive/referencias-paletas/`; no se usan para construir.
Los contrastes de la paleta vigente están auditados (13,9:1 tinta/superficie, 7,2:1 texto secundario,
4,7:1 botón) en `DESIGN.md`. Lo único que sigue abierto de este sector es el registro de los textos:
paso a «usted» y humor mínimo, sin tocar tipografía ni color.

| # | Qué necesitamos del cliente | Respuesta | Qué desbloquea |
| --- | --- | --- | --- |
| 1.1 | Colores oficiales de la marca (nombres o códigos hex). La paleta actual es decisión nuestra, no del cliente. | **Cerrado por descarte:** sin colores oficiales y con violeta y tríada rechazadas, la paleta crema es la vigente (`build/tokens.css`) | Nada: los tokens ya son la fuente de verdad |
| 1.2 | El logotipo que mencionas, ¿va con texto o solo el ícono? ¿Lo usamos tal cual en cabecera y favicon? | ____________________ | Sustituir el gato SVG provisional de la cabecera |
| 1.3 | Tres sitios que te gusten y tres que no, con el motivo de cada uno. | ____________________ | Ya no bloquea la identidad; sirve si algún día se replantea |
| 1.4 | Confirmación: ¿la web se ve profesional y corporativa, conservando el gato y las ilustraciones? ¿El gato aparece en portada, pasos y fichas, o solo en la portada? | ____________________ | Alcance exacto de la ilustración de marca |
| 1.5 | Confirmación del trato de «usted» en todo el sitio (hoy la página usa «tú» en los textos). | ____________________ | Reescritura de héroe, proceso, formulario y confirmaciones |
| 1.6 | ¿«Bueno, bonito barato» es el lema? ¿Lo usamos como argumento en el hero? | ____________________ | Claim principal de la portada |
| 1.7 | Tus clientes son personas, emprendedores y empresas. ¿Quieres que la web hable a los tres o a uno solo? | ____________________ | Orden del contenido y secciones por tipo de cliente |

**Cambios previstos en este sector:** solo textos. Paso a «usted», humor mínimo y claim «bueno,
bonito y barato» en el héroe. **No** se toca la paleta, **no** se cambia Chewy y **no** se rehacen
los componentes. Se edita el parcial de cada sección en `build/sections/` y se regenera con
`powershell -File build\actualizar-portada.ps1` (seguro: el catálogo de datos y el de la página
coinciden en 19 productos, verificado el 2026-11-12).

---

## Sector 2 — Datos de empresa (hoy hay inventos)

**Estado:** aplicado el 2026-11-11 con los datos disponibles · **Pendiente:** razón social y RUT, número de local, sábados, correo que se publica, enlace de Maps y dominio

**Aplicado el 2026-11-11:** dirección «Bocaccio 866, Maipú, Santiago», horario «lunes a viernes de
10:00 a 17:00», envíos a todo Chile con retiro en taller y Blueexpress, WhatsApp +56 9 4940 0253 en
los tres enlaces, Instagram @sublikat.cl, correo pedidos@sublikat.cl en el pie, borrado el nombre
social inventado «Sublikat Taller de Estampados S.L.», iconos de la tarjeta de contacto convertidos
a SVG de la misma familia y etiquetas Open Graph añadidas. En el pie, la columna «Productos» pasa a
las 5 categorías reales con enlace directo a cada pestaña del catálogo.

| # | Qué necesitamos del cliente | Respuesta | Qué desbloquea |
| --- | --- | --- | --- |
| 2.1 | Razón social y RUT de la empresa. | ____________________ | Pie de página y facturación (SII) |
| 2.2 | Dirección completa: ¿Bocaccio 866 tiene número de local o departamento? | ____________________ | Tarjeta «Taller físico y recogidas» |
| 2.3 | Horario: ¿sábados? ¿domingo cerrado? ¿El tramo 10:00–17:00 es todos los días de lunes a viernes? | ____________________ | Tarjeta de horarios |
| 2.4 | WhatsApp: ¿confirmamos +56 9 4940 0253 para el widget flotante y los botones? | ____________________ | Enlaces de WhatsApp (hoy apuntan a un número de ejemplo) |
| 2.5 | Correo: ¿publicamos `rolakun@gmail.com`, `pedidos@sublikat.cl` o los dos? | ____________________ | Campo y texto de ayuda del formulario |
| 2.6 | Instagram: ¿`@sublikat.cl` es la cuenta oficial? ¿Hay Facebook o TikTok? | ____________________ | Enlaces sociales y sección «síguenos» |
| 2.7 | Enlace al perfil de empresa en Google Maps. | ____________________ | Enlace de perfil + reseñas reales |
| 2.8 | Dominio: ¿compramos `sublikat.cl`? ¿Con qué nombre de dominio (ej. `sublikat.cl`, `tienda.sublikat.cl`)? ¿Quién lo administra? | ____________________ | Canonical, Open Graph y favicon antes de publicar |
| 2.9 | ¿El taller aparece con nombre en el letrero y en Maps? | ____________________ | Coherencia entre la web y el punto físico |
| 2.10 | Si es empresa unipersonal o con dependientes, ¿el pie debe incluir RUT y giro? | ____________________ | Pie legal definitivo |

**Cambios previstos en este sector:** sustituir dirección, horarios, teléfono, Instagram y razón
social en la tarjeta de contacto, el pie y los dos enlaces de WhatsApp; añadir enlace a Maps e
Instagram; dejar el nombre social en hueco hasta 2.1; y preparar canonical, Open Graph y favicon
(los tres últimos quedan pendientes de 2.8).

---

## Sector 3 — Comercio: precios, pago, envío y FAQ

**Estado:** sin empezar · **Depende de:** cuenta de Mercado Pago, montos y textos legales

| # | Qué necesitamos del cliente | Respuesta | Qué desbloquea |
| --- | --- | --- | --- |
| 3.1 | Lista de precios (con IVA) de los 11 a 20 productos listos, o confirmación de que se cotizan uno a uno. | ____________________ | Fichas con precio o «precio a consultar» |
| 3.2 | Monto mínimo de compra para tener despacho gratis. | ____________________ | Sección de envío y FAQ |
| 3.3 | ¿Quién paga el flete cuando no hay despacho gratis? ¿Costo aproximado? | ____________________ | Sección de envío |
| 3.4 | Mercado Pago: ¿tienes cuenta? ¿Lo usamos para pagar productos listos y el resto se cotiza por WhatsApp? | ____________________ | Checkout en la web |
| 3.5 | Emisión de boleta y factura: ¿con SII? ¿Mercado Pago emite? ¿Qué datos van en el pie? | ____________________ | Pie legal y facturación |
| 3.6 | Retiros en el taller: ¿días, horas y con cita previa? | ____________________ | Tarjeta de contacto y retiro |
| 3.7 | Plazo real: ¿1 a 3 días hábiles desde la aprobación del diseño? ¿Cuenta fin de semana? | ____________________ | Corregir «Listo en 24 h» y la FAQ de plazos |
| 3.8 | ¿El precio incluye diseño? ( Dijiste que no puedes prometer «diseño incluido»: ¿confirmamos que va aparte?) | ____________________ | Quitar la promesa de diseño incluido en lotes |
| 3.9 | Formatos de archivo que aceptas y resolución mínima. | ____________________ | Paso 1 del proceso y FAQ |
| 3.10 | Medidas, materiales y cuidados de lavado por producto (o una ficha técnica en PDF). | ____________________ | Fichas de producto ampliadas |
| 3.11 | Garantía: ¿qué cubre y hasta cuántos lavados? ¿Qué no cubre? | ____________________ | Franja de confianza y FAQ de calidad |
| 3.12 | ¿Tienes un texto tipo con la información que entregas siempre? Lo usaríamos en las fichas. | ____________________ | Fichas de producto |

**Cambios previstos en este sector:** añadir una sección de preguntas frecuentes con las 6 dudas que
declaraste (plazos, calidad y durabilidad, precio, cantidad mínima, despacho y cómo pagar), una
sección de envío y retiro con Blueexpress y retiro en Maipú, medios de pago visibles, y la integración
del checkout. Sin 3.4 el formulario seguirá mostrando su confirmación de demostración, y eso hay que
decirlo claramente en la web hasta que exista.

---

## Sector 4 — Producto y catálogo

**Estado:** sin empezar · **Depende de:** precios y decisión sobre polerones

| # | Qué necesitamos del cliente | Respuesta | Qué desbloquea |
| --- | --- | --- | --- |
| 4.1 | ¿Los 19 productos del catálogo son los mismos que tienes en el taller? ¿Alguno cambió? | ____________________ | Catálogo y fotos |
| 4.2 | Polerones: ¿qué modelos y tipos hay? ¿Se venden por pieza o por lote? | ____________________ | Producto estrella: hero, ficha propia y opción del formulario |
| 4.3 | Polerones: ¿van dentro de «Estampados textiles» o prefieres una categoría propia? | ____________________ | Estructura de las 5 pestañas |
| 4.4 | Lanzamiento: ¿confirmas tazas, poleras, mousepads y termos como productos listos? | ____________________ | Distinción «disponible ya» / «a pedido» en las 19 fichas |
| 4.5 | ¿Cuáles de los 19 están listos para comprar y cuáles son a pedido? | ____________________ | Etiqueta de estado en cada ficha |
| 4.6 | Enlace a la carpeta con el logo, las fotos de producto y las del taller (vino vacío en el cuestionario). | ____________________ | Logo real y las 19 fotos reales (hoy hay espacios SVG) |
| 4.7 | ¿Tienes fotos reales de producto ya tomadas? Dijiste que sí, pero sin el enlace no puedo usarlas. | ____________________ | Sustituir los espacios visuales SVG |

**Cambios previstos en este sector:** destacar polerones en el hero, en la ficha de catálogo y en el
desplegable del formulario; añadir el estado «disponible ya» / «a pedido» a las 19 fichas; y
sustituir los espacios SVG por las fotos reales cuando lleguen (con `build\patch-imagenes.ps1` para
las rutas y `assets/stock/credits.json` al día).

---

## Sector 5 — Lo que ya está bien

**Estado:** sin cambios previstos · **Depende de:** nada

| Requisito | Estado actual |
| --- | --- |
| Compras desde el celular | Implementado: mobile-first, objetivos táctiles de 44 px, sin scroll horizontal |
| Cotizar un producto personalizado | Implementado: los 19 botones «Cotizar» prellenan el formulario |
| Contacto por WhatsApp | Implementado: widget flotante + tarjeta de respuesta rápida |
| Muestra antes de producir | Implementado: previsualización y visto bueno antes de imprimir |
| Formatos de archivo | Implementado: PNG, SVG o boceto, con ajuste de resolución |
| Pedidos desde 1 unidad | Implementado: aviso «sin pedido mínimo» |
| Gato e ilustraciones de marca | Implementado: se conservan (ajuste de peso visual en el sector 1) |
| Base de calidad | Implementado: contraste ≥ 4,5:1 en ambos modos, foco visible, `prefers-reduced-motion` |

---

## Sector 6 — Defectos que no dependen del cliente

**Estado:** aplicado el 2026-11-11 · **Pendiente:** nada de este sector

**Aplicado el 2026-11-11:** las 7 anclas rotas están resueltas y el pie se rehizo con enlaces
válidos; el enlace a una categoría del pie abre además su pestaña del catálogo; las 3 reseñas
inventadas y la nota «★ 4.9/5 · 142 reseñas verificadas» se sustituyeron por los compromisos
verificados del taller (mínimo 1 unidad, muestra antes de imprimir, respuesta de 10:00 a 17:00) y
por el aviso del perfil verificado en Google Maps; el desplegable del formulario ofrece los 19
productos reales agrupados en las 5 categorías, con «Otro soporte personalizado» al final. El
linter de la app queda en 0 avisos (P0, P1 y P2).

| # | Qué hay que corregir | Por qué |
| --- | --- | --- |
| 6.1 | 7 anclas rotas: `#camisetas`, `#tazas`, `#sudaderas`, `#lotes`, `#como-trabajamos`, `#calidad` y `#faq` | Apuntan a un catálogo de 4 productos que ya no existe y a secciones que nunca se crearon |
| 6.2 | Pie desactualizado: «Catálogo en stock express», «Guía de tintas y fijado» y «Preguntas frecuentes» | Rehacer el pie con las 5 categorías reales y el enlace a la FAQ nueva (sector 3) |
| 6.3 | Reseñas de ejemplo (Marta Salcedo, Álvaro Gómez, Elena Valero) bajo «Opiniones verificadas» | Son ficticias; con el perfil de Maps verificado se usan las reales o se retira la sección. En cualquier caso, quitar «verificadas» |
| 6.4 | Desplegable del formulario con 4 opciones genéricas (tazas, camisetas, sudaderas, lote) | Offer los productos reales, empezando por polerones |
| 6.5 | Formulario sin envío y confirmación que dice «no se ha enviado ningún dato» | Depende del sector 3; hasta entonces, el texto debe ser explícito |

---

## Sector 7 — Datos que hay que pedirle (checklist)

| # | Ítem | Estado |
| --- | --- | --- |
| 7.1 | Razón social y RUT | ☐ |
| 7.2 | Colores oficiales | ☑ **Cerrado por descarte** (2026-11-12): sin colores del cliente y con violeta y tríada rechazadas, se mantiene la paleta crema |
| 7.3 | Enlace a la carpeta con logo, fotos y documentos | ☐ |
| 7.4 | Tres sitios que le gustan y tres que no | ☐ (ya no bloquea: identidad cerrada) |
| 7.5 | Monto mínimo de compra para despacho gratis | ☐ |
| 7.6 | Lista de precios de los productos listos | ☐ |
| 7.7 | Medidas, materiales, cuidados, formatos y garantía por producto | ☐ |
| 7.8 | Decisión sobre el nombre social y el aviso legal de retracto | ☐ |
| 7.9 | Enlace al perfil de Google Maps | ☐ |
| 7.10 | Nombre de dominio definitivo y quién lo administra | ☐ |
| 7.11 | Cuál paleta es la oficial | ☑ **Crema + Chewy** (2026-11-12). Violeta y tríada, descartadas |

---

## Nota sobre el aviso legal

El texto actual de retracto (10 días para producto listo, sin retracto en producto personalizado) está
marcado como **ejemplo** y pendiente de validación jurídica. El cliente dijo que emite boleta y
factura, así que la redacción final necesita un abogado antes de publicar, no solo un dato de negocio.

## Nota sobre los plazos del cliente

El sitio se quiere el **2026-11-30** con presupuesto de $1.000.000 a $2.000.000. El flujo de cobro en
línea (sector 3) es el bloque más pesado de los cinco: si el plazo aprieta, la recomendación es sacar
primero el checkout de Mercado Pago para productos listos y dejar el resto como cotización por
WhatsApp, que es como funciona hoy el taller.

---

## Registro de cambios

| Fecha | Sectores | Qué se tocó |
| --- | --- | --- |
| 2026-11-11 | 6 y 2 | Anclas rotas resueltas (0 pendientes), pie rehecho con enlaces y datos reales, reseñas inventadas sustituidas por compromisos verificables, desplegable con los 19 productos, dirección, horarios, envíos, WhatsApp, Instagram y correo corregidos, etiquetas Open Graph añadidas y linter de la app a 0 avisos. |
| 2026-11-11 | 1 (paleta, propuesta) | **Propuesta no aplicada a la portada.** Se preparó un rediseño con violeta `#4f2cf5` de acento, amarillo `#f5df2b`, oliva `#757150`, grafito `#413f4b` y neutros derivados. Quedó sin ensamblar y se archivó en `archive/referencias/pendiente-violeta/` el 2026-11-12. |
| 2026-11-11 | 1 (reparto del color, propuesta) | **Propuesta no aplicada.** Reparto de territorios del rediseño violeta: violeta para acciones, amarillo como un gesto por bloque, oliva para confianza, grafito para estructura. Mismo destino: archivado. |
| 2026-11-11 | 1 (tríada, propuesta) | **Propuesta no aplicada.** Tríada de Adobe Color (magenta `#f52c93`, cyan `#2cddf5`, amarillo `#f5df2b`, oliva `#a39c67`, ciruela `#75465e`, petróleo `#457075`) preparada como alternativa. El cliente la vio y no lo convenció. Archivada el 2026-11-12 con los dos JPEG en `archive/referencias-paletas/`. |
| 2026-11-12 | 1 (cierre de identidad) | **Dirección cerrada:** crema `#f4e6c8` + Chewy, con coral `#d4573f` y toldo `#f7c948`. Se retiraron del proyecto las propuestas violeta y tríada, se archivaron `index2.html`, las pantallas de Stitch y los JPEG de AdobeColor, y se limpiaron los manifiestos de artefactos huérfanos. `DESIGN.md`, `ARQUITECTURA.md` y este documento se reescribieron con la paleta real. La portada no cambió de aspecto: el texto visible es idéntico al de la copia de `archive/baseline/`. |
| 2026-11-15 | 1 (portada y cabecera) | **Portada rehecha: la foto se encoge hasta ser una banda bajo el menú** (efecto «cover to fixed header»). (1) La cabecera pasa de `sticky` a `fixed`: no reserva alto y la foto arranca en `y=0` a sangre por detrás de ella, con el menú siempre encima (z 50 sobre 35). (2) La portada anima ahora el **alto del marco** de `100svh` a `--hh` + `--od-portada-banda` (hoy 117 px en escritorio, ver punto 6) en `0 90vh`, con el `background-position` de la foto de `50% 0` a `50% 100%` y el nombre apagándose en `0 45vh`; el alto que deja de ocupar en el flujo lo reserva `body` con `padding-block-start: 100svh`. (3) **Un fallo que costó encontrar:** el estado base es `html .od-portada` (0,1,1) y la regla del efecto estaba como `.od-portada` (0,1,0), así que `position: fixed` perdía la cascada mientras el alto sí se animaba: el marco se encogía pero se iba con la página (`top` de 0 a −4000). Corregido con el prefijo `html ` en las cinco reglas. (4) Se restauró el **panel de confirmación del formulario** (`#exito-contacto`), que estaba vacío: al enviar con datos válidos el formulario se ocultaba sin ningún mensaje. (5) **La cabecera ya no pinta fondo** (`background: var(--bg)` comentado en `#site-header`): la foto se ve por detrás del menú y **dentro de la cabecera**, entre el borde de la ventana y la tarjeta; solo la tarjeta es opaca. (6) **La banda acaba casi a la altura del menú**: `--od-portada-banda` pasó de `64px` fijo a `clamp(10px, 2vh, 20px)` (y `clamp(8px, 1.6vh, 16px)` por debajo de 768 px), así que el alto final es **117 px** a 1280×900, **172 px** a 375×812 y **177 px** a 768×900, con un labio de foto de unos 30 px por debajo de la tarjeta. (7) **Se retiró la línea azul del proceso** («Cómo trabajamos»): la barra de `--accent` que avanzaba sobre las píldoras «Paso NN» se leía como un subrayado a medias; se quitaron la base, el relleno, el segmento móvil y sus `@keyframes`, y se conservó el apilado ligero de los pasos. Regresión en el arnés: **48/48 pruebas en verde**. (8) **La foto de portada es responsive**: se generaron variantes de 1440, 1024, 720 y un recorte vertical de 554 × 1200 (73 KB) para móvil; cada tramo de ancho carga la suya (`-movil.jpg` en vertical, `-1440.jpg` en tablet y apaisado, `-2150.jpg` desde 1280 px) y el foco horizontal se ajusta por ancho con `--od-portada-foco-x` (68 % en tablet vertical, para no encuadrar la pared). Arnés: **49/49**. (9) **El modo oscuro se muda dentro de la hamburguesa en móvil**: `#theme-toggle` no ocupa sitio en la barra cuando la pantalla baja de 768 px; el mismo nodo (no un duplicado: conserva listeners, `aria-pressed` y estado) pasa a ser una fila más de `#menu-movil`, a todo el ancho, con la etiqueta «Modo oscuro»/«Modo claro» al lado del icono. Al ensanchar vuelve a la barra, justo antes de la hamburguesa. Medido: fila de 301 × 48 px a 375 px y botón de 44 × 44 px a 1280 px, un solo nodo en el documento. Arnés: **52/52**. |

### Avisos que siguen abiertos

- La tipografía de titular **es Chewy y se queda**: el cliente descartó las alternativas (violeta
  con Archivo y tríada). Ya no es un aviso abierto.
- Los textos siguen en tuteo y con humor de barrio; el cliente pidió trato de «usted» y humor mínimo.
  Es lo único que queda del sector 1.
- El formulario no envía a ningún servidor: la confirmación lo dice y es honesto, pero hasta que haya
  checkout o un endpoint, «pedir presupuesto» no llega a nadie por sí solo. Queda en el sector 3.
- El campo «Correo electrónico» viene precargado con `pedidos@sublikat.cl` por decisión anterior; el
  cuestionario respondió `rolakun@gmail.com` como correo de contacto. Hay que confirmar qué bandeja
  está vigilada hasta que exista el dominio.
- El formulario muestra un nombre de ejemplo precargado («Lucía Fernández») porque el sitio sigue
  siendo un prototipo sin envío real. Se limpia junto con el formulario, en el sector 3.
- La franja de confianza sigue prometiendo «Listo en 24 h» y una garantía por 50 lavados, y el bloque de
  proceso ofrece «precios por volumen desde 10 unidades con diseño mixto incluido», que contradice el
  mínimo de 1 unidad. Los tres son del sector 3.
- `canonical`, `og:image` y el favicon propio esperan la decisión del dominio (2.8).
- ~~**El panel de confirmación del formulario no está en el marcado** (2026-11-15)~~: **resuelto el
  2026-11-15**. La zona `<!-- OD:EXITO -->` se restauró con el panel `#exito-contacto` (nombre, aviso de
  que no se envía nada y botón «Enviar otra consulta»). Las pruebas del arnés que estaban marcadas como
  «no aplica» vuelven a comprobar la confirmación.
- Las pantallas de Stitch (`04-modo-oscuro.html`, `05-movil.html`) están en
  `archive/referencias/src/`: conservan su propia paleta con hexadecimales literales, no heredan los
  tokens y no forman parte del entregable.

## Estado real de la portada (2026-11-12)

Esta sección describe **lo que hay en disco**, no lo que se llegó a proponer. Las propuestas violeta
y tríada nunca se ensamblaron en `index.html` y están archivadas.

### Lo que la portada ya tiene

- [x] Paleta crema `#f4e6c8` + Chewy en `build/tokens.css`, con modo claro y oscuro.
- [x] Contraste auditado: 13,9:1 tinta/superficie, 7,2:1 texto secundario, 4,7:1 botón principal.
- [x] 19 fichas en 5 categorías, sin precios ni stock inventados.
- [x] Beneficios = compromisos confirmados (desde 1 unidad, muestra previa, 10:00–17:00).
- [x] Proceso en cuatro pasos sin plazos garantizados.
- [x] Navegación móvil accesible con panel de menú y enlace de salto al contenido.
- [x] Formulario de prototipo: el panel final dice que no hay envío a servidor.
- [x] Datos de contacto reales (dirección, horarios, WhatsApp, Instagram, correo).
- [x] Anclas y enlaces del pie sin roturas.
- [x] 36 `data-od-id` y ganchos `od-*` de movimiento aplicados en el marcado.
- [x] Capa de movimiento implementada (`build/motion.css` + zona `OD:MOTION`): barra de lectura, sombra de cabecera, entrada del héroe y apariciones al entrar en pantalla. Verificado en navegador real (`qa/movimiento-implementado.md`).

### Lo que NO está en disco, aunque se propuso

| Propuesta | Estado |
| --- | --- |
| Violeta `#4f2cf5` con titulares Archivo | En `archive/referencias/pendiente-violeta/`. Nunca se ensambló |
| Tríada de Adobe Color | Solo los dos JPEG en `archive/referencias-paletas/`. Nunca se ensambló |
| Textos en «usted» | **No aplicados**: la portada sigue en tuteo |
| Cinco páginas (`tienda`, `personalizados`, `cotizar`, `contacto`) | **No existen**: solo `index.html` |
| 20 fichas con polerón destacado | **No**: la portada tiene 19 fichas y no hay bloque de polerón |
| Archivo como tipografía de titular | **No**: Chewy sigue siendo la titular |

### Sigue pendiente del cliente

| # | Dato que falta | Dónde se aplica al llegar |
|---|---|---|
| 1 | Logotipo definitivo (el gato SVG es provisional) | cabecera, pie, favicon y Open Graph |
| 2 | Fotografías reales del taller y de cada producto | fichas del catálogo |
| 3 | Lista de precios por producto y escalamiento por volumen | fichas y bloque de volumen |
| 4 | Qué productos están listos para compra y cuáles solo a pedido | ficha a ficha; hoy todas cotizan |
| 5 | Stock y variantes (tallas, colores, modelos) de polerones | ficha de polerones |
| 6 | Medidas, materiales y cuidados por soporte | descripciones del catálogo |
| 7 | Monto mínimo para envío gratis | bloque de envíos y FAQ de contacto |
| 8 | Plazo máximo real de producción por tipo de pedido | FAQ y proceso |
| 9 | Razón social y RUT (para facturar) | pie y aviso legal |
| 10 | Enlace de Google Maps del perfil | contacto y utilidades del pie |
| 11 | Número de local y horarios del sábado, si los hay | contacto y cabecera |
| 12 | Dominio definitivo y titular del dominio | canonical, Open Graph y favicon |
| 13 | Condiciones de devolución y garantía comercial | aviso legal del pie |
| 14 | Endpoint de envío y credenciales de Mercado Pago | formularios, panel final y carrito |

### Notas de forma

- Nada de lo pendiente se rellenó con suposiciones: los huecos visibles en pantalla están
  etiquetados como «por confirmar».
- `build/actualizar-portada.ps1` es idempotente y vuelve a insertar las zonas `OD:` que falten,
  de modo que el sitio se puede regenerar tras cualquier restauración de ficheros.
- **Catálogo conciliado (2026-11-12):** `build/data/catalogo.json` declara **19** productos y la
  portada tiene **19** fichas, con los mismos ids. Regenerar no cambia el catálogo: la página
  resultante es idéntica y dos ejecuciones dan el mismo archivo byte a byte.
- `build/contenido-inicio.json` es la fuente de verdad del contenido de la portada: las
  correcciones se aplican con `build/aplicar-contenido.ps1` y no se edita el HTML a mano.

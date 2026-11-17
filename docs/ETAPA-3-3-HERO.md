# Sublikat — Etapa 3.3: migración de Hero

## Fuente y ubicación del componente

Se consultó `docs/archive/index-original.html`, bloque `OD:HERO` entre la
franja previa y `OD:BENEFICIOS`. El componente existente está en
`src/sections/Hero/Hero.jsx`; no existe `src/components/Hero/Hero.jsx`.

## Estructura original

Hero no es un `<section>` y no tiene ID. Devuelve dos nodos hermanos directos
dentro de `.od-secciones`, sin wrapper:

1. Una franja informativa `.mb-6.flex.flex-wrap.items-center.justify-between.gap-3`
   con el rótulo `.od-parallax`, el texto del taller, el texto de productos
   oculto hasta `md` y el estado de verificación de Google Maps.
2. La tarjeta `.od-hero`, con el detalle decorativo `od-hero__deco` y una
   cuadrícula de dos columnas. La columna de texto contiene claim, H1, párrafo,
   dos CTA y nota de confianza; la columna visual contiene cinta, imagen,
   leyenda y distintivo de ejemplo.

El orden, anidamiento y clases del HTML original se conservaron. No se
añadieron IDs ni atributos ARIA, porque no existen en este bloque original.
Los dos enlaces mantienen sus destinos y `role="button"`; el CTA principal
conserva `data-od-id="cta-ver-productos"`. La imagen mantiene `src`,
`alt`, `class` y `loading="eager"`. Se conservaron los dos SVG inline: flecha
del CTA principal e icono de rodillo del secundario.

Los textos preservados incluyen la cinta del taller, el estado de verificación,
el claim, el H1, la descripción, los CTA, la nota de una unidad, la cinta
«¡Todo con su diseño!», la leyenda de la camiseta y «Ejemplo». El comentario
HTML final alude a una franja de cuatro iconos, pero no contiene elementos DOM
ni contenido que migrar; no se inventó contenido para ella.

## Comportamientos y dependencias identificados

No se encontraron listeners ni scripts originales dirigidos a `.od-hero`,
`od-parallax` o `cta-ver-productos`. Los CTA son enlaces normales a `#tienda` y
`#contacto`. La animación y el movimiento del Hero dependen de CSS:

- `.od-secciones > * + *` aplica separación entre hijos directos. El fragmento
  React mantiene los dos nodos de Hero como hermanos y no altera el flujo.
- Las clases `od-hero__claim`, `__title`, `__lead`, `__ctas`, `__note`, `__media`
  y `__tape` son objetivos de la animación de entrada, con sus delays originales.
- `.od-hero__media img` conserva el recorte de entrada y el parallax nativo
  `scroll(root block)` de 0 a 700 px. La relación entre la imagen, su contenedor
  y `.od-hero__media-col` también se mantiene para los estilos y el pseudo-elemento
  decorativo.
- No se modificaron reglas, keyframes, rangos, `@supports` ni las condiciones de
  `prefers-reduced-motion`.

La ruta relativa original `assets/stock/camiseta-cats.jpg` se mantuvo. El
recurso existe en `assets/stock/`, Vite lo sirve desde `/assets/stock/` y la
configuración de build lo copia a `dist/assets/stock/`.

## Cambios realizados

- Se reemplazó el stub de `src/sections/Hero/Hero.jsx` por el DOM completo de
  Hero usando JSX.
- Se creó este informe.
- No se modificaron `App.jsx`, otras secciones, CSS, recursos ni
  configuraciones.

## Pruebas ejecutadas

- `npm run build`: **correcto**; Vite 8.3.8 transformó 31 módulos.
- Servidor de desarrollo: aplicación cargada correctamente en el navegador.
- DOM: las dos primeras raíces directas de `.od-secciones` son la franja y
  `.od-hero`; la sección `#beneficios` continúa a continuación. No se introdujo
  wrapper, y el orden del resto de secciones no cambió.
- Contenido y atributos: se comprobaron textos visibles, clases, los dos
  destinos de enlaces, `data-od-id`, roles, ausencia de IDs/ARIA añadidos, los
  dos SVG y los atributos de la imagen.
- Navegación: el CTA principal actualizó el hash a `#tienda` y el secundario a
  `#contacto`; ambos destinos existen en el DOM.
- Imagen: cargó desde
  `http://127.0.0.1:5173/assets/stock/camiseta-cats.jpg` con HTTP 200 y tamaño
  intrínseco de 512 × 512 px. También existe la copia en el build.
- CSS: no se modificaron hojas de estilo ni animaciones.
- Consola: sin errores de aplicación durante la recarga; apareció la advertencia
  existente de `cdn.tailwindcss.com`.
- `git diff --check`: **sin errores**.

No se realizó comparación de capturas con la página original; por ello no se
declara equivalencia visual completa.

## Diferencias y pendientes

No se identificaron diferencias de estructura o contenido en Hero. El archivo
real se encuentra bajo `src/sections/`, no bajo `src/components/`, por lo que se
editó la ruta existente sin reorganizar la arquitectura. Las demás secciones
siguen siendo provisionales y quedan fuera de esta etapa.

## Alcance

El trabajo parte de la rama `feat/react-vite-migration` y el commit
`b596147`. No se hizo commit, push ni despliegue. No se continuó con otras
secciones.

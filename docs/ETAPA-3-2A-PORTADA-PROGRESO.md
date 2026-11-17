# Sublikat — Etapa 3.2a: Portada y ReadingProgress

## Resultado

La inspección encontró que ambos componentes ya reproducían la estructura HTML
archivada. No fue necesario modificar su JSX ni añadir comportamiento JavaScript:
la Portada y la barra de progreso ya se apoyan en el CSS existente. Se creó este
informe para dejar constancia de la comparación y las pruebas.

## Archivos modificados

- `docs/ETAPA-3-2A-PORTADA-PROGRESO.md` (este informe).

Se revisaron, pero no necesitaron cambios:

- `src/components/Portada/Portada.jsx`
- `src/components/ReadingProgress/ReadingProgress.jsx`

No se modificaron otros archivos.

## Comparación con el HTML original

La fuente consultada fue `docs/archive/index-original.html`.

### Portada

El HTML original y el DOM renderizado contienen la misma estructura y atributos:

```html
<div class="od-portada" aria-hidden="true">
  <div class="od-portada__foto"></div>
  <div class="od-portada__velo"></div>
  <div class="od-portada__marca">
    <span class="od-portada__nombre">Sublikat</span>
    <span class="od-portada__lema">Taller de estampados · Sublimación textil y cerámica</span>
  </div>
</div>
```

La foto se aplica como `background-image` en `.od-portada__foto`, no como un
elemento `<img>`. La portada mantiene `aria-hidden="true"` y el texto decorativo.
En `App.jsx` continúa entre `Header` y `<main>`.

### ReadingProgress

El componente mantiene exactamente el elemento original:

```html
<div class="od-progress" aria-hidden="true"></div>
```

Continúa como primer hijo de la composición de `App`.

## Comportamiento JavaScript y animaciones

No existe comportamiento JavaScript específico para `.od-progress`: las
referencias encontradas en el HTML original son la regla CSS y su elemento. La
barra se controla exclusivamente mediante CSS Scroll-Driven Animations:

- Estado inicial oculto; se muestra dentro de `@supports
  (animation-timeline: scroll())` y `prefers-reduced-motion: no-preference`.
- Posición fija en el borde superior, 6 px de alto, `z-index: 60`.
- `animation-timeline: scroll(root block)` ejecuta `od-progress-grow`, que
  escala horizontalmente de 0 a 1.
- Con movimiento reducido o sin soporte de la timeline, permanece oculta.

Por tanto, no se añadió `useEffect`, listener de scroll ni `requestAnimationFrame`.
La Portada conserva las animaciones CSS existentes de encogimiento,
desvanecimiento y recorte. No se modificaron las hojas CSS.

## Recursos y rutas

Las reglas de `src/styles/components.css` usan rutas absolutas desde la raíz:

- `/assets/portada/quita-la-luz-2150.jpg` (encuadre base).
- `/assets/portada/quita-la-luz-movil.jpg` (móvil vertical).
- `/assets/portada/quita-la-luz-1024.jpg` (móvil apaisado).
- `/assets/portada/quita-la-luz-1440.jpg` (tablet y anchos intermedios).

Los cuatro archivos originales permanecen en `assets/portada/`; no se movieron
ni duplicaron. Vite resuelve esas URLs en desarrollo y las emite en
`dist/assets/portada/` para producción.

## Pruebas ejecutadas

- `npm run build`: **correcto** con Vite 8.3.8; generó los cuatro recursos de
  Portada en `dist/assets/portada/`.
- `npm run dev -- --host 127.0.0.1`: el servidor respondió **HTTP 200**. Las
  cuatro URLs de imagen respondieron **HTTP 200**.
- `npm run preview -- --host 127.0.0.1 --port 4173`: la página respondió
  **HTTP 200** y las cuatro URLs de imagen respondieron **HTTP 200**.
- DOM en navegador: `.od-progress` es el primer hijo de `#root`; `.od-portada`
  aparece después de `header#site-header` y antes de `<main>`. El `outerHTML`
  de Portada coincide con el fragmento original.
- Scroll: al pasar de `scrollY=866` a `scrollY=300`, el `transform` de la barra
  cambió de `scaleX(0.419543)` a `scaleX(0.145843)`, confirmando que responde a
  `scroll(root block)`.
- Movimiento reducido: `.od-progress` queda oculto y `.od-portada` vuelve a
  `position: relative`; al restaurar `no-preference`, la barra vuelve a estar
  disponible.
- `git diff --check`: **sin errores**. Las hojas CSS y el HTML archivado no
  presentan cambios.
- Consola del navegador: no se observaron errores de la aplicación. Se mostró
  una advertencia de `cdn.tailwindcss.com` ya presente en el punto de entrada.

No se realizó una comparación visual de capturas entre el sitio original y el
migrado; por tanto, este informe no declara equivalencia visual completa.

## Pendientes

No quedan pendientes de implementación para estos dos componentes. El resto de
la aplicación sigue siendo provisional según la etapa anterior; la migración de
contenido e interacciones de las demás secciones queda fuera de este alcance.

## Alcance de cambios

El árbol de trabajo estaba limpio al iniciar, en la rama
`feat/react-vite-migration` y sobre `9d4e8b8 refactor: establecer estructura
principal React`. Solo se creó este informe; no se modificaron los componentes,
estilos, `App.jsx`, el HTML archivado, recursos ni configuraciones. No se hizo
commit ni push.

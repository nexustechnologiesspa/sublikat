# Etapa 3.9 — Recuperación de Proceso en React

## 1. Fuentes inspeccionadas

- `docs/archive/index-original.html`, bloque `OD:PROCESO` (líneas 3705–3935), fuente de verdad de la sección.
- `src/sections/Process/Process.jsx`, componente antes y después del cambio.
- `src/styles/components.css`, reglas móviles del carrusel `.swipe` y los indicadores `.dots` (aprox. líneas 430–460).
- `src/styles/motion.css`, reveal de `.od-step` (aprox. líneas 376–395), fallback y movimiento reducido, y sombras de desplazamiento con timeline nombrada `--od-desliz` (aprox. líneas 482–530).
- Script original de carruseles en `docs/archive/index-original.html` (aprox. líneas 771–788).

## 2. Estructura original identificada

La sección original es un `<section id="proceso" data-od-id="proceso-taller">`, etiquetado por `heading-proceso`. Contiene, en este orden:

1. Cabecera con distintivo, título y texto introductorio.
2. `.swipe-marco` con el carrusel `.swipe`, sus cuatro tarjetas `.od-step` y un indicador `.dots` que el JavaScript original insertaba después del carrusel.
3. Franja inferior con texto de cotización y enlace a `#contacto`.

## 3. Elementos recuperados

- El distintivo, encabezado «Cómo trabajamos» y su párrafo introductorio.
- Los cuatro pasos, en el orden original, con sus títulos, descripciones, textos de apoyo y SVG inline.
- Los atributos accesibles y geometría de los SVG; se adaptaron a JSX los nombres de atributos SVG que lo requieren.
- La franja CTA, su contenido, clases y destino `#contacto`.
- Los indicadores de carrusel: cuatro puntos, con el estado activo actualizado al desplazar el carrusel y limpieza del listener al desmontar el componente.

### Corrección puntual de indicadores

El script original calcula `k` a partir de `scrollLeft` y `scrollWidth - clientWidth`, y aplica `s.classList.toggle('on', j === k)` a cada punto. El CSS original y actual define el estado visual mediante `.dots span.on`; no se añadió ninguna clase ni regla nueva.

Al revisar el componente para esta corrección, el JSX ya vinculaba el estado a la clase existente:

```jsx
className={index === activeStepIndex ? 'on' : undefined}
```

Por tanto, el hallazgo descrito (indicadores renderizados solo como `<span key={index} />`) no estaba presente en la copia de trabajo inspeccionada y no fue necesario modificar JSX. Se mantuvo la lógica actual y se verificó el comportamiento completo en el navegador.

## 4. Comparación de estructura y contenido

La estructura React sigue el orden del bloque original. Se conservaron el `id`, `data-od-id`, `aria-labelledby`, las clases del contenedor, `.swipe-marco`, `.swipe`, `.od-steps`, `.od-stagger`, `.od-stagger-2` y las cuatro clases `.od-step`.

Los textos y destinos se transcribieron del HTML original. Los SVG permanecen inline y mantienen `viewBox`, geometría, colores y etiquetas `aria-label`. Las adaptaciones de sintaxis se limitan a `className`, `strokeWidth`, `strokeLinecap`, `strokeLinejoin`, `fillOpacity`, `fontFamily`, `fontSize` y `fontWeight`, según corresponde en JSX.

El comportamiento de `.dots` estaba implementado por un script del HTML original. React lo reproduce junto al carrusel, con el mismo `aria-hidden`, puntos y clase activa condicional. Los puntos inactivos no reciben `on`; el listener se elimina al desmontarse mediante `removeEventListener`.

## 5. Clases y animaciones preservadas

- El reveal de escritorio sigue dependiendo de CSS Scroll-Driven Animations: `#proceso .od-step` usa `animation-timeline: view()` y rangos escalonados desde 768 px.
- En móvil se conserva `.swipe` como carrusel horizontal con scroll snap; las sombras laterales mantienen la timeline nombrada `--od-desliz`.
- No se añadió CSS ni una librería de animación. Las reglas existentes de fallback y `prefers-reduced-motion` permanecen sin cambios.

## 6. Pruebas realizadas

- `npm run build`: correcto; Vite compiló 34 módulos y generó los archivos de producción.
- `git diff --check`: correcto, sin errores de whitespace.
- En la corrección puntual no se modificó JSX porque el vínculo de `activeStepIndex` con la clase `on` ya estaba presente; se actualizó este informe con la inspección y las pruebas específicas.
- Navegador integrado, en 1440, 768 y 390 px: la sección se encontró, conserva cuatro pasos y cabe en el ancho visible; el documento no presentó overflow horizontal en las tres medidas.
- Indicadores a 390 px, comprobados en navegador: al cargar, `[true, false, false, false]`; al desplazar hasta el cuarto paso, `[false, false, false, true]`; al regresar al inicio, `[true, false, false, false]`. En cada estado hubo exactamente un indicador con `on`; los demás perdieron esa clase. El carrusel tuvo 1035 px de `scrollWidth` frente a 325 px de `clientWidth`.
- Limpieza del listener: inspección estática confirmó que el efecto devuelve `removeEventListener('scroll', updateActiveStep)` al desmontarse.
- Movimiento reducido: `prefers-reduced-motion: reduce` quedó activo y el nombre de animación computado para `.od-step` fue `none`.
- Se observó una advertencia de la página sobre el uso de `cdn.tailwindcss.com` en producción. No corresponde a esta sección y no se modificó.

No se realizó una comparación visual directa, captura contra captura, con el HTML original; por ello no se afirma equivalencia visual.

## 7. Limitaciones de verificación

La comprobación del navegador cubrió estructura, medidas, desplazamiento y preferencia de movimiento reducido. No se compararon píxeles entre la página original y React ni se probaron todos los navegadores/dispositivos físicos.

## 8. Archivos modificados

- `src/sections/Process/Process.jsx`: restauración de la sección y comportamiento de sus indicadores.
- `docs/ETAPA-3-9-PROCESO-REACT.md`: este informe.

No se modificaron CSS, `App.jsx`, otras secciones, recursos, dependencias ni configuración.

## 9. Conclusión

La sección Proceso recuperó su contenido y estructura original en React, manteniendo las clases y ganchos CSS existentes para el reveal y el carrusel. La compilación y las comprobaciones estructurales/responsive indicadas finalizaron correctamente. La equivalencia visual con el original queda pendiente de una comparación directa.

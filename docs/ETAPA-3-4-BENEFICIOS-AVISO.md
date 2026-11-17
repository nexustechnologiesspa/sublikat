# Sublikat — Etapa 3.4: migración de Beneficios y Aviso del taller

## Fuente y componentes

La fuente consultada fue `docs/archive/index-original.html`, bloques
`OD:BENEFICIOS` y `OD:AVISO`. Se migraron los componentes existentes:

- `src/sections/Benefits/Benefits.jsx`
- `src/sections/WorkshopNotice/WorkshopNotice.jsx`

## Estructura y contenido migrados

`#beneficios` conserva sus atributos originales (`data-od-id` y `aria-label`)
y la jerarquía:

1. `.pin-vista`, hijo directo de la sección.
2. `.pin-intro` y `.swipe-marco`, como hijos de `.pin-vista`.
3. `.swipe.pin-pista`, primer hijo de `.swipe-marco`, con las cuatro tarjetas.
4. `.dots[aria-hidden="true"]`, hermano de la pista dentro de `.swipe-marco`.

Las tarjetas conservan sus clases, imágenes, textos alternativos, títulos y
descripciones originales. La pista mantiene las clases de rejilla y de
desplazamiento.

`#aviso-taller` conserva `data-od-id`, `aria-label`, `class="relative"`, el
contenedor, el icono SVG dentro de su elemento `aria-hidden`, el texto del
aviso y la etiqueta «• Lote de prueba artesanal •». No se añadieron enlaces ni
comportamientos que no existieran.

## Dependencias DOM, CSS y JavaScript

- En escritorio, `#beneficios` declara la timeline de vista `--pin-ventajas`;
  `.pin-pista` la consume. Se conservaron `.pin-vista`, `.pin-intro` y
  `.swipe-marco` en sus posiciones originales, sin wrappers nuevos.
- En móvil, `.swipe-marco` conserva el ámbito de timeline `--od-desliz` y la
  pista conserva la clase `.swipe` que habilita el desplazamiento horizontal.
- El script original crea un punto por tarjeta después de cada `.swipe`,
  activa el punto según `scrollLeft` y usa un listener pasivo. Beneficios
  reproduce ese comportamiento con `useRef`, `useEffect` y estado React; el
  listener se retira al desmontar y no se actualiza estado si el índice no
  cambió. Los puntos son indicadores, no botones.
- El Aviso no tenía un comportamiento JavaScript específico.
- No se modificaron hojas CSS ni animaciones. La inicialización original
  recorría todos los `.swipe`; en esta etapa se migró su comportamiento solo
  para Beneficios. Las demás secciones quedan fuera del alcance.

## Recursos

Se mantuvieron las rutas relativas originales:

- `assets/beneficios/pedidos-unidad.jpg`
- `assets/beneficios/personalizacion.jpg`
- `assets/beneficios/muestra-impresion.jpg`
- `assets/beneficios/atencion-whatsapp.jpg`

Vite configura la copia de estos recursos al build. Las cuatro imágenes
cargaron en el navegador con ancho intrínseco de 640 px; el endpoint de
desarrollo para una de ellas respondió HTTP 200.

## Pruebas ejecutadas

- `npm run build` desde `projects\Sublikat`: **correcto**; Vite 8.3.8
  transformó 31 módulos.
- Servidor de desarrollo `npm run dev -- --host 127.0.0.1`: **inició
  correctamente** en `http://127.0.0.1:5173/`.
- Comparación del DOM original y React: coinciden atributos de ambas
  secciones, clases, textos, imágenes y `alt`, SVG del aviso y orden de las
  secciones. `#tienda` continúa inmediatamente después de `#aviso-taller`.
- Comprobación estructural de `--pin-ventajas`: en ambas páginas,
  `#beneficios` expone `view-timeline-name: --pin-ventajas` y `.pin-pista`
  expone `animation-timeline: --pin-ventajas`. El navegador admite
  `animation-range`; el CSS fuente, incluido su rango original, no se cambió.
- Prueba móvil a 390 px: la pista tuvo 824 px de desplazamiento máximo; el
  indicador pasó del primer al cuarto punto tanto en el HTML original como en
  React.
- Carga de recursos: las cuatro imágenes terminaron de cargar con ancho
  intrínseco de 640 px.
- Consola: sin errores de aplicación. Se observó la advertencia existente de
  `cdn.tailwindcss.com`.
- `git diff --check`: **correcto**, sin errores.

La primera invocación de `npm run build` se hizo desde la raíz del workspace,
que no contiene el `package.json` de Sublikat; al repetirla desde
`projects\Sublikat`, pasó correctamente.

## Diferencias y pendientes

No se compararon capturas de pantalla; por tanto, este informe no declara
equivalencia visual completa. No se identificaron diferencias de contenido,
atributos o estructura DOM en las dos secciones.

La migración del script de puntos se limita a Beneficios. Al migrar otras
secciones que tengan `.swipe`, deberá tratarse su comportamiento dentro de su
propio alcance.

## Alcance

Solo se modificaron los dos componentes indicados y este informe. `App.jsx`,
otras secciones, estilos, recursos, configuraciones y el HTML archivado
permanecen intactos. No se hizo commit, push ni despliegue.

# Etapa 3.6e — Integración Catálogo → Contacto

## Alcance

Se migró a React la estructura del formulario de contacto original y se conectaron los enlaces «Cotizar» del catálogo para completar `#contacto-mensaje` cuando está vacío, sin cambiar el `href="#contacto"` ni cancelar la navegación nativa.

## Archivos modificados

- `src/sections/Catalog/Catalog.jsx`
- `src/sections/Contact/Contact.jsx`
- `docs/ETAPA-3-6E-INTEGRACION-CONTACTO.md` (este informe)

No se modificaron `ProductCard.jsx`, `catalogData.js`, `App.jsx`, CSS, animaciones ni dependencias.

## Implementación del formulario

Se migró la sección `OD:CONTACTO` de `docs/archive/index-original.html` (bloque aproximado, líneas 4000–4238), conservando el orden, la jerarquía, los textos, clases, IDs, atributos, opciones, enlaces de WhatsApp, tarjeta informativa e insignia de garantía.

El textarea:

- Tiene `id="contacto-mensaje"`, `name="mensaje"` y la clase original.
- Está asociado a su etiqueta mediante `htmlFor="contacto-mensaje"`.
- Es no controlado: no tiene `value`, estado React ni manejador de contenido.
- Mantiene el placeholder, `rows` y `aria-describedby` originales.

Se adaptaron a JSX los atributos HTML (`className`, `htmlFor`, `noValidate`) y los valores iniciales de inputs/selects (`defaultValue`, `defaultChecked`) para conservar sus valores predeterminados.

### Diferencias y limitaciones del formulario

- No se implementó backend, validación ni envío real.
- El formulario evita el POST mediante `onSubmit` con `preventDefault()`. El botón no muestra una confirmación ni procesa datos.
- El panel de éxito y el resumen de errores permanecen ocultos; su contenido estático no simula un envío.
- La validación interactiva del formulario original no se migró en esta etapa. Por eso no se declara equivalencia funcional completa del formulario.
- No se compararon capturas; no se afirma equivalencia visual.

## Manejador delegado de cotización

`Catalog.jsx` maneja el clic desde la sección raíz ya existente. Comprueba que el objetivo admita `closest()`, localiza el enlace `a[data-producto]` más cercano, verifica que esté dentro del catálogo, obtiene el producto de `data-producto` y busca el campo por ID.

Si el campo existe y `value.trim()` está vacío, asigna exactamente `Consulta sobre: NOMBRE DEL PRODUCTO\n`. Si contiene cualquier texto no blanco, conserva el valor completo, incluidos espacios y saltos de línea. En ambos casos enfoca el textarea.

La prueba confirmó que el navegador ejecuta la navegación nativa a `#contacto`. Se observó que esa navegación desplazaba el foco después del `focus()` síncrono; para satisfacer el requisito de foco efectivo sin cancelar el enlace, se vuelve a enfocar el campo en el siguiente `requestAnimationFrame`. El frame pendiente se cancela al desmontar el catálogo y se comprueba que el campo siga conectado al documento.

## Pruebas ejecutadas

### Build

- `npm run build` — **correcto** (Vite 8.3.8; 34 módulos transformados).

### Pruebas en navegador

| Caso | Resultado |
|---|---|
| Un textarea `#contacto-mensaje`, con etiqueta asociada y sin atributo `value` | Correcto |
| Cinco pestañas, cinco paneles y 20 enlaces de producto | Correcto |
| Campo vacío | Inserta el texto exacto, incluido el salto de línea final |
| Campo con espacios y salto de línea solamente | Reemplaza el contenido por la cotización exacta |
| Campo con contenido previo no blanco | Conserva el valor íntegro |
| Productos de distintas categorías: Tazas, Tazas mágicas, Botellas y Polerones | Correcto |
| Activación de «Cotizar» con Enter | Completa el campo, lo enfoca y navega a `#contacto` |
| Foco después de la navegación nativa | Correcto tras el ajuste con `requestAnimationFrame` |
| Campo ausente | No produce error y el enlace sigue navegando a `#contacto` |
| Pestañas: selección única, `tabIndex=0`, panel visible y flecha derecha circular desde el extremo | Correcto |
| Errores de ejecución del navegador durante las pruebas | Ninguno |

Las pruebas se realizaron en el navegador integrado con el servidor Vite de desarrollo. No se verificaron otros navegadores o dispositivos.

## Riesgos pendientes

- El botón de formulario no envía ni valida la consulta; definir e implementar ese flujo requiere una etapa aparte.
- El foco efectivo depende de `requestAnimationFrame`; la prueba se realizó en un navegador de escritorio, no en Safari móvil.
- No se realizó comparación visual por capturas.

## Estado de entrega

No se hizo commit, push ni despliegue.

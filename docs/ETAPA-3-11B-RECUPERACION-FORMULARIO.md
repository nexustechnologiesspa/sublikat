# Etapa 3.11b — Recuperación de interacciones del formulario

## Alcance y fuentes

Se migró a React la validación y confirmación local del formulario, sin backend ni solicitudes de envío. Se inspeccionaron:

- `docs/archive/index-original.html`: validación y reinicio (`iniciarFormulario`), prefill original, inicialización y markup de `OD:CONTACTO`.
- `src/sections/Contact/Contact.jsx`: implementación React.
- `src/sections/Catalog/Catalog.jsx`: integración de enlaces `data-producto`.
- `src/styles/components.css`: estilos existentes para controles, errores, resumen y confirmación.
- `src/App.jsx`: integración de la sección Contact.

## Lógica recuperada

- Validación personalizada original: nombre recortado de al menos 2 caracteres; correo recortado con `/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/`; producto no vacío; mensaje recortado de al menos 10 caracteres; privacidad marcada.
- Validación de nombre, correo, producto y mensaje al perder el foco; actualización del resumen al cambiar la casilla y validación completa al enviar.
- Errores inline con los textos e IDs originales, clase `has-error`, `aria-invalid`, `role="status"` y enlaces del resumen que enfocan el control asociado.
- Al enviar con errores, foco en el primer campo inválido. Al enviar sin errores, se cancela el envío real, se oculta el formulario y se enfoca la confirmación local con el nombre recortado.
- «Enviar otra consulta» restablece los controles no controlados, los errores y la confirmación, y enfoca Nombre.
- Se conservaron `noValidate`, `preventDefault()`, los valores no controlados y el prefill del Catálogo. No se añadieron validaciones para cantidad o medio de contacto.

## Catálogo

La integración existente de `Catalog.jsx` permanece sin cambios. En la prueba, seleccionar «Cotizar» completó el mensaje vacío con `Consulta sobre: Tazas`; un mensaje escrito previamente se conservó. El foco posterior a la navegación por ancla no quedó confirmado: la activación sintética dejó `body` como elemento activo, y el intento de clic real expiró al esperar la estabilidad del elemento durante el desplazamiento animado. El foco directo en el textarea sí funcionó. No se modificó Catálogo por estar fuera del alcance; conviene confirmar este caso con interacción manual en navegador.

## Pruebas y resultados

| Prueba | Resultado |
|---|---|
| `npm run build` | Pasó; Vite compiló 34 módulos. |
| `git diff --check` | Pasó, sin errores de whitespace. |
| Envío vacío | Pasó: se mostraron los errores aplicables y el foco fue a Nombre. |
| Nombre de un carácter y corrección | Pasó: se mostró y luego se retiró el error. |
| Correo inválido y válido | Pasó: error y limpieza correctos. |
| Mensaje inferior al mínimo y corrección | Pasó: error y limpieza correctos. |
| Pérdida de foco y enlace del resumen | Pasó: se actualizó el error y el enlace enfocó Correo. |
| Privacidad desmarcada/marcada | Pasó usando activación de la casilla: al desmarcar apareció su error en el resumen; al marcar desapareció. |
| Envío válido | Pasó: formulario oculto, confirmación visible con el nombre recortado y foco en el panel. |
| Reinicio | Pasó: valores restablecidos, errores y confirmación ocultos, foco en Nombre. |
| Solicitudes al enviar | No se observó ninguna solicitud POST ni solicitud externa de envío. |
| Prefill del Catálogo | Pasó para completar el mensaje vacío y conservar un mensaje escrito previamente. El foco tras la navegación queda pendiente de verificación manual, como se indica arriba. |

Las interacciones se comprobaron en el navegador integrado en `http://127.0.0.1:5173/`. No se hizo una comparación visual contra el original ni una matriz de capturas a 1440, 768 y 390 px. La consola mostró la advertencia preexistente de Tailwind CDN; no se observó un error nuevo atribuible al formulario.

## Diferencias y limitaciones

No se identificaron cambios deliberados en textos, reglas de validación o destino de los datos respecto al comportamiento original. El formulario sigue siendo una demostración local y no remite consultas. El foco tras el prefill desde Catálogo es el único caso de interacción que requiere confirmación manual; los estilos responsive no se compararon visualmente.

## Archivos modificados

- `src/sections/Contact/Contact.jsx`
- `docs/ETAPA-3-11B-RECUPERACION-FORMULARIO.md`

No se modificaron Catálogo, CSS, App, recursos ni dependencias.

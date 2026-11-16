# Inventario de clases del catálogo y de la portada

**Fecha:** 12 de noviembre de 2026
**Alcance:** medir el uso de Tailwind antes de decidir cómo quitar el CDN.
**Naturaleza:** análisis, sin cambios en el proyecto.

---

## 1. Cuántas clases se usan

| | Clases distintas | Usos en el marcado |
|---|---|---|
| Propias del proyecto (`build/css/*.css` + `build/tokens.css`) | 100 | 1.012 |
| Utilidades de Tailwind | **224** | **1.504** |
| Total en el marcado | 324 | 2.516 |

Reparto por familia de utilidad: `text-*` 19, `h-*` 14, `w-*` 12, `gap-*` 11, `px-*` 10,
`p-*` 10, `py-*` 8, `grid-*` 7, `flex-*` 6, `min-*` 6, `translate-*` 5, `border-*` 5,
`leading-*` 5, `max-*` 5, `mb-*` 5, `mt-*` 5, `space-*` 5, `ring-*` 4, `font-*` 4,
`pt-*` 4, `rounded-*` 4, `tracking-*` 4, `inline-*` 3, `items-*` 3… y 180 más.

## 2. Variantes y valores arbitrarios

| Tipo | Cuántas |
|---|---|
| `sm:` | 11 |
| `md:` | 12 |
| `lg:` | 8 |
| `hover:` | 3 |
| `focus:` | 6 |
| `active:` | 3 |
| Con valor arbitrario (`w-[44px]`, `focus:ring-[var(--focus)]`, `hover:translate-y-[-2px]`…) | 24 |

Dos detalles que condicionan la decisión:

1. **Las utilidades de transformación se combinan.** El botón principal usa
   `hover:translate-x-[-2px] hover:translate-y-[-2px]` a la vez. Tailwind no las escribe como dos
   reglas sueltas: compone un único `transform` con variables CSS (`--tw-translate-x`,
   `--tw-translate-y`). Un CSS propio tiene que replicar esa composición o el hover se rompe.
2. **El CDN aplica el *preflight* de Tailwind.** El `Play CDN` es Tailwind v3 completo, así que hoy
   la página ya recibe su reset (`*, ::before, ::after { margin: 0; padding: 0; … }`). Un CSS
   compilado con el preflight desactivado daría un resultado distinto.

## 3. Clases que no existen

| Clase | Usos | Por qué está muerta |
|---|---|---|
| `bd-ink/20` | 5 | Tailwind no tiene un color llamado `ink`; el modificador de opacidad no aplica |
| `bd-ink/40` | 1 | ídem |
| `tx-ink/70` | 1 | ídem |

Ninguna de las tres produce estilo hoy, en ningún modo. Se pueden borrar sin cambio visual.

El JavaScript solo alterna cuatro clases: `compact`, `has-error`, `on` (propias) y `hidden`
(utilidad de Tailwind, además presente en el marcado).

## 4. Qué implicaría cada opción

### A) Compilar Tailwind en `build/`

- Una dependencia de desarrollo (`tailwindcss` v3, el mismo motor que el CDN), un
  `tailwind.config.js` con `content` apuntando a `index.html` y `build/sections/*.html`, y un script
  que ejecute la compilación con purga. El CSS generado se versiona en `build/css/` y **el sitio no
  necesita Node en tiempo de ejecución**.
- El motor es el mismo que el que renderiza la página hoy → la equivalencia es por construcción.
- Peso: el `Play CDN` son del orden de 350 KB sin comprimir, más la compilación de las utilidades
  en el navegador y un `MutationObserver` que vigila el DOM. El CSS purgado de esta página rondará
  los 20 KB (5-6 KB con gzip) → **la primera pintura mejora**.
- Coste: Node entra en el proyecto. Hay que decidir dónde vive la herramienta (dentro del proyecto
  como dependencia de desarrollo, o fuera, versionando solo el CSS generado).
- Riesgo: el preflight debe **mantenerse activo** (si no, cambia el reset) y el CSS compilado debe
  colocarse en el mismo punto del `<head>` donde el CDN inyecta sus estilos.

### B) Reescribir las 224 utilidades como CSS propio

- unas 250-270 reglas (224 utilidades + las 43 variantes), con los valores literales que hoy
  calcula Tailwind: escalas de espaciado, `font-weight`, `line-height`, `letter-spacing`, radios,
  anillos, sombras, los tres breakpoints (640/768/1024) y las variantes de estado.
- Los puntos delicados: la composición de transformaciones, los 24 valores arbitrarios, los
  anillos con `var(--…)` y el reset.
- Ventaja: sin Node, sin paso de compilación; el CSS es nuestro y auditable.
- Coste: un mapa manual de 224 utilidades que hay que mantener; cualquier utilidad nueva obliga a
  escribirla. Riesgo alto de deriva visual si Tailwind no está en la lista.

## 5. Recomendación

**Opción A**, por dos razones: el mismo motor genera el CSS, así que la equivalencia no depende de
que alguien reescriba 224 utilidades a mano; y la página deja de pagar en cada visita la descarga
del CDN y la compilación en el navegador.

La opción B sigue siendo válida como destino, pero es mejor abordarla **después**: con la capa de
Tailwind ya compilada y estática se ve exactamente qué utilidades quedan en uso y se pueden migrar
por grupos, con la comparación de capturas como red de seguridad.

En cualquiera de las dos opciones, `bd-ink/20`, `bd-ink/40` y `tx-ink/70` desaparecen: hoy no
pintan nada.

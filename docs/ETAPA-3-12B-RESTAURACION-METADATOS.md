# Etapa 3.12b — Restauración de metadatos SEO

## Cambios realizados

Se restauraron en el `<head>` de `index.html` los metadatos comerciales identificados en `docs/archive/index-original.html`:

- Título: `Sublikat — Taller de sublimación y estampados en Santiago`.
- Descripción original del taller, ubicación, productos y cotización por WhatsApp.
- Cinco propiedades Open Graph originales: `og:type`, `og:site_name`, `og:locale`, `og:title` y `og:description`.

No se añadieron `og:url`, `og:image`, canonical, Twitter Cards ni keywords. No se inventaron dominios ni rutas.

## Archivos

- Modificado: `index.html`.
- Creado: `docs/ETAPA-3-12B-RESTAURACION-METADATOS.md`.
- Durante la verificación final, `index.html` se normalizó de CRLF a LF en sus 35 líneas. El contenido permanece UTF-8 y sin BOM.
- `npm run build` regeneró los artefactos ignorados de `dist/` para las verificaciones, incluido `dist/index.html`; no se editaron manualmente otros archivos de fuente.
- No se modificaron componentes, scripts, estilos ni configuración.

## Verificaciones

| Comprobación | Resultado |
|---|---|
| `npm run build` | Pasó. Vite transformó 34 módulos y generó `dist/index.html`. |
| `git diff -- index.html` | Revisado. El diff normal registra también la conversión de finales de línea de CRLF a LF. |
| `git diff --ignore-space-at-eol --stat -- index.html` | Muestra exclusivamente la restauración SEO: 16 inserciones y 1 eliminación. |
| Valores en `index.html` y `dist/index.html` | Pasó: título, descripción y las cinco propiedades OG aparecen una sola vez con sus valores esperados. |
| Elementos preexistentes del `<head>` | Pasó: `lang="es"`, charset UTF-8, viewport, favicon, Google Fonts y script de Tailwind siguen presentes. |
| Metadatos no autorizados | Pasó: no se agregaron `og:url`, `og:image`, canonical, Twitter Cards ni keywords. |
| `git diff --check` | Pasó después de la normalización, código de salida 0. |
| Codificación y finales de línea | Pasó: `index.html` es UTF-8 sin BOM y sus 35 líneas usan LF. |

## Conclusión

Los siete valores comerciales respaldados por el HTML original quedaron restaurados tanto en el documento fuente como en el HTML generado. Se conservaron los demás elementos del `<head>` y no se introdujeron valores de metadatos o URLs sin respaldo.

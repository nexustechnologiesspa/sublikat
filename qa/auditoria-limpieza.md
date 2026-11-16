# Auditoría de limpieza — Sublikat

**Fecha:** 16 de noviembre de 2026  
**Rama auditada:** `main`  
**Alcance:** inventario Git, referencias locales de `index.html`, arquitectura de generación y archivos candidatos a exclusión del despliegue.

## Resumen

- Inventario: **99 archivos** en el árbol de `main`.
- Sitio: HTML estático servido desde `index.html`.
- No se encontró `package.json`, `vercel.json`, ni un proceso de build Node en la raíz.
- `index.html` no referencia archivos dentro de `build/`, `docs/` o `qa/`.
- Se identificaron **10 rutas de assets** referenciadas desde `index.html`; se conservan.
- No se eliminó ningún archivo fuente en esta etapa. Las eliminaciones requieren resolver primero el desfase entre `index.html` y `build/sections/`.

## Arquitectura observada

### Publicación

La raíz contiene `index.html`, por lo que el despliegue estático puede servir la página directamente. La página carga Tailwind desde CDN y Google Fonts externamente; no hay evidencia de que Vercel necesite compilar CSS o JavaScript localmente.

### Archivos necesarios en runtime

Se deben conservar:

- `index.html`.
- `assets/favicon.svg`.
- `assets/portada/quita-la-luz-2150.jpg`.
- `assets/portada/quita-la-luz-movil.jpg`.
- `assets/portada/quita-la-luz-1024.jpg`.
- `assets/portada/quita-la-luz-1440.jpg`.
- `assets/stock/camiseta-cats.jpg`.
- `assets/beneficios/pedidos-unidad.jpg`.
- `assets/beneficios/personalizacion.jpg`.
- `assets/beneficios/muestra-impresion.jpg`.
- `assets/beneficios/atencion-whatsapp.jpg`.

La lista se obtuvo buscando rutas locales de assets en el HTML. No se deben borrar imágenes por parecer duplicadas sin comprobar también `srcset`, estilos, JavaScript y comportamiento en móvil.

## Clasificación por carpetas

| Ruta | Clasificación | Acción |
|---|---|---|
| `index.html` | Entrada publicada | Conservar |
| `assets/` | Recursos visuales y metadatos | Conservar imágenes; excluir metadatos no usados del deploy |
| `build/` | Fuentes modulares y herramientas | Conservar en Git; excluir de Vercel |
| `docs/` | Documentación técnica | Conservar en Git; excluir de Vercel |
| `qa/` | Auditorías y scripts de prueba | Conservar en Git; excluir de Vercel |
| `.gitignore` | Reglas de Git | Conservar |

## Hallazgo crítico: fuente modular desincronizada

El propio `build/README.md` advierte que, desde el 15 de noviembre, `index.html` recibió cambios manuales de contenido que todavía no están reflejados en todos los parciales de `build/sections/`.

Por tanto:

1. `index.html` es la versión publicada y autoridad temporal del contenido.
2. `build/actualizar-portada.ps1` puede sobrescribir contenido que aún no está sincronizado.
3. No ejecutar el ensamblador como parte de un deploy automático.
4. No borrar `build/sections/`, CSS, JS, datos ni plantillas: forman el sistema modular de mantenimiento.
5. Antes de volver a declarar `build/` como fuente única, sincronizar los parciales y probar una reconstrucción byte a byte o con diff controlado.

## Scripts y dependencias

| Archivo | Evidencia | Decisión |
|---|---|---|
| `build/actualizar-portada.ps1` | Lee tokens, CSS, JS, parciales, datos, plantillas, iconos y ejecuta `aplicar-contenido.ps1` | Conservar; no ejecutar hasta sincronizar |
| `build/aplicar-contenido.ps1` | Lee `build/contenido-inicio.json`; es invocado por el ensamblador | Conservar |
| `build/contenido-inicio.json` | Datos de reemplazo consumidos por `aplicar-contenido.ps1` | Conservar |
| `build/actualizar-inicio.ps1` | Generador anterior; consume `contenido-inicio.json` y `meta-inicio.json` | Candidato a retirar tras confirmar que no se usa localmente |
| `build/meta-inicio.json` | Consumido por el generador anterior | Candidato a retirar junto con ese flujo |
| `build/optimizar-portada.ps1` | Busca un JPEG original en la raíz que no aparece en el inventario actual | Candidato a retirar o documentar como herramienta histórica; no es runtime |
| `build/ganchos-scroll.ps1` | Modifica HTML y parciales con clases usadas por `motion.css` | Conservar |
| `build/limpiar-hex.ps1` | Herramienta de validación de tokens/colores | Conservar |
| `build/data/`, `templates/`, `icons/`, `sections/`, `css/` | Dependencias directas del ensamblador | Conservar |

**Importante:** el hecho de que un archivo no se entregue al navegador no significa que sea prescindible del repositorio.

## Exclusiones de despliegue preparadas

El archivo `.vercelignore` de esta rama excluye del paquete de Vercel:

- `build/`, `docs/` y `qa/`.
- Documentación y manifiestos de `assets/productos/`.
- `assets/stock/credits.json`.

No excluye imágenes usadas por `index.html`. Las exclusiones no borran nada de GitHub.

## Limpieza destructiva pendiente

No se borraron archivos porque hay dependencias de generación y riesgo de perder la capacidad de reconstruir la página. Antes de eliminar los candidatos:

1. Confirmar que nadie ejecuta el flujo `actualizar-inicio.ps1` desde su entorno local.
2. Confirmar que el original de la foto de portada no existe fuera de Git o conservarlo en una ubicación de archivo.
3. Sincronizar `index.html` con los parciales de `build/sections/`.
4. Ejecutar el ensamblador sobre una copia temporal, comparar el resultado y probar desktop/móvil, navegación, formulario, catálogo y animaciones.
5. Solo entonces retirar scripts y datos realmente obsoletos.

## Verificación antes de fusionar

- Revisar el preview/deployment de Vercel para confirmar que la página carga.
- Comprobar portada en escritorio y móvil.
- Comprobar imágenes, favicon, navegación, filtros del catálogo, formulario y botón WhatsApp.
- Revisar que no haya peticiones 404 a archivos excluidos.
- Confirmar que el despliegue no intente ejecutar un comando de build inexistente.

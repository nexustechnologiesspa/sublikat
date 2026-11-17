# Etapa 1 — Preparación de React + Vite

## Alcance y estado

Infraestructura preparada en la rama `feat/react-vite-migration`. Esta etapa no migra secciones ni estilos del sitio.

La versión HTML original se conservó íntegra en `docs/archive/index-original.html` antes de sustituir el `index.html` activo por el punto de entrada mínimo de Vite. El hash Git del archivo archivado coincide con el de `HEAD:index.html` (`d8964abe093ef9118d5143e1a605d84ae926bb57`). No se modificó la configuración de Vercel.

## Archivos creados y modificados

- Modificados: `index.html`, `.gitignore`.
- Creados: `package.json`, `package-lock.json`, `vite.config.js`.
- Montaje y pantalla provisional: `src/main.jsx`, `src/App.jsx`.
- Estilos preparados, sin extracción ni reescritura: `src/styles/tokens.css`, `base.css`, `components.css`, `motion.css`.
- Directorios modulares vacíos, conservados con `.gitkeep`:
  - `src/components/Header/`, `ReadingProgress/`, `WhatsAppWidget/`.
  - `src/sections/Hero/`, `Benefits/`, `WorkshopNotice/`, `Catalog/`, `Process/`, `Commitments/`, `Contact/`, `Footer/`.
  - `src/hooks/`, `src/utils/`.
- Preparación de recursos: `public/assets/.gitkeep`.
- Copia original: `docs/archive/index-original.html`.

`src/App.jsx` solo muestra una pantalla provisional para verificar React. `src/main.jsx` monta la aplicación con `createRoot` y `StrictMode`, importa los cuatro archivos CSS y falla explícitamente si falta `#root`.

## Dependencias y versiones verificadas

Entorno utilizado: Node `v22.23.4`, npm `11.5.2`.

Dependencias directas fijadas en `package.json`:

- `react` y `react-dom` `19.3.1`.
- `vite` `8.3.8`.
- `@vitejs/plugin-react` `6.3.0`.

`npm install` terminó correctamente; instaló 51 paquetes y la auditoría informó 0 vulnerabilidades. Se configuraron los scripts `npm run dev`, `npm run build` y `npm run preview`.

## Verificaciones realizadas

| Comprobación | Resultado |
| --- | --- |
| Rama del proyecto Sublikat | `feat/react-vite-migration` |
| Último commit inspeccionado | `f4c2e14 Borrado de archivos y reorganizacion de otros` |
| Copia del HTML original | Idéntica al archivo original confirmado en `HEAD` mediante hash Git |
| `npm install` | Correcto; 0 vulnerabilidades reportadas |
| `npm run build` | Correcto; Vite 8.3.8 transformó 19 módulos y generó `dist/index.html` y los bundles JS/CSS |
| Servidor de desarrollo | `npm run dev -- --host 127.0.0.1`; HTTP 200. El navegador mostró la pantalla provisional de React |
| Vista previa de producción | `npm run preview -- --host 127.0.0.1`; el navegador mostró la misma pantalla |
| Errores de consola y de página | Ninguno observado en desarrollo ni vista previa |
| Recursos originales | `assets/`, `build/` y `qa/` siguen presentes; no hay cambios registrados en esas rutas |
| Configuración Vercel | No existe `vercel.json` en el repositorio; no se modificó configuración del dashboard |
| Commit o push | No se realizaron |

### Recursos estáticos: comprobación y siguiente paso

El servidor de desarrollo sirve `assets/favicon.svg` desde la ruta actual `/assets/favicon.svg` (HTTP 200, `image/svg+xml`). La vista previa del build todavía no contiene los archivos de `assets/`: esa misma petición responde con el HTML de fallback, no con el SVG. Vite no copia automáticamente al `dist/` recursos de la raíz que no estén importados o expuestos como recursos públicos.

Esto no borra ni mueve imágenes, y la aplicación provisional no usa esos recursos. Antes de migrar una sección que los referencie, la siguiente etapa debe exponer o importar los recursos necesarios conservando sus rutas públicas y comprobar el resultado con `npm run preview`. `public/assets/` queda preparado como directorio, sin duplicar imágenes en esta etapa.

## Uso local

Desde la raíz del proyecto:

```sh
npm install
npm run dev
npm run build
npm run preview
```

La verificación de React consiste en abrir la URL local de Vite y confirmar que aparecen el encabezado **Infraestructura React + Vite** y el mensaje de pantalla provisional. La misma pantalla se comprobó también con `vite preview`.

## Pendiente para la siguiente etapa

- Determinar y exponer los recursos que requiera cada sección en `public/assets/` o mediante imports, sin alterar los originales.
- Migrar los componentes y secciones progresivamente según el inventario de `docs/MIGRACION-REACT.md`.
- Extraer estilos solo al migrar sus elementos, preservando diseño, responsive y animaciones CSS existentes.
- Validar las rutas de recursos y las interacciones en el build de producción.

## Recomendación Vercel para el despliegue final

Cuando la migración esté completa y se autorice el cambio, usar el preset Vite, `npm run build` como comando de build y `dist` como directorio de salida. No cambiar ahora Root Directory, comandos, preset, variables ni dominios. La configuración efectiva del dashboard no se puede confirmar desde el repositorio y debe verificarse allí antes de cualquier ajuste.

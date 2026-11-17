import { copyFile, mkdir } from 'node:fs/promises';
import { dirname, isAbsolute, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const projectRoot = fileURLToPath(new URL('.', import.meta.url));
const sourceAssets = resolve(projectRoot, 'assets');
const htmlImageAssets = [
  'beneficios/atencion-whatsapp.jpg',
  'beneficios/muestra-impresion.jpg',
  'beneficios/pedidos-unidad.jpg',
  'beneficios/personalizacion.jpg',
  'stock/camiseta-cats.jpg'
];

function preserveAssetPaths({ originalFileNames }) {
  for (const originalFileName of originalFileNames) {
    const relativeAssetPath = relative(sourceAssets, originalFileName);
    if (
      relativeAssetPath &&
      relativeAssetPath !== '..' &&
      !relativeAssetPath.startsWith(`..${sep}`) &&
      !isAbsolute(relativeAssetPath)
    ) {
      return `assets/${relativeAssetPath.split(sep).join('/')}`;
    }
  }

  return 'assets/[name]-[hash][extname]';
}

function copyHtmlImageAssets() {
  return {
    name: 'copy-html-image-assets',
    apply: 'build',
    async closeBundle() {
      await Promise.all(
        htmlImageAssets.map(async (assetPath) => {
          const sourcePath = resolve(sourceAssets, assetPath);
          const destinationPath = resolve(projectRoot, 'dist', 'assets', assetPath);

          await mkdir(dirname(destinationPath), { recursive: true });
          await copyFile(sourcePath, destinationPath);
        })
      );
    }
  };
}

export default defineConfig({
  plugins: [react(), copyHtmlImageAssets()],
  publicDir: 'public',
  build: {
    // Ninguna imagen se incrusta como data URI: las variantes AVIF/WebP de 480 px pesan ~4 KB
    // y, incrustadas, engordarían el JS que se descarga siempre y perderían el lazy loading.
    assetsInlineLimit: 0,
    cssMinify: false,
    rollupOptions: {
      output: {
        assetFileNames: preserveAssetPaths
      }
    }
  }
});

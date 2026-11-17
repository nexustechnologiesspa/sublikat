// Genera las variantes AVIF y WebP que publica la web a partir de los maestros JPEG
// de `assets/productos/<categoria>/`.
//
//   npm run fotos            genera solo lo que falta o está desactualizado
//   npm run fotos -- --force rehace todas las variantes
//
// Los maestros (1200 × 1200, JPEG progresivo) no se publican: solo se empaquetan las
// variantes -480 y -960, que son las que usa `<picture>` en la ficha de producto.
import { readdir, stat, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const RAIZ = fileURLToPath(new URL('..', import.meta.url));
const CARPETA = join(RAIZ, 'assets', 'productos');
const CATEGORIAS = ['regalos', 'cuadros', 'textiles', 'papeleria', 'identificacion'];
const TAMANOS = [480, 960];
const FUERZA = process.argv.includes('--force');

const AVIF = { quality: 52, effort: 5, chromaSubsampling: '4:4:4' };
const WEBP = { quality: 80, effort: 5 };

const FORMATOS = [
  ['avif', AVIF],
  ['webp', WEBP]
];

const kb = (bytes) => (bytes / 1024).toFixed(1).padStart(6);

async function newerThan(archivo, referencia) {
  try {
    const [a, r] = await Promise.all([stat(archivo), stat(referencia)]);
    return a.mtimeMs >= r.mtimeMs;
  } catch {
    return false;
  }
}

async function variantesDe(maestro) {
  const base = maestro.replace(/\.jpe?g$/i, '');
  const generadas = [];

  for (const tamano of TAMANOS) {
    for (const [formato, opciones] of FORMATOS) {
      const destino = `${base}-${tamano}.${formato}`;
      if (!FUERZA && (await newerThan(destino, maestro))) {
        const info = await stat(destino);
        generadas.push({ formato, tamano, bytes: info.size, omitida: true });
        continue;
      }

      const buffer = await sharp(maestro)
        .resize(tamano, tamano, { fit: 'cover', position: 'centre', kernel: 'lanczos3' })
        .toFormat(formato, opciones)
        .toBuffer();

      await writeFile(destino, buffer);
      generadas.push({ formato, tamano, bytes: buffer.length, omitida: false });
    }
  }

  return generadas;
}

const filas = [];
const totales = { avif480: 0, avif960: 0, webp480: 0, webp960: 0, maestro: 0 };
let maestros = 0;

for (const categoria of CATEGORIAS) {
  const carpeta = join(CARPETA, categoria);
  let entradas;
  try {
    entradas = await readdir(carpeta);
  } catch {
    console.warn(`Aviso: no existe ${relative(RAIZ, carpeta)}`);
    continue;
  }

  const jpegs = entradas.filter((nombre) => /\.jpe?g$/i.test(nombre)).sort();

  for (const nombre of jpegs) {
    const maestro = join(carpeta, nombre);
    const meta = await sharp(maestro).metadata();
    if (meta.width !== meta.height) {
      console.warn(
        `Aviso: ${relative(RAIZ, maestro)} no es cuadrada (${meta.width}x${meta.height}); se recorta al centro.`
      );
    }

    const infoMaestro = await stat(maestro);
    totales.maestro += infoMaestro.size;
    maestros += 1;

    const variantes = await variantesDe(maestro);
    for (const variante of variantes) {
      totales[`${variante.formato}${variante.tamano}`] += variante.bytes;
    }
    filas.push({
      maestro: relative(CARPETA, maestro),
      variantes
    });
  }
}

console.log('maestro'.padEnd(34), 'avif480', 'avif960', 'webp480', 'webp960');
for (const fila of filas) {
  const peso = (formato, tamano) =>
    fila.variantes.find((v) => v.formato === formato && v.tamano === tamano).bytes;
  console.log(
    fila.maestro.padEnd(34),
    kb(peso('avif', 480)),
    kb(peso('avif', 960)),
    kb(peso('webp', 480)),
    kb(peso('webp', 960))
  );
}

const escritas = filas.flatMap((f) => f.variantes).filter((v) => !v.omitida).length;
const totalVariantes = filas.length * TAMANOS.length * FORMATOS.length;

console.log(
  `\n${maestros} maestros (${(totales.maestro / 1024).toFixed(0)} KB, no se publican) · ` +
    `${totalVariantes} variantes, ${escritas} escritas ahora`
);
console.log(
  `Navegador AVIF: ${(totales.avif480 / 1024).toFixed(0)} KB si sirve las 20 de 480 · ` +
    `${(totales.avif960 / 1024).toFixed(0)} KB si sirve las 20 de 960`
);
console.log(
  `Navegador WebP: ${(totales.webp480 / 1024).toFixed(0)} KB (480) · ` +
    `${(totales.webp960 / 1024).toFixed(0)} KB (960)`
);

// ---------- portada ----------
// La foto del hero se sirve por CSS con `image-set()`; se generan las mismas
// medidas que el JPEG, con el nombre cambiado solo de extensión.
const PORTADA = join(RAIZ, 'assets', 'portada');
const portada = [];

for (const nombre of (await readdir(PORTADA)).filter((n) => /\.jpe?g$/i.test(n)).sort()) {
  const maestro = join(PORTADA, nombre);
  const base = maestro.replace(/\.jpe?g$/i, '');
  const meta = await sharp(maestro).metadata();
  const fila = { nombre, ancho: meta.width, jpeg: (await stat(maestro)).size };

  for (const [formato, opciones] of [
    ['avif', { quality: 50, effort: 5 }],
    ['webp', { quality: 76, effort: 5 }]
  ]) {
    const destino = `${base}.${formato}`;
    if (!FUERZA && (await newerThan(destino, maestro))) {
      fila[formato] = (await stat(destino)).size;
      continue;
    }
    const buffer = await sharp(maestro).toFormat(formato, opciones).toBuffer();
    await writeFile(destino, buffer);
    fila[formato] = buffer.length;
  }

  portada.push(fila);
}

console.log('\nportada'.padEnd(34), 'ancho', 'jpeg', 'avif', 'webp');
for (const fila of portada) {
  console.log(
    fila.nombre.padEnd(34),
    String(fila.ancho).padStart(5),
    kb(fila.jpeg),
    kb(fila.avif),
    kb(fila.webp)
  );
}

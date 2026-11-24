/**
 * Galería de trabajos terminados (mockup).
 *
 * Mientras el taller junta fotos de pedidos reales, la galería usa las fotos de producto
 * del catálogo como muestra. Para cambiarlas basta con editar
 * `trabajos`: cada foto se busca por su nombre en `assets/productos/`.
 */
const fotos480 = import.meta.glob('../../../assets/productos/*/*-480.webp', {
  eager: true,
  import: 'default'
});
const fotos960 = import.meta.glob('../../../assets/productos/*/*-960.webp', {
  eager: true,
  import: 'default'
});

const buscar = (modulos, nombre) =>
  Object.entries(modulos).find(([ruta]) => ruta.endsWith(`/${nombre}`))?.[1];

const trabajos = [
  { foto: 'tazas', titulo: 'Tazas para un cumpleaños', detalle: 'Regalos personalizados' },
  { foto: 'estampado-3-colores', titulo: 'Poleras para un equipo', detalle: 'Estampado a 3 colores' },
  { foto: 'cuadros-fotos', titulo: 'Lámina enmarcada', detalle: 'Cuadros y fotografías' },
  { foto: 'bolsas', titulo: 'Bolsas para una feria', detalle: 'Regalos personalizados' },
  { foto: 'lanyards', titulo: 'Lanyards para un evento', detalle: 'Identificación corporativa' },
  { foto: 'botellas', titulo: 'Botellas para una empresa', detalle: 'Regalos personalizados' },
  { foto: 'tarjetas-presentacion', titulo: 'Tarjetas de presentación', detalle: 'Papelería corporativa' },
  { foto: 'mousepads', titulo: 'Mousepads de oficina', detalle: 'Regalos personalizados' }
].map((trabajo) => ({
  ...trabajo,
  w480: buscar(fotos480, `${trabajo.foto}-480.webp`),
  w960: buscar(fotos960, `${trabajo.foto}-960.webp`)
})).filter((trabajo) => trabajo.w480 && trabajo.w960);

export default function Gallery() {
  return (
    <section className="gal" id="trabajos" aria-labelledby="heading-trabajos">
      <header className="gal-head">
        <span className="sticker-badge">Trabajos terminados</span>
        <h2 id="heading-trabajos" className="section-title">
          Hecho en el taller
        </h2>
        <p className="gal-head__lead">
          Algunos pedidos que ya salieron de la prensa, listos para entregar.
        </p>
        <p className="mockup-aviso">
          Fotos de muestra: aquí irán las fotos de pedidos reales del taller.
        </p>
      </header>

      <ul className="gal-grid">
        {trabajos.map((trabajo, index) => (
          <li className={`gal-item${[0, 5].includes(index) ? ' gal-item--alto' : ''}${[2, 7].includes(index) ? ' gal-item--ancho' : ''}`} key={trabajo.foto}>
            <figure>
              <img
                src={trabajo.w960}
                srcSet={`${trabajo.w480} 480w, ${trabajo.w960} 960w`}
                sizes="(min-width: 1024px) 280px, 46vw"
                alt={trabajo.titulo}
                width="960"
                height="960"
                loading="lazy"
                decoding="async"
              />
              <figcaption>
                <strong>{trabajo.titulo}</strong>
                <span>{trabajo.detalle}</span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}

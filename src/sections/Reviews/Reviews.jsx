import { whatsappLink } from '../../utils/whatsapp.js';

/**
 * Reseñas de clientes (mockup).
 *
 * Los textos son EJEMPLOS para mostrar el diseño: el cliente va a pedir
 * opiniones reales a sus compradores. Antes de publicar en producción hay que
 * reemplazar `resenas` por reseñas reales (con permiso de cada persona) y
 * quitar el aviso de ejemplo.
 */
const resenas = [
  {
    nombre: 'Camila R.',
    comuna: 'Maipú',
    producto: 'Tazas personalizadas',
    estrellas: 5,
    texto:
      'Pedí tazas con la foto de mi perrita para regalar y quedaron preciosas. Me mandaron la muestra antes de imprimir y me respondieron rapidísimo.'
  },
  {
    nombre: 'Jorge M.',
    comuna: 'Cerrillos',
    producto: 'Poleras para equipo',
    estrellas: 5,
    texto:
      'Hicimos las poleras del equipo de fútbol con nombre y número. Buen precio, colores firmes después de varios lavados.'
  },
  {
    nombre: 'Valentina P.',
    comuna: 'Santiago Centro',
    producto: 'Credenciales y lanyards',
    estrellas: 5,
    texto:
      'Necesitábamos credenciales para un evento con poco tiempo y cumplieron con el plazo. La atención por WhatsApp fue muy cercana.'
  },
  {
    nombre: 'Rodrigo S.',
    comuna: 'Pudahuel',
    producto: 'Cuadro de aluminio',
    estrellas: 4,
    texto:
      'El cuadro quedó con muy buena definición. Tuve que ajustar un poco el diseño y me ayudaron a dejarlo listo para imprimir.'
  },
  {
    nombre: 'Francisca L.',
    comuna: 'Estación Central',
    producto: 'Taza mágica',
    estrellas: 5,
    texto:
      'La taza mágica fue un éxito para el día del padre. Se ve el diseño apenas se le echa algo caliente, tal cual me lo explicaron.'
  },
  {
    nombre: 'Pymes del Sur',
    comuna: 'San Bernardo',
    producto: 'Tarjetas de presentación',
    estrellas: 5,
    texto:
      'Hicimos tarjetas y botellas con nuestro logo. Pedido ordenado, bien embalado y retiro fácil en el taller.'
  }
];

const promedio = (
  resenas.reduce((total, resena) => total + resena.estrellas, 0) / resenas.length
).toFixed(1);

function Estrellas({ valor }) {
  return (
    <span className="rev-stars" role="img" aria-label={`${valor} de 5 estrellas`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <svg key={n} viewBox="0 0 24 24" aria-hidden="true" focusable="false" className={n <= valor ? 'is-on' : ''}>
          <path d="m12 3 2.6 6.1 6.6.6-5 4.3 1.5 6.5L12 17.2 6.3 20.5l1.5-6.5-5-4.3 6.6-.6L12 3Z" />
        </svg>
      ))}
    </span>
  );
}

export default function Reviews() {
  return (
    <section className="rev" id="resenas" aria-labelledby="heading-resenas">
      <header className="rev-head">
        <div>
          <span className="sticker-badge">Opiniones</span>
          <h2 id="heading-resenas" className="section-title">
            Lo que dicen nuestros clientes
          </h2>
          <p className="mockup-aviso">
            Reseñas de ejemplo para mostrar el diseño: se reemplazarán por opiniones reales.
          </p>
        </div>
        <div className="rev-score" aria-label={`Promedio ${promedio} de 5`}>
          <span className="rev-score__num">{promedio}</span>
          <Estrellas valor={Math.round(Number(promedio))} />
          <span className="rev-score__count">{resenas.length} reseñas</span>
        </div>
      </header>

      <ul className="rev-grid">
        {resenas.map((resena) => (
          <li className="rev-card" key={resena.nombre}>
            <Estrellas valor={resena.estrellas} />
            <blockquote>
              <p>{resena.texto}</p>
            </blockquote>
            <div className="rev-card__autor">
              <span className="rev-card__avatar" aria-hidden="true">
                {resena.nombre.charAt(0)}
              </span>
              <span>
                <strong>{resena.nombre}</strong>
                <span>
                  {resena.comuna} · {resena.producto}
                </span>
              </span>
            </div>
          </li>
        ))}
      </ul>

      <p className="rev-cta">
        <a href={whatsappLink('Hola Sublikat, quiero dejar mi opinión sobre mi pedido.')} target="_blank" rel="noopener noreferrer">
          ¿Ya nos compró? Cuéntenos cómo le fue
        </a>
      </p>
    </section>
  );
}

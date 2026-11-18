import { generalQuoteLink, WHATSAPP_DISPLAY } from '../../utils/whatsapp.js';

export default function Footer() {
  return (
    <footer className="site-footer od-reveal-soft" role="contentinfo">
      <div className="main-container">
        <div className="footer-grid">
          <div>
            <div className="footer-brand-title">
              <svg
                width="28"
                height="28"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <circle cx="50" cy="50" r="46" fill="#f5df2b" />
                <path d="M28 32 L36 48 L22 46 Z" fill="#413f4b" />
                <path d="M72 32 L64 48 L78 46 Z" fill="#413f4b" />
                <circle cx="50" cy="55" r="28" fill="#413f4b" />
                <ellipse cx="42" cy="50" rx="4" ry="6" fill="#ffffff" />
                <ellipse cx="58" cy="50" rx="4" ry="6" fill="#ffffff" />
                <polygon points="50,58 46,63 54,63" fill="#4f2cf5" />
              </svg>
              <span>Sublikat</span>
            </div>
            <p className="footer-brand-desc">
              Taller de estampados y sublimación en Maipú, Santiago. Polerones,
              tazas, botellas térmicas, cuadros y artículos corporativos
              personalizados.
            </p>
          </div>

          <div>
            <h4 className="footer-col-title">Productos</h4>
            <ul className="footer-nav-list">
              <li>
                <a href="#cat-regalos">Regalos personalizados</a>
              </li>
              <li>
                <a href="#cat-cuadros">Cuadros y fotografías</a>
              </li>
              <li>
                <a href="#cat-textiles">Estampados textiles</a>
              </li>
              <li>
                <a href="#cat-papeleria">Papelería corporativa</a>
              </li>
              <li>
                <a href="#cat-identificacion">Identificación corporativa</a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="footer-col-title">El taller</h4>
            <ul className="footer-nav-list">
              <li>
                <a href="#proceso">Cómo trabajamos</a>
              </li>
              <li>
                <a href="#contacto">Pedir cotización</a>
              </li>
              <li>
                <a href={generalQuoteLink} target="_blank" rel="noopener noreferrer">
                  WhatsApp {WHATSAPP_DISPLAY}
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/sublikat.cl/">
                  Instagram @sublikat.cl
                </a>
              </li>
              <li>
                <a href="mailto:pedidos@sublikat.cl">
                  Correo pedidos@sublikat.cl
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="footer-col-title">Visítenos</h4>
            <div className="footer-hours-box">
              <p>
                <strong>Bocaccio 866, Maipú</strong>
              </p>
              <p>Santiago, Chile</p>
              <p style={{ marginTop: '8px' }}>
                <strong>Horario de atención:</strong>
              </p>
              <p>Lunes a viernes, de 10:00 a 17:00</p>
            </div>
          </div>
        </div>

        <div className="legal-notice-box" id="aviso-legal">
          <p>
            <strong>Derecho a retracto:</strong> productos listos, 10 días desde
            la entrega. Productos personalizados, sin derecho a retracto.
          </p>
        </div>

        <div className="footer-bottom">
          <div>
            © 2026 Sublikat · Taller de estampados en Maipú, Santiago, Chile.
          </div>
          <nav className="footer-bottom-links" aria-label="Enlaces legales">
            <a href="#aviso-legal">Términos y condiciones</a>
            <a href="#contacto">Escríbanos</a>
          </nav>
        </div>
      </div>
    </footer>
  );
}

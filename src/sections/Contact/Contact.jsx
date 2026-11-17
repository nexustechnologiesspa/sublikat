export default function Contact() {
  return (
    <section
      className="contact-section"
      aria-labelledby="contact-heading"
      id="contacto"
      data-od-id="contacto"
    >
      <div style={{ marginBottom: '24px' }}>
        <span className="sticker-badge">Taller abierto · Hable con nosotros</span>
        <h2 id="contact-heading" className="section-title od-reveal-soft">
          Pida presupuesto o cuéntanos su idea
        </h2>
        <p className="section-subtitle od-reveal-soft">
          Le respondemos dentro del horario de taller, de lunes a viernes de
          10:00 a 17:00. Sin bots: le atiende una persona del equipo.
        </p>
      </div>

      <div className="contact-layout">
        <div className="form-container-card">
          <div
            id="error-summary"
            className="error-summary"
            role="alert"
            aria-labelledby="error-summary-heading"
            tabIndex="-1"
            hidden
          >
            <div id="error-summary-heading" className="error-summary-title">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span id="error-summary-count">
                Hay 1 error en el formulario que necesita revisión:
              </span>
            </div>
            <ul id="error-summary-list" className="error-summary-list">
              <li>
                <a href="#contacto-email">
                  Correo electrónico: Introduce una dirección válida con
                  terminación de dominio (por ejemplo: .com o .es)
                </a>
              </li>
            </ul>
          </div>

          <form
            id="form-contacto"
            action="#"
            method="post"
            noValidate
            onSubmit={(event) => event.preventDefault()}
          >
            <div className="form-group">
              <label htmlFor="contacto-nombre" className="field-label">
                Nombre completo{' '}
                <span className="required-mark" aria-hidden="true">
                  *
                </span>
              </label>
              <input
                type="text"
                id="contacto-nombre"
                name="nombre"
                autoComplete="name"
                enterKeyHint="next"
                className="field-input"
                defaultValue=""
                aria-describedby="nombre-help"
                required
              />
              <span id="nombre-help" className="field-help-text">
                Indíquenos cómo prefiere que le contactemos al enviarle el
                boceto.
              </span>
            </div>

            <div className="form-group">
              <label htmlFor="contacto-email" className="field-label">
                Correo electrónico{' '}
                <span className="required-mark" aria-hidden="true">
                  *
                </span>
              </label>
              <input
                type="email"
                id="contacto-email"
                name="email"
                autoComplete="email"
                inputMode="email"
                enterKeyHint="next"
                className="field-input"
                defaultValue=""
                aria-describedby="email-help"
                required
              />
              <span id="email-help" className="field-help-text">
                Correo de contacto del taller: rolakun@gmail.com. Le
                respondemos aquí con el desglose del presupuesto y la prueba
                digital.
              </span>
            </div>

            <div className="form-group">
              <label htmlFor="contacto-producto" className="field-label">
                Producto o soporte que le interesa{' '}
                <span className="required-mark" aria-hidden="true">
                  *
                </span>
              </label>
              <select
                id="contacto-producto"
                name="producto"
                className="field-select"
                aria-describedby="producto-help"
                defaultValue="tazas"
              >
                <optgroup label="Regalos personalizados">
                  <option value="tazas">Tazas</option>
                  <option value="tazas-magicas">Tazas mágicas</option>
                  <option value="botellas">Botellas</option>
                  <option value="mousepads">Mousepads</option>
                  <option value="bolsas">Bolsas</option>
                  <option value="relojes">Relojes</option>
                  <option value="chapas-mascotas">Chapas para mascotas</option>
                </optgroup>
                <optgroup label="Cuadros y fotografías">
                  <option value="cuadros-piedra">Cuadros de piedra</option>
                  <option value="cuadros-fotos">
                    Cuadros de fotos (desde A6 hasta A3)
                  </option>
                  <option value="cuadros-aluminio">
                    Cuadros de fotos en aluminio (A4)
                  </option>
                </optgroup>
                <optgroup label="Estampados textiles">
                  <option value="textil-1-color">
                    Estampado en telas de 1 color
                  </option>
                  <option value="textil-2-colores">
                    Estampado en telas de 2 colores
                  </option>
                  <option value="textil-3-colores">
                    Estampado en telas de 3 colores
                  </option>
                  <option value="textil-imagenes">
                    Estampado en tela con imágenes (hasta A3)
                  </option>
                </optgroup>
                <optgroup label="Papelería corporativa">
                  <option value="tarjetas-presentacion">
                    Tarjetas de presentación
                  </option>
                  <option value="tarjetas-presentacion-pvc">
                    Tarjetas de presentación PVC
                  </option>
                </optgroup>
                <optgroup label="Identificación corporativa">
                  <option value="lanyards">Lanyards</option>
                  <option value="credenciales">Credenciales</option>
                  <option value="credenciales-pvc">Credenciales PVC</option>
                </optgroup>
                <option value="otro">Otro soporte personalizado</option>
              </select>
              <span id="producto-help" className="field-help-text">
                Elija el producto que le interesa. Si busca otra base, marque
                «Otro soporte personalizado».
              </span>
            </div>

            <div className="form-group">
              <label htmlFor="contacto-cantidad" className="field-label">
                Cantidad de unidades{' '}
                <span className="required-mark" aria-hidden="true">
                  *
                </span>
              </label>
              <input
                type="number"
                id="contacto-cantidad"
                name="cantidad"
                className="field-input"
                min="1"
                max="500"
                step="1"
                placeholder="Por ejemplo: 12"
                aria-describedby="cantidad-help"
                required
              />
              <span id="cantidad-help" className="field-help-text">
                Para pedidos de más de 500 unidades, escríbanos por WhatsApp:
                lo cotizamos a medida.
              </span>
            </div>

            <div className="form-group">
              <label htmlFor="contacto-contacto" className="field-label">
                Medio de contacto{' '}
                <span className="required-mark" aria-hidden="true">
                  *
                </span>
              </label>
              <select
                id="contacto-contacto"
                name="contacto"
                className="field-select"
                aria-describedby="contacto-help"
                required
                defaultValue=""
              >
                <option value="">Elija una opción</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="correo">Correo electrónico</option>
                <option value="telefono">Teléfono</option>
                <option value="retiro">Prefiero pasar por el taller</option>
              </select>
              <span id="contacto-help" className="field-help-text">
                Así le respondemos más rápido dentro del horario de taller.
              </span>
            </div>

            <div className="form-group">
              <label htmlFor="contacto-mensaje" className="field-label">
                Detalles del encargo o consulta{' '}
                <span className="required-mark" aria-hidden="true">
                  *
                </span>
              </label>
              <textarea
                id="contacto-mensaje"
                name="mensaje"
                className="field-textarea"
                rows="4"
                aria-describedby="mensaje-help"
                placeholder="Cuéntanos cuántas unidades necesitas, si ya tienes el archivo o si necesitas que adaptemos el boceto..."
              />
              <span id="mensaje-help" className="field-help-text">
                Puedes adjuntarnos el archivo en alta resolución o pedirnos
                asesoramiento técnico de color.
              </span>
            </div>

            <div className="checkbox-group">
              <input
                type="checkbox"
                id="contacto-privacidad"
                name="privacidad"
                className="custom-checkbox"
                defaultChecked
                required
              />
              <label htmlFor="contacto-privacidad" className="checkbox-label">
                He leído y acepto el tratamiento de mis datos de contacto para
                gestionar esta consulta comercial conforme a la política de
                privacidad. <span className="demo-tag">Texto de ejemplo</span>
              </label>
            </div>

            <button
              type="submit"
              className="btn-submit"
              data-od-id="enviar-consulta"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
              <span>Revisar mi consulta</span>
            </button>
          </form>

          <div
            id="exito-contacto"
            className="exito-panel hidden"
            role="status"
            tabIndex="-1"
            hidden
          >
            <h3>
              ¡Gracias, <span id="exito-nombre">Lucía</span>!
            </h3>
            <p>
              Su consulta de ejemplo queda registrada solo en este navegador.
              No se ha enviado ningún dato a ningún servidor: esta demostración
              enseña la validación, el resumen de errores y la confirmación.
            </p>
            <p className="mt-2">
              En la versión real le responderíamos por WhatsApp el mismo día
              laborable, con el desglose del presupuesto y la prueba de color.
            </p>
            <button type="button" id="form-reiniciar" className="btn-sec">
              Enviar otra consulta
            </button>
          </div>
        </div>

        <aside
          className="contact-aside"
          aria-label="Información de contacto directa"
        >
          <div className="contact-card">
            <span
              className="sticker-badge"
              style={{ background: '#dad3ff', marginBottom: '12px' }}
            >
              Respuesta rápida
            </span>
            <h3>¿Prefiere respuesta inmediata?</h3>
            <p className="contact-desc">
              Escríbanos por WhatsApp con su boceto o su consulta y le
              respondemos desde el taller, de lunes a viernes de 10:00 a 17:00.
            </p>

            <a
              href="https://wa.me/56949409253?text=Hola%20Sublikat,%20quiero%20cotizar%20un%20estampado"
              className="btn-whatsapp"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12.031 2c-5.509 0-9.986 4.477-9.986 9.984 0 1.761.458 3.479 1.328 4.996l-1.411 5.158 5.29-1.388c1.464.798 3.117 1.218 4.779 1.218 5.509 0 9.986-4.477 9.986-9.984 0-5.507-4.477-9.984-9.986-9.984zm5.828 14.167c-.244.686-1.419 1.309-1.956 1.378-.517.067-1.188.096-1.921-.139-.444-.142-1.016-.334-1.758-.655-3.097-1.341-5.118-4.484-5.274-4.693-.155-.208-1.258-1.674-1.258-3.193 0-1.518.795-2.266 1.077-2.576.283-.31.616-.388.823-.388.206 0 .413.002.594.011.191.01.447-.073.7.534.262.628.896 2.188.974 2.348.078.16.13.348.024.558-.106.21-.16.34-.316.525-.156.185-.328.413-.469.554-.156.155-.318.324-.137.635.181.311.805 1.328 1.726 2.148 1.185 1.055 2.185 1.382 2.496 1.537.311.155.494.137.677-.073.183-.21.782-.912.99-1.223.208-.311.416-.259.702-.155.286.104 1.815.856 2.127 1.012.312.156.52.233.598.363.078.13.078.756-.166 1.442z" />
              </svg>
              <span>Pedir por WhatsApp</span>
            </a>

            <div className="workshop-details">
              <div className="detail-item">
                <span className="detail-icon" aria-hidden="true">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" />
                    <circle cx="12" cy="10" r="2.6" />
                  </svg>
                </span>
                <div>
                  <span className="detail-title">Taller y recogidas</span>
                  <span className="detail-text">
                    Bocaccio 866, Maipú, Santiago
                  </span>
                </div>
              </div>

              <div className="detail-item">
                <span className="detail-icon" aria-hidden="true">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7.2v5.1l3.3 2" />
                  </svg>
                </span>
                <div>
                  <span className="detail-title">Horario de atención</span>
                  <span className="detail-text">
                    Lunes a viernes, de 10:00 a 17:00
                  </span>
                </div>
              </div>

              <div className="detail-item">
                <span className="detail-icon" aria-hidden="true">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5z" />
                    <path d="M3 7.5 12 12l9-4.5M12 12v9" />
                  </svg>
                </span>
                <div>
                  <span className="detail-title">Envíos y retiros</span>
                  <span className="detail-text">
                    Retiro en el taller o despacho por Blue Express a todo Chile
                  </span>
                </div>
              </div>

              <div className="detail-item">
                <span className="detail-icon" aria-hidden="true">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
                  </svg>
                </span>
                <div>
                  <span className="detail-title">WhatsApp</span>
                  <span className="detail-text">+56 9 4940 9253</span>
                </div>
              </div>

              <div className="detail-item">
                <span className="detail-icon" aria-hidden="true">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect
                      x="3.5"
                      y="3.5"
                      width="17"
                      height="17"
                      rx="5"
                    />
                    <circle cx="12" cy="12" r="3.8" />
                    <circle
                      cx="16.9"
                      cy="7.1"
                      r="1"
                      fill="currentColor"
                      stroke="none"
                    />
                  </svg>
                </span>
                <div>
                  <span className="detail-title">Instagram</span>
                  <span className="detail-text">@sublikat.cl</span>
                </div>
              </div>
            </div>
          </div>

          <div className="assurance-badge">
            <svg
              className="assurance-icon"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
            <p className="assurance-text">
              <strong>Muestra antes de imprimir:</strong> revisamos su diseño y
              lo aprobamos con usted antes de enviarlo a producción.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}

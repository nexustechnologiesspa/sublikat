import { CardIcon } from './CardIcons.jsx';

/**
 * Bloques de contenido de la ficha ampliada: opciones de personalización,
 * características y la invitación a consultar. Cada bloque se omite si su
 * dato no existe, para no rellenar la ficha con contenido inventado.
 */
export default function ProductFeatures({
  idPrefix,
  personalization,
  specs,
  invitation
}) {
  const personalizationId = `${idPrefix}-personalizacion`;
  const specsId = `${idPrefix}-caracteristicas`;

  return (
    <>
      {personalization?.length > 0 && (
        <section
          className="product-detail__block"
          aria-labelledby={personalizationId}
        >
          <h3 className="product-detail__heading" id={personalizationId}>
            Personalización
          </h3>
          <ul className="product-detail__options">
            {personalization.map((option) => (
              <li className="product-detail__option" key={option.label}>
                <CardIcon name={option.icon} />
                <span>{option.label}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {specs?.length > 0 && (
        <section className="product-detail__block" aria-labelledby={specsId}>
          <h3 className="product-detail__heading" id={specsId}>
            Características
          </h3>
          <ul className="product-detail__specs">
            {specs.map((spec) => (
              <li key={spec}>{spec}</li>
            ))}
          </ul>
        </section>
      )}

      {invitation && (
        <div className="product-detail__invite">
          <p className="product-detail__invite-title">{invitation.title}</p>
          <p className="product-detail__invite-text">{invitation.text}</p>
        </div>
      )}
    </>
  );
}

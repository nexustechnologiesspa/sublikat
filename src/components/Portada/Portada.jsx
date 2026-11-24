import logoSublikat from '../../../assets/marca/logo-sublikat.webp';

export default function Portada() {
  return (
    <div className="od-portada" aria-hidden="true">
      <div className="od-portada__foto" />
      <div className="od-portada__velo" />
      <div className="od-portada__marca">
        <span className="od-portada__logo">
          <img src={logoSublikat} alt="" width="1400" height="489" decoding="async" />
        </span>
        <span className="od-portada__lema">
          Taller de estampados y sublimación · Maipú, Santiago
        </span>
      </div>
    </div>
  );
}

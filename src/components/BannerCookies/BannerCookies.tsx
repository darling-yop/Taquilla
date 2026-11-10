import Link from "next/link";
import "./BannerCookies.css";
import type { TextosInterfaz } from "../../data/interfaz";

export default function BannerCookies({
  textos,
  onAceptar,
  onRechazar,
  onConfigurar,
}: {
  textos: TextosInterfaz;
  onAceptar: () => void;
  onRechazar: () => void;
  onConfigurar: () => void;
}) {
  return (
    <aside className="banner-cookies" aria-label={textos.ariaBanner}>
      <h2>{textos.banner}</h2>
      <p>{textos.descripcion}</p>
      <Link
        className="cookie-policy-link"
        href={textos.politicaUrl}
        aria-label={textos.ariaEnlacePolitica}
      >
        {textos.politica}
      </Link>
      <div className="grupo-botones">
        <button
          type="button"
          className="boton-home primario"
          aria-label={textos.ariaAceptar}
          onClick={onAceptar}
        >
          {textos.aceptar}
        </button>
        <button
          type="button"
          className="boton-home secundario"
          aria-label={textos.ariaRechazar}
          onClick={onRechazar}
        >
          {textos.rechazar}
        </button>
        <button
          type="button"
          className="enlace-home"
          aria-label={textos.ariaConfigurar}
          onClick={onConfigurar}
        >
          {textos.configurar}
        </button>
      </div>
    </aside>
  );
}

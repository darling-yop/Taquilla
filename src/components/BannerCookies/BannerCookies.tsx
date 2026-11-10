import Link from "next/link";
import Button from "../Button/Button";
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
        <Button
          variant="primary"
          type="button"
          aria-label={textos.ariaAceptar}
          onClick={onAceptar}
        >
          {textos.aceptar}
        </Button>
        <Button
          variant="outline"
          type="button"
          aria-label={textos.ariaRechazar}
          onClick={onRechazar}
        >
          {textos.rechazar}
        </Button>
        <Button
          variant="outline"
          type="button"
          className="cookie-configure"
          aria-label={textos.ariaConfigurar}
          onClick={onConfigurar}
        >
          {textos.configurar}
        </Button>
      </div>
    </aside>
  );
}

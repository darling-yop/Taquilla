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
    <aside className="banner-cookies" aria-label={textos.banner}>
      <h2>{textos.banner}</h2>
      <p>{textos.descripcion}</p>
      <div className="grupo-botones">
        <button
          type="button"
          className="boton-home primario"
          onClick={onAceptar}
        >
          {textos.aceptar}
        </button>
        <button
          type="button"
          className="boton-home secundario"
          onClick={onRechazar}
        >
          {textos.rechazar}
        </button>
        <button type="button" className="enlace-home" onClick={onConfigurar}>
          {textos.configurar}
        </button>
      </div>
    </aside>
  );
}

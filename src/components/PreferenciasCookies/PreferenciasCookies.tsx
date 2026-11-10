import { useEffect, useId, useRef } from "react";
import Link from "next/link";
import type { TextosInterfaz } from "../../data/interfaz";
import "./PreferenciasCookies.css";
export default function PreferenciasCookies({
  abierto,
  textos,
  permitir,
  onCambiar,
  onGuardar,
  onCerrar,
  error,
}: {
  abierto: boolean;
  textos: TextosInterfaz;
  permitir: boolean;
  onCambiar: (permitir: boolean) => void;
  onGuardar: (permitir: boolean) => void;
  onCerrar: () => void;
  error: boolean;
}) {
  const dialogo = useRef<HTMLDialogElement>(null);
  const id = useId();
  useEffect(() => {
    if (abierto) {
      if (dialogo.current && !dialogo.current.open) dialogo.current.showModal();
    } else if (dialogo.current?.open) dialogo.current.close();
  }, [abierto]);
  return (
    <dialog
      className="preferencias-dialogo"
      ref={dialogo}
      aria-labelledby={id}
      aria-describedby={`${id}-descripcion`}
      aria-label={textos.ariaPreferencias}
      onClose={onCerrar}
    >
      <h2 id={id}>{textos.cookies}</h2>
      <p id={`${id}-descripcion`}>
        {textos.descripcion}{" "}
        <Link
          className="cookie-policy-link"
          href={textos.politicaUrl}
          aria-label={textos.ariaEnlacePolitica}
        >
          {textos.politica}
        </Link>
      </p>
      <section>
        <h3>{textos.necesarias}</h3>
        <p>{textos.necesariasTexto}</p>
      </section>
      <label className="opcion-cookie">
        <input
          type="checkbox"
          checked={permitir}
          onChange={(e) => onCambiar(e.target.checked)}
        />
        <span>
          <strong>{textos.preferencias}</strong>
          <span>{textos.preferenciasTexto}</span>
        </span>
      </label>
      {error && <p role="alert">{textos.error}</p>}
      <div className="grupo-botones">
        <button
          type="button"
          className="boton-home primario"
          aria-label={textos.ariaGuardar}
          onClick={() => onGuardar(permitir)}
        >
          {textos.guardar}
        </button>
        <button
          type="button"
          className="boton-home secundario"
          aria-label={textos.ariaCerrar}
          onClick={() => dialogo.current?.close()}
        >
          {textos.cerrar}
        </button>
      </div>
    </dialog>
  );
}

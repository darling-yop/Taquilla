import { useEffect, useId, useRef, useState } from "react";
import type { TextosInterfaz } from "../../data/interfaz";
import "./PreferenciasCookies.css";
export default function PreferenciasCookies({
  abierto,
  textos,
  permitir,
  onGuardar,
  onCerrar,
  error,
}: {
  abierto: boolean;
  textos: TextosInterfaz;
  permitir: boolean;
  onGuardar: (permitir: boolean) => void;
  onCerrar: () => void;
  error: boolean;
}) {
  const dialogo = useRef<HTMLDialogElement>(null);
  const id = useId();
  const [seleccion, setSeleccion] = useState(permitir);
  useEffect(() => {
    if (abierto) {
      if (dialogo.current && !dialogo.current.open) dialogo.current.showModal();
    } else if (dialogo.current?.open) dialogo.current.close();
  }, [abierto, permitir]);
  return (
    <dialog
      className="preferencias-dialogo"
      ref={dialogo}
      aria-labelledby={id}
      onClose={onCerrar}
    >
      <h2 id={id}>{textos.cookies}</h2>
      <p>{textos.descripcion}</p>
      <section>
        <h3>{textos.necesarias}</h3>
        <p>{textos.necesariasTexto}</p>
      </section>
      <label className="opcion-cookie">
        <input
          type="checkbox"
          checked={seleccion}
          onChange={(e) => setSeleccion(e.target.checked)}
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
          onClick={() => onGuardar(seleccion)}
        >
          {textos.guardar}
        </button>
        <button
          type="button"
          className="boton-home secundario"
          onClick={() => dialogo.current?.close()}
        >
          {textos.cerrar}
        </button>
      </div>
    </dialog>
  );
}

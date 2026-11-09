import { useEffect, useRef, useId } from "react";
import { usePreferencias } from "../../context/PreferenciasContext";
import type { Detalle } from "../../types";
import "./DialogoDetalle.css";
export default function DialogoDetalle({
  detalle,
  onCerrar,
}: {
  detalle: Detalle | null;
  onCerrar: () => void;
}) {
  const { textos } = usePreferencias();
  const dialogo = useRef<HTMLDialogElement>(null);
  const id = useId();
  useEffect(() => {
    if (detalle && dialogo.current && !dialogo.current.open)
      dialogo.current.showModal();
    if (!detalle && dialogo.current?.open) dialogo.current.close();
  }, [detalle]);
  return (
    <dialog
      className="detalle-home"
      ref={dialogo}
      onClose={onCerrar}
      aria-labelledby={id}
    >
      <button
        className="cerrar-detalle"
        aria-label={textos.comun.cerrar}
        onClick={() => dialogo.current?.close()}
      >
        ×
      </button>
      <h2 id={id}>{detalle?.titulo}</h2>
      <p>{detalle?.descripcion}</p>
      {detalle?.contenido}
      <button
        className="boton-home primario"
        onClick={() => dialogo.current?.close()}
      >
        {detalle?.cerrar ?? textos.comun.cerrar}
      </button>
    </dialog>
  );
}

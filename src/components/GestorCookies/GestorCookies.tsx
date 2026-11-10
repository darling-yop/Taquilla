import { useState } from "react";
import { usePreferencias } from "../../context/PreferenciasContext";
import BannerCookies from "../BannerCookies/BannerCookies";
import PreferenciasCookies from "../PreferenciasCookies/PreferenciasCookies";
import "./GestorCookies.css";
export default function GestorCookies({
  abierto,
  permitir,
  onCambiar,
  onAbrir,
  onCerrar,
}: {
  abierto: boolean;
  permitir: boolean;
  onCambiar: (permitir: boolean) => void;
  onAbrir: () => void;
  onCerrar: () => void;
}) {
  const {
    consentimiento,
    preferenciasCargadas,
    guardarConsentimiento,
    error,
    textos,
  } = usePreferencias();
  const [mensaje, setMensaje] = useState(false);
  const t = textos.interfaz;
  function guardar(permitir: boolean) {
    const guardado = guardarConsentimiento(permitir);
    if (guardado) {
      setMensaje(true);
      onCerrar();
    }
  }
  return (
    <>
      {preferenciasCargadas && !consentimiento && (
        <BannerCookies
          textos={t}
          onAceptar={() => guardar(true)}
          onRechazar={() => guardar(false)}
          onConfigurar={onAbrir}
        />
      )}
      {error && !abierto && (
        <p className="error-cookies" role="alert">
          {t.error}
        </p>
      )}
      <PreferenciasCookies
        abierto={abierto}
        textos={t}
        permitir={permitir}
        onCambiar={onCambiar}
        onGuardar={guardar}
        onCerrar={onCerrar}
        error={error}
      />
      <span className="solo-lectores" role="status">
        {mensaje ? t.guardado : ""}
      </span>
    </>
  );
}

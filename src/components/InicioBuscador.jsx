import { useState } from "react";
import Icono from "./Icono.jsx";

function IconoUbicacion() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function IconoCalendario() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"

      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </svg>
  );
}

export default function InicioBuscador({ textos, onBuscar }) {
  const [que, setQue] = useState("");
  const [donde, setDonde] = useState("Manizales");
  const [cuando, setCuando] = useState("");

  function enviar(evento) {
    evento.preventDefault();

    const consulta = que.trim();
    if (!consulta) return;

    onBuscar?.({
      q: consulta,
      ciudad: donde.trim(),
      fecha: cuando,
    });
  }

  return (
    <form
      className="inicio-buscador"
      role="search"
      aria-label={textos?.aria}
      onSubmit={enviar}
    >
      <label className="inicio-campo">
        <Icono nombre="buscar" />

        <span className="inicio-campo-texto">
          <span className="inicio-campo-etiqueta">{textos?.que}</span>
          <input
            type="text"
            name="que"
            value={que}
            onChange={(e) => setQue(e.target.value)}
            placeholder={textos?.quePlaceholder}
          />
        </span>
      </label>

      <label className="inicio-campo">
        <IconoUbicacion />
        <span className="inicio-campo-texto">
          <span className="inicio-campo-etiqueta">{textos?.donde}</span>
          <input
            type="text"
            name="donde"
            value={donde}
            onChange={(e) => setDonde(e.target.value)}
          />
        </span>
      </label>

      <label className="inicio-campo">
        <IconoCalendario />
        <span className="inicio-campo-texto">
          <span className="inicio-campo-etiqueta">{textos?.cuando}</span>
          <input
            type="text"
            name="cuando"

            value={cuando}
            onChange={(e) => setCuando(e.target.value)}
            placeholder={textos?.cuandoPlaceholder}
          />
        </span>
      </label>

      <button type="submit" className="inicio-boton">
        {textos?.boton}
      </button>
    </form>
  );
}
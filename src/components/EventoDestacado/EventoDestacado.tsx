import AficheEvento from "../AficheEvento/AficheEvento";
import { dinero } from "../../data/catalogo";
import type { Evento } from "../../types";
import "./EventoDestacado.css";
export default function EventoDestacado({
  evento,
  en,
  onAbrir,
}: {
  evento: Evento;
  en: boolean;
  onAbrir: (evento: Evento) => void;
}) {
  return (
    <div className="destacado-taquilla">
      <AficheEvento
        variante={evento.arte}
        color1={evento.color1}
        color2={evento.color2}
      />
      <div className="ficha-destacado">
        <span className="etiqueta-evento">{en ? "Featured" : "Destacado"}</span>
        <h2>{evento.nombre}</h2>
        <p>
          {evento.horario} · {evento.lugar}
        </p>
        <div>
          <strong>
            {en ? "From" : "Desde"} {dinero(evento.precio)}
          </strong>
          <button
            className="boton-home primario"
            onClick={() => onAbrir(evento)}
          >
            {en ? "View event" : "Ver evento"}
          </button>
        </div>
      </div>
    </div>
  );
}

import AficheEvento from "../AficheEvento/AficheEvento";
import { dinero } from "../../data/catalogo";
import { usePreferencias } from "../../context/PreferenciasContext";
import type { Evento } from "../../types";
import "./EventoDestacado.css";
export default function EventoDestacado({
  evento,
  onAbrir,
}: {
  evento: Evento;
  onAbrir: (evento: Evento) => void;
}) {
  const { textos } = usePreferencias();
  return (
    <div className="destacado-taquilla">
      <AficheEvento
        variante={evento.arte}
        color1={evento.color1}
        color2={evento.color2}
      />
      <div className="ficha-destacado">
        <span className="etiqueta-evento">
          {textos.inicio.buscador.destacado}
        </span>
        <h2>{evento.nombre}</h2>
        <p>
          {evento.horario} · {evento.lugar}
        </p>
        <div>
          <strong>
            {textos.inicio.buscador.desde.replace(
              "{precio}",
              dinero(evento.precio),
            )}
          </strong>
          <button
            className="boton-home primario"
            onClick={() => onAbrir(evento)}
          >
            {textos.inicio.buscador.verEvento}
          </button>
        </div>
      </div>
    </div>
  );
}

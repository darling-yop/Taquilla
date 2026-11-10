import AficheEvento from "../AficheEvento/AficheEvento";
import Button from "../Button/Button";
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
        variante={4}
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
          <Button
            variant="primary"
            onClick={() => onAbrir(evento)}
          >
            {textos.inicio.buscador.verEvento}
          </Button>
        </div>
      </div>
    </div>
  );
}

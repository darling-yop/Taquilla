import AficheEvento from "../AficheEvento/AficheEvento";
import IconoEvento from "../IconoEvento/IconoEvento";
import Button from "../Button/Button";
import { dinero } from "../../data/catalogo";
import { usePreferencias } from "../../context/PreferenciasContext";
import type { Evento } from "../../types";
import "./TarjetaEvento.css";
export default function TarjetaEvento({
  evento,
  onAbrir,
  en,
}: {
  evento: Evento;
  onAbrir: (evento: Evento) => void;
  en: boolean;
}) {
  const { textos } = usePreferencias();
  return (
    <article className="tarjeta-evento">
      <AficheEvento
        variante={evento.arte}
      />
      <div className="contenido-evento">
        <span className="etiqueta-evento">
          {textos.categorias[evento.categoria]}
        </span>
        <h3>{evento.nombre}</h3>
        <p>
          <IconoEvento tipo="fecha" />
          {en
            ? new Date(`${evento.fecha}T12:00:00`).toLocaleDateString("en", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })
            : evento.horario}
        </p>
        <p>
          <IconoEvento tipo="lugar" />
          {evento.lugar}, {evento.ciudad}
        </p>
        <div className="precio-evento">
          <div>
            <small>{textos.comun.desde}</small>
            <strong>{dinero(evento.precio)}</strong>
          </div>
          <Button
            variant="outline"
            aria-label={`${textos.comun.verEvento}: ${evento.nombre}`}
            onClick={() => onAbrir(evento)}
          >
            {textos.comun.verEvento}
          </Button>
        </div>
      </div>
    </article>
  );
}

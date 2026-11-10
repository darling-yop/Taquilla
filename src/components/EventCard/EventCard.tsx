import AficheEvento from "../AficheEvento/AficheEvento";
import IconoEvento from "../IconoEvento/IconoEvento";
import Button from "../Button/Button";
import { usePreferencias } from "../../context/PreferenciasContext";
import type { EventoListado } from "../../data/eventosMock";
import "./EventCard.css";

export default function EventCard({
  evento,
  onVerEvento,
}: {
  evento: EventoListado;
  onVerEvento: (evento: EventoListado) => void;
}) {
  const { idioma, textos } = usePreferencias();
  const locale = idioma === "en" ? "en-CO" : "es-CO";
  const moneda = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  });
  const fechaHora = new Intl.DateTimeFormat(locale, {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/Bogota",
  });

  return (
    <article className="event-card" role="listitem">
      <AficheEvento variante={evento.arte} className="event-card-image" />
      <div className="event-card-content">
        <span className="event-card-category">
          {textos.categorias[evento.categoria]}
        </span>
        <h2>{evento.nombre}</h2>
        <p className="event-card-detail">
          <IconoEvento tipo="fecha" />
          <time dateTime={evento.fecha}>
            {fechaHora.format(new Date(evento.fecha)).replace(/\s+/g, " ")}
          </time>
        </p>
        <p className="event-card-detail">
          <IconoEvento tipo="lugar" />
          <span>
            {evento.lugar}, {evento.ciudad}
          </span>
        </p>
        <div className="event-card-footer">
          <p>
            <span>{textos.comun.desde}</span>
            <strong>{moneda.format(evento.precio).replace(/\s+/g, " ")}</strong>
          </p>
          <Button
            variant="outline"
            type="button"
            onClick={() => onVerEvento(evento)}
          >
            {textos.comun.verEvento}
          </Button>
        </div>
      </div>
    </article>
  );
}

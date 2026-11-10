import EventCard from "../EventCard/EventCard";
import type { EventoListado } from "../../data/eventosMock";
import "./EventGrid.css";

export default function EventGrid({
  eventos,
  onVerEvento,
  ariaLabel,
}: {
  eventos: EventoListado[];
  onVerEvento: (evento: EventoListado) => void;
  ariaLabel: string;
}) {
  return (
    <div className="event-grid" role="list" aria-label={ariaLabel}>
      {eventos.map((evento) => (
        <EventCard key={evento.id} evento={evento} onVerEvento={onVerEvento} />
      ))}
    </div>
  );
}

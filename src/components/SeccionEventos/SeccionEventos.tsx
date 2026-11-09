import Flecha from "../Flecha/Flecha";
import TarjetaEvento from "../TarjetaEvento/TarjetaEvento";
import type { Evento } from "../../types";
import "./SeccionEventos.css";
export default function SeccionEventos({
  id,
  titulo,
  descripcion,
  eventos,
  en,
  onAbrir,
  onVerTodos,
  cargando = false,
  error = null,
  onReintentar,
}: {
  id: string;
  titulo: string;
  descripcion: string;
  eventos: Evento[];
  en: boolean;
  onAbrir: (evento: Evento) => void;
  onVerTodos: () => void;
  cargando?: boolean;
  error?: Error | null;
  onReintentar?: () => void;
}) {
  return (
    <section
      className="seccion-eventos"
      id={id}
      aria-labelledby={`${id}-titulo`}
    >
      <div className="titulo-seccion">
        <div>
          <h2 id={`${id}-titulo`}>{titulo}</h2>
          <p role="status">{descripcion}</p>
        </div>
        <button className="enlace-home" onClick={onVerTodos}>
          {en ? "View all" : "Ver todos"}
          <Flecha />
        </button>
      </div>
      <div className="eventos-grid" aria-busy={cargando}>
        {cargando && (
          <>
            <span className="solo-lectores" role="status">
              {en ? "Loading events" : "Cargando eventos"}
            </span>
            {Array.from({ length: 4 }, (_, index) => (
              <div
                className="evento-cargando"
                key={`evento-cargando-${index}`}
                aria-hidden="true"
              />
            ))}
          </>
        )}
        {!cargando &&
          !error &&
          eventos.map((evento) => (
            <TarjetaEvento
              key={evento.id}
              evento={evento}
              en={en}
              onAbrir={onAbrir}
            />
          ))}
      </div>
      {error && (
        <div className="estado-eventos" role="alert">
          <p>
            {en
              ? "We couldn't load events. Check your connection and try again."
              : "No pudimos cargar los eventos. Revisa tu conexión e inténtalo de nuevo."}
          </p>
          {onReintentar && (
            <button
              type="button"
              className="boton-home primario"
              onClick={onReintentar}
            >
              {en ? "Try again" : "Reintentar"}
            </button>
          )}
        </div>
      )}
      {!cargando && !error && !eventos.length && (
        <div className="sin-resultados">
          <h3>{en ? "No events found" : "No encontramos eventos"}</h3>
          <p>{en ? "Try another search." : "Prueba con otra búsqueda."}</p>
          <button className="boton-home primario" onClick={onVerTodos}>
            {en ? "View all events" : "Ver todos los eventos"}
          </button>
        </div>
      )}
    </section>
  );
}

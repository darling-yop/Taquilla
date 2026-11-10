import TarjetaEvento from "../TarjetaEvento/TarjetaEvento";
import Button from "../Button/Button";
import { usePreferencias } from "../../context/PreferenciasContext";
import type { Evento } from "../../types";
import "./SeccionEventos.css";
export default function SeccionEventos({
  id,
  titulo,
  descripcion,
  eventos,
  en,
  onAbrir,
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
  cargando?: boolean;
  error?: Error | null;
  onReintentar?: () => void;
}) {
  const { textos } = usePreferencias();
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
        <Button variant="link" href="/explorar">
          {textos.pie.eventos}
        </Button>
      </div>
      <div className="eventos-grid" aria-busy={cargando}>
        {cargando && (
          <>
            <span className="solo-lectores" role="status">
              {textos.comun.cargandoEventos}
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
          <p>{textos.comun.errorEventos}</p>
          {onReintentar && (
            <Button
              variant="primary"
              type="button"
              onClick={onReintentar}
            >
              {textos.comun.reintentar}
            </Button>
          )}
        </div>
      )}
      {!cargando && !error && !eventos.length && (
        <div className="sin-resultados">
          <h3>{textos.comun.noEncontrados}</h3>
          <p>{textos.comun.probarOtraBusqueda}</p>
        </div>
      )}
    </section>
  );
}

import { useEffect, useState } from "react";
import { pedirDetalleEvento } from "../services/eventosService.js";
import { formatearFecha, formatearPrecio } from "../utils/formato.js";
import "../styles/Acciones.css";

export default function DetalleEvento({ slug, idioma }) {
  const ingles = idioma === "en";
  const [evento, setEvento] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controlador = new AbortController();
    setCargando(true);
    setError(null);

    pedirDetalleEvento(slug, controlador.signal)
      .then(setEvento)
      .catch((errorConsulta) => {
        if (!controlador.signal.aborted) setError(errorConsulta);
      })
      .finally(() => {
        if (!controlador.signal.aborted) setCargando(false);
      });

    return () => controlador.abort();
  }, [slug]);

  return (
    <main className="vista-accion">
      <a href="#explorar" className="volver-explorar">
        {ingles ? "← Browse events" : "← Explorar eventos"}
      </a>
      {cargando && (
        <p role="status">
          {ingles ? "Loading event…" : "Cargando evento…"}
        </p>
      )}
      {error && (
        <p role="alert">
          {ingles ? "Could not load this event." : "No pudimos cargar este evento."}
        </p>
      )}
      {evento && (
        <article className="detalle-evento">
          <div
            className="detalle-evento-afiche"
            style={{
              background: `linear-gradient(135deg, ${evento.afiche?.color1 ?? "#a79fd0"}, ${evento.afiche?.color2 ?? "#c4909a"})`,
            }}
          />
          <div>
            <p>{evento.categoria}</p>
            <h1>{evento.titulo}</h1>
            <p>{evento.descripcion}</p>
            <p>
              {evento.recinto?.nombre}
              {evento.recinto?.ciudad ? ` · ${evento.recinto.ciudad}` : ""}
            </p>
            <p>{formatearFecha(evento.fecha, idioma)}</p>
            {evento.edadMinima > 0 && (
              <p>
                {ingles ? "Minimum age:" : "Edad mínima:"} {evento.edadMinima}
              </p>
            )}

            {evento.localidades?.length > 0 && (
              <section aria-labelledby="localidades-titulo">
                <h2 id="localidades-titulo">
                  {ingles ? "Ticket sections" : "Localidades"}
                </h2>
                <ul className="localidades-evento">
                  {evento.localidades.map((localidad) => (
                    <li key={localidad.id}>
                      <strong>{localidad.nombre}</strong>
                      <span>{formatearPrecio(localidad.precio, idioma)}</span>
                      <span>
                        {localidad.agotada || localidad.disponibles === 0
                          ? ingles
                            ? "Sold out"
                            : "Agotada"
                          : `${localidad.disponibles} ${ingles ? "available" : "disponibles"}`}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            <p className="aviso-compra" role="note">
              {ingles
                ? "Ticket purchase is not available through the current API."
                : "La API actual no ofrece un endpoint de compra. Puedes consultar aquí las localidades, precios y disponibilidad."}
            </p>
          </div>
        </article>
      )}
    </main>
  );
}

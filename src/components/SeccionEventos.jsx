import "../styles/Eventos.css";
import TarjetaEvento from "./TarjetaEvento.jsx";

export default function SeccionEventos({
  seccion,
  etiquetas,
  nombresCategoria,
  idioma,
  onVerTodos,
}) {
  const idTitulo = `${seccion.id}-titulo`;

  return (
    <section id={seccion.id} className="eventos" aria-labelledby={idTitulo}>
      <div className="eventos-cabecera">
        <div>
          <h2 id={idTitulo} className="eventos-titulo">
            {seccion.titulo}
          </h2>
          <p className="eventos-subtitulo">{seccion.subtitulo}</p>
        </div>

        <a className="eventos-ver-todos" href="#explorar" onClick={onVerTodos}>
          {etiquetas?.verTodos} <span aria-hidden="true">→</span>
        </a>
      </div>

      <ul className="eventos-lista">
        {seccion.eventos.map((evento) => (
          <li key={evento.id}>
            <TarjetaEvento
              evento={evento}
              categoria={nombresCategoria?.[evento.categoria]}
              idioma={idioma}
              etiquetas={etiquetas}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
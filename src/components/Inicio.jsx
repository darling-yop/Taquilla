import "../styles/Inicio.css";
import InicioBuscador from "./InicioBuscador.jsx";
import EventoDestacado from "./EventoDestacado.jsx";

// Textos de respaldo: solo se usan si la API no entrega el JSON.
const RESPALDO = {
  es: {
    badge: "Temporada nov – dic 2026",
    titulo: "Tu próxima noche empieza aquí",
    descripcion:
      "Conciertos, teatro, deportes y festivales. Busca por categoría, fecha o ciudad y consulta todos los detalles de cada evento.",
    buscador: {
      aria: "Buscar eventos",
      que: "Qué",
      quePlaceholder: "Evento o artista",
      donde: "Dónde",
      cuando: "Cuándo",
      cuandoPlaceholder: "Cualquier fecha",
      boton: "Buscar",
    },
    populares: {
      etiqueta: "Populares:",
      items: ["Salsa", "Stand-up", "Fútbol", "Festivales de fin de año"],
    },
  },

  en: {
    badge: "Season Nov – Dec 2026",
    titulo: "Your next night starts here",
    descripcion:
      "Concerts, theater, sports and festivals. Search by category, date or city and see every detail of each event.",
    buscador: {
      aria: "Search events",
      que: "What",
      quePlaceholder: "Event or artist",
      donde: "Where",
      cuando: "When",
      cuandoPlaceholder: "Any date",
      boton: "Search",
    },
    populares: {
      etiqueta: "Popular:",
      items: ["Salsa", "Stand-up", "Soccer", "Year-end festivals"],
    },
  },
};

export default function Inicio({ textos, idioma, onBuscar }) {
  const t = { ...(RESPALDO[idioma] ?? RESPALDO.es), ...textos };

  return (

    <section id="inicio" className="inicio" aria-labelledby="inicio-titulo">
      <div className="inicio-interior">
        <div className="inicio-contenido">
          <p className="inicio-badge">{t.badge}</p>

          <h1 id="inicio-titulo" className="inicio-titulo">
            {t.titulo}
          </h1>

          <p className="inicio-descripcion">{t.descripcion}</p>

          <InicioBuscador textos={t.buscador} onBuscar={onBuscar} />

          {t.populares?.items?.length > 0 && (
            <div className="inicio-populares">
              <span>{t.populares?.etiqueta}</span>
              <ul>
                {t.populares.items.map((item) => (
                  <li key={item}>
                    <button type="button" onClick={() => onBuscar?.(item)}>
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {t.destacado?.titulo && <EventoDestacado textos={t.destacado} />}
      </div>
    </section>
  );
}
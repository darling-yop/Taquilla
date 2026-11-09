import EventoDestacado from "../EventoDestacado/EventoDestacado";
import type { ReactNode } from "react";
import type { Evento, FiltrosEventos, CategoriaEvento } from "../../types";
import "./HeroTaquilla.css";
export default function HeroTaquilla({
  en,
  children,
  destacado,
  abrirEvento,
  setFiltros,
  filtrarCategoria,
}: {
  en: boolean;
  children: ReactNode;
  destacado: Evento;
  abrirEvento: (evento: Evento) => void;
  setFiltros: (filtros: FiltrosEventos | null) => void;
  filtrarCategoria: (categoria: CategoriaEvento) => void;
}) {
  return (
    <section className="hero-taquilla">
      <div className="ancho-home interior-taquilla">
        <div>
          <span className="etiqueta-evento">
            {en
              ? "November – December 2026 season"
              : "Temporada nov – dic 2026"}
          </span>
          <h1>
            {en
              ? "Your next night starts here"
              : "Tu próxima noche empieza aquí"}
          </h1>
          <p>
            {en
              ? "Concerts, theatre, sports and festivals. Search by category, date or city and discover all the details of each event."
              : "Conciertos, teatro, deportes y festivales. Busca por categoría, fecha o ciudad y consulta todos los detalles de cada evento."}
          </p>
          {children}
          <div className="populares">
            <span>{en ? "Popular:" : "Populares:"}</span>
            {["Salsa", "Stand-up", "Fútbol", "Festivales de fin de año"].map(
              (valor, i) => (
                <button
                  key={valor}
                  onClick={() =>
                    i === 0
                      ? (setFiltros({ consulta: "Salsa" }),
                        document.getElementById("eventos")?.scrollIntoView())
                      : filtrarCategoria(
                          (
                            [
                              "Conciertos",
                              "Comedia",
                              "Deportes",
                              "Festivales",
                            ] as const
                          )[i],
                        )
                  }
                >
                  {valor}
                </button>
              ),
            )}
          </div>
        </div>
        <EventoDestacado evento={destacado} en={en} onAbrir={abrirEvento} />
      </div>
    </section>
  );
}

import EventoDestacado from "../EventoDestacado/EventoDestacado";
import Button from "../Button/Button";
import type { ReactNode } from "react";
import type { Evento, FiltrosEventos, CategoriaEvento } from "../../types";
import { usePreferencias } from "../../context/PreferenciasContext";
import "./HeroTaquilla.css";
export default function HeroTaquilla({
  children,
  destacado,
  cargandoDestacado,
  errorDestacado,
  onReintentarDestacado,
  abrirEvento,
  setFiltros,
  filtrarCategoria,
}: {
  children: ReactNode;
  destacado: Evento | null;
  cargandoDestacado: boolean;
  errorDestacado: Error | null;
  onReintentarDestacado: () => void;
  abrirEvento: (evento: Evento) => void;
  setFiltros: (filtros: FiltrosEventos | null) => void;
  filtrarCategoria: (categoria: CategoriaEvento) => void;
}) {
  const { textos } = usePreferencias();
  return (
    <section className="hero-taquilla">
      <div className="ancho-home interior-taquilla">
        <div>
          <span className="etiqueta-evento">{textos.inicio.temporada}</span>
          <h1>{textos.inicio.titulo}</h1>
          <p>{textos.inicio.subtitulo}</p>
          {children}
          <div className="populares">
            <span>{textos.inicio.populares}</span>
            {["Salsa", "Stand-up", "Fútbol", "Festivales de fin de año"].map(
              (valor, i) => (
                <button
                  type="button"
                  className="popular-filter"
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
        {destacado ? (
          <EventoDestacado evento={destacado} onAbrir={abrirEvento} />
        ) : (
          <div
            className="destacado-estado"
            role={errorDestacado ? "alert" : "status"}
            aria-busy={cargandoDestacado}
          >
            {cargandoDestacado ? (
              <p>{textos.inicio.cargarDestacados}</p>
            ) : errorDestacado ? (
              <>
                <p>{textos.inicio.errorDestacados}</p>
                <Button
                  variant="outline"
                  onClick={onReintentarDestacado}
                >
                  {textos.comun.reintentar}
                </Button>
              </>
            ) : (
              <p>{textos.inicio.sinDestacados}</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

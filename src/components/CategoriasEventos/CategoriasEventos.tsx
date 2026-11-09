import IconoEvento from "../IconoEvento/IconoEvento";
import { categoriasEn } from "../../data/catalogo";
import type { Categoria, FiltrosEventos } from "../../types";
import "./CategoriasEventos.css";
export default function CategoriasEventos({
  categorias,
  filtros,
  en,
  filtrarCategoria,
  cargando,
  error,
  onReintentar,
}: {
  categorias: Categoria[];
  filtros: FiltrosEventos | null;
  en: boolean;
  filtrarCategoria: (categoria: Categoria["id"]) => void;
  cargando: boolean;
  error: Error | null;
  onReintentar: () => void;
}) {
  return (
    <nav
      className="categorias-eventos"
      aria-label={en ? "Event categories" : "Categorías de eventos"}
      aria-busy={cargando}
    >
      {cargando && (
        <>
          <span className="solo-lectores" role="status">
            {en ? "Loading event categories" : "Cargando categorías de eventos"}
          </span>
          {Array.from({ length: 6 }, (_, index) => (
            <div
              className="categoria-cargando"
              key={`categoria-cargando-${index}`}
              aria-hidden="true"
            />
          ))}
        </>
      )}
      {!cargando &&
        !error &&
        categorias.map((categoria) => (
          <button
            type="button"
            key={categoria.id}
            aria-pressed={filtros?.categoria === categoria.id}
            onClick={() => filtrarCategoria(categoria.id)}
          >
            <span className="icono-categoria">
              <IconoEvento tipo={categoria.id} />
            </span>
            <span>
              {en ? categoriasEn[categoria.id] : categoria.nombre}
              <small>
                {categoria.eventos} {en ? "events" : "eventos"}
              </small>
            </span>
          </button>
        ))}
      {error && (
        <div className="estado-categorias" role="alert">
          <p>
            {en
              ? "We couldn't load event categories."
              : "No pudimos cargar las categorías de eventos."}
          </p>
          <button type="button" onClick={onReintentar}>
            {en ? "Try again" : "Reintentar"}
          </button>
        </div>
      )}
    </nav>
  );
}

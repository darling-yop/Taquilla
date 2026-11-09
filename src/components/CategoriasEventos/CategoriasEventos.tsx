import IconoEvento from "../IconoEvento/IconoEvento";
import type { CategoriaEvento, FiltrosEventos } from "../../types";
import "./CategoriasEventos.css";
export default function CategoriasEventos({
  categorias,
  categoriasEn,
  cantidades,
  filtros,
  en,
  filtrarCategoria,
}: {
  categorias: CategoriaEvento[];
  categoriasEn: string[];
  cantidades: number[];
  filtros: FiltrosEventos | null;
  en: boolean;
  filtrarCategoria: (categoria: CategoriaEvento) => void;
}) {
  return (
    <nav
      className="categorias-eventos"
      aria-label={en ? "Event categories" : "Categorías de eventos"}
    >
      {categorias.map((categoria, i) => (
        <button
          key={categoria}
          aria-pressed={filtros?.categoria === categoria}
          onClick={() => filtrarCategoria(categoria)}
        >
          <span className="icono-categoria">
            <IconoEvento tipo={categoria} />
          </span>
          <span>
            {en ? categoriasEn[i] : categoria}
            <small>
              {cantidades[i]} {en ? "events" : "eventos"}
            </small>
          </span>
        </button>
      ))}
    </nav>
  );
}

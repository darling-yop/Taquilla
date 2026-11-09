import IconoEvento from "../IconoEvento/IconoEvento";
import { usePreferencias } from "../../context/PreferenciasContext";
import type { Categoria, FiltrosEventos } from "../../types";
import "./CategoriasEventos.css";
export default function CategoriasEventos({
  categorias,
  filtros,
  filtrarCategoria,
  cargando,
  error,
  onReintentar,
}: {
  categorias: Categoria[];
  filtros: FiltrosEventos | null;
  filtrarCategoria: (categoria: Categoria["id"]) => void;
  cargando: boolean;
  error: Error | null;
  onReintentar: () => void;
}) {
  const { textos } = usePreferencias();
  return (
    <nav
      className="categorias-eventos"
      aria-label={textos.inicio.buscador.categorias}
      aria-busy={cargando}
    >
      {cargando && (
        <>
          <span className="solo-lectores" role="status">
            {textos.inicio.buscador.cargarCategorias}
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
              {textos.categorias[categoria.id]}
              <small>
                {(categoria.eventos === 1
                  ? textos.inicio.buscador.evento
                  : textos.inicio.buscador.eventos
                ).replace("{cantidad}", String(categoria.eventos))}
              </small>
            </span>
          </button>
        ))}
      {error && (
        <div className="estado-categorias" role="alert">
          <p>{textos.inicio.errorCategorias}</p>
          <button type="button" onClick={onReintentar}>
            {textos.comun.reintentar}
          </button>
        </div>
      )}
    </nav>
  );
}

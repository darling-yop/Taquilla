
import "../styles/Eventos.css";
import "../styles/Explorar.css";
import { useCiudades } from "../hooks/useCiudades.js";
import FiltrosExplorar from "./FiltrosExplorar.jsx";
import TarjetaEvento from "./TarjetaEvento.jsx";
import Icono from "./Icono.jsx";
import { formatearDiaCorto } from "../utils/fechas.js";

function llenar(texto = "", valores = {}) {
  return texto.replace(/\{(\w+)\}/g, (m, clave) => valores[clave] ?? m);
}

export default function Explorar({
  textos,
  idioma,
  filtros = {},
  categorias = [],
  nombresCategoria,
  etiquetas,
  resultados = [],
  paginacion,
  cargando,
  error,
  onFiltrar,
  onReintentar,
}) {
  const ciudades = useCiudades();

  const e = textos?.paginas?.explorar;
  const g = textos?.general;

  const t = {
    migas: textos?.componentes?.migas?.explorar,
    paginas: e?.paginacion?.aria,
    inicio: textos?.componentes?.migas?.inicio,
    titulo: e?.encabezado?.titulo,
    conteoUno: e?.encabezado?.conteo?.uno,
    conteoOtro: e?.encabezado?.conteo?.otro,
    filtros: e?.filtros?.titulo,
    categoria: e?.filtros?.etiquetas?.categoria,
    todasCategorias: g?.categorias?.todas,
    ciudad: e?.filtros?.etiquetas?.ciudad,
    todasCiudades: e?.filtros?.etiquetas?.todasLasCiudades,
    fecha: e?.filtros?.etiquetas?.fecha,
    fechas: {
      hoy: e?.filtros?.etiquetas?.hoy,
      finDeSemana: e?.filtros?.etiquetas?.esteFinDeSemana,
      mes: e?.filtros?.etiquetas?.esteMes,
      rango: e?.filtros?.etiquetas?.elegirFechas,
    },
    desde: e?.filtros?.etiquetas?.desde,
    hasta: e?.filtros?.etiquetas?.hasta,
    limpiar: e?.filtros?.botones?.limpiar,
    quitar: e?.filtros?.aria?.quitarFiltro,
    cargando: e?.cargando?.texto,
    errorTitulo: e?.error?.titulo,
    errorTexto: e?.error?.texto,
    reintentar: e?.error?.botones?.reintentar,
    vacioTitulo: e?.vacio?.titulo,
    vacioTexto: e?.vacio?.texto,
    limpiarFiltros: e?.vacio?.botones?.limpiarFiltros,
    anterior: g?.acciones?.anterior,
    siguiente: g?.acciones?.siguiente,
  };

  const total =
    typeof paginacion?.total === "number" ? paginacion.total : null;

  const textoFecha =
    filtros.fecha === "rango"
      ? filtros.desde || filtros.hasta
        ? `${filtros.desde
            ? formatearDiaCorto(filtros.desde, idioma)
            : "…"} – ${
            filtros.hasta
              ? formatearDiaCorto(filtros.hasta, idioma)
              : "…"
          }`
        : null
      : t.fechas?.[filtros.fecha];

  const chips = [
    filtros.categoria && {
      clave: "categoria",
      texto: nombresCategoria?.[filtros.categoria] ?? filtros.categoria,
      quitar: { categoria: undefined },
    },
    textoFecha && {
      clave: "fecha",
      texto: textoFecha,
      quitar: {
        fecha: undefined,
        desde: undefined,
        hasta: undefined,
      },
    },
    filtros.ciudad && {
      clave: "ciudad",
      texto: filtros.ciudad,
      quitar: { ciudad: undefined },
    },
    filtros.q && {
      clave: "q",
      texto: `“${filtros.q}”`,
      quitar: { q: undefined },
    },
  ].filter(Boolean);

  function cambiar(cambios) {
    onFiltrar({ ...filtros, ...cambios, pagina: undefined });
  }

  return (
    <main id="explorar" className="explorar">
      <nav className="explorar-migas" aria-label={t.migas}>
        <ol>
          <li>
            <a href="#inicio">{t.inicio}</a>
          </li>
          <li aria-current="page">{t.titulo}</li>
        </ol>
      </nav>

      <h1 className="explorar-titulo">{t.titulo}</h1>

      {total !== null && !cargando && !error && (
        <p className="explorar-conteo" role="status">
          {llenar(total === 1 ? t.conteoUno : t.conteoOtro, {
            cantidad: total,
          })}
        </p>
      )}

      <div className="explorar-cuerpo">
        <FiltrosExplorar
          t={t}
          filtros={filtros}
          categorias={categorias}
          ciudades={ciudades}
          hayFiltros={chips.length > 0}
          onCambiar={cambiar}
          onLimpiar={() => onFiltrar({})}
        />

        <section className="explorar-resultados" aria-busy={cargando}>
          {chips.length > 0 && (
            <ul className="explorar-chips">
              {chips.map(({ clave, texto, quitar }) => (
                <li key={clave} className="chip">
                  <span>{texto}</span>
                  <button
                    type="button"
                    aria-label={llenar(t.quitar, { filtro: texto })}
                    onClick={() => cambiar(quitar)}
                  >
                    <Icono nombre="cerrar" tamano={14} />
                  </button>
                </li>
              ))}
            </ul>
          )}

          {cargando ? (
            <p role="status" className="explorar-estado">
              {t.cargando}
            </p>
          ) : error ? (
            <div role="alert" className="explorar-estado">
              <h2>{t.errorTitulo}</h2>
              <p>{t.errorTexto}</p>
              <button
                type="button"
                className="explorar-boton"
                onClick={onReintentar}
              >
                {t.reintentar}
              </button>
            </div>
          ) : resultados.length === 0 ? (
            <div role="status" className="explorar-estado">
              <h2>{t.vacioTitulo}</h2>
              <p>{t.vacioTexto}</p>
              {chips.length > 0 && (
                <button
                  type="button"
                  className="explorar-boton"
                  onClick={() => onFiltrar({})}
                >
                  {t.limpiarFiltros}
                </button>
              )}
            </div>
          ) : (
            <>
              <ul className="explorar-lista">
                {resultados.map((evento) => (
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

              {paginacion?.paginas > 1 && (
                <nav
                  className="explorar-paginacion"
                  aria-label={t.paginas}
                >
                  <button
                    type="button"
                    disabled={paginacion.pagina <= 1}
                    onClick={() =>
                      onFiltrar({
                        ...filtros,
                        pagina: paginacion.pagina - 1,
                      })
                    }
                  >
                    {t.anterior}
                  </button>

                  <span>
                    {paginacion.pagina} / {paginacion.paginas}
                  </span>

                  <button
                    type="button"
                    disabled={paginacion.pagina >= paginacion.paginas}
                    onClick={() =>
                      onFiltrar({
                        ...filtros,
                        pagina: paginacion.pagina + 1,
                      })
                    }
                  >
                    {t.siguiente}
                  </button>
                </nav>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
}

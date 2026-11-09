"use client";

import { useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LayoutPublico from "../../components/LayoutPublico/LayoutPublico";
import TarjetaEvento from "../../components/TarjetaEvento/TarjetaEvento";
import AficheEvento from "../../components/AficheEvento/AficheEvento";
import DialogoDetalle from "../../components/DialogoDetalle/DialogoDetalle";
import { useDetalle } from "../../hooks/useDetalle";
import { useRecurso } from "../../hooks/useRecurso";
import { useCatalogoEventos } from "../../hooks/useCatalogoEventos";
import {
  adaptarCategoriaInicio,
  adaptarCiudadInicio,
} from "../../services/inicio";
import { usePreferencias } from "../../context/PreferenciasContext";
import { dinero } from "../../data/catalogo";
import type { CategoriaEvento, Evento } from "../../types";
import "./ExplorarPage.css";
import { formatearTexto } from "../../services/textos";

const tamanioPagina = 12;
const ordenes = ["fecha", "precio", "popularidad"] as const;
type OrdenEventos = (typeof ordenes)[number];

function valorValido(
  valor: string | null,
  permitidos: readonly string[],
): string {
  return valor && permitidos.includes(valor) ? valor : "";
}

function ordenValido(valor: string | null): OrdenEventos {
  return ordenes.find((orden) => orden === valor) ?? "fecha";
}

function fechaValida(valor: string | null): string {
  if (!valor || !/^\d{4}-\d{2}-\d{2}$/.test(valor)) return "";
  const fecha = new Date(`${valor}T12:00:00`);
  return Number.isNaN(fecha.getTime()) ||
    fecha.toISOString().slice(0, 10) !== valor
    ? ""
    : valor;
}

function construirRuta(
  consulta: string,
  categoria: string,
  ciudad: string,
  orden: OrdenEventos,
): string {
  const parametros = new URLSearchParams({
    pagina: "1",
    porPagina: "100",
    orden,
  });
  if (consulta) parametros.set("q", consulta);
  if (categoria) parametros.set("categoria", categoria.toLowerCase());
  if (ciudad) parametros.set("ciudad", ciudad);
  return `/eventos?${parametros.toString()}`;
}

function actualizarUrl(
  router: ReturnType<typeof useRouter>,
  valores: Record<string, string>,
) {
  const parametros = new URLSearchParams();
  Object.entries(valores).forEach(([clave, valor]) => {
    if (valor) parametros.set(clave, valor);
  });
  parametros.set("pagina", valores.pagina || "1");
  router.push(`/explorar?${parametros.toString()}`);
}

export default function ExplorarPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const parametros = searchParams ?? new URLSearchParams();
  const { idioma, textos } = usePreferencias();
  const en = idioma === "en";
  const { detalle, setDetalle, abrirCuenta } = useDetalle(textos);
  const categoriasRecurso = useRecurso("/categorias", adaptarCategoriaInicio);
  const ciudadesRecurso = useRecurso("/ciudades", adaptarCiudadInicio);
  const categorias = categoriasRecurso.datos ?? [];
  const ciudades = ciudadesRecurso.datos ?? [];
  const categoria = valorValido(parametros.get("categoria"), [
    "conciertos",
    "teatro",
    "deportes",
    "festivales",
    "comedia",
    "familiares",
  ]);
  const ciudad = parametros.get("ciudad")?.trim() ?? "";
  const consulta = (parametros.get("q") ?? "").trim();
  const fecha = fechaValida(parametros.get("fecha"));
  const orden = ordenValido(parametros.get("orden"));
  const paginaNumero = Number(parametros.get("pagina") || "1");
  const pagina =
    Number.isInteger(paginaNumero) && paginaNumero > 0 ? paginaNumero : 1;
  const ruta = useMemo(
    () => construirRuta(consulta, categoria, ciudad, orden),
    [consulta, categoria, ciudad, orden],
  );
  const catalogo = useCatalogoEventos(ruta);
  const eventosFiltrados = (catalogo.datos ?? []).filter(
    (evento) => !fecha || evento.fecha === fecha,
  );
  const paginas = Math.ceil(eventosFiltrados.length / tamanioPagina);
  const eventos = eventosFiltrados.slice(
    (pagina - 1) * tamanioPagina,
    pagina * tamanioPagina,
  );
  useEffect(() => {
    if (
      !catalogo.cargando &&
      !catalogo.error &&
      paginas > 0 &&
      pagina > paginas
    ) {
      actualizarUrl(router, {
        q: consulta,
        categoria,
        ciudad,
        fecha,
        orden,
        pagina: String(paginas),
      });
    }
  }, [
    categoria,
    catalogo.cargando,
    catalogo.error,
    ciudad,
    consulta,
    fecha,
    pagina,
    paginas,
    orden,
    router,
  ]);

  function buscar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const datos = new FormData(evento.currentTarget);
    actualizarUrl(router, {
      q: String(datos.get("q") ?? "").trim(),
      categoria: String(datos.get("categoria") ?? ""),
      ciudad: String(datos.get("ciudad") ?? ""),
      fecha: String(datos.get("fecha") ?? ""),
      orden: String(datos.get("orden") ?? "fecha"),
      pagina: "1",
    });
  }

  function abrirEvento(evento: Evento) {
    setDetalle({
      titulo: evento.nombre,
      descripcion: `${evento.horario} · ${evento.lugar}, ${evento.ciudad}`,
      contenido: (
        <div className="resumen-evento">
          <AficheEvento
            variante={evento.arte}
            color1={evento.color1}
            color2={evento.color2}
          />
          <p>{dinero(evento.precio)} COP</p>
        </div>
      ),
      cerrar: textos.comun.cerrar,
    });
  }

  const categoriaSeleccionada = (categorias.find(
    ({ id }) => id.toLowerCase() === categoria,
  )?.id ?? "") as CategoriaEvento | "";

  return (
    <LayoutPublico
      destino="/explorar"
      inicioDestino="/"
      buscarDestino="#filtros-explorar"
      etiqueta={textos.interfaz.explora}
      descripcion={textos.pie.descripcion}
      onCuenta={abrirCuenta}
    >
      <div className="ancho-home pagina-explorar">
        <header className="encabezado-explorar">
          <p className="sobrelinea-explorar">{textos.explorar.eyebrow}</p>
          <h1>{textos.explorar.titulo.replace(" · Taquilla", "")}</h1>
          <p>{textos.explorar.descripcion}</p>
        </header>

        <form
          id="filtros-explorar"
          className="filtros-explorar"
          role="search"
          aria-label={textos.explorar.filtroAria}
          key={parametros.toString()}
          onSubmit={buscar}
        >
          <label>
            <span>{textos.explorar.eventoArtista}</span>
            <input
              type="search"
              name="q"
              defaultValue={consulta}
              placeholder={textos.explorar.buscarEventos}
            />
          </label>
          <label>
            <span>{textos.explorar.categoria}</span>
            <select
              name="categoria"
              defaultValue={categoriaSeleccionada}
              disabled={categoriasRecurso.cargando || !!categoriasRecurso.error}
            >
              <option value="">{textos.explorar.todasCategorias}</option>
              {categorias.map((opcion) => (
                <option key={opcion.id} value={opcion.id.toLowerCase()}>
                  {textos.categorias[opcion.id]}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>{textos.explorar.ciudad}</span>
            <select
              name="ciudad"
              defaultValue={ciudad}
              disabled={ciudadesRecurso.cargando || !!ciudadesRecurso.error}
            >
              <option value="">{textos.explorar.todasCiudades}</option>
              {ciudades.map((opcion) => (
                <option key={opcion} value={opcion}>
                  {opcion}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>{textos.explorar.fecha}</span>
            <input type="date" name="fecha" defaultValue={fecha} />
          </label>
          <label>
            <span>{textos.explorar.orden}</span>
            <select name="orden" defaultValue={orden}>
              <option value="fecha">{textos.explorar.ordenFecha}</option>
              <option value="precio">{textos.explorar.ordenPrecio}</option>
              <option value="popularidad">
                {textos.explorar.ordenPopularidad}
              </option>
            </select>
          </label>
          <div className="acciones-filtros">
            <button type="submit" className="boton-home primario">
              {formatearTexto(textos.explorar.aplicar, {
                cantidad: String(eventosFiltrados.length),
              })}
            </button>
            <button
              type="button"
              className="boton-limpiar-filtros"
              onClick={() => router.push("/explorar")}
            >
              {textos.explorar.limpiar}
            </button>
          </div>
        </form>

        {(categoriasRecurso.error || ciudadesRecurso.error) && (
          <div className="error-opciones-filtros" role="alert">
            <p>{textos.explorar.errorOpciones}</p>
            {categoriasRecurso.error && (
              <button type="button" onClick={categoriasRecurso.recargar}>
                {textos.explorar.reintentarCategorias}
              </button>
            )}
            {ciudadesRecurso.error && (
              <button type="button" onClick={ciudadesRecurso.recargar}>
                {textos.explorar.reintentarCiudades}
              </button>
            )}
          </div>
        )}

        <section
          className="resultados-explorar"
          aria-labelledby="titulo-resultados"
        >
          <div className="titulo-seccion">
            <div>
              <h2 id="titulo-resultados">{textos.explorar.tituloResultados}</h2>
              <p role="status" aria-live="polite">
                {catalogo.cargando
                  ? textos.explorar.cargando
                  : catalogo.error
                    ? textos.explorar.errorCatalogo
                    : formatearTexto(
                        eventosFiltrados.length === 1
                          ? textos.explorar.resultadoUno
                          : textos.explorar.resultados,
                        { cantidad: String(eventosFiltrados.length) },
                      )}
              </p>
            </div>
          </div>

          {catalogo.cargando && (
            <div className="eventos-grid" aria-busy="true">
              {Array.from({ length: 4 }, (_, indice) => (
                <div
                  className="evento-cargando"
                  key={`cargando-${indice}`}
                  aria-hidden="true"
                />
              ))}
            </div>
          )}
          {catalogo.error && (
            <div className="estado-eventos" role="alert">
              <p>{textos.explorar.errorCatalogo}</p>
              <button
                type="button"
                className="boton-home primario"
                onClick={catalogo.recargar}
              >
                {textos.explorar.reintentar}
              </button>
            </div>
          )}
          {!catalogo.cargando && !catalogo.error && eventos.length > 0 && (
            <div className="eventos-grid">
              {eventos.map((evento) => (
                <TarjetaEvento
                  key={evento.id}
                  evento={evento}
                  en={en}
                  onAbrir={abrirEvento}
                />
              ))}
            </div>
          )}
          {!catalogo.cargando &&
            !catalogo.error &&
            eventosFiltrados.length === 0 && (
              <div className="sin-resultados">
                <h3>{textos.explorar.sinResultados}</h3>
                <p>{textos.explorar.sinResultadosDescripcion}</p>
              </div>
            )}

          {!catalogo.cargando && !catalogo.error && paginas > 1 && (
            <nav
              className="paginacion-explorar"
              aria-label={textos.explorar.navPaginas}
            >
              <button
                type="button"
                disabled={pagina <= 1}
                onClick={() =>
                  actualizarUrl(router, {
                    q: consulta,
                    categoria,
                    ciudad,
                    fecha,
                    orden,
                    pagina: String(pagina - 1),
                  })
                }
              >
                {textos.explorar.anterior}
              </button>
              <span aria-current="page">
                {textos.explorar.pagina} {pagina} {textos.explorar.de} {paginas}
              </span>
              <button
                type="button"
                disabled={pagina >= paginas}
                onClick={() =>
                  actualizarUrl(router, {
                    q: consulta,
                    categoria,
                    ciudad,
                    fecha,
                    orden,
                    pagina: String(pagina + 1),
                  })
                }
              >
                {textos.explorar.siguiente}
              </button>
            </nav>
          )}
        </section>
      </div>
      <DialogoDetalle detalle={detalle} onCerrar={() => setDetalle(null)} />
    </LayoutPublico>
  );
}

import { useEffect, useState } from "react";
import { useTextos } from "./hooks/useTextos.js";
import { useEventos } from "./hooks/useEventos.js";
import { cerrarSesion, consultarSesion } from "./services/cuentaService.js";
import { adaptarInicio } from "./utils/textosInicio.js";
import "./App.css";
import Navbar from "./components/Navbar.jsx";
import Inicio from "./components/Inicio.jsx";
import Categorias from "./components/Categorias.jsx";
import SeccionEventos from "./components/SeccionEventos.jsx";
import Cuenta from "./components/Cuenta.jsx";
import DetalleEvento from "./components/DetalleEvento.jsx";
import Footer from "./components/Footer.jsx";
import Explorar from "./components/Explorar.jsx";

function leerRuta() {
  const hash = window.location.hash.slice(1);
  if (!hash) return { tipo: "inicio" };

  const [pagina, query = ""] = hash.split("?", 2);
  if (pagina.startsWith("evento/")) {
    return { tipo: "evento", slug: decodeURIComponent(pagina.slice(7)) };
  }
  if (pagina.startsWith("categoria/")) {
    return {
      tipo: "categoria",
      categoria: decodeURIComponent(pagina.slice(10)),
    };
  }
  if (pagina === "buscar") {
    return {
      tipo: "buscar",
      filtros: Object.fromEntries(new URLSearchParams(query)),
    };
  }
   if (pagina === "explorar") {
    return {
      tipo: "explorar",
      filtros: Object.fromEntries(new URLSearchParams(query)),
    };
  }
  if (pagina === "ingresar" || pagina === "crearCuenta") {
    return { tipo: pagina };
  }
  return { tipo: "inicio" };
}

function App() {
  const [idioma, setIdioma] = useState("es");
  const [ruta, setRuta] = useState(leerRuta);
  const [usuario, setUsuario] = useState(null);
  const [errorSesion, setErrorSesion] = useState(null);
  const datos = useTextos(idioma);
  const contenido = useEventos(datos.textos, idioma);
  const ingles = idioma === "en";

  useEffect(() => {
    function actualizar() {
      setRuta(leerRuta());
    }

    window.addEventListener("hashchange", actualizar);
    return () => window.removeEventListener("hashchange", actualizar);
  }, []);

  useEffect(() => {
    let vigente = true;
    consultarSesion()
      .then((sesion) => {
        if (vigente) setUsuario(sesion);
      })
      .catch((errorConsulta) => {
        if (vigente) {
          console.error("Error al consultar la sesión:", errorConsulta);
          setErrorSesion(errorConsulta);
        }
      });

    return () => {
      vigente = false;
    };
  }, []);

  useEffect(() => {
    if (ruta.tipo === "categoria") {
      contenido.cargarResultados({ categoria: ruta.categoria });
      } else if (ruta.tipo === "buscar" || ruta.tipo === "explorar") {
      contenido.cargarResultados(ruta.filtros);
    } else {
      contenido.limpiarResultados();
    }
  }, [ruta, contenido.cargarResultados, contenido.limpiarResultados]);

  useEffect(() => {
    document.documentElement.lang = idioma;
  }, [idioma]);

  function navegar(hash) {
    const destino = hash.startsWith("#") ? hash : `#${hash}`;
    if (window.location.hash === destino) {
      setRuta(leerRuta());
    } else {
      window.location.hash = destino;
    }
  }

  function buscar(valor) {
    const filtros = typeof valor === "string" ? { q: valor } : valor;
    const parametros = new URLSearchParams();

    for (const clave of ["q", "ciudad", "fecha"]) {
      if (filtros?.[clave]) parametros.set(clave, filtros[clave]);
    }

    navegar(`buscar?${parametros.toString()}`);
  }
    function filtrarExplorar(filtros = {}) {
    const parametros = new URLSearchParams();

        for (const clave of ["q", "categoria", "ciudad", "fecha", "desde", "hasta", "pagina"]) {
      if (filtros[clave]) parametros.set(clave, filtros[clave]);
    }

    const consulta = parametros.toString();
    navegar(consulta ? `explorar?${consulta}` : "explorar");
  }

  async function salir() {
    try {
      await cerrarSesion();
      setUsuario(null);
      setErrorSesion(null);
    } catch (errorConsulta) {
      setErrorSesion(errorConsulta);
    }
  }

  const catalogoActivo = ["categoria", "buscar"].includes(ruta.tipo);
  const mostrarInicioPublico = ["inicio", "explorar"].includes(ruta.tipo);
   const activo =
    ruta.tipo === "categoria"
      ? ruta.categoria
      : catalogoActivo || ruta.tipo === "explorar"
        ? "explorar"
        : undefined;
  const nombreCategoria =
    contenido.nombresCategoria?.[ruta.categoria] ?? ruta.categoria;

   const tituloResultados =
    ruta.tipo === "categoria"
      ? nombreCategoria
      : (datos.textos?.paginas?.explorar?.encabezado?.titulo ??
        (ingles ? "Explore events" : "Explorar eventos"));

  const fechaNoDisponible =
    ruta.tipo === "buscar" && Boolean(ruta.filtros?.fecha);

  return (
    <div className="sitio">
      <Navbar
        {...datos}
        idioma={idioma}
        cambiarIdioma={setIdioma}
        activo={activo}
        onBuscar={buscar}
        usuario={usuario}
        onCerrarSesion={salir}
      />

      {errorSesion && (
        <p role="alert" className="estado-busqueda">
          {ingles
            ? "There was a problem with your session."
            : "Ocurrió un problema con la sesión."}
        </p>
      )}

      {ruta.tipo === "evento" ? (
        <DetalleEvento slug={ruta.slug} idioma={idioma} />
      ) : ruta.tipo === "ingresar" || ruta.tipo === "crearCuenta" ? (
        <Cuenta
          tipo={ruta.tipo}
          textos={datos.textos}
          idioma={idioma}
          onLogin={setUsuario}
        />
            ) : ruta.tipo === "explorar" ? (
        <Explorar
          textos={datos.textos}
          idioma={idioma}
          filtros={ruta.filtros}
          categorias={contenido.categorias?.items ?? []}
          nombresCategoria={contenido.nombresCategoria}
          etiquetas={contenido.etiquetas}
          resultados={contenido.resultados}
          paginacion={contenido.paginacion}
          cargando={
            contenido.cargandoResultados || contenido.filtrosResultados === null
          }
          error={contenido.errorResultados}
          onFiltrar={filtrarExplorar}
          onReintentar={() => contenido.cargarResultados(ruta.filtros)}
        />
      ) : (
        <main id="explorar">
          {mostrarInicioPublico && (
            <Inicio
              textos={adaptarInicio(datos.textos, {
                idioma,
                evento: contenido.destacados.eventos[0],
              })}
              idioma={idioma}
              onBuscar={buscar}
            />
          )}

          {contenido.cargando && (
            <p role="status" className="estado-busqueda">
              {ingles ? "Loading events…" : "Cargando eventos…"}
            </p>
          )}

          {contenido.error && (
            <div role="alert" className="estado-busqueda">
              <p>
                {ingles
                  ? "Events could not be loaded."
                  : "No pudimos cargar los eventos."}
              </p>
              <button type="button" onClick={contenido.recargar}>
                {ingles ? "Try again" : "Reintentar"}
              </button>
            </div>
          )}

          {!contenido.cargando && !contenido.error && (
            <>
              <Categorias
                categorias={contenido.categorias}
                onBuscar={(categoria) =>
                  navegar(`categoria/${encodeURIComponent(categoria)}`)
                }
              />

              {catalogoActivo ? (
                <>
                  {contenido.cargandoResultados && (
                    <p role="status" className="estado-busqueda">
                      {ingles ? "Searching events…" : "Buscando eventos…"}
                    </p>
                  )}
                  {contenido.errorResultados && (
                    <p role="alert" className="estado-busqueda">
                      {ingles
                        ? "The event search failed. Try again."
                        : "No pudimos buscar eventos. Inténtalo de nuevo."}
                    </p>
                  )}
                  {fechaNoDisponible && (
                    <p role="note" className="estado-busqueda">
                      {ingles
                        ? "The API does not currently support filtering events by date."
                        : "La API actual no permite filtrar eventos por fecha; se aplicaron los demás criterios."}
                    </p>
                  )}
                  {!contenido.cargandoResultados &&
                    !contenido.errorResultados &&
                    (contenido.resultados.length > 0 ? (
                      <SeccionEventos
                        seccion={{
                          id: "resultados",
                          titulo: tituloResultados,
                          subtitulo: "",
                          eventos: contenido.resultados,
                        }}
                        etiquetas={contenido.etiquetas}
                        nombresCategoria={contenido.nombresCategoria}
                        idioma={idioma}
                        onVerTodos={() => navegar("#explorar")}
                      />
                    ) : (
                      <p role="status" className="estado-busqueda">
                        {ingles
                          ? "No events match these filters."
                          : "No hay eventos que coincidan con estos filtros."}
                      </p>
                    ))}
                  {contenido.paginacion?.paginas > 1 && (
                    <nav
                      className="paginacion-eventos"
                      aria-label={ingles ? "Event pages" : "Páginas de eventos"}
                    >
                      <button
                        type="button"
                        disabled={contenido.paginacion.pagina <= 1}
                        onClick={() =>
                          contenido.cambiarPagina(
                            contenido.paginacion.pagina - 1,
                          )
                        }
                      >
                        {ingles ? "Previous" : "Anterior"}
                      </button>
                      <span>
                        {contenido.paginacion.pagina} /{" "}
                        {contenido.paginacion.paginas}
                      </span>
                      <button
                        type="button"
                        disabled={
                          contenido.paginacion.pagina >=
                          contenido.paginacion.paginas
                        }
                        onClick={() =>
                          contenido.cambiarPagina(
                            contenido.paginacion.pagina + 1,
                          )
                        }
                      >
                        {ingles ? "Next" : "Siguiente"}
                      </button>
                    </nav>
                  )}
                </>
              ) : (
                <>
                  {contenido.destacados.eventos.length > 0 && (
                    <SeccionEventos
                      seccion={contenido.destacados}
                      etiquetas={contenido.etiquetas}
                      nombresCategoria={contenido.nombresCategoria}
                      idioma={idioma}
                      onVerTodos={() => navegar("#explorar")}
                    />
                  )}
                  {contenido.proximos.eventos.length > 0 && (
                    <SeccionEventos
                      seccion={contenido.proximos}
                      etiquetas={contenido.etiquetas}
                      nombresCategoria={contenido.nombresCategoria}
                      idioma={idioma}
                      onVerTodos={() => navegar("#explorar")}
                    />
                  )}
                </>
              )}
            </>
          )}
          </main>
    )}
    <Footer textos={datos.textos} idioma={idioma} />
  </div>
);
}

export default App;

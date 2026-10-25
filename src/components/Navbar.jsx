
import { useEffect, useRef, useState } from "react";
import Icono from "./Icono.jsx";
import "./Navbar.css";

const DESTINOS = {
  explorar: "#explorar",
};

export default function Navbar({
  textos,
  cargando,
  error,
  recargar,
  idioma,
  cambiarIdioma,
  activo,
  onBuscar,
  textoGrande,
  alternarTexto,
}) {
  const [abierto, setAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const botonMenu = useRef(null);
  const campoBusqueda = useRef(null);

  const nav = textos?.navbar;
  const ingles = idioma === "en";

  const abrir =
    textos?.menuMovil.abrir ?? (ingles ? "Open menu" : "Abrir menú");

  const cerrar =
    textos?.menuMovil.cerrar ?? (ingles ? "Close menu" : "Cerrar menú");

  const enlaces = Object.entries(nav?.enlaces ?? {}).filter(
    ([clave]) => DESTINOS[clave],
  );

  useEffect(() => {
    function cerrarConEscape(evento) {
      if (evento.key === "Escape" && abierto) {
        setAbierto(false);
        botonMenu.current?.focus();
      }
    }

    document.addEventListener("keydown", cerrarConEscape);

    return () => document.removeEventListener("keydown", cerrarConEscape);
  }, [abierto]);

  function abrirBusqueda() {
    setAbierto(true);
    requestAnimationFrame(() => campoBusqueda.current?.focus());
  }

  function buscar(evento) {
    evento.preventDefault();

    const consulta = busqueda.trim();

    if (!consulta) return;

    onBuscar(consulta);
    setAbierto(false);
  }

  return (
    <header className="navbar">
      <nav
        className="navbar-interior"
        aria-label={nav?.aria.menu ?? "Navegación principal"}
      >
        <a
          className="navbar-marca"
          href="#explorar"
          aria-label={nav?.logo.aria ?? "explorar"}
          onClick={() => setAbierto(false)}
        >
          <span className="navbar-simbolo" aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 7h16v3a2 2 0 0 0 0 4v3H4v-3a2 2 0 0 0 0-4V7Z" />
              <path d="M14 7v3m0 4v3" strokeDasharray="1 2" />
            </svg>
          </span>

          <span>taquilla</span>
        </a>

        <div className="navbar-movil-acciones">
          <button
            type="button"
            className="navbar-icono"
            aria-label={nav?.buscador.aria ?? "Buscar"}
            disabled={!nav}
            onClick={abrirBusqueda}
          >
            <Icono nombre="buscar" />
          </button>

          {nav && (
            <a
              className="navbar-icono"
              href="#favoritos"
              aria-label={nav.botones.favoritos}
              onClick={() => setAbierto(false)}
            >
              <Icono nombre="favoritos" />
            </a>
          )}

          <button
            ref={botonMenu}
            type="button"
            className="navbar-icono"
            aria-label={abierto ? cerrar : abrir}
            aria-expanded={abierto}
            aria-controls="navbar-panel"
            onClick={() => setAbierto((valor) => !valor)}
          >
            <Icono nombre={abierto ? "cerrar" : "menu"} />
          </button>
        </div>

        <div
          id="navbar-panel"
          className={`navbar-panel${abierto ? " is-abierto" : ""}`}
          aria-busy={cargando}
        >
          {cargando && (
            <p className="navbar-estado" role="status">
              {ingles ? "Loading navigation…" : "Cargando navegación…"}
            </p>
          )}

          {error && (
            <div className="navbar-estado" role="alert">
              <p>
                {ingles
                  ? "Navigation could not be loaded."
                  : "No pudimos cargar el menú."}
              </p>

              <button type="button" onClick={recargar}>
                {ingles ? "Try again" : "Reintentar"}
              </button>
            </div>
          )}

          {nav && (
            <>
              <ul className="navbar-enlaces">
                {enlaces.map(([clave, etiqueta]) => (
                  <li key={clave}>
                    <a
                      href={DESTINOS[clave]}
                      aria-current={activo === clave ? "page" : undefined}
                      onClick={() => setAbierto(false)}
                    >
                      {etiqueta}
                    </a>
                  </li>
                ))}
              </ul>

              <form
                className="navbar-buscador"
                role="search"
                aria-label={nav.buscador.aria}
                onSubmit={buscar}
              >
                <button type="submit" aria-label={nav.buscador.boton}>
                  <Icono nombre="buscar" />
                </button>

                <input
                  id="navbar-busqueda"
                  name="busqueda"
                  ref={campoBusqueda}
                  type="search"
                  value={busqueda}
                  onChange={(evento) => setBusqueda(evento.target.value)}
                  placeholder={nav.buscador.placeholder}
                  aria-label={nav.buscador.aria}
                  required
                />
              </form>
            </>
          )}

          <div className="navbar-utilidades">
            <div
              className="navbar-idioma"
              role="group"
              aria-label={nav?.aria.idioma ?? "Cambiar idioma"}
            >
              {["es", "en"].map((opcion) => (
                <button
                  key={opcion}
                  type="button"
                  className={`navbar-idioma-opcion ${
                    idioma === opcion ? "is-activo" : ""
                  }`}
                  aria-pressed={idioma === opcion}
                  onClick={() => cambiarIdioma(opcion)}
                >
                  {opcion.toUpperCase()}
                </button>
              ))}
            </div>

            <a
              className="navbar-boton-ingresar"
              href="#ingresar"
              onClick={() => setAbierto(false)}
            >
              {ingles ? "Log in" : "Ingresar"}
            </a>

            {nav && (
              <a
                className="navbar-accion"
                href="#crearCuenta"
                onClick={() => setAbierto(false)}
              >
                {nav.botones.crearCuenta}
              </a>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

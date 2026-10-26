
import { useEffect, useRef, useState } from "react";
import Icono from "./Icono.jsx";
import "../styles/Navbar.css";


const DESTINOS = {
  inicio: "#inicio",
  explorar: "#explorar",
  conciertos: "#categoria/conciertos",
  teatro: "#categoria/teatro",
  deportes: "#categoria/deportes",
  festivales: "#categoria/festivales",
};

// Textos de respaldo: solo se usan si la API no entrega el JSON.
const RESPALDO = {
  es: {
    navegacion: "Navegación principal",
    logo: "taquilla, ir al inicio",
    buscar: "Buscar",
    abrirMenu: "Abrir menú",
    cerrarMenu: "Cerrar menú",
    idioma: "Cambiar idioma",
    cargando: "Cargando navegación…",
    error: "No pudimos cargar el menú.",
    reintentar: "Reintentar",
    ingresar: "Ingresar",
  },
  en: {
    navegacion: "Main navigation",
    logo: "taquilla, go to home",
    buscar: "Search",
    abrirMenu: "Open menu",
    cerrarMenu: "Close menu",
    idioma: "Change language",
    cargando: "Loading navigation…",
    error: "Navigation could not be loaded.",
    reintentar: "Try again",
    ingresar: "Log in",
  },
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
  usuario,
  onCerrarSesion,
}) {
  const [abierto, setAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const botonMenu = useRef(null);
  const campoBusqueda = useRef(null);

  const nav = textos?.navbar;
  const t = RESPALDO[idioma] ?? RESPALDO.es;

  const abrir = textos?.menuMovil?.abrir ?? t.abrirMenu;
  const cerrar = textos?.menuMovil?.cerrar ?? t.cerrarMenu;

  const enlaces = Object.entries(nav?.enlaces ?? {}).filter(
    ([clave]) => DESTINOS[clave],
  );
  const salir = textos?.menuMovil?.botones?.cerrarSesion ??
    (idioma === "en" ? "Sign out" : "Cerrar sesión");

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

    onBuscar?.(consulta);
    setAbierto(false);
  }

  return (
    <header className="navbar">
      <nav
        className="navbar-interior"
        aria-label={nav?.aria?.menu ?? t.navegacion}
      >
        <a
          className="navbar-marca"
          href="#explorar"
          aria-label={nav?.logo?.aria ?? t.logo}
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
            aria-label={nav?.buscador?.aria ?? t.buscar}
            disabled={!nav}
            onClick={abrirBusqueda}
          >
            <Icono nombre="buscar" />
          </button>

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
              {t.cargando}
            </p>
          )}

          {error && (
            <div className="navbar-estado" role="alert">
              <p>{t.error}</p>

              <button type="button" onClick={recargar}>
                {t.reintentar}
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
                aria-label={nav?.buscador?.aria ?? t.buscar}
                onSubmit={buscar}
              >
                <button
                  type="submit"
                  aria-label={nav?.buscador?.boton ?? t.buscar}
                >
                  <Icono nombre="buscar" />
                </button>

                <input
                  id="navbar-busqueda"
                  name="busqueda"
                  ref={campoBusqueda}
                  type="search"
                  value={busqueda}
                  onChange={(evento) => setBusqueda(evento.target.value)}
                  placeholder={nav?.buscador?.placeholder}
                  aria-label={nav?.buscador?.aria ?? t.buscar}
                  required
                />
              </form>
            </>
          )}

          <div className="navbar-utilidades">
            <div
              className="navbar-idioma"
              role="group"
              aria-label={nav?.aria?.idioma ?? t.idioma}
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

            {usuario ? (
              <>
                <span className="navbar-usuario">{usuario.nombre}</span>
                <button
                  type="button"
                  className="navbar-accion"
                  onClick={onCerrarSesion}
                >
                  {salir}
                </button>
              </>
            ) : (
              <>
                <a
                  className="navbar-boton-ingresar"
                  href="#ingresar"
                  onClick={() => setAbierto(false)}
                >
                  {nav?.botones?.ingresar ?? t.ingresar}
                </a>
              <a
                className="navbar-accion"
                href="#crearCuenta"
                onClick={() => setAbierto(false)}
              >
                  {nav?.botones?.crearCuenta ??
                    (idioma === "en" ? "Create account" : "Crear cuenta")}
                </a>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
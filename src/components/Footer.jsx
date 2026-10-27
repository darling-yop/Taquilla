import "../styles/Footer.css";
import Icono from "./Icono.jsx";
import { RUTAS } from "../utils/rutas.js";

// Respaldo: solo se usa si la API no trae el texto.
const RESPALDO = {
  es: {
    navegacion: "Pie de página",
    logo: "taquilla, ir al inicio",
    lema: "Conciertos, teatro, deportes y festivales en un solo lugar. Explora eventos y consulta sus detalles.",
    columnas: { explora: "Explora", cuenta: "Tu cuenta", legal: "Legal" },
    inicio: "Inicio",
    explorarEventos: "Explorar eventos",
    ingresar: "Ingresar",
    crearCuenta: "Crear cuenta",
    cookies: "Política de cookies",
    accesibilidad: "Accesibilidad",
    derechos: "© {anio} Taquilla · Proyecto académico",
    aviso: "Datos de ejemplo con fines académicos.",
  },
  en: {
    navegacion: "Footer",
    logo: "taquilla, go to home",
    lema: "Concerts, theater, sports and festivals in one place. Explore events and see their details.",
    columnas: { explora: "Explore", cuenta: "Your account", legal: "Legal" },
    inicio: "Home",
    explorarEventos: "Explore events",
    ingresar: "Log in",
    crearCuenta: "Sign up",
    cookies: "Cookie policy",
    accesibilidad: "Accessibility",
    derechos: "© {anio} Taquilla · Academic project",
    aviso: "Sample data for academic purposes.",
  },
};

export default function Footer({ textos, idioma }) {
  const r = RESPALDO[idioma] ?? RESPALDO.es;
  const f = textos?.footer;
  const nav = textos?.navbar;
  const anio = new Date().getFullYear();

  // Un enlace sin href se muestra como texto plano (aún no tiene pantalla)
  const columnas = [
    {
      clave: "explora",
      titulo: r.columnas.explora,
      enlaces: [
        {
          clave: "inicio",
          texto: textos?.componentes?.migas?.inicio ?? r.inicio,
          href: RUTAS.inicio,
        },
        {
          clave: "explorar",
          texto:
            textos?.paginas?.explorar?.encabezado?.titulo ?? r.explorarEventos,
          href: RUTAS.explorar,
        },
      ],
    },
    {
      clave: "cuenta",
      titulo: r.columnas.cuenta,
      enlaces: [
        {
          clave: "ingresar",
          texto: nav?.botones?.ingresar ?? r.ingresar,
          href: RUTAS.ingresar,
        },
        {
          clave: "crearCuenta",
          texto: nav?.botones?.crearCuenta ?? r.crearCuenta,
          href: RUTAS.crearCuenta,
        },
      ],
    },
    {
      clave: "legal",
      titulo: r.columnas.legal,
      enlaces: [
        {
          clave: "cookies",
          texto: f?.legal?.enlaces?.politicaCookies ?? r.cookies,
        },
        {
          clave: "accesibilidad",
          texto: f?.legal?.enlaces?.accesibilidad ?? r.accesibilidad,
        },
      ],
    },
  ];

  return (
    <footer className="footer">
      <div className="footer-interior">
        <div className="footer-superior">
          <div className="footer-marca-bloque">
            <a
              className="footer-marca"
              href={RUTAS.inicio}
              aria-label={nav?.logo?.aria ?? r.logo}
            >
              <span className="footer-simbolo" aria-hidden="true">
                <Icono nombre="logo" />
              </span>
              <span>taquilla</span>
            </a>

            <p className="footer-lema">{f?.lema ?? r.lema}</p>
          </div>

          <nav className="footer-columnas" aria-label={r.navegacion}>
            {columnas.map((columna) => (
              <div key={columna.clave} className="footer-columna">
                <h2 className="footer-titulo">{columna.titulo}</h2>

                <ul className="footer-lista">
                  {columna.enlaces.map(({ clave, texto, href }) => (
                    <li key={clave}>
                      {href ? <a href={href}>{texto}</a> : <span>{texto}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="footer-inferior">
          <p>{(f?.legal?.derechos ?? r.derechos).replace("{anio}", anio)}</p>
          <p>{f?.legal?.aviso ?? r.aviso}</p>
        </div>
      </div>
    </footer>
  );
}
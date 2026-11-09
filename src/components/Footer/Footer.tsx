import Marca from "../Marca/Marca";
import { interfaz } from "../../data/interfaz";
import type { Idioma } from "../../data/interfaz";
import type { TipoCuenta } from "../../types";
import "./Footer.css";
export default function Footer({
  nombre,
  tipo,
  descripcion,
  destino,
  etiqueta,
  inicioDestino = "#contenido",
  onCuenta,
  idioma,
  onAbrirCookies,
}: {
  nombre: string;
  tipo: string;
  descripcion: string;
  destino: string;
  etiqueta: string;
  inicioDestino?: string;
  idioma: Idioma;
  onCuenta: (tipo: TipoCuenta) => void;
  onAbrirCookies: () => void;
}) {
  const t = interfaz[idioma];
  return (
    <footer className="pie-home">
      <div className="ancho-home">
        <div className="columnas-pie">
          <div>
            <Marca nombre={nombre} tipo={tipo} />
            <p>{descripcion}</p>
          </div>
          <div>
            <h3>{t.explora}</h3>
            <a href={inicioDestino}>{t.inicio}</a>
            <a href={destino}>{etiqueta}</a>
          </div>
          <div>
            <h3>{t.cuenta}</h3>
            <button onClick={() => onCuenta("ingresar")}>{t.ingresar}</button>
            <button onClick={() => onCuenta("registro")}>{t.registro}</button>
          </div>
        </div>
        <div className="pie-creditos">
          <span>
            © 2026 {nombre} · {t.academico}
          </span>
          <button className="enlace-home" onClick={onAbrirCookies}>
            {t.cookies}
          </button>
        </div>
      </div>
    </footer>
  );
}

import Marca from "../Marca/Marca";
import type { TextosAplicacion } from "../../data/textos";
import type { TipoCuenta } from "../../types";
import "./Footer.css";
export default function Footer({
  nombre,
  tipo,
  descripcion,
  destino,
  inicioDestino = "#contenido",
  onCuenta,
  textos,
  onAbrirCookies,
}: {
  nombre: string;
  tipo: string;
  descripcion: string;
  destino: string;
  inicioDestino?: string;
  textos: TextosAplicacion;
  onCuenta: (tipo: TipoCuenta) => void;
  onAbrirCookies: () => void;
}) {
  return (
    <footer className="pie-home">
      <div className="ancho-home">
        <div className="columnas-pie">
          <div>
            <Marca nombre={nombre} tipo={tipo} ariaLabel={textos.logoAria} />
            <p>{textos.pie.descripcion || descripcion}</p>
          </div>
          <div>
            <h3>{textos.pie.explorar}</h3>
            <a href={inicioDestino}>{textos.pie.inicio}</a>
            <a href={destino}>{textos.pie.eventos}</a>
          </div>
          <div>
            <h3>{textos.pie.cuenta}</h3>
            <button onClick={() => onCuenta("ingresar")}>
              {textos.pie.ingresar}
            </button>
            <button onClick={() => onCuenta("registro")}>
              {textos.pie.registro}
            </button>
          </div>
        </div>
        <div className="pie-creditos">
          <span>{textos.pie.derechos}</span>
          <button
            className="enlace-home"
            aria-label={textos.interfaz.ariaPreferencias}
            onClick={onAbrirCookies}
          >
            {textos.interfaz.cookies}
          </button>
        </div>
      </div>
    </footer>
  );
}

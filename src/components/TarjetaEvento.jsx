import Icono from "./Icono.jsx";
import { formatearFecha, formatearPrecio } from "../utils/formato.js";

export default function TarjetaEvento({
  evento,
  categoria,
  idioma,
  etiquetas,
}) {
  const colores = evento.colores ?? ["#a79fd0", "#c4909a"];

  return (
    <article className="tarjeta-evento">
      <div
        className="tarjeta-evento-imagen"
        style={{
          background: `linear-gradient(135deg, ${colores[0]}, ${colores[1]})`,
        }}
      >
        <span className="tarjeta-evento-categoria">
          {categoria ?? evento.categoria}
        </span>
      </div>

      <div className="tarjeta-evento-cuerpo">
        <h3 className="tarjeta-evento-titulo">{evento.nombre}</h3>

        <p className="tarjeta-evento-dato">
          <Icono nombre="calendario" />
          {formatearFecha(evento.fecha, idioma)}
        </p>

        <p className="tarjeta-evento-dato">
          <Icono nombre="ubicacion" />
          {evento.lugar}
        </p>

        <div className="tarjeta-evento-pie">
          <p className="tarjeta-evento-precio">
            <span>{etiquetas?.desde}</span>
            <strong>{formatearPrecio(evento.precio, idioma)}</strong>
          </p>
          <a
            className="tarjeta-evento-boton"
            href={`#evento/${encodeURIComponent(evento.slug)}`}
          >
            {etiquetas?.verEvento}
          </a>
        </div>
      </div>
    </article>
  );
}

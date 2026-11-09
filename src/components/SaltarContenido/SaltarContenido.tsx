import "./SaltarContenido.css";
export default function SaltarContenido({
  texto,
  destino = "contenido",
}: {
  texto: string;
  destino?: string;
}) {
  return (
    <a className="saltar-contenido" href={`#${destino}`}>
      {texto}
    </a>
  );
}

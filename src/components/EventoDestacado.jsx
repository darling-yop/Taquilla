export default function EventoDestacado({ textos }) {
  return (
    <article
      className="evento-destacado"
      style={
        textos?.colores
          ? {
              background: `linear-gradient(135deg, ${textos.colores[0]}, ${textos.colores[1]})`,
            }
          : undefined
      }
    >
      <div className="evento-destacado-info">
        <p className="inicio-badge">{textos?.etiqueta}</p>

        <div className="evento-destacado-fila">
          <div>
            <h2 className="evento-destacado-titulo">{textos?.titulo}</h2>
            <p className="evento-destacado-lugar">{textos?.lugar}</p>
            <p className="evento-destacado-precio">{textos?.precio}</p>
          </div>

          <a
            className="inicio-boton"
            href={textos?.slug ? `#evento/${encodeURIComponent(textos.slug)}` : "#explorar"}
          >
            {textos?.boton}
          </a>
        </div>
      </div>
    </article>
  );
}
import "./SelectorIdioma.css";
import type { Idioma } from "../../data/interfaz";

export default function SelectorIdioma({
  idioma,
  onCambiar,
  etiqueta,
  nombres,
}: {
  idioma: Idioma;
  onCambiar: (idioma: Idioma) => void;
  etiqueta: string;
  nombres: Record<Idioma, string>;
}) {
  return (
    <div className="idiomas-home" role="group" aria-label={etiqueta}>
      {(["es", "en"] as const).map((valor) => (
        <button
          type="button"
          key={valor}
          lang={valor}
          aria-pressed={idioma === valor}
          onClick={() => onCambiar(valor)}
        >
          {nombres[valor]}
        </button>
      ))}
    </div>
  );
}

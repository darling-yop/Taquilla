import "./SelectorIdioma.css";
import type { Idioma, TextosInterfaz } from "../../data/interfaz";

export default function SelectorIdioma({
  idioma,
  onChangeLanguage,
  textos,
}: {
  idioma: Idioma;
  onChangeLanguage: (idioma: Idioma) => void;
  textos: TextosInterfaz;
}) {
  return (
    <div className="idiomas-home" role="group" aria-label={textos.headerIdioma}>
      {(["es", "en"] as const).map((valor) => (
        <button
          type="button"
          key={valor}
          lang={valor}
          aria-label={
            valor === "es" ? textos.ariaIdiomaEs : textos.ariaIdiomaEn
          }
          aria-pressed={idioma === valor}
          onClick={() => onChangeLanguage(valor)}
        >
          {valor.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

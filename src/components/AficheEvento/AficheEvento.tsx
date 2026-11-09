import "./AficheEvento.css";
import type { CSSProperties } from "react";

type AficheStyle = CSSProperties & {
  [variable: `--${string}`]: string | undefined;
};

export default function AficheEvento({
  variante = 0,
  className = "",
  color1,
  color2,
}: {
  variante?: number;
  className?: string;
  color1?: string;
  color2?: string;
}) {
  const estilo: AficheStyle = {
    ...(color1 ? { "--afiche-color-1": color1 } : {}),
    ...(color2 ? { "--afiche-color-2": color2 } : {}),
  };
  return (
    <div
      className={`arte-evento arte-evento-${variante} ${className}`}
      aria-hidden="true"
      style={estilo}
    />
  );
}

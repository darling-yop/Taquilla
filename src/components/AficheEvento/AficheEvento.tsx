import "./AficheEvento.css";
export default function AficheEvento({
  variante = 0,
  className = "",
}: {
  variante?: number;
  className?: string;
}) {
  return (
    <div
      className={`arte-evento arte-evento-${variante} ${className}`}
      aria-hidden="true"
    />
  );
}

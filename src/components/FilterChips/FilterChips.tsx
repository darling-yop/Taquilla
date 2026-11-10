import "./FilterChips.css";
import Button from "../Button/Button";

export interface ActiveFilter {
  id: string;
  label: string;
  onRemove: () => void;
}

export default function FilterChips({
  filters,
  removeLabel,
  ariaLabel,
}: {
  filters: ActiveFilter[];
  removeLabel: string;
  ariaLabel: string;
}) {
  return (
    <div className="filter-chips" role="group" aria-label={ariaLabel}>
      {filters.map((filter) => (
        <span className="filter-chip" key={filter.id}>
          {filter.label}
          <Button
            variant="icon"
            type="button"
            className="filter-chip-remove"
            aria-label={`${removeLabel}: ${filter.label}`}
            onClick={filter.onRemove}
          >
            <span aria-hidden="true">×</span>
          </Button>
        </span>
      ))}
    </div>
  );
}

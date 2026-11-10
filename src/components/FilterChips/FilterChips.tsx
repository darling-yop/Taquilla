import "./FilterChips.css";

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
          <button
            type="button"
            aria-label={`${removeLabel}: ${filter.label}`}
            onClick={filter.onRemove}
          >
            <span aria-hidden="true">×</span>
          </button>
        </span>
      ))}
    </div>
  );
}

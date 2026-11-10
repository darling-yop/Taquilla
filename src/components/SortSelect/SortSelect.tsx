import "./SortSelect.css";

export type EventSort = "fecha" | "precio" | "precio-desc";

export default function SortSelect({
  value,
  label,
  options,
  onChange,
}: {
  value: EventSort;
  label: string;
  options: { value: EventSort; label: string }[];
  onChange: (value: EventSort) => void;
}) {
  return (
    <label className="sort-select">
      <span>{label}</span>
      <select
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value as EventSort)}
      >
        {options.map((option) => (
          <option value={option.value} key={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

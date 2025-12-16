import "./TypeToggle.css";

type ToggleOption<T extends string> = {
  value: T;
  label: string;
};

type TypeToggleProps<T extends string> = {
  value: T;
  options: ToggleOption<T>[];
  onChange: (next: T) => void;
  disabled?: boolean;
};

export function TypeToggle<T extends string>({
  value,
  options,
  onChange,
  disabled = false,
}: TypeToggleProps<T>) {
  return (
    <div className={`toggle-group ${disabled ? "is-disabled" : ""}`}>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className={value === opt.value ? "active" : ""}
          onClick={() => onChange(opt.value)} // no swapping the unit yet, just have the ability to update the kind according to provided options
          disabled={disabled}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

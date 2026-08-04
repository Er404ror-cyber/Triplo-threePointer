import type { LucideIcon } from "lucide-react";

interface Option {
  label: string;
  value: string;
}

interface SelectFieldProps {
  label: string;
  icon?: LucideIcon;
  value: string;
  onChange: (value: string) => void;
  options: (string | Option)[];
  placeholder?: string;
  required?: boolean;
}

export default function SelectField({
  label,
  icon: Icon,
  value,
  onChange,
  options,
  placeholder,
  required = false,
}: SelectFieldProps) {
  const normalized: Option[] = options.map((opt) =>
    typeof opt === "string" ? { label: opt, value: opt } : opt
  );

  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <div className="relative">
        {Icon && (
          <Icon
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
        )}

        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className={`w-full rounded-xl border border-slate-200 py-3 pr-4 outline-none focus:border-blue-500 ${
            Icon ? "pl-12" : "px-4"
          }`}
        >
          {placeholder && <option value="">{placeholder}</option>}

          {normalized.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

import type { LucideIcon } from "lucide-react";

interface Option {
  label: string;
  value: string;
}

interface CompactSelectFieldProps {
  label: string;
  icon?: LucideIcon;
  value: string;
  onChange: (value: string) => void;
  options: (string | Option)[];
  placeholder?: string;
  required?: boolean;
}

export default function CompactSelectField({
  label,
  icon: Icon,
  value,
  onChange,
  options,
  placeholder,
  required = false,
}: CompactSelectFieldProps) {
  const normalized: Option[] = options.map((opt) =>
    typeof opt === "string" ? { label: opt, value: opt } : opt
  );

  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-slate-600">
        {label}
      </label>

      <div className="relative">
        {Icon && (
          <Icon
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
        )}

        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className={`w-full rounded-xl border border-slate-200 py-2.5 pr-3 text-sm text-slate-700 outline-none focus:border-blue-400 ${
            Icon ? "pl-9" : "px-3"
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

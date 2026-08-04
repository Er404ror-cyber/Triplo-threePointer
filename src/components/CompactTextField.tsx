import type { LucideIcon } from "lucide-react";

interface CompactTextFieldProps {
  label: string;
  icon?: LucideIcon;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "number" | "date";
  placeholder?: string;
  min?: string;
  required?: boolean;
}

export default function CompactTextField({
  label,
  icon: Icon,
  value,
  onChange,
  type = "text",
  placeholder,
  min,
  required = false,
}: CompactTextFieldProps) {
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

        <input
          type={type}
          min={min}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className={`w-full rounded-xl border border-slate-200 py-2.5 pr-3 text-sm text-slate-700 outline-none focus:border-blue-400 ${
            Icon ? "pl-9" : "px-3"
          }`}
        />
      </div>
    </div>
  );
}

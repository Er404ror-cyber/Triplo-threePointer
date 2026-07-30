import type { LucideIcon } from "lucide-react";
interface TextFieldProps {
  label: string;
  icon: LucideIcon;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  showCounter?: boolean;
  required?: boolean;
  inputMode?: "text" | "numeric";
  numericOnly?: boolean;
}

export default function TextField({
  label,
  icon: Icon,
  value,
  onChange,
  placeholder,
  maxLength,
  showCounter = false,
  required = false,
  inputMode = "text",
  numericOnly = false,
}: TextFieldProps) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="block text-sm font-semibold text-slate-700">
          {label}
        </label>

        {showCounter && maxLength && (
          <span className="text-xs text-slate-400">
            {value.length}/{maxLength}
          </span>
        )}
      </div>

      <div className="relative">
        <Icon
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          size={18}
        />

        <input
          type="text"
          inputMode={inputMode}
          value={value}
          onChange={(e) =>
            onChange(numericOnly ? e.target.value.replace(/\D/g, "") : e.target.value)
          }
          maxLength={maxLength}
          placeholder={placeholder}
          className="w-full rounded-xl border border-slate-200 py-3 pl-12 pr-4 outline-none transition focus:border-blue-500"
          required={required}
        />
      </div>
    </div>
  );
}

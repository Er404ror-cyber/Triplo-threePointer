import type { LucideIcon } from "lucide-react";

interface TextFieldProps {
  label: string;
  icon?: LucideIcon;
  value?: string;
  onChange?: (val: string) => void; // 💡 Tornado opcional para evitar quebras
  placeholder?: string;
  maxLength?: number;
  showCounter?: boolean;
  required?: boolean;
  inputMode?: "text" | "numeric" | "decimal";
  numericOnly?: boolean;
}

export default function TextField({
  label,
  icon: Icon,
  value = "",
  onChange,
  placeholder,
  maxLength,
  showCounter,
  required,
  inputMode,
  numericOnly = false,
}: TextFieldProps) {
  const currentLength = (value ?? "").length;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let nextValue = e.target.value;
    if (numericOnly) {
      nextValue = nextValue.replace(/\D/g, "");
    }
    // 💡 Só chama se onChange existir como função
    if (typeof onChange === "function") {
      onChange(nextValue);
    }
  };

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-semibold text-slate-700">{label}</label>
      <div className="relative flex items-center">
        {Icon && <Icon className="absolute left-3 text-slate-400" size={18} />}
        <input
          type="text"
          value={value ?? ""}
          onChange={handleChange}
          placeholder={placeholder}
          maxLength={maxLength}
          required={required}
          inputMode={inputMode}
          className={`w-full rounded-xl border border-slate-200 py-2.5 pr-4 text-sm text-slate-900 transition focus:border-blue-500 focus:outline-none ${
            Icon ? "pl-10" : "pl-4"
          }`}
        />
      </div>
      {showCounter && maxLength && (
        <span className="text-xs text-slate-400">
          {currentLength}/{maxLength}
        </span>
      )}
    </div>
  );
}
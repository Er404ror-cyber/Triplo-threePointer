import type { LucideIcon } from "lucide-react";

interface TextAreaFieldProps {
  label: string;
  icon?: LucideIcon;
  value?: string;
  onChange?: (val: string) => void; // 💡 Tornado opcional
  placeholder?: string;
  maxLength?: number;
  rows?: number;
  required?: boolean;
}

export default function TextAreaField({
  label,
  icon: Icon,
  value = "",
  onChange,
  placeholder,
  maxLength,
  rows = 4,
  required,
}: TextAreaFieldProps) {
  const currentLength = (value ?? "").length;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (typeof onChange === "function") {
      onChange(e.target.value);
    }
  };

  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
        {Icon && <Icon size={16} className="text-slate-400" />}
        {label}
      </label>

      <textarea
        value={value ?? ""}
        onChange={handleChange}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={rows}
        required={required}
        className="w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-900 transition focus:border-blue-500 focus:outline-none resize-none"
      />

      {maxLength && (
        <div className="flex justify-end">
          <span className="text-xs text-slate-400">
            {currentLength}/{maxLength}
          </span>
        </div>
      )}
    </div>
  );
}
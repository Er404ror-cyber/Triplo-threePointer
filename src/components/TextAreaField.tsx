import type { LucideIcon } from "lucide-react";
interface TextAreaFieldProps {
  label: string;
  icon: LucideIcon;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  rows?: number;
}

export default function TextAreaField({
  label,
  icon: Icon,
  value,
  onChange,
  placeholder,
  maxLength,
  rows = 6,
}: TextAreaFieldProps) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="block text-sm font-semibold text-slate-700">
          {label}
        </label>

        {maxLength && (
          <span className="text-xs text-slate-400">
            {value.length}/{maxLength}
          </span>
        )}
      </div>

      <div className="relative">
        <Icon className="absolute left-4 top-4 text-slate-400" size={18} />

        <textarea
          rows={rows}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={maxLength}
          placeholder={placeholder}
          className="w-full resize-none rounded-xl border border-slate-200 py-3 pl-12 pr-4 outline-none transition focus:border-blue-500"
        />
      </div>
    </div>
  );
}

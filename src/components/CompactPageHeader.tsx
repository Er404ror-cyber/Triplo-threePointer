import { Link } from "react-router-dom";
import { ChevronLeft, type LucideIcon } from "lucide-react";
interface CompactPageHeaderProps {
  title: string;
  subtitle: string;
  backTo: string;
  backLabel?: string;
  icon: LucideIcon;
}

export default function CompactPageHeader({
  title,
  subtitle,
  backTo,
  backLabel = "Voltar ao dashboard",
  icon: Icon,
}: CompactPageHeaderProps) {
  return (
    <>
      <Link
        to={backTo}
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700"
      >
        <ChevronLeft size={16} />
        {backLabel}
      </Link>

      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
          <Icon size={20} className="text-blue-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">{title}</h1>
          <p className="text-sm text-slate-400">{subtitle}</p>
        </div>
      </div>
    </>
  );
}

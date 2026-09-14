import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { QUICK_ACTIONS } from '../../data/📄 dashboardData';

export function QuickActions() {
  return (
    <div>
      <p className="mb-3 text-sm font-semibold text-slate-700">Ações rápidas</p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {QUICK_ACTIONS.map((action) => (
          <div key={action.title} className="group rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-sm">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 transition-colors group-hover:bg-orange-500">
              <action.icon size={18} className="text-orange-600 transition-colors group-hover:text-white" />
            </div>
            <p className="mb-1 text-sm font-semibold text-slate-900">{action.title}</p>
            <p className="mb-4 text-xs leading-relaxed text-slate-400">{action.description}</p>
            <Link to={action.path} className="inline-flex items-center gap-1.5 rounded-full bg-orange-500 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-orange-600">
              <Plus size={13} />
              {action.buttonText}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
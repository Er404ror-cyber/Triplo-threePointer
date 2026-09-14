import { Activity } from 'lucide-react';
import { RECENT_ACTIVITY } from '../../data/📄 dashboardData';

export function RecentActivityList() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity size={15} className="text-slate-400" />
          <p className="text-sm font-semibold text-slate-700">Atividade recente</p>
        </div>
        <button className="text-xs font-medium text-orange-600 hover:text-orange-700">Ver tudo</button>
      </div>

      <div className="space-y-4">
        {RECENT_ACTIVITY.map((item, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100">
              <item.icon size={14} className="text-slate-500" />
            </div>
            <div>
              <p className="text-xs font-medium leading-snug text-slate-700">{item.title}</p>
              <p className="mt-0.5 text-[11px] text-slate-400">{item.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
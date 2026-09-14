import { TrendingUp, TrendingDown } from 'lucide-react';
import { STAT_CARDS } from '../../data/📄 dashboardData';

export function StatCardsList() {
  return (
    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
      {STAT_CARDS.map((card) => (
        <div key={card.label} className={`rounded-2xl border p-4 transition-shadow hover:shadow-sm ${card.highlighted ? 'border-orange-500 bg-orange-50' : 'border-slate-200 bg-white'}`}>
          <div className="mb-3 flex items-center justify-between">
            <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${card.highlighted ? 'bg-orange-500' : 'bg-slate-100'}`}>
              <card.icon size={16} className={card.highlighted ? 'text-white' : 'text-slate-500'} />
            </div>
            {card.trend && (
              <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${card.trendUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                {card.trendUp ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                {card.trend}
              </span>
            )}
          </div>
          <p className="text-2xl font-bold text-slate-900">{card.value}</p>
          <p className="text-xs text-slate-400">{card.label}</p>
        </div>
      ))}
    </div>
  );
}
import { Flame } from 'lucide-react';
import { TOP_SCORERS } from '../../data/📄 dashboardData';

export function TopScorers() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flame size={15} className="text-orange-500" />
          <p className="text-sm font-semibold text-slate-700">Melhores marcadores</p>
        </div>
        <button className="text-xs font-medium text-orange-600 hover:text-orange-700">Ver todos</button>
      </div>

      <div className="space-y-3">
        {TOP_SCORERS.map((player, i) => (
          <div key={player.name} className="flex items-center gap-3">
            <span className="w-4 text-xs font-bold text-slate-300">{i + 1}</span>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
              {player.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-slate-800">{player.name}</p>
              <p className="truncate text-[11px] text-slate-400">{player.team}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-slate-900">{player.points}</p>
              <p className="text-[10px] text-slate-400">pts/jogo</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
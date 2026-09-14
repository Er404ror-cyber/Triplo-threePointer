import { CalendarDays, Plus, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { UPCOMING_GAMES } from '../../data/📄 dashboardData';

export function UpcomingGames() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarDays size={15} className="text-slate-400" />
          <p className="text-sm font-semibold text-slate-700">Próximos jogos</p>
        </div>
        <Link to="/admin/newpartida" className="flex items-center gap-1 text-xs font-medium text-orange-600 hover:text-orange-700">
          Agendar jogo
          <Plus size={13} />
        </Link>
      </div>

      <div className="space-y-3">
        {UPCOMING_GAMES.map((game, i) => (
          <div key={i} className="flex flex-col gap-3 rounded-xl border border-slate-100 p-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-[10px] font-bold text-white" style={{ backgroundColor: game.homeColor }}>
                  {game.homeInitials}
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-[10px] font-bold text-white" style={{ backgroundColor: game.awayColor }}>
                  {game.awayInitials}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-800">
                  {game.home} <span className="font-normal text-slate-400">vs</span> {game.away}
                </p>
                <p className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-400">
                  <MapPin size={10} />
                  {game.venue}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 self-start rounded-full bg-slate-50 px-3 py-1.5 text-[11px] font-semibold text-slate-600 sm:self-center">
              {game.date} · {game.time}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
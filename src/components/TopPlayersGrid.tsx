import type { Player } from '../data/playersData';

interface TopPlayersGridProps {
  players: Player[];
}

export function TopPlayersGrid({ players }: TopPlayersGridProps) {
  const top5 = players.slice(0, 5);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
      {top5.map((player) => (
        <div
          key={player.id}
          className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md"
        >
          {/* FOTO DO JOGADOR */}
          <div className="relative h-48 w-full bg-slate-100">
            {player.avatarUrl || player.photo ? (
              <img
                src={player.avatarUrl || player.photo}
                alt={player.name}
                className="h-full w-full object-cover object-top"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-slate-200 text-xl font-bold text-slate-400">
                {player.name.substring(0, 2).toUpperCase()}
              </div>
            )}
            
            {/* BADGE DE STATUS DE ATIVIDADE */}
            <span
              className={`absolute top-3 right-3 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                player.active
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {player.active ? 'Ativo' : 'Inativo'}
            </span>
          </div>

          {/* DETALHES DO JOGADOR */}
          <div className="flex flex-1 flex-col p-4 text-xs">
            <h3 className="text-base font-bold text-slate-900 truncate" title={player.name}>
              {player.name}
            </h3>

            <div className="mt-3 space-y-1.5 text-slate-600">
              <p className="flex justify-between">
                <span className="font-medium text-slate-400">Equipa:</span>
                <span className="font-semibold text-slate-800">{player.team}</span>
              </p>
              <p className="flex justify-between">
                <span className="font-medium text-slate-400">Divisão:</span>
                <span className="font-semibold text-slate-800">{player.division || 'N/D'}</span>
              </p>
              <p className="flex justify-between">
                <span className="font-medium text-slate-400">Província:</span>
                <span className="font-semibold text-slate-800">{player.province || 'N/D'}</span>
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
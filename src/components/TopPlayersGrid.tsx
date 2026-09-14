import { Shield, Star, ChevronUp, ChevronDown } from 'lucide-react';

export interface Player {
  id: string | number;
  name: string;
  team: string;
  active: boolean;
  is_top_5?: boolean;
  top_5_order?: number | null;
  position?: string;
  height?: string;
  age?: number;
  initials?: string;
  photo?: string;
  division?: string;
  divisao?: string;
  categoria?: string;
  category?: string;
}

interface TopPlayersGridProps {
  players: Player[];
  onViewPlayer?: (id: string | number) => void;
  onMoveTop5?: (playerId: string | number, direction: 'up' | 'down') => void;
}

const getInitials = (name: string) => {
  if (!name) return '??';
  const nomes = name.trim().split(' ');
  if (nomes.length >= 2) {
    return (nomes[0][0] + nomes[nomes.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

export function TopPlayersGrid({ players, onViewPlayer, onMoveTop5 }: TopPlayersGridProps) {
  // Índices dentro do subconjunto Top 5, para saber quem é o primeiro/último
  const top5Ids = players.filter((p) => p.is_top_5 === true).map((p) => p.id);

  return (
    <div className="flex flex-col gap-2.5 sm:grid sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
      {players.map((player) => {
        const isTop5 = player.is_top_5 === true;

        let rawCategory =
          player.division ||
          player.divisao ||
          player.categoria ||
          player.category ||
          'Sénior';

        const provinciasProibidas = ['tete', 'maputo', 'sofala', 'manica', 'gaza', 'inhambane', 'zambézia', 'nampula', 'cabo delgado', 'niassa', 'tete'];

        if (provinciasProibidas.includes(rawCategory.toLowerCase().trim())) {
          rawCategory = 'Sénior';
        }

        const playerCategory = rawCategory;

        const top5Index = isTop5 ? top5Ids.indexOf(player.id) : -1;
        const isFirst = top5Index <= 0;
        const isLast = top5Index === top5Ids.length - 1;

        return (
          <div
            key={player.id}
            className={`group relative rounded-2xl border p-3 shadow-sm transition-all hover:-translate-y-1 w-full min-w-0 ${
              isTop5
                ? 'bg-gradient-to-b from-amber-50/80 via-white to-amber-50/30 border-amber-300 shadow-amber-100 hover:border-amber-400 hover:shadow-md'
                : 'bg-white border-slate-200/80 hover:border-blue-300 hover:shadow-md'
            }`}
          >
            {isTop5 && (
              <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-white shadow-sm" title="Destaque Top 5">
                <Star size={11} fill="currentColor" />
              </div>
            )}

            {/* Botões de mover posição (apenas para jogadores do Top 5) */}
            {isTop5 && onMoveTop5 && (
              <div className="absolute left-2 top-2 flex flex-col gap-0.5">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onMoveTop5(player.id, 'up');
                  }}
                  disabled={isFirst}
                  title="Mover para cima"
                  className={`flex h-5 w-5 items-center justify-center rounded-full border shadow-sm transition ${
                    isFirst
                      ? 'border-slate-200 bg-white text-slate-300 cursor-not-allowed'
                      : 'border-amber-300 bg-white text-amber-600 hover:bg-amber-100'
                  }`}
                >
                  <ChevronUp size={12} />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onMoveTop5(player.id, 'down');
                  }}
                  disabled={isLast}
                  title="Mover para baixo"
                  className={`flex h-5 w-5 items-center justify-center rounded-full border shadow-sm transition ${
                    isLast
                      ? 'border-slate-200 bg-white text-slate-300 cursor-not-allowed'
                      : 'border-amber-300 bg-white text-amber-600 hover:bg-amber-100'
                  }`}
                >
                  <ChevronDown size={12} />
                </button>
              </div>
            )}

            <div
              onClick={() => onViewPlayer && onViewPlayer(player.id)}
              className="flex cursor-pointer flex-row items-center gap-3 text-left sm:flex-col sm:items-center sm:text-center sm:gap-0"
            >
              <div className="mb-0 shrink-0 sm:mb-2">
                {player.photo ? (
                  <img src={player.photo} alt={player.name} className="h-10 w-10 rounded-full object-cover" />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-sm font-bold text-slate-700">
                    {getInitials(player.name)}
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1 sm:w-full">
                <h3 className={`text-xs sm:text-sm font-bold transition-colors truncate w-full ${
                  isTop5 ? 'text-amber-900 group-hover:text-amber-600' : 'text-slate-900 group-hover:text-blue-600'
                }`}>
                  {player.name}
                </h3>
                <p className="text-[10px] sm:text-xs font-medium text-slate-400 mt-0.5">
                  {player.position || 'Atleta'}
                </p>

                <div className="mt-2 flex w-full items-center justify-between gap-2 border-t border-slate-100 pt-2 text-[10px] text-slate-500 sm:mt-3 sm:pt-2 sm:text-[11px]">
                  <span className="flex min-w-0 items-center gap-1 truncate font-medium text-slate-700">
                    <Shield size={11} className={isTop5 ? "text-amber-500 shrink-0" : "text-blue-500 shrink-0"} />
                    <span className="truncate">{player.team}</span>
                  </span>

                  <span className="flex shrink-0 items-center font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded-md">
                    {playerCategory}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Calendar, MapPin, Star } from 'lucide-react';
import type { Team } from '../types/useTeamForm';

interface TopTeamsGridProps {
  teams: Team[];
  onToggleTop5: (e: React.MouseEvent, teamId: string | number, isCurrentlyTop5: boolean) => void;
}

export function TopTeamsGrid({ teams, onToggleTop5 }: TopTeamsGridProps) {
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const handleImageError = (id: string) => {
    setFailedImages((prev) => ({ ...prev, [id]: true }));
  };

  

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {teams.map((team, idx) => {
        const imageUrl = team.logo;
        const hasImageFailed = failedImages[team.id];

        return (
          <Link
            key={team.id}
            to={`/admin/equipas/${team.id}`}
            state={{ team }}
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md hover:border-blue-300 cursor-pointer"
          >
            <div
              className="relative h-24 w-full px-4 pt-3 flex justify-between items-start"
              style={{ backgroundColor: team.color }}
            >
              <span className="rounded-full bg-black/25 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-sm shadow-sm">
                #{idx + 1} Destaque
              </span>
              <span className="rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">
                {team.division}
              </span>
            </div>

            <div className="px-5 -mt-10 flex justify-between items-end">
              <div className="relative h-20 w-20 overflow-hidden rounded-2xl border-4 border-white bg-slate-100 shadow-md shrink-0">
                {imageUrl && !hasImageFailed ? (
                  <img
                    src={imageUrl}
                    alt={team.name}
                    onError={() => handleImageError(team.id)}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div
                    className="flex h-full w-full items-center justify-center font-black text-lg text-white"
                    style={{ backgroundColor: team.color }}
                  >
                    {team.initials}
                  </div>
                )}
              </div>

              {team.founded && (
                <span className="flex items-center gap-1 text-[11px] font-medium text-slate-400 pb-1">
                  <Calendar size={13} />
                  Fundado {team.founded}
                </span>
              )}
            </div>

            <div className="p-5 pt-3 flex flex-1 flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {team.name}
                </h3>

                <p className="mt-1 flex items-center gap-1 text-xs text-slate-500 font-medium">
                  <MapPin size={13} />
                  {team.city}
                </p>
              </div>

              {/* RODAPÉ — ESTRELA NO LUGAR DAS INICIAIS */}
              <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                  <Users size={14} className="text-slate-400" />
                  {team.players ? `${team.players} Jogadores` : 'Sem dados'}
                </span>

                <button
                  onClick={(e) => onToggleTop5(e, team.id, !!team.is_top_5)}
                  className="p-1.5 rounded-full bg-amber-100 text-amber-500 hover:bg-amber-200 transition-colors"
                  title="Remover do Destaque"
                >
                  <Star size={16} className="fill-current" />
                </button>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
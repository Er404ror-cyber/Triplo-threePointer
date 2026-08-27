import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Calendar, MapPin } from 'lucide-react';
import type { Team } from '../pages/TeamManagement';

interface TopTeamsGridProps {
  teams: Team[];
}

export function TopTeamsGrid({ teams }: TopTeamsGridProps) {
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
            state={{ team }} /* 💡 AQUI: Passamos os dados completos da equipa na navegação */
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md hover:border-blue-300 cursor-pointer"
          >
            {/* FAIXA COLORIDA SUPERIOR */}
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

            {/* ESCUDO / LOGO DA EQUIPA */}
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

            {/* DETALHES DA EQUIPA */}
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

              {/* RODAPÉ */}
              <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                  <Users size={14} className="text-slate-400" />
                  {team.players ? `${team.players} Jogadores` : 'Sem dados'}
                </span>

                <span
                  className="rounded-md bg-slate-50 px-2.5 py-1 font-black text-xs uppercase tracking-wider border border-slate-100"
                  style={{ color: team.color }}
                >
                  {team.initials}
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
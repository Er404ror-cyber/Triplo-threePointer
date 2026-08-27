import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Users, Shield } from 'lucide-react';
import type { Team } from '../pages/TeamManagement';

interface AllTeamsSectionProps {
  teams: Team[];
  searchValue: string;
  onSearchChange: (value: string) => void;
}

export function AllTeamsSection({
  teams,
  searchValue,
  onSearchChange,
}: AllTeamsSectionProps) {
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const handleImageError = (id: string) => {
    setFailedImages((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="space-y-4">
      {/* BARRA DE PESQUISA */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-bold text-slate-800">Todas as Equipas</h2>

        <div className="relative w-full sm:w-72">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Pesquisar equipa ou província..."
            className="w-full rounded-full border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm text-slate-700 outline-none transition-colors focus:border-blue-500 shadow-sm"
          />
        </div>
      </div>

      {/* ESTADO VAZIO */}
      {teams.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          Nenhuma equipa encontrada{searchValue ? ` para "${searchValue}"` : ''}.
        </div>
      ) : (
        /* GRELHA DE EQUIPAS */
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {teams.map((team) => {
            const teamImage = team.logo;
            const hasFailed = failedImages[team.id];

            return (
              <Link
                key={team.id}
                to={`/admin/equipas/${team.id}`}
                state={{ team }} /* 💡 AQUI TAMBÉM: Passamos os dados completos */
                className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-blue-400 hover:shadow-md cursor-pointer"
              >
                <div>
                  {/* CABEÇALHO DO CARD COM EMBLEMA */}
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 overflow-hidden rounded-full border border-slate-200 bg-slate-100 shrink-0">
                      {teamImage && !hasFailed ? (
                        <img
                          src={teamImage}
                          alt={team.name}
                          onError={() => handleImageError(team.id)}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div
                          className="flex h-full w-full items-center justify-center font-bold text-xs text-white"
                          style={{ backgroundColor: team.color }}
                        >
                          {team.initials}
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h4 className="truncate font-bold text-slate-900 group-hover:text-blue-600 transition-colors" title={team.name}>
                        {team.name}
                      </h4>
                      <p className="flex items-center gap-1 text-xs text-slate-500">
                        <MapPin size={11} />
                        {team.city}
                      </p>
                    </div>
                  </div>

                  {/* DETALHES */}
                  <div className="mt-4 space-y-1.5 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Divisão:</span>
                      <span className="font-semibold text-slate-800">{team.division}</span>
                    </div>
                    {team.founded && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Fundação:</span>
                        <span className="font-medium text-slate-700">{team.founded}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* RODAPÉ */}
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                  <span className="flex items-center gap-1 text-slate-500">
                    <Users size={12} />
                    {team.players ? `${team.players} Jogadores` : '—'}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                    <Shield size={10} />
                    {team.initials}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
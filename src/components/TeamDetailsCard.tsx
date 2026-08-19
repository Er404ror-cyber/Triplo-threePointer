import React from 'react';
import { MapPin, Calendar, Users, Layers } from 'lucide-react';

export interface TeamData {
  id: string;
  name: string;
  initials: string;
  color: string;
  city: string;
  division: string;
  description?: string;
  founded?: number | string; // 👈 Atualizado para aceitar number e string
  players?: number | string;
}

interface TeamDetailsCardProps {
  team: TeamData;
}

export const TeamDetailsCard: React.FC<TeamDetailsCardProps> = ({ team }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
      {/* Cabeçalho da equipa */}
      <div className="mb-8 flex items-center gap-4">
        <div
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white"
          style={{ backgroundColor: team.color }}
        >
          {team.initials}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{team.name}</h1>
          <p className="text-sm text-slate-400">{team.division}</p>
        </div>
      </div>

      {/* Descrição */}
      {team.description && (
        <p className="mb-8 text-sm leading-relaxed text-slate-600">
          {team.description}
        </p>
      )}

      {/* Grid de informações */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 p-4">
          <div className="mb-2 flex items-center gap-2 text-slate-400">
            <MapPin size={14} />
            <p className="text-xs font-semibold uppercase tracking-wide">Cidade</p>
          </div>
          <p className="text-sm font-semibold text-slate-900">{team.city}</p>
        </div>

        <div className="rounded-xl border border-slate-200 p-4">
          <div className="mb-2 flex items-center gap-2 text-slate-400">
            <Layers size={14} />
            <p className="text-xs font-semibold uppercase tracking-wide">Divisão</p>
          </div>
          <p className="text-sm font-semibold text-slate-900">{team.division}</p>
        </div>

        {team.founded !== undefined && (
          <div className="rounded-xl border border-slate-200 p-4">
            <div className="mb-2 flex items-center gap-2 text-slate-400">
              <Calendar size={14} />
              <p className="text-xs font-semibold uppercase tracking-wide">Fundação</p>
            </div>
            <p className="text-sm font-semibold text-slate-900">{team.founded}</p>
          </div>
        )}

        {team.players !== undefined && (
          <div className="rounded-xl border border-slate-200 p-4">
            <div className="mb-2 flex items-center gap-2 text-slate-400">
              <Users size={14} />
              <p className="text-xs font-semibold uppercase tracking-wide">Jogadores</p>
            </div>
            <p className="text-sm font-semibold text-slate-900">{team.players}</p>
          </div>
        )}
      </div>
    </div>
  );
};
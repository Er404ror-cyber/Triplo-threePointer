import { Link, useParams } from 'react-router-dom';
import { ChevronLeft, MapPin, Calendar, Users, Layers } from 'lucide-react';
import { ALL_TEAMS } from './t_equipas';

export default function T_Details() {
  const { id } = useParams<{ id: string }>();
  const team = ALL_TEAMS.find((t) => t.id === id);

  if (!team) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
        <div className="text-center">
          <p className="mb-4 text-sm text-slate-500">Equipa não encontrada.</p>
          <Link to="/admin/equipas" className="text-sm font-medium text-blue-600 hover:text-blue-700">
            Voltar à lista de equipas
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-4 font-sans text-slate-900 md:p-8">
      <div className="mx-auto max-w-4xl">

        <Link
          to="/admin/equipas"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700"
        >
          <ChevronLeft size={16} />
          Voltar às equipas
        </Link>

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
            <p className="mb-8 text-sm leading-relaxed text-slate-600">{team.description}</p>
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

            {team.founded && (
              <div className="rounded-xl border border-slate-200 p-4">
                <div className="mb-2 flex items-center gap-2 text-slate-400">
                  <Calendar size={14} />
                  <p className="text-xs font-semibold uppercase tracking-wide">Fundação</p>
                </div>
                <p className="text-sm font-semibold text-slate-900">{team.founded}</p>
              </div>
            )}

            {team.players && (
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
      </div>
    </div>
  );
}
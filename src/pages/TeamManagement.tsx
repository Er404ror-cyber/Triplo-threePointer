import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Shield, Trophy } from 'lucide-react';
import { TOP_TEAMS, ALL_TEAMS } from './t_equipas';
import { TopTeamsGrid } from '../components/TopTeamsGrid';
import { AllTeamsSection } from '../components/AllTeamsSection';

function normalizeText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

const QUICK_ACTIONS = [
  {
    icon: Shield,
    title: 'Adicionar nova equipa',
    description: 'Cadastre um novo clube ou seleção na base de dados.',
    path: '/admin/newtime',
    buttonText: 'Adicionar equipa',
  },
];

export default function TeamManagement() {
  const [search, setSearch] = useState('');

  const filteredTeams = useMemo(() => {
    const normalizedSearch = normalizeText(search);
    if (!normalizedSearch) return ALL_TEAMS;
    return ALL_TEAMS.filter(
      (team) =>
        normalizeText(team.name).includes(normalizedSearch) ||
        normalizeText(team.city).includes(normalizedSearch) ||
        normalizeText(team.division).includes(normalizedSearch) ||
        normalizeText(team.initials).includes(normalizedSearch)
    );
  }, [search]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 font-sans text-slate-900 sm:p-6 md:p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* HEADER DA PÁGINA */}
        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-blue-600">
              <Trophy size={20} />
              <span className="text-xs font-bold uppercase tracking-wider">Campeonato BasquetMZ</span>
            </div>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900">
              Gestão de Equipas
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Acompanhe os clubes, divisões e o plantel de cada equipa.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            {QUICK_ACTIONS.map((action) => (
              <Link
                key={action.title}
                to={action.path}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
              >
                <Plus size={15} />
                {action.buttonText}
              </Link>
            ))}
          </div>
        </div>

        {/* TOP 5 EQUIPAS */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800">Equipas em Destaque</h2>
            <span className="text-xs text-slate-500">Top 5 da Época</span>
          </div>
          <TopTeamsGrid teams={TOP_TEAMS} />
        </section>

        {/* PESQUISA E LISTA DE TODAS AS EQUIPAS */}
        <section>
          <AllTeamsSection
            teams={filteredTeams}
            searchValue={search}
            onSearchChange={setSearch}
          />
        </section>
      </div>
    </div>
  );
}
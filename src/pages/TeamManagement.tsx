import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Plus, Shield, Trophy, Loader2, AlertCircle } from 'lucide-react'; // 💡 Importei o AlertCircle
import { supabase } from '../lib/supabaseClient';
import type { Team } from '../types/useTeamForm';
import { TopTeamsGrid } from '../components/TopTeamsGrid';
import { AllTeamsSection } from '../components/AllTeamsSection';

function normalizeText(text: string): string {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

export default function TeamManagement() {
  const [search, setSearch] = useState('');

  const { data: teams = [], isLoading, isError, error } = useQuery({
    queryKey: ['teams'],
    queryFn: async () => {
      // 👇 CORREÇÃO AQUI: Adicionado o .select('*') antes do .order
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .order('name');
        
      if (error) throw new Error(error.message, { cause: error });
      
      return data.map((t) => ({
        id: t.id,
        name: t.name,
        city: t.province,
        division: t.division,
        founded: t.founded?.toString() || '',
        description: t.description || '',
        color: t.header_color || '#2563eb',
        logo: t.crest_url,
        initials: t.name.substring(0, 3).toUpperCase(),
        players: 0,
      })) as Team[];
    },
    staleTime: 1000 * 60 * 10, 
    refetchOnWindowFocus: false,
  });

  const filteredTeams = useMemo(() => {
    const normSearch = normalizeText(search);
    if (!normSearch) return teams;
    return teams.filter(
      (team) =>
        normalizeText(team.name).includes(normSearch) ||
        normalizeText(team.city).includes(normSearch) ||
        normalizeText(team.division).includes(normSearch) ||
        normalizeText(team.initials).includes(normSearch)
    );
  }, [search, teams]);

  // 💡 Mostra loading
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // 💡 MOSTRA O ERRO SE ALGO FALHAR
  if (isError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <AlertCircle className="mb-4 h-12 w-12 text-red-500" />
        <h2 className="text-lg font-bold text-slate-900">Erro ao carregar equipas</h2>
        <p className="mt-2 text-sm text-slate-500">{(error as Error).message}</p>
      </div>
    );
  }

  const displayTopTeams = teams.slice(0, 5);

  return (
    <div className="min-h-screen bg-slate-50 p-4 font-sans text-slate-900 sm:p-6 md:p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-blue-600">
              <Trophy size={20} />
              <span className="text-xs font-bold uppercase tracking-wider">Campeonato BasquetMZ</span>
            </div>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900">Gestão de Equipas</h1>
          </div>
          <Link to="/admin/newtime" className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-blue-700">
            <Plus size={15} /> Adicionar equipa
          </Link>
        </div>

        {displayTopTeams.length > 0 && (
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800">Equipas em Destaque</h2>
            </div>
            <TopTeamsGrid teams={displayTopTeams} />
          </section>
        )}

        <section>
          <AllTeamsSection teams={filteredTeams} searchValue={search} onSearchChange={setSearch} />
        </section>
      </div>
    </div>
  );
}
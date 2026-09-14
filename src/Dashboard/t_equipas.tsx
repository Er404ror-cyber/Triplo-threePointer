import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient'; 
import { Search, MapPin, Calendar, Users, Plus, X, Shield } from 'lucide-react';

export interface Team {
  id: string | number;
  name: string;
  division?: string;
  city?: string;
  province?: string;
  founded?: string | number;
  fundacao?: string | number;
  logo?: string;
  playersCount?: number; // Propriedade nova que vai guardar o número real de jogadores
}

function normalizeText(text: string): string {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

export default function Equipas() {
  const [search, setSearch] = useState('');

  // A MÁGICA ACONTECE AQUI: Busca as equipas e conta os jogadores conectados na base de dados
  const { data: teams = [], isLoading, error } = useQuery({
    queryKey: ['teams-list-full'],
    queryFn: async () => {
      // 1. Puxa todas as equipas
      const { data: teamsData, error: teamsError } = await supabase
        .from('teams')
        .select('*')
        .order('name');
      
      if (teamsError) throw new Error(teamsError.message);

      // 2. Puxa as referências da tabela de jogadores para os podermos contar
      const { data: playersData, error: playersError } = await supabase
        .from('players')
        .select('id, team_id, teamId, team');
      
      if (playersError) throw new Error(playersError.message);

      // 3. Associa a contagem a cada equipa correspondente
      return (teamsData || []).map((team) => {
        const playerCount = (playersData || []).filter(p => {
          const pTeamId = p.team_id || p.teamId || p.team;
          return String(pTeamId) === String(team.id);
        }).length;

        return {
          ...team,
          playersCount: playerCount // Guardamos o número exato aqui
        } as Team;
      });
    }
  });

  const filteredTeams = useMemo(() => {
    const normalizedSearch = normalizeText(search);
    if (!normalizedSearch) return teams;

    return teams.filter((team) => (
      normalizeText(team.name).includes(normalizedSearch) ||
      normalizeText(team.city || team.province || '').includes(normalizedSearch) ||
      normalizeText(team.division || '').includes(normalizedSearch)
    ));
  }, [teams, search]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50/60">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50/60 p-4">
        <div className="rounded-xl bg-rose-50 p-6 text-center text-rose-600">
          <p className="font-bold">Erro ao carregar equipas</p>
          <p className="text-sm">Verifique a sua ligação ou a consola para mais detalhes.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/60 p-4 font-sans text-slate-900 sm:p-6 md:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Equipas</h1>
            <p className="text-xs text-slate-500 mt-1">Consulte e administre os clubes e plantéis.</p>
          </div>
          <Link 
            to="/admin/newteam" 
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-95"
          >
            <Plus size={15} /> Adicionar Equipa
          </Link>
        </header>

        <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
          <h2 className="text-base font-bold text-slate-900">Todas as Equipas ({filteredTeams.length})</h2>
          
          <div className="relative w-full sm:w-80">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              placeholder="Pesquisar equipa ou província..." 
              className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-8 text-xs text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100" 
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X size={13} />
              </button>
            )}
          </div>
        </div>

        {filteredTeams.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTeams.map((team, index) => {
              const isOrange = index % 4 === 0 || index % 4 === 3;
              const bannerColor = isOrange ? 'bg-amber-500' : 'bg-blue-600';
              const badgeColor = isOrange ? 'bg-amber-600' : 'bg-blue-700';
              const foundedYear = team.founded || team.fundacao;

              return (
                <Link 
                  key={team.id} 
                  to={`/admin/equipas/${team.id}`}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  <div className={`h-24 ${bannerColor} p-4 flex justify-between items-start text-white`}>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-black/10 px-2 py-1 rounded-md backdrop-blur-sm">
                      #{index + 1} Destaque
                    </span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${badgeColor}`}>
                      {team.division || 'Geral'}
                    </span>
                  </div>

                  <div className="px-5 pb-5 flex-1 flex flex-col relative -mt-10">
                    <div className="mb-3 flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-white border-4 border-white shadow-sm text-blue-600 overflow-hidden">
                      {team.logo ? (
                        <img src={team.logo} alt={team.name} className="h-full w-full object-cover" />
                      ) : (
                        <Shield size={32} />
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {team.name}
                      </h3>
                      
                      <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-slate-500">
                        <MapPin size={14} className="text-slate-400" />
                        <span className="truncate">{team.city || team.province || 'Localização N/A'}</span>
                      </div>
                      
                      {foundedYear && (
                        <div className="mt-1.5 flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
                          <Calendar size={13} />
                          <span>Fundado {foundedYear}</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                      
                      {/* O "Sem dados" FOI REMOVIDO E SUBSTITUÍDO POR ISTO: */}
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Users size={15} />
                        <span className="text-xs font-bold text-slate-700">
                          {team.playersCount === 0 
                            ? 'Plantel vazio' 
                            : `${team.playersCount} ${team.playersCount === 1 ? 'Jogador' : 'Jogadores'}`}
                        </span>
                      </div>

                      <div className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-2 py-1 rounded-md uppercase tracking-widest">
                        {team.name.substring(0, 3)}
                      </div>
                      
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-16 text-center shadow-sm">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <Shield size={24} />
            </div>
            <h3 className="text-sm font-bold text-slate-800">Nenhuma equipa encontrada</h3>
            <p className="mt-1 max-w-sm text-xs text-slate-500">
              Tente procurar por outro nome ou adicione uma nova equipa ao sistema.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
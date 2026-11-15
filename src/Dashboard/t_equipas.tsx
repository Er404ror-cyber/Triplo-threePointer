import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient'; 
import { Search,  Users, Plus, X, Shield, Star } from 'lucide-react';

export interface Team {
  id: string | number;
  name: string;
  division?: string;
  city?: string;
  province?: string;
  founded?: string | number;
  fundacao?: string | number;
  logo?: string;
  playersCount?: number;
  is_top_5?: boolean;
}

function normalizeText(text: string): string {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

export default function Equipas() {
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();

  const { data: teams = [], isLoading, error } = useQuery({
    queryKey: ['teams-list-full'],
    queryFn: async () => {
      const { data: teamsData, error: teamsError } = await supabase
        .from('teams')
        .select('*')
        .order('name');
      
      if (teamsError) throw new Error(teamsError.message);

      const { data: playersData, error: playersError } = await supabase
        .from('players')
        .select('id, team_id, teamId, team');
      
      if (playersError) throw new Error(playersError.message);

      return (teamsData || []).map((team) => {
        const playerCount = (playersData || []).filter(p => {
          const pTeamId = p.team_id || p.teamId || p.team;
          return String(pTeamId) === String(team.id);
        }).length;

        return {
          ...team,
          playersCount: playerCount 
        } as Team;
      });
    }
  });

  const top5Teams = useMemo(() => teams.filter(t => t.is_top_5), [teams]);

  const handleToggleTop5 = async (e: React.MouseEvent, teamId: string | number, isCurrentlyTop5: boolean) => {
    e.preventDefault();

    if (!isCurrentlyTop5 && top5Teams.length >= 5) {
      alert("Já existem 5 equipas no Top 5! Desmarque uma antes de adicionar outra.");
      return;
    }

    const { error } = await supabase
      .from('teams')
      .update({ is_top_5: !isCurrentlyTop5 })
      .eq('id', teamId);

    if (error) {
      console.error("Erro ao atualizar status Top 5:", error);
      alert("Ocorreu um erro ao atualizar a equipa.");
    } else {
      queryClient.invalidateQueries({ queryKey: ['teams-list-full'] });
    }
  };

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
          
          {teams.length >= 20 ? (
            <button 
              onClick={() => alert("Limite atingido! Não é possível criar mais de 20 equipas.")}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-400 px-4 py-2.5 text-xs font-semibold text-white shadow-sm cursor-not-allowed transition-opacity hover:opacity-90"
            >
              <Plus size={15} /> Limite Atingido (20/20)
            </button>
          ) : (
            <Link 
              to="/admin/newteam" 
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-95"
            >
              <Plus size={15} /> Adicionar Equipa
            </Link>
          )}
        </header>

        {/* Secção Top 5 (Opcional, mas útil para ver quem está lá em cima) */}
        {top5Teams.length > 0 && (
            <div className="space-y-4">
                <h2 className="text-lg font-bold text-slate-800">Top 5 Equipas</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                    {top5Teams.map(team => (
                        <div key={`top-${team.id}`} className="bg-white rounded-xl border border-amber-200 p-4 shadow-sm flex items-center gap-3">
                             <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 border border-slate-200 overflow-hidden">
                                {team.logo ? (
                                    <img src={team.logo} alt={team.name} className="h-full w-full object-cover" />
                                ) : (
                                    <Shield size={20} className="text-slate-400" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-bold text-slate-800 truncate">{team.name}</h4>
                                <p className="text-[10px] text-slate-500 truncate">{team.city || team.province || 'Sem local'}</p>
                            </div>
                            <button
                                onClick={(e) => handleToggleTop5(e, team.id, true)}
                                className="text-amber-500 hover:text-amber-600 p-1"
                                title="Remover do Top 5"
                            >
                                <Star size={16} className="fill-current" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        )}

        <div className="flex flex-col gap-2 border-b border-slate-100 bg-emerald-50/40 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <h2 className="text-base font-bold text-slate-900">Todas as Equipas ({filteredTeams.length}/20)</h2>
          
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
              const badgeColor = isOrange ? 'bg-amber-600' : 'bg-blue-700';
              const foundedYear = team.founded || team.fundacao;

              return (
                <Link 
                  key={team.id} 
                  to={`/admin/equipas/${team.id}`}
                  className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md ${team.is_top_5 ? 'border-amber-400' : 'border-slate-200'}`}
                >
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white border border-slate-100 shadow-sm text-blue-600 overflow-hidden">
                        {team.logo ? (
                            <img src={team.logo} alt={team.name} className="h-full w-full object-cover" />
                        ) : (
                            <Shield size={28} />
                        )}
                        </div>
                        <div className="flex flex-col items-end gap-2">
                             <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md text-white ${badgeColor}`}>
                                {team.division || 'Geral'}
                            </span>
                            {team.is_top_5 && (
                                <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-md">
                                    Top 5
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex-1">
                      <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {team.name}
                      </h3>
                      
                      <div className="mt-2 space-y-1.5">
                        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                            <span className="w-14 text-slate-400">Local:</span>
                            <span className="truncate text-slate-700">{team.city || team.province || 'N/A'}</span>
                        </div>
                        
                        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                            <span className="w-14 text-slate-400">Fundação:</span>
                            <span className="text-slate-700">{foundedYear || 'N/A'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                      
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Users size={15} />
                        <span className="text-xs font-bold text-slate-700">
                          {team.playersCount === 0 
                            ? 'Sem jogadores' 
                            : `${team.playersCount} Jogador${team.playersCount === 1 ? '' : 'es'}`}
                        </span>
                      </div>

                      {/* BOTÃO DA ESTRELA AQUI, SUBSTITUINDO AS INICIAIS */}
                      <button
                        onClick={(e) => handleToggleTop5(e, team.id, !!team.is_top_5)}
                        className={`p-1.5 rounded-full z-10 transition-colors shadow-sm ${
                            team.is_top_5
                            ? 'bg-amber-100 text-amber-500 hover:bg-amber-200' 
                            : 'bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600'
                        }`}
                        title={team.is_top_5 ? "Remover do Top 5" : "Adicionar ao Top 5"}
                      >
                         <Star size={18} className={team.is_top_5 ? "fill-current" : ""} />
                      </button>
                      
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
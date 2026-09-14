import { useState, useMemo, useRef, useEffect } from 'react';
import { Search, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabaseClient'; // ⚠️ Ajusta o caminho se o teu supabaseClient estiver noutra pasta

// 1. Definimos o que é uma equipa para o TypeScript não dar erro de 'any'
export interface TeamSearch {
  id: string;
  name: string;
  city?: string;
  division?: string;
  initials?: string;
  color?: string;
}

// Função para ignorar acentos e maiúsculas na pesquisa
function normalizeText(text: string): string {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

export function Topbar() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchWrapperRef = useRef<HTMLDivElement>(null);

  // 2. Buscar as equipas reais diretamente ao Supabase
  const { data: allTeams = [] } = useQuery<TeamSearch[]>({
    queryKey: ['teams-search'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('teams')
        .select('id, name, city, division, initials, color'); 
      
      if (error) throw error;
      return data as TeamSearch[];
    }
  });

  // 3. Filtrar usando os dados reais que vieram da base de dados
  const searchResults = useMemo(() => {
    const normalizedSearch = normalizeText(search);
    if (!normalizedSearch) return [];
    
    return allTeams
      .filter((team: TeamSearch) => normalizeText(team.name).includes(normalizedSearch))
      .slice(0, 6); // Mostra no máximo 6 resultados para não encher o ecrã
  }, [search, allTeams]);

  // Fecha o dropdown se o utilizador clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Ao clicar numa equipa, limpa a pesquisa e navega para os detalhes
  const handleSelectTeam = (id: string) => {
    setSearch('');
    setIsSearchFocused(false);
    navigate(`/admin/equipas/detalhes/${id}`); // ⚠️ Verifica se esta é a rota correta para o teu detalhe de equipa
  };

  const showDropdown = isSearchFocused && search.length > 0;

  return (
    <div className="mb-6 flex items-center gap-4">
      {/* BARRA DE PESQUISA */}
      <div ref={searchWrapperRef} className="relative flex-1">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setIsSearchFocused(true)}
          placeholder="Pesquisar equipas, jogadores, partidas..."
          className="w-full rounded-full border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition-colors focus:border-orange-400"
        />

        {/* DROPDOWN DE RESULTADOS */}
        {showDropdown && (
          <div className="absolute left-0 right-0 top-full z-20 mt-2 max-h-72 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-lg">
            {searchResults.length > 0 ? (
              searchResults.map((team: TeamSearch) => (
                <button
                  key={team.id}
                  onClick={() => handleSelectTeam(team.id)}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors hover:bg-slate-50"
                >
                  <div 
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white shadow-sm" 
                    style={{ backgroundColor: team.color || '#94a3b8' }}
                  >
                    {team.initials || team.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">{team.name}</p>
                    <p className="truncate text-xs text-slate-400">{team.city || 'Sem cidade'} · {team.division || '-'}</p>
                  </div>
                </button>
              ))
            ) : (
              <p className="px-3 py-4 text-center text-xs text-slate-400">Nenhuma equipa encontrada para "{search}".</p>
            )}
          </div>
        )}
      </div>

      {/* NOTIFICAÇÕES */}
      <button className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition-colors hover:border-orange-300 hover:text-orange-600">
        <Bell size={16} />
        <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-orange-500" />
      </button>

      {/* PERFIL DO ADMIN */}
      <div className="hidden items-center gap-2 sm:flex">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-700">
          JD
        </div>
        <div>
          <p className="text-sm font-semibold leading-tight">John Doe</p>
          <p className="text-xs text-slate-400">Administrador</p>
        </div>
      </div>
    </div>
  );
}
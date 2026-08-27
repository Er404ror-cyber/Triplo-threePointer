import { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Users, 
  UserCheck, 
  Shield, 
  MapPin, 
  SlidersHorizontal,
  X 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { TOP_PLAYERS, INITIAL_PLAYERS, type Player } from '../data/playersData';
import { TopPlayersGrid } from '../components/TopPlayersGrid';
import { PlayersTable } from '../components/PlayersTable';

function normalizeText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>(INITIAL_PLAYERS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const toggleActive = (id: string) => {
    setPlayers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p))
    );
  };

  const removePlayer = (id: string) => {
    setPlayers((prev) => prev.filter((p) => p.id !== id));
  };

  // Métricas rápidas calculadas
  const stats = useMemo(() => {
    const total = players.length;
    const active = players.filter((p) => p.active).length;
    const uniqueTeams = new Set(players.map((p) => p.team)).size;
    const uniqueProvinces = new Set(players.map((p) => p.province).filter(Boolean)).size;

    return { total, active, uniqueTeams, uniqueProvinces };
  }, [players]);

  // Filtros combinados de pesquisa e status
  const filteredPlayers = useMemo(() => {
    const normalizedSearch = normalizeText(search);

    return players.filter((player) => {
      // Filtro de Status
      if (statusFilter === 'active' && !player.active) return false;
      if (statusFilter === 'inactive' && player.active) return false;

      // Filtro de Texto
      if (!normalizedSearch) return true;
      return (
        normalizeText(player.name).includes(normalizedSearch) ||
        normalizeText(player.team).includes(normalizedSearch) ||
        normalizeText(player.position || '').includes(normalizedSearch) ||
        normalizeText(player.province || '').includes(normalizedSearch)
      );
    });
  }, [players, search, statusFilter]);

  return (
    <div className="min-h-screen bg-slate-50/60 p-4 font-sans text-slate-900 sm:p-6 md:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* HEADER PRINCIPAL */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 pb-5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              BasquetMZ — Gestão de Jogadores
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Consulte e administre os atletas inscritos na temporada.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admin/newplay"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-95"
            >
              <Plus size={15} />
              Adicionar Jogador
            </Link>
          </div>
        </header>

        {/* 1. SECÇÃO TOP 5 JOGADORES */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse" />
              <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider text-xs">
                Destaques da Temporada — Top 5
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-medium">Top Performance</span>
          </div>

          <TopPlayersGrid players={TOP_PLAYERS} />
        </section>

        {/* 2. CARDS DE RESUMO (Métricas Rápidas) */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Users size={18} />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Total de Atletas</p>
                <p className="text-xl font-bold text-slate-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <UserCheck size={18} />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Atletas Ativos</p>
                <p className="text-xl font-bold text-slate-900">{stats.active}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <Shield size={18} />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Clubes</p>
                <p className="text-xl font-bold text-slate-900">{stats.uniqueTeams}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <MapPin size={18} />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Províncias</p>
                <p className="text-xl font-bold text-slate-900">{stats.uniqueProvinces}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. PAINEL DA TABELA DE JOGADORES */}
        <section className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
          
          {/* BARRA DE FERRAMENTAS INTEGRADA */}
          <div className="flex flex-col gap-4 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
            
            {/* ABAS DE STATUS */}
            <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className={`rounded-lg px-3 py-1.5 transition-colors ${
                  statusFilter === 'all'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Todos ({players.length})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('active')}
                className={`rounded-lg px-3 py-1.5 transition-colors ${
                  statusFilter === 'active'
                    ? 'bg-white text-emerald-700 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Ativos ({stats.active})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('inactive')}
                className={`rounded-lg px-3 py-1.5 transition-colors ${
                  statusFilter === 'inactive'
                    ? 'bg-white text-rose-700 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Inativos ({stats.total - stats.active})
              </button>
            </div>

            {/* BARRA DE PESQUISA INTEGRADA */}
            <div className="flex items-center gap-2">
              <div className="relative w-full sm:w-72">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Filtrar por nome, clube, província..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-8 text-xs text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white"
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* TABELA DE JOGADORES COM EMPTY STATE */}
          <div className="p-2 sm:p-4">
            {filteredPlayers.length > 0 ? (
              <PlayersTable
                players={filteredPlayers}
                search={search}
                onToggleActive={toggleActive}
                onRemovePlayer={removePlayer}
              />
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-3">
                  <SlidersHorizontal size={22} />
                </div>
                <h3 className="text-sm font-semibold text-slate-800">Nenhum jogador encontrado</h3>
                <p className="text-xs text-slate-500 max-w-xs mt-1">
                  Não encontramos resultados para os filtros ou termo de pesquisa inserido.
                </p>
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="mt-4 text-xs font-semibold text-blue-600 hover:underline"
                  >
                    Limpar pesquisa
                  </button>
                )}
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}
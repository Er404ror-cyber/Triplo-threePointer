import { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Users, 
  UserCheck, 
  UserX,
  MapPin, 
  X,
  AlertCircle
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

export default function AdminJogadores() {
  const [players, setPlayers] = useState<Player[]>(INITIAL_PLAYERS);
  const [search, setSearch] = useState('');

  // 💡 Move instantaneamente o jogador de uma tabela para a outra
  const toggleActive = (id: string) => {
    setPlayers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p))
    );
  };

  const removePlayer = (id: string) => {
    setPlayers((prev) => prev.filter((p) => p.id !== id));
  };

  // Filtragem da busca
  const filteredPlayers = useMemo(() => {
    const term = normalizeText(search);
    if (!term) return players;
    return players.filter(
      (player) =>
        normalizeText(player.name).includes(term) ||
        normalizeText(player.team).includes(term) ||
        normalizeText(player.division || '').includes(term) ||
        normalizeText(player.province || '').includes(term)
    );
  }, [players, search]);

  // 💡 Condição 1: Apenas os ativos ficam no bloco de cima
  const activePlayers = useMemo(
    () => filteredPlayers.filter((p) => p.active),
    [filteredPlayers]
  );

  // 💡 Condição 2: Apenas os inativos ficam no bloco de baixo
  const inactivePlayers = useMemo(
    () => filteredPlayers.filter((p) => !p.active),
    [filteredPlayers]
  );

  return (
    <div className="min-h-screen bg-slate-50/60 p-4 font-sans text-slate-900 sm:p-6 md:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* HEADER */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              BasquetMZ — Gestão de Jogadores
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Consulte e administre os atletas inscritos na temporada.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Pesquisar jogadores..."
                className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-8 text-xs text-slate-700 outline-none transition focus:border-blue-500"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            <Link
              to="/admin/newplay"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-95"
            >
              <Plus size={15} />
              Adicionar Jogador
            </Link>
          </div>
        </header>

        {/* DESTAQUES TOP 5 */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Destaques da Temporada — Top 5
              </h2>
            </div>
            <span className="text-xs font-medium text-slate-400">Top Performance</span>
          </div>

          <TopPlayersGrid players={TOP_PLAYERS} />
        </section>

        {/* MÉTRICAS */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Users size={18} />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Total de Atletas</p>
                <p className="text-xl font-bold text-slate-900">{players.length}</p>
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
                <p className="text-xl font-bold text-emerald-700">{activePlayers.length}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                <UserX size={18} />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Atletas Inativos</p>
                <p className="text-xl font-bold text-rose-700">{inactivePlayers.length}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <MapPin size={18} />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Clubes</p>
                <p className="text-xl font-bold text-slate-900">
                  {new Set(players.map((p) => p.team)).size}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 1. TABELA SUPERIOR: JOGADORES ATIVOS */}
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 bg-emerald-50/40 px-6 py-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="text-base font-bold text-slate-900">Jogadores Ativos</h2>
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                {activePlayers.length}
              </span>
            </div>
            <span className="text-xs font-medium text-emerald-700">Disponíveis para a Temporada</span>
          </div>

          <div className="p-2 sm:p-4">
            <PlayersTable
              players={activePlayers}
              search={search}
              onToggleActive={toggleActive}
              onRemovePlayer={removePlayer}
            />
          </div>
        </section>

        {/* 2. TABELA INFERIOR: JOGADORES INATIVOS */}
        <section className="rounded-2xl border border-slate-200 bg-white/90 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-100/70 px-6 py-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-3 w-3 rounded-full bg-slate-400" />
              <h2 className="text-base font-bold text-slate-800">Jogadores Inativos / Dispensados</h2>
              <span className="rounded-full bg-slate-200 px-2.5 py-0.5 text-xs font-bold text-slate-700">
                {inactivePlayers.length}
              </span>
            </div>
            <span className="text-xs text-slate-400">Fora de competição</span>
          </div>

          <div className="p-2 sm:p-4">
            {inactivePlayers.length > 0 ? (
              <PlayersTable
                players={inactivePlayers}
                search={search}
                onToggleActive={toggleActive}
                onRemovePlayer={removePlayer}
              />
            ) : (
              <div className="flex items-center justify-center gap-2 py-8 text-xs text-slate-400">
                <AlertCircle size={14} />
                <span>Nenhum jogador inativo no momento.</span>
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}
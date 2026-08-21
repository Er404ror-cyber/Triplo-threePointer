import { useState, useMemo } from 'react';
import { Filter, Search, Plus } from 'lucide-react';
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

const QUICK_ACTIONS = [
  {
    title: 'Adicionar novo jogador',
    description: 'Registe um novo jogador.',
    path: '/admin/newplay',
    buttonText: 'Adicionar jogador',
  },
];

export default function Newtime() {
  const [players, setPlayers] = useState<Player[]>(INITIAL_PLAYERS);
  const [search, setSearch] = useState('');

  const toggleActive = (id: string) => {
    setPlayers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p))
    );
  };

  const removePlayer = (id: string) => {
    setPlayers((prev) => prev.filter((p) => p.id !== id));
  };

  const filteredPlayers = useMemo(() => {
    const normalizedSearch = normalizeText(search);
    if (!normalizedSearch) return players;
    return players.filter(
      (player) =>
        normalizeText(player.name).includes(normalizedSearch) ||
        normalizeText(player.team).includes(normalizedSearch) ||
        normalizeText(player.position || '').includes(normalizedSearch) ||
        normalizeText(player.province || '').includes(normalizedSearch)
    );
  }, [players, search]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 font-sans text-slate-900 sm:p-6 md:p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* HEADER */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-slate-900">BasquetMZ — Jogadores</h1>

          <div className="flex flex-wrap items-center gap-2">
            {QUICK_ACTIONS.map((action) => (
              <Link
                key={action.title}
                to={action.path}
                className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-700"
              >
                <Plus size={13} />
                {action.buttonText}
              </Link>
            ))}

            <button className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition-colors hover:border-slate-300">
              <Filter size={15} />
            </button>

            <div className="relative w-full sm:w-64 md:w-72">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Pesquisar jogadores..."
                className="w-full rounded-full border border-slate-200 py-2 pl-9 pr-4 text-sm text-slate-700 outline-none transition-colors focus:border-blue-400"
              />
            </div>
          </div>
        </div>

        {/* TOP 5 JOGADORES */}
        <section>
          <h2 className="mb-4 text-lg font-bold text-slate-800">Destaques — Top 5 Jogadores</h2>
          <TopPlayersGrid players={TOP_PLAYERS} />
        </section>

        {/* LISTA COMPLETA DE JOGADORES */}
        <section>
          <h2 className="mb-4 text-lg font-bold text-slate-800">Todos os Jogadores</h2>
          <PlayersTable
            players={filteredPlayers}
            search={search}
            onToggleActive={toggleActive}
            onRemovePlayer={removePlayer}
          />
        </section>
      </div>
    </div>
  );
}
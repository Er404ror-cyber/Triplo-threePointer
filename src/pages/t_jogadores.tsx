import { useState, useMemo } from 'react';
import {
  Star,
  Filter,
  Search,
  MessageCircle,
  Phone,
  Ruler,
  Pencil,
  Trash2,
  Power,
  Gamepad2,
  Plus,
} from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Lista de jogadores da equipa.
 * Observação: usei avatares genéricos (iniciais) e nomes/dados fictícios
 * no lugar de fotos reais de pessoas, pois fotos de rostos não podem
 * ser reproduzidas sem autorização.
 */

interface TopPlayer {
  id: string;
  name: string;
  team: string;
  status: 'Ativo' | 'Inativo';
  location: string;
  initials: string;
  color: string;
}

const TOP_PLAYERS: TopPlayer[] = [
  { id: '1', name: 'Júlio Macamo', team: 'Costa do Sol', status: 'Ativo', location: 'Maputo, MZ', initials: 'JM', color: '#2563eb' },
  { id: '2', name: 'Carlos Nhaca', team: 'Ferroviário', status: 'Ativo', location: 'Maputo, MZ', initials: 'CN', color: '#0891b2' },
  { id: '3', name: 'André Sitoe', team: 'Costa do Sol', status: 'Ativo', location: 'Beira, MZ', initials: 'AS', color: '#7c3aed' },
  { id: '4', name: 'Miro Cossa', team: 'Maxaquene', status: 'Inativo', location: 'Xai-Xai, MZ', initials: 'MC', color: '#dc2626' },
  { id: '5', name: 'Vasco Chirindza', team: 'Costa do Sol', status: 'Ativo', location: 'Maputo, MZ', initials: 'VC', color: '#16a34a' },
];

interface Player {
  id: string;
  name: string;
  team: string;
  age: number;
  position: string;
  height: string;
  active: boolean;
  initials: string;
  color: string;
  tags: { label: string; color: string }[];
}

const INITIAL_PLAYERS: Player[] = [
  {
    id: '1', name: 'Robert Marter', team: 'Ferroviário', age: 24, position: 'Base', height: "1.85m",
    active: true, initials: 'RM', color: '#2563eb',
    tags: [{ label: 'Titular', color: 'bg-violet-100 text-violet-700' }, { label: 'Capitão', color: 'bg-emerald-100 text-emerald-700' }],
  },
  {
    id: '2', name: 'Seth Tuttiano', team: 'Maxaquene', age: 27, position: 'Ala-Pivô', height: "2.02m",
    active: true, initials: 'ST', color: '#dc2626',
    tags: [{ label: 'Reserva', color: 'bg-slate-100 text-slate-600' }, { label: 'Lesionado', color: 'bg-amber-100 text-amber-700' }],
  },
  {
    id: '3', name: 'Derek Minhouse', team: 'Ferroviário', age: 31, position: 'Pivô', height: "2.08m",
    active: false, initials: 'DM', color: '#64748b',
    tags: [{ label: 'Titular', color: 'bg-violet-100 text-violet-700' }],
  },
  {
    id: '4', name: 'Gabriela Morvalho', team: 'Maxaquene', age: 22, position: 'Ala', height: "1.79m",
    active: true, initials: 'GM', color: '#0891b2',
    tags: [{ label: 'Reserva', color: 'bg-slate-100 text-slate-600' }, { label: 'Promessa', color: 'bg-emerald-100 text-emerald-700' }],
  },
  {
    id: '5', name: 'Murilo Nakroncalves', team: 'Costa do Sol', age: 29, position: 'Base', height: "1.88m",
    active: true, initials: 'MN', color: '#7c3aed',
    tags: [{ label: 'Promessa', color: 'bg-emerald-100 text-emerald-700' }],
  },
];

// Remove acentos e normaliza para minúsculas, para a busca ignorar acentuação
function normalizeText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

interface QuickAction {
  icon: React.ElementType;
  title: string;
  description: string;
  path: string;
  buttonText: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    icon: Gamepad2,
    title: 'Adicionar novo jogador',
    description: 'Registe um novo jogador.',
    path: '/admin/newplay', // Invertido: agora aponta para newtime
    buttonText: 'Adicionar jogador',
  },
];

export default function Newtime() {
  const [players, setPlayers] = useState<Player[]>(INITIAL_PLAYERS);
  const [search, setSearch] = useState('');

  const toggleActive = (id: string) => {
    setPlayers((prev) => prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p)));
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
        normalizeText(player.position).includes(normalizedSearch)
    );
  }, [players, search]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 font-sans text-slate-900 md:p-8">
      <div className="mx-auto max-w-6xl">

        {/* ================= HEADER ================= */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-slate-900">BasquetMZ — Jogadores</h1>
          <div className="flex items-center gap-2">
            {QUICK_ACTIONS.map((action) => (
                            <div
                              key={action.title}
                              className="m-5 "
                            >
                            
                              <Link
                                to={action.path}
                                className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-700"
                              >
                                <Plus size={13} />
                                {action.buttonText}
                              </Link>
                            </div>
                          ))}
            <button className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition-colors hover:border-slate-300">
              <Filter size={15} />
            </button>
            <div className="relative sm:w-72">
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

        {/* ================= TOP 5 JOGADORES ================= */}
        <div className="mb-8">
          <p className="mb-3 text-sm font-semibold text-blue-600">Melhores jogadores</p>
          <div className="grid grid-cols-5 gap-3">
            {TOP_PLAYERS.map((player) => (
              <div
                key={player.id}
                className="flex flex-col rounded-2xl border border-slate-200 bg-white p-4"
              >
                <div className="mb-3 flex items-start justify-between">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold text-white shrink-0"
                    style={{ backgroundColor: player.color }}
                  >
                    {player.initials}
                  </div>
                  <Star size={14} className="text-slate-300" />
                </div>

                <p className="truncate text-sm font-semibold text-slate-900">{player.name}</p>
                <p className="truncate text-xs text-slate-400">{player.team}</p>

                <div className="my-3 border-t border-slate-100" />

                <p className={`text-xs font-medium ${player.status === 'Ativo' ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {player.status}
                </p>
                <p className="mb-3 truncate text-xs text-slate-400">{player.location}</p>

                <div className="mt-auto flex items-center gap-2 text-[11px] text-slate-400">
                  <button className="flex items-center gap-1 hover:text-blue-600">
                    <MessageCircle size={11} />
                    <span className="hidden xl:inline">Mensagem</span>
                  </button>
                  <button className="flex items-center gap-1 hover:text-blue-600">
                    <Phone size={11} />
                    Ligar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= LISTA COMPLETA ================= */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-semibold text-blue-600">Lista de jogadores</p>

            
          </div>

          {/* Cabeçalho da tabela — só desktop */}
          <div className="mb-2 hidden grid-cols-[1.6fr_0.6fr_0.9fr_0.7fr_auto] gap-3 px-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400 md:grid">
            <span>Nome</span>
            <span>Idade</span>
            <span>Posição</span>
            <span>Altura</span>
            <span className="text-right">Ações</span>
          </div>

          <div className="divide-y divide-slate-100">
            {filteredPlayers.map((player) => (
              <div
                key={player.id}
                className="grid grid-cols-1 items-center gap-3 rounded-xl px-2 py-4 transition-colors hover:bg-slate-50 md:grid-cols-[1.6fr_0.6fr_0.9fr_0.7fr_auto]"
              >
                {/* Nome + avatar + tags */}
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                    style={{ backgroundColor: player.color }}
                  >
                    {player.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">{player.name}</p>
                    <p className="truncate text-xs text-slate-400">{player.team}</p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {player.tags.map((tag) => (
                        <span
                          key={tag.label}
                          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${tag.color}`}
                        >
                          {tag.label}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Idade */}
                <div className="text-sm text-slate-600 md:text-left">
                  <span className="text-xs font-semibold text-slate-400 md:hidden">Idade: </span>
                  {player.age} anos
                </div>

                {/* Posição */}
                <div className="text-sm text-slate-600 md:text-left">
                  <span className="text-xs font-semibold text-slate-400 md:hidden">Posição: </span>
                  {player.position}
                </div>

                {/* Altura */}
                <div className="flex items-center gap-1.5 text-sm text-slate-600">
                  <Ruler size={13} className="hidden text-slate-400 md:block" />
                  {player.height}
                </div>

                {/* Ações */}
                <div className="flex items-center gap-2 md:justify-end">
                  <button
                    onClick={() => toggleActive(player.id)}
                    title={player.active ? 'Marcar como inativo' : 'Marcar como ativo'}
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                      player.active
                        ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                        : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    <Power size={12} />
                    {player.active ? 'Ativo' : 'Inativo'}
                  </button>

                  <button
                    title="Editar jogador"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:border-blue-300 hover:text-blue-600"
                  >
                    <Pencil size={13} />
                  </button>

                  <button
                    onClick={() => removePlayer(player.id)}
                    title="Remover jogador"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:border-red-300 hover:text-red-500"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}

            {filteredPlayers.length === 0 && (
              <p className="py-10 text-center text-sm text-slate-400">
                {search ? 'Nenhum jogador encontrado.' : 'Nenhum jogador na lista.'}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
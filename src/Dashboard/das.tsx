import { useState, useMemo, useRef, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Trophy,
  Users,
  Gamepad2,
  Plus,
  Search,
  Bell,
  Shield,
  ArrowUpRight,
  Activity,
  BarChart3,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { ALL_TEAMS } from '../pages/t_equipas'; // ajuste o caminho conforme sua estrutura de pastas

/**
 * Painel administrativo do BasquetMZ.
 */

interface StatCard {
  icon: React.ElementType;
  value: string;
  label: string;
  trend: string;
  trendUp: boolean;
  highlighted?: boolean;
}

const STAT_CARDS: StatCard[] = [
  {
    icon: Shield,
    value: '10',
    label: 'Total de equipas',
    trend: '+2 este mês',
    trendUp: true,
  },
  {
    icon: Trophy,
    value: '20',
    label: 'Total de partidas',
    trend: '+5 este mês',
    trendUp: true,
    highlighted: true,
  },
  {
    icon: BarChart3,
    value: '487',
    label: 'Total de visitantes',
    trend: '-3% esta semana',
    trendUp: false,
  },
];

interface QuickAction {
  icon: React.ElementType;
  title: string;
  description: string;
  path: string;
  buttonText: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    icon: Shield,
    title: 'Adicionar nova equipa',
    description: 'Cadastre um novo clube ou seleção na base de dados.',
    path: '/admin/newplay',
    buttonText: 'Adicionar equipa',
  },
  {
    icon: Gamepad2,
    title: 'Adicionar nova partida',
    description: 'Registe o resultado ou agende um novo jogo.',
    path: '/admin/newpartida',
    buttonText: 'Adicionar partida',
  },
];

interface ActivityItem {
  icon: React.ElementType;
  title: string;
  time: string;
}

const RECENT_ACTIVITY: ActivityItem[] = [
  { icon: Shield, title: 'Nova equipa "Ferroviário de Nampula" adicionada', time: 'há 2 horas' },
  { icon: Gamepad2, title: 'Resultado de "Costa do Sol vs Maxaquene" atualizado', time: 'há 5 horas' },
  { icon: Users, title: '12 novos visitantes registados', time: 'ontem' },
  { icon: Trophy, title: 'Campeonato Nacional marcado como encerrado', time: 'há 2 dias' },
];

const WEEKLY_VISITS = [
  { day: 'Seg', value: 40 },
  { day: 'Ter', value: 65 },
  { day: 'Qua', value: 50 },
  { day: 'Qui', value: 80 },
  { day: 'Sex', value: 95 },
  { day: 'Sáb', value: 60 },
  { day: 'Dom', value: 45 },
];

// Remove acentos e normaliza para minúsculas, para a busca ignorar acentuação
function normalizeText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

export default function Dash() {
  const maxVisit = Math.max(...WEEKLY_VISITS.map((d) => d.value));
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchWrapperRef = useRef<HTMLDivElement>(null);

  const searchResults = useMemo(() => {
    const normalizedSearch = normalizeText(search);
    if (!normalizedSearch) return [];
    return ALL_TEAMS.filter((team) => normalizeText(team.name).includes(normalizedSearch)).slice(0, 6);
  }, [search]);

  // Fecha o dropdown ao clicar fora da barra de pesquisa
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectTeam = (id: string) => {
    setSearch('');
    setIsSearchFocused(false);
    navigate(`/admin/equipas/detalhes/${id}`);
  };

  const showDropdown = isSearchFocused && search.length > 0;

  return (
    <div className="min-h-screen w-full bg-slate-100 font-sans text-slate-900">
      {/* ================= MAIN CONTENT ================= */}
      <main className="w-full px-6 py-8 lg:px-10">
        {/* Topbar */}
        <div className="mb-6 flex items-center gap-4">
          <div ref={searchWrapperRef} className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              placeholder="Pesquisar equipas, partidas..."
              className="w-full rounded-full border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition-colors focus:border-blue-400"
            />

            {showDropdown && (
              <div className="absolute left-0 right-0 top-full z-20 mt-2 max-h-72 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-lg">
                {searchResults.length > 0 ? (
                  searchResults.map((team) => (
                    <button
                      key={team.id}
                      onClick={() => handleSelectTeam(team.id)}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors hover:bg-slate-50"
                    >
                      <div
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
                        style={{ backgroundColor: team.color }}
                      >
                        {team.initials}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900">{team.name}</p>
                        <p className="truncate text-xs text-slate-400">{team.city} · {team.division}</p>
                      </div>
                    </button>
                  ))
                ) : (
                  <p className="px-3 py-4 text-center text-xs text-slate-400">
                    Nenhuma equipa encontrada para "{search}".
                  </p>
                )}
              </div>
            )}
          </div>

          <button className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition-colors hover:border-blue-300 hover:text-blue-600">
            <Bell size={16} />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-blue-600" />
          </button>

          <div className="hidden items-center gap-2 sm:flex">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
              JD
            </div>
            <div>
              <p className="text-sm font-semibold leading-tight">John Doe</p>
              <p className="text-xs text-slate-400">Administrador</p>
            </div>
          </div>
        </div>

        {/* Banner de boas-vindas */}
        <div className="mb-8 flex flex-col justify-between gap-4 rounded-2xl bg-slate-900 p-6 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-xs font-medium text-slate-400">4 de setembro de 2025</p>
            <h1 className="mb-1 text-xl font-bold text-white">Bem-vindo de volta, John!</h1>
            <p className="text-sm text-slate-400">Acompanhe as equipas, partidas e visitantes do BasquetMZ</p>
          </div>
          <div className="flex h-16 w-16 shrink-0 items-center justify-center self-end rounded-xl bg-blue-600 sm:self-center">
            <Trophy size={26} className="text-white" />
          </div>
        </div>

        {/* Stat cards */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {STAT_CARDS.map((card) => (
            <div
              key={card.label}
              className={`rounded-2xl border p-4 transition-shadow hover:shadow-sm ${
                card.highlighted ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white'
              }`}
            >
              <div className="mb-3 flex items-center justify-between">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                    card.highlighted ? 'bg-blue-600' : 'bg-slate-100'
                  }`}
                >
                  <card.icon size={16} className={card.highlighted ? 'text-white' : 'text-slate-500'} />
                </div>
                <span
                  className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                    card.trendUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
                  }`}
                >
                  {card.trendUp ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                  {card.trend}
                </span>
              </div>
              <p className="text-2xl font-bold text-slate-900">{card.value}</p>
              <p className="text-xs text-slate-400">{card.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-4">
          {/* Coluna esquerda — Ações rápidas + Mini-gráfico */}
          <div className="space-y-6 xl:col-span-3">
            {/* Ações rápidas */}
            <div>
              <p className="mb-3 text-sm font-semibold text-slate-700">Ações rápidas</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {QUICK_ACTIONS.map((action) => (
                  <div
                    key={action.title}
                    className="group rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-sm"
                  >
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 transition-colors group-hover:bg-blue-600">
                      <action.icon size={18} className="text-blue-600 transition-colors group-hover:text-white" />
                    </div>
                    <p className="mb-1 text-sm font-semibold text-slate-900">{action.title}</p>
                    <p className="mb-4 text-xs leading-relaxed text-slate-400">{action.description}</p>
                    <Link
                      to={action.path}
                      className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-700"
                    >
                      <Plus size={13} />
                      {action.buttonText}
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Mini-gráfico de visitantes */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-700">Visitantes esta semana</p>
                  <p className="text-xs text-slate-400">Total de acessos por dia</p>
                </div>
                <span className="flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-semibold text-green-600">
                  <ArrowUpRight size={12} />
                  12%
                </span>
              </div>

              <div className="flex h-32 items-end justify-between gap-2">
                {WEEKLY_VISITS.map((d) => (
                  <div key={d.day} className="flex flex-1 flex-col items-center gap-2">
                    <div
                      className="w-full rounded-t-md bg-blue-100 transition-all hover:bg-blue-500"
                      style={{ height: `${(d.value / maxVisit) * 100}%` }}
                    />
                    <span className="text-[10px] font-medium text-slate-400">{d.day}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Coluna direita — Admins + Atividade recente */}
          <div className="space-y-6">
            {/* Administradores */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-700">Administradores</p>
                <button className="text-xs font-medium text-blue-600 hover:text-blue-700">Ver todos</button>
              </div>
              <div className="flex -space-x-2">
                {['AS', 'JD', 'RK'].map((initials, i) => (
                  <div
                    key={i}
                    className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-white bg-blue-100 text-xs font-bold text-blue-700 shadow-sm"
                  >
                    {initials}
                  </div>
                ))}
                <button className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-dashed border-slate-200 text-slate-400 hover:border-blue-300 hover:text-blue-500">
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Atividade recente */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity size={15} className="text-slate-400" />
                  <p className="text-sm font-semibold text-slate-700">Atividade recente</p>
                </div>
                <button className="text-xs font-medium text-blue-600 hover:text-blue-700">Ver tudo</button>
              </div>

              <div className="space-y-4">
                {RECENT_ACTIVITY.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                      <item.icon size={14} className="text-slate-500" />
                    </div>
                    <div>
                      <p className="text-xs font-medium leading-snug text-slate-700">{item.title}</p>
                      <p className="mt-0.5 text-[11px] text-slate-400">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
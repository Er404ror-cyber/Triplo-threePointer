import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, ChevronRight, Star, Shield } from 'lucide-react';

/**
 * Painel de gestão de equipas — BasquetMZ.
 * Observação: usei escudos fictícios (iniciais + cor), não logos reais
 * de clubes, evitando qualquer uso de marcas registadas.
 */
export interface Team {
  id: string;
  name: string;
  city: string;
  division: string;
  initials: string;
  color: string;
  founded?: number;
  players?: number;
  description?: string;
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
    icon: Shield,
    title: 'Adicionar nova equipa',
    description: 'Cadastre um novo clube ou seleção na base de dados.',
    path: '/admin/newtime', // Invertido: agora aponta para newplay
    buttonText: 'Adicionar equipa',
  },
];

// As 5 melhores equipas (por classificação/desempenho)
export const TOP_TEAMS: Team[] = [
  { id: '1', name: 'Costa do Sol', city: 'Maputo, MZ', division: '1ª Divisão', initials: 'CDS', color: '#2563eb', founded: 1949, players: 14, description: 'Campeão nacional em título, com uma das formações mais sólidas do país.' },
  { id: '2', name: 'Ferroviário de Maputo', city: 'Maputo, MZ', division: '1ª Divisão', initials: 'FRM', color: '#dc2626', founded: 1926, players: 16, description: 'Um dos clubes mais tradicionais de Moçambique, com forte investimento na formação de base.' },
  { id: '3', name: 'Maxaquene', city: 'Maputo, MZ', division: '1ª Divisão', initials: 'MAX', color: '#0891b2', founded: 1932, players: 15, description: 'Histórico clube maputense, conhecido pela qualidade tática das suas equipas.' },
  { id: '4', name: 'Ferroviário da Beira', city: 'Beira, MZ', division: '1ª Divisão', initials: 'FRB', color: '#7c3aed', founded: 1933, players: 13, description: 'Representa a região centro do país, com boa base de apoio local.' },
  { id: '5', name: 'Textáfrica', city: 'Chimoio, MZ', division: '1ª Divisão', initials: 'TXT', color: '#0d9488', founded: 1965, players: 12, description: 'Clube em ascensão, com foco em jogadores jovens da região de Chimoio.' },
];

// Todas as equipas do campeonato
export const ALL_TEAMS: Team[] = [
  ...TOP_TEAMS,
  { id: '6', name: 'Desportivo de Maputo', city: 'Maputo, MZ', division: '2ª Divisão', initials: 'DSM', color: '#64748b', founded: 1920, players: 12, description: 'Um dos clubes mais antigos do país, atualmente reorganizando a equipa sénior.' },
  { id: '7', name: 'Clube K.a.T', city: 'Maputo, MZ', division: '2ª Divisão', initials: 'KAT', color: '#ca8a04', founded: 2001, players: 11, description: 'Clube mais recente, com boa aposta em jogadores formados internamente.' },
  { id: '8', name: 'Liceu de Maputo', city: 'Maputo, MZ', division: '2ª Divisão', initials: 'LIC', color: '#be185d', founded: 1943, players: 10, description: 'Ligado à formação escolar, com forte tradição em categorias de base.' },
  { id: '9', name: '1º de Maio', city: 'Nampula, MZ', division: '1ª Divisão', initials: '1DM', color: '#4f46e5', founded: 1975, players: 14, description: 'Principal representante da região norte no campeonato nacional.' },
  { id: '10', name: 'Associação de Gaza', city: 'Xai-Xai, MZ', division: '2ª Divisão', initials: 'AGZ', color: '#059669', founded: 1980, players: 12, description: 'Associação provincial com foco no desenvolvimento do basquetebol em Gaza.' },
];

// Remove acentos e normaliza para minúsculas, para a busca ignorar acentuação
function normalizeText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

export default function TeamManagement() {
  const [search, setSearch] = useState('');

  const filteredTeams = useMemo(() => {
    const normalizedSearch = normalizeText(search);
    return ALL_TEAMS.filter((team) => normalizeText(team.name).includes(normalizedSearch));
  }, [search]);

  return (
    <div className="min-h-screen bg-slate-100 p-4 font-sans text-slate-900 md:p-8">
      <div className="mx-auto max-w-6xl rounded-2xl border border-slate-200 bg-white p-6 md:p-8">

        {/* ================= HEADER ================= */}
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Gestão de equipas</h1>
            <p className="mt-1 text-sm text-slate-500">
              Acompanhe o desempenho e os dados de cada equipa do campeonato.
            </p>
          </div>
         
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
        </div>

        {/* ================= TOP 5 EQUIPAS ================= */}
        <div className="mb-6">
          <p className="mb-3 text-sm font-semibold text-blue-600">Melhores equipas</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {TOP_TEAMS.map((team) => (
  <Link
    key={team.id}
    to={`/admin/equipas/detalhes/${team.id}`}
    className="rounded-2xl border border-slate-200 p-4 transition-colors hover:border-slate-300"
  >
                <div className="mb-4 flex items-start justify-between">
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                    style={{ backgroundColor: team.color }}
                  >
                    {team.initials}
                  </div>
                  <Star size={14} className="text-amber-400" fill="currentColor" />
                </div>

                <p className="truncate text-sm font-semibold text-slate-900">{team.name}</p>
                <p className="mb-3 truncate text-xs text-slate-400">{team.city}</p>

                <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                  <p className="text-xs text-slate-500">{team.division}</p>
                  <span className="flex items-center gap-1 text-xs font-medium text-blue-600">
                    Detalhes
                    <ChevronRight size={13} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ================= SEARCH BAR + TODAS AS EQUIPAS ================= */}
        <div className="rounded-2xl border border-slate-200 p-5">
          <div className="mb-5">
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Pesquisar equipas..."
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition-colors focus:border-blue-400"
              />
            </div>
          </div>

          <p className="mb-4 text-sm font-semibold text-blue-600">Todas as equipas</p>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
           {filteredTeams.map((team) => (
  <Link
    key={team.id}
    to={`/admin/equipas/detalhes/${team.id}`}
    className="rounded-2xl border border-slate-200 p-4 transition-colors hover:border-slate-300"
  >
                <div className="mb-4 flex items-center gap-3">
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                    style={{ backgroundColor: team.color }}
                  >
                    {team.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{team.name}</p>
                    <p className="text-xs text-slate-400">{team.city}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                  <p className="text-sm text-slate-500">{team.division}</p>
                  <span className="flex items-center gap-1 text-sm font-medium text-blue-600">
                    Ver detalhes
                    <ChevronRight size={14} />
                  </span>
                </div>
              </Link>
            ))}

            {filteredTeams.length === 0 && (
              <p className="col-span-full py-10 text-center text-sm text-slate-400">
                Nenhuma equipa encontrada.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
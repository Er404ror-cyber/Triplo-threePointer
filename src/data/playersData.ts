export interface Team {
  id: number;
  name: string;
}

export interface PlayerTag {
  label: string;
  color: string;
}

export interface Player {
  id: number;
  teamId: number; // Conexão real com a tabela de equipas
  name: string;
  active: boolean;
  isTop5?: boolean; // Diferencial para identificar os melhores
  position?: string;
  height?: string;
  age?: number;
  initials?: string;
  color?: string;
  tags?: PlayerTag[];
  photo?: string;
  avatarUrl?: string;
  division?: string;
  province?: string;
}

// 1. Tabela de Equipas (Simulando uma Base de Dados)
export const TEAMS_DB: Team[] = [
  { id: 1, name: 'Costa do Sol' },
  { id: 2, name: 'Ferroviário de Maputo' }, // Assumi que "Ferroviário" era o de Maputo
  { id: 3, name: 'Maxaquene' },
  { id: 4, name: 'Desportivo de Maputo' },
  { id: 5, name: 'Ferroviário da Beira' },
];

// 2. Tabela de Jogadores (Simulando uma Base de Dados)
export const PLAYERS_DB: Player[] = [
  // --- JOGADORES TOP 5 ---
  {
    id: 1,
    teamId: 1, // Conectado a Costa do Sol
    name: 'Carlos Sitoe',
    isTop5: true,
    age: 25,
    position: 'Base',
    height: '1.88m',
    active: true,
    division: '1ª Divisão',
    province: 'Maputo Cidade',
    photo: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400',
    tags: [{ label: 'Top 5 ⭐', color: 'bg-yellow-100 text-yellow-700' }], // Diferencial visual
  },
  {
    id: 2,
    teamId: 2, // Conectado a Ferroviário de Maputo
    name: 'Nelson Machava',
    isTop5: true,
    age: 28,
    position: 'Extremo',
    height: '1.96m',
    active: true,
    division: '1ª Divisão',
    province: 'Maputo Cidade',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    tags: [{ label: 'Top 5 ⭐', color: 'bg-yellow-100 text-yellow-700' }],
  },
  {
    id: 3,
    teamId: 3, // Conectado a Maxaquene
    name: 'Helton Ubisse',
    isTop5: true,
    age: 30,
    position: 'Poste',
    height: '2.04m',
    active: false,
    division: '1ª Divisão',
    province: 'Sofala',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    tags: [{ label: 'Top 5 ⭐', color: 'bg-yellow-100 text-yellow-700' }],
  },
  {
    id: 4,
    teamId: 4, // Conectado a Desportivo de Maputo
    name: 'Pio Matos',
    isTop5: true,
    age: 31,
    position: 'Base',
    height: '1.85m',
    active: true,
    division: '2ª Divisão',
    province: 'Gaza',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
    tags: [{ label: 'Top 5 ⭐', color: 'bg-yellow-100 text-yellow-700' }],
  },
  {
    id: 5,
    teamId: 5, // Conectado a Ferroviário da Beira
    name: 'Ayad Munguambe',
    isTop5: true,
    age: 23,
    position: 'Ala-Pivô',
    height: '2.01m',
    active: true,
    division: '1ª Divisão',
    province: 'Sofala',
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400',
    tags: [{ label: 'Top 5 ⭐', color: 'bg-yellow-100 text-yellow-700' }],
  },

  // --- RESTANTES JOGADORES ---
  {
    id: 6,
    teamId: 2, // Conectado a Ferroviário de Maputo
    name: 'Robert Marter',
    isTop5: false,
    age: 24,
    position: 'Base',
    height: '1.85m',
    active: true,
    division: '1ª Divisão',
    province: 'Maputo Cidade',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    initials: 'RM',
    color: '#2563eb',
    tags: [
      { label: 'Titular', color: 'bg-violet-100 text-violet-700' },
      { label: 'Capitão', color: 'bg-emerald-100 text-emerald-700' },
    ],
  },
  {
    id: 7,
    teamId: 3, // Conectado a Maxaquene
    name: 'Seth Tuttiano',
    isTop5: false,
    age: 27,
    position: 'Ala-Pivô',
    height: '2.02m',
    active: false,
    division: '1ª Divisão',
    province: 'Inhambane',
    photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400',
    initials: 'ST',
    color: '#dc2626',
    tags: [
      { label: 'Reserva', color: 'bg-slate-100 text-slate-600' },
      { label: 'Lesionado', color: 'bg-amber-100 text-amber-700' },
    ],
  },
  {
    id: 8,
    teamId: 2, // Conectado a Ferroviário de Maputo
    name: 'Derek Minhouse',
    isTop5: false,
    age: 31,
    position: 'Pivô',
    height: '2.08m',
    active: true,
    division: '2ª Divisão',
    province: 'Nampula',
    photo: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400',
    initials: 'DM',
    color: '#64748b',
    tags: [{ label: 'Titular', color: 'bg-violet-100 text-violet-700' }],
  },
  {
    id: 9,
    teamId: 3, // Conectado a Maxaquene
    name: 'Gabriela Morvalho',
    isTop5: false,
    age: 22,
    position: 'Ala',
    height: '1.79m',
    active: true,
    division: '1ª Divisão',
    province: 'Zambézia',
    photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400',
    initials: 'GM',
    color: '#0891b2',
    tags: [
      { label: 'Reserva', color: 'bg-slate-100 text-slate-600' },
      { label: 'Promessa', color: 'bg-emerald-100 text-emerald-700' },
    ],
  },
  {
    id: 10,
    teamId: 1, // Conectado a Costa do Sol
    name: 'Murilo Nakroncalves',
    isTop5: false,
    age: 29,
    position: 'Base',
    height: '1.88m',
    active: false,
    division: '2ª Divisão',
    province: 'Cabo Delgado',
    photo: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400',
    initials: 'MN',
    color: '#7c3aed',
    tags: [{ label: 'Promessa', color: 'bg-emerald-100 text-emerald-700' }],
  },
];

// 3. Helpers que simulam chamadas à base de dados para serem usados nos teus componentes:

// Pega apenas nos 5 melhores
export const TOP_PLAYERS: Player[] = PLAYERS_DB.filter(player => player.isTop5);

// Pega nos restantes para uma lista inicial (exclui os top 5, ou podes remover o filtro se quiseres todos)
export const INITIAL_PLAYERS: Player[] = PLAYERS_DB.filter(player => !player.isTop5);

// Exemplo de função para obteres os jogadores de uma equipa específica
export function getPlayersByTeamId(teamId: number): Player[] {
  return PLAYERS_DB.filter(player => player.teamId === teamId);
}
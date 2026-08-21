export interface PlayerTag {
  label: string;
  color: string;
}

export interface Player {
  id: string;
  name: string;
  team: string;
  active: boolean;
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

export const TOP_PLAYERS: Player[] = [
  {
    id: 'top-1',
    name: 'Carlos Sitoe',
    team: 'Costa do Sol',
    age: 25,
    position: 'Base',
    height: '1.88m',
    active: true,
    division: '1ª Divisão',
    province: 'Maputo Cidade',
    photo: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400',
  },
  {
    id: 'top-2',
    name: 'Nelson Machava',
    team: 'Ferroviário de Maputo',
    age: 28,
    position: 'Extremo',
    height: '1.96m',
    active: true,
    division: '1ª Divisão',
    province: 'Maputo Cidade',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
  },
  {
    id: 'top-3',
    name: 'Helton Ubisse',
    team: 'Maxaquene',
    age: 30,
    position: 'Poste',
    height: '2.04m',
    active: false,
    division: '1ª Divisão',
    province: 'Sofala',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
  },
  {
    id: 'top-4',
    name: 'Pio Matos',
    team: 'Desportivo de Maputo',
    age: 31,
    position: 'Base',
    height: '1.85m',
    active: true,
    division: '2ª Divisão',
    province: 'Gaza',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
  },
  {
    id: 'top-5',
    name: 'Ayad Munguambe',
    team: 'Ferroviário da Beira',
    age: 23,
    position: 'Ala-Pivô',
    height: '2.01m',
    active: true,
    division: '1ª Divisão',
    province: 'Sofala',
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400',
  },
];

export const INITIAL_PLAYERS: Player[] = [
  {
    id: '1',
    name: 'Robert Marter',
    team: 'Ferroviário',
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
    id: '2',
    name: 'Seth Tuttiano',
    team: 'Maxaquene',
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
    id: '3',
    name: 'Derek Minhouse',
    team: 'Ferroviário',
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
    id: '4',
    name: 'Gabriela Morvalho',
    team: 'Maxaquene',
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
    id: '5',
    name: 'Murilo Nakroncalves',
    team: 'Costa do Sol',
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
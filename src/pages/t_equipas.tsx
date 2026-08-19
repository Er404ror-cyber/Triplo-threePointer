export interface Team {
  id: string;
  name: string;
  city: string;
  division: string;
  initials: string;
  color: string;
  logo?: string;
  photo?: string;
  avatarUrl?: string;
  founded?: number;
  players?: number;
  description?: string;
}

export const TOP_TEAMS: Team[] = [
  {
    id: '1',
    name: 'Costa do Sol',
    city: 'Maputo, MZ',
    division: '1ª Divisão',
    initials: 'CDS',
    color: '#2563eb',
    logo: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=400&q=80',
    founded: 1949,
    players: 14,
  },
  {
    id: '2',
    name: 'Ferroviário de Maputo',
    city: 'Maputo, MZ',
    division: '1ª Divisão',
    initials: 'FRM',
    color: '#dc2626',
    // URL nova e estável para Ferroviário de Maputo
    logo: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=400&q=80',
    founded: 1926,
    players: 16,
  },
  {
    id: '3',
    name: 'Maxaquene',
    city: 'Maputo, MZ',
    division: '1ª Divisão',
    initials: 'MAX',
    color: '#0891b2',
    logo: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=400&q=80',
    founded: 1932,
    players: 15,
  },
  {
    id: '4',
    name: 'Ferroviário da Beira',
    city: 'Beira, MZ',
    division: '1ª Divisão',
    initials: 'FRB',
    color: '#7c3aed',
    // URL nova e estável para Ferroviário da Beira
    logo: 'https://images.unsplash.com/photo-1519766304817-4f37bda74a29?auto=format&fit=crop&w=400&q=80',
    founded: 1933,
    players: 13,
  },
  {
    id: '5',
    name: 'Textáfrica',
    city: 'Chimoio, MZ',
    division: '1ª Divisão',
    initials: 'TXT',
    color: '#0d9488',
    logo: 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&w=400&q=80',
    founded: 1965,
    players: 12,
  },
];

export const ALL_TEAMS: Team[] = [
  ...TOP_TEAMS,
 {
    id: '6',
    name: 'Desportivo de Maputo',
    city: 'Maputo, MZ',
    division: '2ª Divisão',
    initials: 'DSM',
    color: '#64748b',
    // URL nova e estável
    logo: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=400&q=80',
    founded: 1920,
    players: 12,
  },
  {
    id: '7',
    name: 'Clube K.a.T',
    city: 'Maputo, MZ',
    division: '2ª Divisão',
    initials: 'KAT',
    color: '#ca8a04',
    logo: 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?auto=format&fit=crop&w=400&q=80',
    founded: 2001,
    players: 11,
  },
  {
    id: '8',
    name: 'Liceu de Maputo',
    city: 'Maputo, MZ',
    division: '2ª Divisão',
    initials: 'LIC',
    color: '#be185d',
    logo: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?auto=format&fit=crop&w=400&q=80',
    founded: 1943,
    players: 10,
  },
  {
    id: '9',
    name: '1º de Maio',
    city: 'Nampula, MZ',
    division: '1ª Divisão',
    initials: '1DM',
    color: '#4f46e5',
    logo: 'https://images.unsplash.com/photo-1511193311914-0346f16efe90?auto=format&fit=crop&w=400&q=80',
    founded: 1975,
    players: 14,
  },
  {
    id: '10',
    name: 'Associação de Gaza',
    city: 'Xai-Xai, MZ',
    division: '2ª Divisão',
    initials: 'AGZ',
    color: '#059669',
    logo: 'https://images.unsplash.com/photo-1505666287802-931dc83948e9?auto=format&fit=crop&w=400&q=80',
    founded: 1980,
    players: 12,
  },
];
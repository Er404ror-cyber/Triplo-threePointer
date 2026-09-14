import { Shield, Gamepad2, Flame, CalendarDays, Trophy, Users } from 'lucide-react';

export interface StatCard {
  icon: React.ElementType;
  value: string;
  label: string;
  trend?: string;
  trendUp?: boolean;
  highlighted?: boolean;
}

export const STAT_CARDS: StatCard[] = [
  { icon: Shield, value: '10', label: 'Equipas ativas', trend: '+2 este mês', trendUp: true },
  { icon: Gamepad2, value: '20', label: 'Partidas disputadas', trend: '+5 este mês', trendUp: true, highlighted: true },
  { icon: Flame, value: '82.4', label: 'Média de pontos/jogo', trend: '+3.1 vs época passada', trendUp: true },
  { icon: CalendarDays, value: '3', label: 'Jogos por marcar esta semana' },
];

export const QUICK_ACTIONS = [
  { icon: Shield, title: 'Adicionar nova equipa', description: 'Cadastre um novo clube ou seleção na base de dados.', path: '/admin/newplay', buttonText: 'Adicionar equipa' },
  { icon: Gamepad2, title: 'Adicionar nova partida', description: 'Registe o resultado ou agende um novo jogo.', path: '/admin/newpartida', buttonText: 'Adicionar partida' },
];

export const RECENT_ACTIVITY = [
  { icon: Shield, title: 'Nova equipa "Ferroviário de Nampula" adicionada', time: 'há 2 horas' },
  { icon: Gamepad2, title: 'Resultado de "Costa do Sol vs Maxaquene" atualizado (78–71)', time: 'há 5 horas' },
  { icon: Trophy, title: 'Campeonato Nacional marcado como encerrado', time: 'há 2 dias' },
  { icon: Users, title: 'Ficha de jogador de "Ferroviário da Beira" atualizada', time: 'há 3 dias' },
];

export const STANDINGS = [
  { pos: 1, team: 'Ferroviário de Maputo', color: '#1d4ed8', initials: 'FM', v: 9, d: 1, pts: 18 },
  { pos: 2, team: 'Maxaquene', color: '#dc2626', initials: 'MX', v: 8, d: 2, pts: 16 },
  { pos: 3, team: 'Costa do Sol', color: '#0891b2', initials: 'CS', v: 7, d: 3, pts: 14 },
  { pos: 4, team: 'Ferroviário de Nampula', color: '#ea580c', initials: 'FN', v: 6, d: 4, pts: 12 },
  { pos: 5, team: 'Ferroviário da Beira', color: '#16a34a', initials: 'FB', v: 5, d: 5, pts: 10 },
];

export const UPCOMING_GAMES = [
  { home: 'Ferroviário de Maputo', away: 'Maxaquene', homeInitials: 'FM', awayInitials: 'MX', homeColor: '#1d4ed8', awayColor: '#dc2626', date: 'Sáb, 6 set', time: '15:30', venue: 'Pavilhão do Maxaquene' },
  { home: 'Costa do Sol', away: 'Ferroviário de Nampula', homeInitials: 'CS', awayInitials: 'FN', homeColor: '#0891b2', awayColor: '#ea580c', date: 'Dom, 7 set', time: '17:00', venue: 'Pavilhão Costa do Sol' },
  { home: 'Ferroviário da Beira', away: 'Desportivo de Nampula', homeInitials: 'FB', awayInitials: 'DN', homeColor: '#16a34a', awayColor: '#7c3aed', date: 'Ter, 9 set', time: '19:00', venue: 'Pavilhão Municipal da Beira' },
];

export const TOP_SCORERS = [
  { name: 'Yassine Bila', team: 'Ferroviário de Maputo', points: 24.6, gamesPlayed: 10 },
  { name: 'Edson Come', team: 'Maxaquene', points: 22.1, gamesPlayed: 10 },
  { name: 'Nelson Muianga', team: 'Costa do Sol', points: 19.8, gamesPlayed: 9 },
  { name: 'Aurélio Sitoe', team: 'Ferroviário de Nampula', points: 18.3, gamesPlayed: 10 },
];
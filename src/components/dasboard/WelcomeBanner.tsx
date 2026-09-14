import { Trophy } from 'lucide-react';

export function WelcomeBanner() {
  return (
    <div className="mb-8 flex flex-col justify-between gap-4 rounded-2xl bg-slate-900 p-6 sm:flex-row sm:items-center">
      <div>
        <p className="mb-2 text-xs font-medium text-slate-400">Época 2025/26 · Jornada 10</p>
        <h1 className="mb-1 text-xl font-bold text-white">Bem-vindo de volta, John!</h1>
        <p className="text-sm text-slate-400">O Ferroviário de Maputo lidera a classificação. Há 3 jogos por marcar esta semana.</p>
      </div>
      <div className="flex h-16 w-16 shrink-0 items-center justify-center self-end rounded-xl bg-orange-500 sm:self-center">
        <Trophy size={26} className="text-white" />
      </div>
    </div>
  );
}
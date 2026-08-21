import { Link, useParams } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { ALL_TEAMS } from './t_equipas';
import { TeamDetailsCard } from '../components/TeamDetailsCard';
import { TeamNotFound } from '../components/TeamNotFound';

export default function T_Details() {
  const { id } = useParams<{ id: string }>();
  const team = ALL_TEAMS.find((t) => t.id === id);

  if (!team) {
    return <TeamNotFound />;
  }

  return (
    <div className="min-h-screen bg-slate-100 p-4 font-sans text-slate-900 sm:p-6 md:p-8">
      <div className="mx-auto max-w-4xl">
        <Link
          to="/admin/equipas"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
        >
          <ChevronLeft size={16} />
          Voltar às equipas
        </Link>

        <TeamDetailsCard team={team} />
      </div>
    </div>
  );
}
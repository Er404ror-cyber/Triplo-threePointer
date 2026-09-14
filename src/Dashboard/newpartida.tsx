import { Link } from "react-router-dom";
import { ChevronLeft, Trophy } from "lucide-react";
import MatchForm from "../components/MatchForm";
import { useMatchForm } from "../types/useMatchForm";

export default function NewPartida() {
  const formState = useMatchForm();

  const formData = {
    homeTeamId: formState.homeTeamId,
    awayTeamId: formState.awayTeamId,
    homeScore: formState.homeScore,
    awayScore: formState.awayScore,
    matchDate: formState.matchDate,
    location: formState.location,
    division: formState.division,
    error: formState.error,
  };

  const actions = {
    setHomeTeamId: formState.setHomeTeamId,
    setAwayTeamId: formState.setAwayTeamId,
    setHomeScore: formState.setHomeScore,
    setAwayScore: formState.setAwayScore,
    setMatchDate: formState.setMatchDate,
    setLocation: formState.setLocation,
    setDivision: formState.setDivision,
    handleSubmit: formState.handleSubmit,
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 font-sans text-slate-900 md:p-8">
      <div className="mx-auto max-w-2xl">
        <Link
          to="/admin/dashboard"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700"
        >
          <ChevronLeft size={16} />
          Voltar ao dashboard
        </Link>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
              <Trophy size={20} className="text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Nova partida</h1>
              <p className="text-sm text-slate-400">
                Registe o resultado ou agende um novo jogo
              </p>
            </div>
          </div>

          <MatchForm formData={formData} actions={actions} />
        </div>
      </div>
    </div>
  );
}
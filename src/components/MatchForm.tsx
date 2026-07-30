import { Calendar, MapPin } from "lucide-react";
import ErrorAlert from "./ErrorAlert";
import { ALL_TEAMS } from "../pages/t_equipas"; // Ajuste o caminho se necessário

const DIVISIONS = ["1ª Divisão", "2ª Divisão"];

interface MatchFormProps {
  formData: {
    homeTeamId: string;
    awayTeamId: string;
    homeScore: string;
    awayScore: string;
    matchDate: string;
    location: string;
    division: string;
    error: string;
  };
  actions: {
    setHomeTeamId: (val: string) => void;
    setAwayTeamId: (val: string) => void;
    setHomeScore: (val: string) => void;
    setAwayScore: (val: string) => void;
    setMatchDate: (val: string) => void;
    setLocation: (val: string) => void;
    setDivision: (val: string) => void;
    handleSubmit: (e: React.FormEvent) => void;
  };
}

export default function MatchForm({ formData, actions }: MatchFormProps) {
  const {
    homeTeamId,
    awayTeamId,
    homeScore,
    awayScore,
    matchDate,
    location,
    division,
    error,
  } = formData;

  const {
    setHomeTeamId,
    setAwayTeamId,
    setHomeScore,
    setAwayScore,
    setMatchDate,
    setLocation,
    setDivision,
    handleSubmit,
  } = actions;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <ErrorAlert message={error} />}

      {/* Equipas */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">
            Equipa da casa
          </label>
          <select
            value={homeTeamId}
            onChange={(e) => setHomeTeamId(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-400"
            required
          >
            <option value="">Selecione a equipa</option>
            {ALL_TEAMS.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">
            Equipa visitante
          </label>
          <select
            value={awayTeamId}
            onChange={(e) => setAwayTeamId(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-400"
            required
          >
            <option value="">Selecione a equipa</option>
            {ALL_TEAMS.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Resultado */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">
            Pontos — Casa
          </label>
          <input
            type="number"
            min="0"
            value={homeScore}
            onChange={(e) => setHomeScore(e.target.value)}
            placeholder="0"
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-400"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">
            Pontos — Visitante
          </label>
          <input
            type="number"
            min="0"
            value={awayScore}
            onChange={(e) => setAwayScore(e.target.value)}
            placeholder="0"
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-400"
          />
        </div>
      </div>

      {/* Data e local */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">
            Data da partida
          </label>
          <div className="relative">
            <Calendar
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="date"
              value={matchDate}
              onChange={(e) => setMatchDate(e.target.value)}
              className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm text-slate-700 outline-none focus:border-blue-400"
              required
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">
            Local
          </label>
          <div className="relative">
            <MapPin
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ex: Pavilhão da Machava"
              className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm text-slate-700 outline-none focus:border-blue-400"
            />
          </div>
        </div>
      </div>

      {/* Divisão */}
      <div>
        <label className="mb-1 block text-xs font-medium text-slate-600">
          Divisão
        </label>
        <select
          value={division}
          onChange={(e) => setDivision(e.target.value)}
          className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-400"
        >
          {DIVISIONS.map((divOption) => (
            <option key={divOption} value={divOption}>
              {divOption}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
      >
        Guardar partida
      </button>
    </form>
  );
}
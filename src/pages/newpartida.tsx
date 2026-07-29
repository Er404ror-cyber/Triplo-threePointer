import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Calendar, MapPin, Trophy } from 'lucide-react';
import { ALL_TEAMS } from './t_equipas';

export default function NewPartida() {
  const navigate = useNavigate();

  const [homeTeamId, setHomeTeamId] = useState('');
  const [awayTeamId, setAwayTeamId] = useState('');
  const [homeScore, setHomeScore] = useState('');
  const [awayScore, setAwayScore] = useState('');
  const [matchDate, setMatchDate] = useState('');
  const [location, setLocation] = useState('');
  const [division, setDivision] = useState('1ª Divisão');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!homeTeamId || !awayTeamId) {
      setError('Selecione as duas equipas.');
      return;
    }

    if (homeTeamId === awayTeamId) {
      setError('As equipas da casa e visitante não podem ser iguais.');
      return;
    }

    const newMatch = {
      homeTeamId,
      awayTeamId,
      homeScore: Number(homeScore) || 0,
      awayScore: Number(awayScore) || 0,
      matchDate,
      location,
      division,
    };

    // TODO: substituir por chamada real ao Supabase (insert na tabela de partidas)
    console.log('Nova partida:', newMatch);

    navigate('/admin/dashboard');
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
              <p className="text-sm text-slate-400">Registe o resultado ou agende um novo jogo</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-600">
                {error}
              </div>
            )}

            {/* Equipas */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Equipa da casa</label>
                <select
                  value={homeTeamId}
                  onChange={(e) => setHomeTeamId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-400"
                  required
                >
                  <option value="">Selecione a equipa</option>
                  {ALL_TEAMS.map((team) => (
                    <option key={team.id} value={team.id}>{team.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Equipa visitante</label>
                <select
                  value={awayTeamId}
                  onChange={(e) => setAwayTeamId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-400"
                  required
                >
                  <option value="">Selecione a equipa</option>
                  {ALL_TEAMS.map((team) => (
                    <option key={team.id} value={team.id}>{team.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Resultado */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Pontos — Casa</label>
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
                <label className="mb-1 block text-xs font-medium text-slate-600">Pontos — Visitante</label>
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
                <label className="mb-1 block text-xs font-medium text-slate-600">Data da partida</label>
                <div className="relative">
                  <Calendar size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
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
                <label className="mb-1 block text-xs font-medium text-slate-600">Local</label>
                <div className="relative">
                  <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
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
              <label className="mb-1 block text-xs font-medium text-slate-600">Divisão</label>
              <select
                value={division}
                onChange={(e) => setDivision(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-400"
              >
                <option value="1ª Divisão">1ª Divisão</option>
                <option value="2ª Divisão">2ª Divisão</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Guardar partida
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
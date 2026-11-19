import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Save,
  Plus,
  Minus,
  Trophy,
  X,
  Edit3,
  Loader2,
  CheckCircle2,
  Shield,
  Users,
  User,
  Swords,
  RotateCcw
} from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabaseClient';

interface EquipaStandings {
  id: string;
  name: string;
  province?: string;
  division?: string;
  header_color?: string;
  crest_url?: string;
  points: number;
  games_played: number;
  wins: number;
  draws: number;
  losses: number;
}

type EditMode = 'view' | 'single' | 'match';

function getInitials(name: string): string {
  if (!name) return 'EQ';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function StandingsTable() {
  const queryClient = useQueryClient();

  // Modos: 'view' (visualização), 'single' (1 equipa), 'match' (confronto 2 equipas)
  const [editMode, setEditMode] = useState<EditMode>('view');
  const [showModeModal, setShowModeModal] = useState(false);

  // Estados do Modo Confronto (2 Equipas)
  const [teamAId, setTeamAId] = useState<string>('');
  const [teamBId, setTeamBId] = useState<string>('');
  const [matchHistory, setMatchHistory] = useState<string[]>([]);

  const [localTeams, setLocalTeams] = useState<EquipaStandings[]>([]);
  const [dirtyIds, setDirtyIds] = useState<Record<string, boolean>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [selectedDivision, setSelectedDivision] = useState<string>('ALL');

  // 1. Carrega as equipas com React Query (cache de 10 minutos)
  const { data: teamsFromDb = [], isLoading, error } = useQuery<EquipaStandings[]>({
    queryKey: ['teams-standings'],
    queryFn: async () => {
      const { data, error: fetchError } = await supabase
        .from('teams')
        .select('*');

      if (fetchError) throw new Error(fetchError.message);

      return (data || []).map((t: any) => ({
        id: String(t.id),
        name: t.name || t.nome || 'Equipa Sem Nome',
        province: t.province || '',
        division: t.division || 'Principal',
        header_color: t.header_color || t.color || '#2563eb',
        crest_url: t.crest_url || '',
        points: Number(t.points ?? t.pontos ?? 0) || 0,
        games_played: Number(t.games_played ?? t.jogos ?? 0) || 0,
        wins: Number(t.wins ?? t.vitorias ?? 0) || 0,
        draws: Number(t.draws ?? t.empates ?? 0) || 0,
        losses: Number(t.losses ?? t.derrotas ?? 0) || 0,
      }));
    },
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (teamsFromDb.length > 0) {
      setLocalTeams(teamsFromDb);
      setDirtyIds({});
    }
  }, [teamsFromDb]);

  const divisions = useMemo(() => {
    const set = new Set(localTeams.map((t) => t.division).filter(Boolean));
    return Array.from(set) as string[];
  }, [localTeams]);

  const sortedTeams = useMemo(() => {
    const filtered =
      selectedDivision === 'ALL'
        ? localTeams
        : localTeams.filter((t) => t.division === selectedDivision);

    return [...filtered].sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.wins !== a.wins) return b.wins - a.wins;
      return a.name.localeCompare(b.name);
    });
  }, [localTeams, selectedDivision]);

  const teamA = useMemo(
    () => localTeams.find((t) => t.id === teamAId) || null,
    [localTeams, teamAId]
  );

  const teamB = useMemo(
    () => localTeams.find((t) => t.id === teamBId) || null,
    [localTeams, teamBId]
  );

  const hasUnsavedChanges = Object.keys(dirtyIds).length > 0;
  const isEditing = editMode !== 'view';

  // Abre a pergunta ao clicar em "Editar Pontos"
  const handleOpenEditPrompt = () => {
    setLocalTeams(teamsFromDb);
    setDirtyIds({});
    setTeamAId('');
    setTeamBId('');
    setMatchHistory([]);
    setShowModeModal(true);
  };

  // Inicia o modo escolhido pelo utilizador
  const handleSelectEditMode = (mode: 'single' | 'match') => {
    setShowModeModal(false);
    setEditMode(mode);
  };

  // Cancela qualquer modo de edição e volta para visualização
  const handleCancelEditing = () => {
    setLocalTeams(teamsFromDb);
    setDirtyIds({});
    setTeamAId('');
    setTeamBId('');
    setMatchHistory([]);
    setEditMode('view');
  };

  // Recalcula Jogos e Pontos segundo a regra do Basquetebol Moçambicano (V=2, E=1, D=1)
  const recalculateTeam = (team: EquipaStandings): EquipaStandings => {
    const v = Math.max(0, Number(team.wins) || 0);
    const e = Math.max(0, Number(team.draws) || 0);
    const d = Math.max(0, Number(team.losses) || 0);
    return {
      ...team,
      wins: v,
      draws: e,
      losses: d,
      games_played: v + e + d,
      points: v * 2 + e * 1 + d * 1,
    };
  };

  // ============================================================================
  // LÓGICA DO MODO INDIVIDUAL (1 EQUIPA)
  // ============================================================================
  const updateSingleTeamStat = (
    teamId: string,
    field: 'points' | 'games_played' | 'wins' | 'draws' | 'losses',
    value: number
  ) => {
    const safeValue = Math.max(0, Math.floor(Number(value) || 0));

    setLocalTeams((prev) =>
      prev.map((team) => {
        if (team.id !== teamId) return team;
        const updated = { ...team, [field]: safeValue };

        if (field === 'wins' || field === 'draws' || field === 'losses') {
          return recalculateTeam(updated);
        }
        return updated;
      })
    );

    setDirtyIds((prev) => ({ ...prev, [teamId]: true }));
  };

  // ============================================================================
  // LÓGICA INTELIGENTE DO MODO CONFRONTO (2 EQUIPAS)
  // ============================================================================
  const handleSelectTeamInTable = (clickedId: string) => {
    if (editMode !== 'match') return;

    if (teamAId === clickedId) {
      setTeamAId('');
      return;
    }
    if (teamBId === clickedId) {
      setTeamBId('');
      return;
    }

    if (!teamAId) {
      setTeamAId(clickedId);
    } else if (!teamBId) {
      setTeamBId(clickedId);
    } else {
      // Se ambas já estão escolhidas, substitui a segunda equipa
      setTeamBId(clickedId);
    }
  };

  // Aplica o resultado do confronto entre Equipa A e Equipa B simultaneamente
  const applyMatchResult = (outcome: 'A_WIN' | 'DRAW' | 'B_WIN') => {
    if (!teamA || !teamB) {
      toast.error('Selecione as 2 equipas primeiro.');
      return;
    }

    setLocalTeams((prev) =>
      prev.map((team) => {
        if (team.id === teamA.id) {
          if (outcome === 'A_WIN') return recalculateTeam({ ...team, wins: team.wins + 1 });
          if (outcome === 'B_WIN') return recalculateTeam({ ...team, losses: team.losses + 1 });
          return recalculateTeam({ ...team, draws: team.draws + 1 });
        }
        if (team.id === teamB.id) {
          if (outcome === 'B_WIN') return recalculateTeam({ ...team, wins: team.wins + 1 });
          if (outcome === 'A_WIN') return recalculateTeam({ ...team, losses: team.losses + 1 });
          return recalculateTeam({ ...team, draws: team.draws + 1 });
        }
        return team;
      })
    );

    setDirtyIds((prev) => ({
      ...prev,
      [teamA.id]: true,
      [teamB.id]: true,
    }));

    const label =
      outcome === 'A_WIN'
        ? `Vitória de ${teamA.name} (+2 pts) · Derrota de ${teamB.name} (+1 pt)`
        : outcome === 'B_WIN'
        ? `Vitória de ${teamB.name} (+2 pts) · Derrota de ${teamA.name} (+1 pt)`
        : `Empate registado (+1 pt para ${teamA.name} e ${teamB.name})`;

    setMatchHistory((prev) => [label, ...prev]);
    toast.success(label);
  };

  // Permite ajustar manualmente V, E ou D de uma das 2 equipas refletindo na adversária
  const handlePairedStatStep = (
    targetSide: 'A' | 'B',
    stat: 'wins' | 'draws' | 'losses',
    delta: 1 | -1
  ) => {
    if (!teamA || !teamB) return;

    const actor = targetSide === 'A' ? teamA : teamB;
    const opponent = targetSide === 'A' ? teamB : teamA;

    // Impede valores negativos em qualquer uma das duas equipas
    if (delta === -1) {
      if (actor[stat] <= 0) return;
      if (stat === 'wins' && opponent.losses <= 0) return;
      if (stat === 'losses' && opponent.wins <= 0) return;
      if (stat === 'draws' && opponent.draws <= 0) return;
    }

    setLocalTeams((prev) =>
      prev.map((team) => {
        if (team.id === actor.id) {
          return recalculateTeam({ ...team, [stat]: team[stat] + delta });
        }
        if (team.id === opponent.id) {
          if (stat === 'wins') {
            return recalculateTeam({ ...team, losses: opponent.losses + delta });
          }
          if (stat === 'losses') {
            return recalculateTeam({ ...team, wins: opponent.wins + delta });
          }
          return recalculateTeam({ ...team, draws: opponent.draws + delta });
        }
        return team;
      })
    );

    setDirtyIds((prev) => ({
      ...prev,
      [teamA.id]: true,
      [teamB.id]: true,
    }));
  };

  // Salva todas as alterações no Supabase e volta para o modo visualização
  const handleSaveAll = async () => {
    if (!hasUnsavedChanges) {
      setEditMode('view');
      return;
    }

    setIsSaving(true);
    try {
      const updates = localTeams
        .filter((team) => dirtyIds[team.id])
        .map((team) =>
          supabase
            .from('teams')
            .update({
              points: Number(team.points) || 0,
              games_played: Number(team.games_played) || 0,
              wins: Number(team.wins) || 0,
              draws: Number(team.draws) || 0,
              losses: Number(team.losses) || 0,
            })
            .eq('id', team.id)
        );

      const results = await Promise.all(updates);
      const failed = results.find((r) => r.error);

      if (failed?.error) {
        throw new Error(failed.error.message);
      }

      queryClient.setQueryData(['teams-standings'], localTeams);
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      setDirtyIds({});
      setTeamAId('');
      setTeamBId('');
      setMatchHistory([]);
      setEditMode('view');
      toast.success('Classificação atualizada com sucesso!');
    } catch (err: any) {
      console.error('Erro ao salvar classificação:', err);
      toast.error(err.message || 'Erro ao salvar alterações.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white p-10 text-slate-500 shadow-sm">
        <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
        <span className="text-sm font-medium">A carregar classificação...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm font-semibold text-rose-600 shadow-sm">
        Erro ao carregar classificação: {(error as Error).message}
      </div>
    );
  }

  return (
    <>
      {/* Fundo escurecido quando está no modo de confronto entre 2 equipas */}
      {editMode === 'match' && (
        <div
          onClick={handleCancelEditing}
          className="fixed inset-0 z-30 bg-slate-950/60 backdrop-blur-[2px] transition-opacity"
        />
      )}

      {/* MODAL DE PERGUNTA: 2 EQUIPAS OU 1 EQUIPA? */}
      {showModeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <Swords size={22} />
              </div>
              <button
                type="button"
                onClick={() => setShowModeModal(false)}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <h3 className="text-lg font-bold text-slate-900">
              Deseja editar pontos de 2 equipas que jogaram entre si?
            </h3>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
              No basquetebol, o resultado de uma partida afeta as duas equipas ao mesmo tempo
              (Vitória = +2 pts e Derrota = +1 pt, ou Empate = +1 pt para ambas).
            </p>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => handleSelectEditMode('match')}
                className="flex flex-col items-start gap-1.5 rounded-2xl border-2 border-blue-600 bg-blue-50/60 p-4 text-left transition hover:bg-blue-100/70 active:scale-98"
              >
                <div className="flex items-center gap-2 font-bold text-blue-700 text-sm">
                  <Users size={16} />
                  Sim (2 Equipas)
                </div>
                <span className="text-[11px] text-blue-800/80">
                  Escolher as 2 equipas do jogo e calcular automaticamente.
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectEditMode('single')}
                className="flex flex-col items-start gap-1.5 rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:border-slate-300 hover:bg-slate-50 active:scale-98"
              >
                <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                  <User size={16} />
                  Não (Individual)
                </div>
                <span className="text-[11px] text-slate-500">
                  Alterar pontos, vitórias ou derrotas de forma manual.
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CARTÃO PRINCIPAL DA CLASSIFICAÇÃO (elevado sobre o fundo escuro no modo 'match') */}
      <div
        className={`rounded-2xl border bg-white p-5 transition-all sm:p-6 ${
          editMode === 'match'
            ? 'relative z-40 border-blue-400/60 shadow-2xl ring-4 ring-blue-500/20'
            : 'border-slate-200/90 shadow-sm'
        }`}
      >
        {/* Cabeçalho */}
        <div className="mb-5 flex flex-col gap-4 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Trophy size={20} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">Classificação</h2>
                {editMode === 'match' && (
                  <span className="rounded-full bg-blue-600 px-2.5 py-0.5 text-[11px] font-bold text-white">
                    Confronto entre 2 Equipas
                  </span>
                )}
                {editMode === 'single' && (
                  <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold text-amber-800">
                    Edição Individual
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                {editMode === 'match'
                  ? 'Selecione a 1ª e a 2ª equipa para registar o resultado do jogo entre elas.'
                  : editMode === 'single'
                  ? 'Regra Basquetebol MZ: Vitória = 2 pts · Empate = 1 pt · Derrota = 1 pt.'
                  : 'Campeonato Nacional · Época 2025/26'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={handleCancelEditing}
                  disabled={isSaving}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  <X size={14} />
                  Cancelar
                </button>

                <button
                  type="button"
                  onClick={handleSaveAll}
                  disabled={isSaving}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 active:scale-95 disabled:opacity-60"
                >
                  {isSaving ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Save size={14} />
                  )}
                  {hasUnsavedChanges
                    ? `Salvar (${Object.keys(dirtyIds).length})`
                    : 'Concluir'}
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleOpenEditPrompt}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800 active:scale-95"
                >
                  <Edit3 size={14} />
                  Editar Pontos
                </button>

                <Link
                  to="/admin/equipas"
                  className="inline-flex items-center gap-1 rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
                >
                  Gerir equipas &gt;
                </Link>
              </>
            )}
          </div>
        </div>

        {/* ========================================================================
            PAINEL INTERATIVO DE CONFRONTO ENTRE 2 EQUIPAS (MODO 'MATCH')
           ======================================================================== */}
        {editMode === 'match' && (
          <div className="mb-6 rounded-2xl border border-blue-200 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 p-5 text-white shadow-lg">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-300">
                <Swords size={15} />
                <span>Painel de Confronto Direto</span>
              </div>
              {(teamAId || teamBId) && (
                <button
                  type="button"
                  onClick={() => {
                    setTeamAId('');
                    setTeamBId('');
                  }}
                  className="inline-flex items-center gap-1 text-[11px] text-slate-300 hover:text-white"
                >
                  <RotateCcw size={12} /> Trocar equipas
                </button>
              )}
            </div>

            {/* Seletores das 2 Equipas */}
            <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-[1fr_auto_1fr]">
              {/* 1ª Equipa */}
              <div className="rounded-xl border border-white/15 bg-white/10 p-3.5 backdrop-blur-xs">
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-blue-300">
                  1ª Equipa (Casa)
                </label>
                <select
                  value={teamAId}
                  onChange={(e) => setTeamAId(e.target.value)}
                  className="w-full rounded-lg border border-white/20 bg-slate-900/90 px-3 py-2 text-sm font-semibold text-white outline-none focus:border-blue-400"
                >
                  <option value="">-- Selecione a 1ª equipa --</option>
                  {sortedTeams.map((t) => (
                    <option key={t.id} value={t.id} disabled={t.id === teamBId}>
                      {t.name} ({t.points} pts)
                    </option>
                  ))}
                </select>

                {teamA && (
                  <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-2.5 text-xs">
                    <span className="text-slate-300">
                      V: <strong className="text-emerald-400">{teamA.wins}</strong> · E:{' '}
                      <strong className="text-amber-300">{teamA.draws}</strong> · D:{' '}
                      <strong className="text-rose-400">{teamA.losses}</strong>
                    </span>
                    <span className="rounded-md bg-blue-500/30 px-2 py-0.5 font-extrabold text-white">
                      {teamA.points} PTS
                    </span>
                  </div>
                )}
              </div>

              {/* VS */}
              <div className="flex items-center justify-center">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-xs font-black tracking-widest text-amber-300">
                  VS
                </span>
              </div>

              {/* 2ª Equipa */}
              <div className="rounded-xl border border-white/15 bg-white/10 p-3.5 backdrop-blur-xs">
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-amber-300">
                  2ª Equipa (Visitante)
                </label>
                <select
                  value={teamBId}
                  onChange={(e) => setTeamBId(e.target.value)}
                  className="w-full rounded-lg border border-white/20 bg-slate-900/90 px-3 py-2 text-sm font-semibold text-white outline-none focus:border-amber-400"
                >
                  <option value="">-- Selecione a 2ª equipa --</option>
                  {sortedTeams.map((t) => (
                    <option key={t.id} value={t.id} disabled={t.id === teamAId}>
                      {t.name} ({t.points} pts)
                    </option>
                  ))}
                </select>

                {teamB && (
                  <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-2.5 text-xs">
                    <span className="text-slate-300">
                      V: <strong className="text-emerald-400">{teamB.wins}</strong> · E:{' '}
                      <strong className="text-amber-300">{teamB.draws}</strong> · D:{' '}
                      <strong className="text-rose-400">{teamB.losses}</strong>
                    </span>
                    <span className="rounded-md bg-amber-500/30 px-2 py-0.5 font-extrabold text-white">
                      {teamB.points} PTS
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Ações rápidas de resultado quando as 2 equipas estão escolhidas */}
            {teamA && teamB ? (
              <div className="mt-5 space-y-4 border-t border-white/10 pt-4">
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                  <button
                    type="button"
                    onClick={() => applyMatchResult('A_WIN')}
                    className="flex flex-col items-center justify-center rounded-xl bg-emerald-600 px-3 py-2.5 text-center transition hover:bg-emerald-500 active:scale-95"
                  >
                    <span className="text-xs font-extrabold text-white">
                      Vitória {teamA.name}
                    </span>
                    <span className="text-[10px] text-emerald-100">
                      {teamA.name} +2 pts · {teamB.name} +1 pt (D)
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => applyMatchResult('DRAW')}
                    className="flex flex-col items-center justify-center rounded-xl bg-amber-500 px-3 py-2.5 text-center text-slate-950 transition hover:bg-amber-400 active:scale-95"
                  >
                    <span className="text-xs font-extrabold">Empate (E)</span>
                    <span className="text-[10px] font-semibold text-slate-900/80">
                      +1 pt e +1 E para as 2 equipas
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => applyMatchResult('B_WIN')}
                    className="flex flex-col items-center justify-center rounded-xl bg-emerald-600 px-3 py-2.5 text-center transition hover:bg-emerald-500 active:scale-95"
                  >
                    <span className="text-xs font-extrabold text-white">
                      Vitória {teamB.name}
                    </span>
                    <span className="text-[10px] text-emerald-100">
                      {teamB.name} +2 pts · {teamA.name} +1 pt (D)
                    </span>
                  </button>
                </div>

                {/* Ajuste fino sincronizado (- / +) */}
                <div className="grid grid-cols-1 gap-3 rounded-xl bg-black/25 p-3 text-xs sm:grid-cols-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate font-semibold text-blue-200">{teamA.name}:</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handlePairedStatStep('A', 'wins', -1)}
                        className="rounded bg-white/10 px-2 py-1 hover:bg-white/20"
                        title="Remover 1 Vitória de A (e 1 Derrota de B)"
                      >
                        -V
                      </button>
                      <button
                        type="button"
                        onClick={() => handlePairedStatStep('A', 'wins', 1)}
                        className="rounded bg-emerald-500/30 px-2 py-1 text-emerald-200 hover:bg-emerald-500/40"
                        title="Adicionar 1 Vitória a A (e 1 Derrota a B)"
                      >
                        +V
                      </button>
                      <button
                        type="button"
                        onClick={() => handlePairedStatStep('A', 'draws', -1)}
                        className="rounded bg-white/10 px-2 py-1 hover:bg-white/20"
                        title="Remover 1 Empate de ambas"
                      >
                        -E
                      </button>
                      <button
                        type="button"
                        onClick={() => handlePairedStatStep('A', 'draws', 1)}
                        className="rounded bg-amber-500/30 px-2 py-1 text-amber-200 hover:bg-amber-500/40"
                        title="Adicionar 1 Empate a ambas"
                      >
                        +E
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate font-semibold text-amber-200">{teamB.name}:</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handlePairedStatStep('B', 'wins', -1)}
                        className="rounded bg-white/10 px-2 py-1 hover:bg-white/20"
                        title="Remover 1 Vitória de B (e 1 Derrota de A)"
                      >
                        -V
                      </button>
                      <button
                        type="button"
                        onClick={() => handlePairedStatStep('B', 'wins', 1)}
                        className="rounded bg-emerald-500/30 px-2 py-1 text-emerald-200 hover:bg-emerald-500/40"
                        title="Adicionar 1 Vitória a B (e 1 Derrota a A)"
                      >
                        +V
                      </button>
                      <button
                        type="button"
                        onClick={() => handlePairedStatStep('B', 'losses', 1)}
                        className="rounded bg-rose-500/30 px-2 py-1 text-rose-200 hover:bg-rose-500/40"
                        title="Adicionar 1 Derrota a B (e 1 Vitória a A)"
                      >
                        +D
                      </button>
                    </div>
                  </div>
                </div>

                {matchHistory.length > 0 && (
                  <div className="text-[11px] text-emerald-300">
                    Última ação: {matchHistory[0]}
                  </div>
                )}
              </div>
            ) : (
              <p className="mt-4 text-center text-xs text-slate-300">
                Dica: Escolha nos menus acima ou clique diretamente em 2 equipas na tabela abaixo.
              </p>
            )}
          </div>
        )}

        {/* Filtro por Divisão */}
        {divisions.length > 1 && (
          <div className="mb-4 flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSelectedDivision('ALL')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                selectedDivision === 'ALL'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Todas ({localTeams.length})
            </button>
            {divisions.map((div) => (
              <button
                key={div}
                type="button"
                onClick={() => setSelectedDivision(div)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  selectedDivision === div
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {div}
              </button>
            ))}
          </div>
        )}

        {/* Tabela de Classificação */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="w-12 px-3 py-3 text-center">#</th>
                <th className="px-3 py-3">Equipa</th>
                <th className="px-3 py-3 text-center">J</th>
                <th className="px-3 py-3 text-center text-emerald-700">V</th>
                <th className="px-3 py-3 text-center text-amber-700">E</th>
                <th className="px-3 py-3 text-center text-rose-700">D</th>
                <th className="px-3 py-3 text-center">PTS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedTeams.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-xs text-slate-400">
                    Nenhuma equipa registada na base de dados.
                  </td>
                </tr>
              ) : (
                sortedTeams.map((equipa, index) => {
                  const isModified = isEditing && Boolean(dirtyIds[equipa.id]);
                  const isPodium = index < 3;
                  const isSelectedInMatch =
                    editMode === 'match' && (equipa.id === teamAId || equipa.id === teamBId);
                  const isDimmedInMatch =
                    editMode === 'match' &&
                    Boolean(teamAId && teamBId) &&
                    !isSelectedInMatch;

                  return (
                    <tr
                      key={equipa.id}
                      onClick={() => handleSelectTeamInTable(equipa.id)}
                      className={`transition-all ${
                        editMode === 'match' ? 'cursor-pointer' : ''
                      } ${
                        isSelectedInMatch
                          ? 'bg-blue-50/90 ring-1 ring-inset ring-blue-300'
                          : isDimmedInMatch
                          ? 'opacity-40 hover:opacity-80'
                          : isModified
                          ? 'bg-amber-50/60'
                          : 'hover:bg-slate-50/80'
                      }`}
                    >
                      {/* Posição */}
                      <td className="px-3 py-3 text-center">
                        <span
                          className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                            index === 0
                              ? 'bg-amber-400 text-slate-900 shadow-xs'
                              : index === 1
                              ? 'bg-slate-300 text-slate-800'
                              : index === 2
                              ? 'bg-amber-700/20 text-amber-800'
                              : 'text-slate-500'
                          }`}
                        >
                          {index + 1}
                        </span>
                      </td>

                      {/* Emblema e Nome da Equipa */}
                      <td className="px-3 py-3">
                        {editMode === 'match' ? (
                          <div className="flex items-center gap-3">
                            {equipa.crest_url ? (
                              <img
                                src={equipa.crest_url}
                                alt={equipa.name}
                                className="h-8 w-8 shrink-0 rounded-full border border-slate-200 object-cover"
                              />
                            ) : (
                              <div
                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white shadow-xs"
                                style={{ backgroundColor: equipa.header_color || '#2563eb' }}
                              >
                                {getInitials(equipa.name)}
                              </div>
                            )}
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="truncate font-semibold text-slate-800">
                                  {equipa.name}
                                </span>
                                {equipa.id === teamAId && (
                                  <span className="rounded bg-blue-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                                    1ª Equipa
                                  </span>
                                )}
                                {equipa.id === teamBId && (
                                  <span className="rounded bg-amber-500 px-1.5 py-0.5 text-[10px] font-bold text-slate-950">
                                    2ª Equipa
                                  </span>
                                )}
                              </div>
                              {equipa.division && (
                                <span className="text-[11px] text-slate-400">
                                  {equipa.division}
                                </span>
                              )}
                            </div>
                          </div>
                        ) : (
                          <Link
                            to={`/admin/equipas/${equipa.id}`}
                            className="group flex items-center gap-3"
                          >
                            {equipa.crest_url ? (
                              <img
                                src={equipa.crest_url}
                                alt={equipa.name}
                                className="h-8 w-8 shrink-0 rounded-full border border-slate-200 object-cover"
                              />
                            ) : (
                              <div
                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white shadow-xs"
                                style={{ backgroundColor: equipa.header_color || '#2563eb' }}
                              >
                                {getInitials(equipa.name)}
                              </div>
                            )}
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="truncate font-semibold text-slate-800 transition-colors group-hover:text-blue-600">
                                  {equipa.name}
                                </span>
                                {isPodium && (
                                  <Shield size={12} className="shrink-0 text-amber-500" />
                                )}
                              </div>
                              {equipa.division && (
                                <span className="text-[11px] text-slate-400">
                                  {equipa.division}
                                </span>
                              )}
                            </div>
                          </Link>
                        )}
                      </td>

                      {/* Jogos (J) */}
                      <td className="px-2 py-3 text-center">
                        <span className="text-xs font-semibold text-slate-600">
                          {equipa.games_played ?? 0}
                        </span>
                      </td>

                      {/* Vitórias (V) */}
                      <td className="px-2 py-3 text-center">
                        {editMode === 'single' ? (
                          <input
                            type="number"
                            min={0}
                            value={equipa.wins ?? 0}
                            onChange={(e) =>
                              updateSingleTeamStat(equipa.id, 'wins', Number(e.target.value))
                            }
                            className="w-12 rounded-lg border border-emerald-200 bg-emerald-50/40 py-1 text-center text-xs font-bold text-emerald-700 outline-none focus:border-emerald-500 focus:bg-white"
                          />
                        ) : (
                          <span className="text-xs font-bold text-emerald-700">
                            {equipa.wins ?? 0}
                          </span>
                        )}
                      </td>

                      {/* Empates (E) */}
                      <td className="px-2 py-3 text-center">
                        {editMode === 'single' ? (
                          <input
                            type="number"
                            min={0}
                            value={equipa.draws ?? 0}
                            onChange={(e) =>
                              updateSingleTeamStat(equipa.id, 'draws', Number(e.target.value))
                            }
                            className="w-12 rounded-lg border border-amber-200 bg-amber-50/40 py-1 text-center text-xs font-bold text-amber-700 outline-none focus:border-amber-500 focus:bg-white"
                          />
                        ) : (
                          <span className="text-xs font-bold text-amber-600">
                            {equipa.draws ?? 0}
                          </span>
                        )}
                      </td>

                      {/* Derrotas (D) */}
                      <td className="px-2 py-3 text-center">
                        {editMode === 'single' ? (
                          <input
                            type="number"
                            min={0}
                            value={equipa.losses ?? 0}
                            onChange={(e) =>
                              updateSingleTeamStat(equipa.id, 'losses', Number(e.target.value))
                            }
                            className="w-12 rounded-lg border border-rose-200 bg-rose-50/40 py-1 text-center text-xs font-bold text-rose-700 outline-none focus:border-rose-500 focus:bg-white"
                          />
                        ) : (
                          <span className="text-xs font-bold text-rose-600">
                            {equipa.losses ?? 0}
                          </span>
                        )}
                      </td>

                      {/* Pontos (PTS) */}
                      <td className="px-3 py-3 text-center">
                        {editMode === 'single' ? (
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() =>
                                updateSingleTeamStat(
                                  equipa.id,
                                  'points',
                                  (equipa.points ?? 0) - 1
                                )
                              }
                              title="Diminuir 1 ponto"
                              className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 active:scale-90"
                            >
                              <Minus size={13} />
                            </button>

                            <input
                              type="number"
                              min={0}
                              value={equipa.points ?? 0}
                              onChange={(e) =>
                                updateSingleTeamStat(equipa.id, 'points', Number(e.target.value))
                              }
                              className="w-14 rounded-lg border border-blue-200 bg-blue-50/50 py-1 text-center text-sm font-extrabold text-slate-900 outline-none focus:border-blue-600 focus:bg-white"
                            />

                            <button
                              type="button"
                              onClick={() =>
                                updateSingleTeamStat(
                                  equipa.id,
                                  'points',
                                  (equipa.points ?? 0) + 1
                                )
                              }
                              title="Adicionar 1 ponto"
                              className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600 active:scale-90"
                            >
                              <Plus size={13} />
                            </button>
                          </div>
                        ) : (
                          <span className="inline-flex min-w-[2.25rem] items-center justify-center rounded-lg bg-slate-100 px-2.5 py-1 text-sm font-extrabold text-slate-900">
                            {equipa.points ?? 0}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Rodapé de status */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 text-[11px] text-slate-400">
          <span>
            {editMode === 'match'
              ? 'As outras equipas ficam atenuadas enquanto edita o confronto direto.'
              : editMode === 'single'
              ? 'Os jogos (J) e pontos (PTS) somam-se automaticamente ao alterar V, E ou D.'
              : 'Ordenado automaticamente por pontuação.'}
          </span>
          {editMode === 'view' && (
            <span className="inline-flex items-center gap-1 font-medium text-emerald-600">
              <CheckCircle2 size={13} /> Sincronizado
            </span>
          )}
        </div>
      </div>
    </>
  );
}
import { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Users, 
  UserCheck, 
  UserX, 
  MapPin, 
  X, 
  Pencil, 
  Trash2, 
  Power, 
  Star,
  Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Header } from '../components/header/header';
import { supabase } from '../lib/supabaseClient';

export interface Player {
  id: string | number;
  team_id?: string;
  name: string;
  team: string;
  active: boolean;
  is_top_5: boolean;
  top_5_order?: number | null;
  position?: string;
  height?: string;
  age?: number;
  initials?: string;
  photo?: string;
  category?: string;
  province?: string;
}

function normalizeText(text: string): string {
  return (text || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
}

function getInitials(name: string): string {
  if (!name) return '??';
  const nameParts = name.trim().split(/\s+/);
  if (nameParts.length === 1) return nameParts[0].substring(0, 2).toUpperCase();
  return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
}

export default function AdminJogadores() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'all' | 'active' | 'inactive'>('all');

  // ==========================================================================
  // CARREGAR JOGADORES REAIS DO SUPABASE
  // ==========================================================================
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const { data, error } = await supabase
          .from('players')
          .select('*');

        if (error) {
          console.error('Erro detalhado do Supabase:', error);
          throw error;
        }

        if (isMounted) {
          setPlayers(data || []);
        }
      } catch (err) {
        console.error('Falha na requisição:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Helper para identificar categoria com segurança
  const getPlayerCategory = (player: Player) => {
    return normalizeText(player.category || '');
  };

  // ==========================================================================
  // ATUALIZAR STATUS (ATIVO / INATIVO) NO SUPABASE
  // ==========================================================================
  const handleToggleActive = async (id: string | number) => {
    const target = players.find((p) => p.id === id);
    if (!target) return;

    const newActive = !target.active;

    setPlayers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, active: newActive } : p))
    );

    const { error } = await supabase
      .from('players')
      .update({ active: newActive })
      .eq('id', id);

    if (error) {
      console.error('Erro ao atualizar status:', error);
      setPlayers((prev) =>
        prev.map((p) => (p.id === id ? { ...p, active: !newActive } : p))
      );
    }
  };

  // ==========================================================================
  // REMOVER JOGADOR NO SUPABASE
  // ==========================================================================
  const handleRemovePlayer = async (id: string | number) => {
    if (!window.confirm('Tem certeza que deseja remover este jogador?')) return;

    const prevPlayers = [...players];
    setPlayers((prev) => prev.filter((p) => p.id !== id));

    const { error } = await supabase
      .from('players')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao remover jogador:', error);
      alert('Erro ao remover da base de dados.');
      setPlayers(prevPlayers);
    }
  };

  // ==========================================================================
  // ALTERNAR TOP 5 (COM VALIDAÇÃO DE NO MÁXIMO 5 POR CATEGORIA) NO SUPABASE
  // ==========================================================================
  const handleToggleTop5 = async (player: Player) => {
    if (player.is_top_5) {
      setPlayers((prev) =>
        prev.map((p) => (p.id === player.id ? { ...p, is_top_5: false } : p))
      );

      const { error } = await supabase
        .from('players')
        .update({ is_top_5: false })
        .eq('id', player.id);

      if (error) {
        console.error('Erro ao remover do Top 5:', error);
        setPlayers((prev) =>
          prev.map((p) => (p.id === player.id ? { ...p, is_top_5: true } : p))
        );
      }
      return;
    }

    const cat = getPlayerCategory(player);
    const isSenior = cat.includes('senior');
    const isJunior = cat.includes('junior') || cat.includes('juvenil');

    if (!isSenior && !isJunior) {
      alert("Atenção: Defina a categoria do atleta como 'Sénior' ou 'Juvenil' antes de destacá-lo.");
      return;
    }

    const categoryLabel = isSenior ? 'Sénior' : 'Juvenil';

    const countCurrent = players.filter((p) => {
      const pCat = getPlayerCategory(p);
      const matchCat = isSenior ? pCat.includes('senior') : (pCat.includes('junior') || pCat.includes('juvenil'));
      return p.is_top_5 && matchCat;
    }).length;

    if (countCurrent >= 5) {
      alert(`Limite atingido! A categoria ${categoryLabel} já possui 5 jogadores selecionados. Remova uma estrela antes de adicionar outro.`);
      return;
    }

    setPlayers((prev) =>
      prev.map((p) => (p.id === player.id ? { ...p, is_top_5: true } : p))
    );

    const { error } = await supabase
      .from('players')
      .update({ is_top_5: true })
      .eq('id', player.id);

    if (error) {
      console.error('Erro ao adicionar ao Top 5:', error);
      setPlayers((prev) =>
        prev.map((p) => (p.id === player.id ? { ...p, is_top_5: false } : p))
      );
    }
  };

  // Filtros dos Top 5 para os cards
  const top5Seniors = useMemo(() => {
    return players.filter((p) => {
      const cat = getPlayerCategory(p);
      return p.is_top_5 && cat.includes('senior');
    });
  }, [players]);

  const top5Juniors = useMemo(() => {
    return players.filter((p) => {
      const cat = getPlayerCategory(p);
      return p.is_top_5 && (cat.includes('junior') || cat.includes('juvenil'));
    });
  }, [players]);

  // Filtro de busca e abas da tabela geral
  const filteredPlayers = useMemo(() => {
    const term = normalizeText(search);
    return players.filter((player) => {
      const matchSearch =
        !term ||
        normalizeText(player.name).includes(term) ||
        normalizeText(player.team).includes(term) ||
        normalizeText(player.category || '').includes(term) ||
        normalizeText(player.province || '').includes(term);

      if (!matchSearch) return false;

      if (tab === 'active') return player.active;
      if (tab === 'inactive') return !player.active;
      return true;
    });
  }, [players, search, tab]);

  const activeCount = useMemo(() => players.filter((p) => p.active).length, [players]);
  const inactiveCount = useMemo(() => players.filter((p) => !p.active).length, [players]);
  const clubsCount = useMemo(() => new Set(players.map((p) => p.team).filter(Boolean)).size, [players]);

  // Função auxiliar para renderizar cada grelha de 5 cards
  const renderTop5CardGrid = (title: string, list: Player[], emptyMsg: string) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400"></span>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            {title}
          </h3>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>Top Performance</span>
          <span className="rounded-md bg-amber-50 px-2 py-0.5 font-bold text-amber-700 border border-amber-200">
            {list.length} / 5
          </span>
        </div>
      </div>

      {list.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-amber-200 bg-amber-50/20 p-6 text-center text-xs text-amber-700">
          {emptyMsg}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {list.map((player) => (
            <div
              key={player.id}
              className="relative flex flex-col items-center justify-between rounded-2xl border border-amber-200 bg-amber-50/40 p-4 text-center transition-all hover:shadow-md hover:border-amber-300"
            >
              <button
                type="button"
                onClick={() => handleToggleTop5(player)}
                title="Remover do Top 5"
                className="absolute top-2.5 right-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-white/80 text-amber-500 shadow-sm transition hover:bg-rose-50 hover:text-rose-600"
              >
                <Star size={13} fill="currentColor" />
              </button>

              <div className="mt-1 mb-2">
                {player.photo ? (
                  <img
                    src={player.photo}
                    alt={player.name}
                    className="h-14 w-14 rounded-full object-cover border-2 border-amber-300 shadow-sm"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-amber-200 bg-amber-100 text-sm font-bold text-amber-900 shadow-sm">
                    {getInitials(player.name)}
                  </div>
                )}
              </div>

              <div className="w-full">
                <h4 className="truncate text-sm font-bold text-slate-800">
                  {player.name}
                </h4>
                <p className="text-[11px] text-slate-400">
                  {player.position || 'Atleta'} {player.age ? `• ${player.age} anos` : ''}
                </p>
              </div>

              <div className="mt-3 flex w-full items-center justify-between border-t border-amber-100 pt-2 text-[10px] text-slate-500">
                <span className="truncate max-w-[55%] text-left">{player.team || 'Sem clube'}</span>
                <span className="rounded bg-white px-1.5 py-0.5 font-medium text-amber-700 shadow-xs">
                  {player.category || '-'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/60 p-4 font-sans text-slate-900 sm:p-6 md:p-8">
       <div className="mx-auto max-w-7xl space-y-8">
        
        {/* 1. HERO / CABEÇALHO */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              BasquetMZ — Gestão de Jogadores
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Consulte e administre os atletas inscritos na temporada.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/admin/newplay"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-95"
            >
              <Plus size={15} />
              Adicionar Jogador
            </Link>
          </div>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-slate-400">
            <Loader2 size={38} className="animate-spin text-blue-600 mb-4" />
            <p className="text-sm font-medium text-slate-500">A carregar atletas do Supabase...</p>
          </div>
        ) : (
          <>
            {/* 2. SECÇÕES TOP 5 (SÉNIOR E JÚNIOR) */}
            <div className="space-y-6">
              {renderTop5CardGrid(
                "Destaques da Temporada — Top 5 Sénior",
                top5Seniors,
                "Nenhum atleta sénior selecionado. Clique na estrela na tabela abaixo para adicionar."
              )}
              {renderTop5CardGrid(
                "Destaques da Temporada — Top 5 Júnior / Juvenil",
                top5Juniors,
                "Nenhum atleta júnior selecionado. Clique na estrela na tabela abaixo para adicionar."
              )}
            </div>

            {/* 3. CARDS DE MÉTRICAS */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
              <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Users size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500">Total de Atletas</p>
                    <p className="text-xl font-bold text-slate-900">{players.length}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <UserCheck size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500">Atletas Ativos</p>
                    <p className="text-xl font-bold text-emerald-700">{activeCount}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                    <UserX size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500">Atletas Inativos</p>
                    <p className="text-xl font-bold text-rose-700">{inactiveCount}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500">Clubes</p>
                    <p className="text-xl font-bold text-slate-900">{clubsCount}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. LISTA GERAL DE JOGADORES (COM ABAS E BUSCA) */}
            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4 sm:p-6 space-y-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1">
                  <button
                    type="button"
                    onClick={() => setTab('all')}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                      tab === 'all'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Todos ({players.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setTab('active')}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                      tab === 'active'
                        ? 'bg-white text-emerald-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Ativos ({activeCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => setTab('inactive')}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                      tab === 'inactive'
                        ? 'bg-white text-rose-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Inativos ({inactiveCount})
                  </button>
                </div>

                <div className="relative w-full sm:w-72">
                  <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Filtrar por nome, clube..."
                    className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-8 text-xs text-slate-700 outline-none transition focus:border-blue-500"
                  />
                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Jogador</th>
                      <th className="px-6 py-4 font-semibold">Equipa & Categoria</th>
                      <th className="px-6 py-4 font-semibold text-center">Status</th>
                      <th className="px-6 py-4 font-semibold text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredPlayers.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-sm text-slate-400">
                          Nenhum jogador encontrado.
                        </td>
                      </tr>
                    ) : (
                      filteredPlayers.map((player) => (
                        <tr key={player.id} className="transition-colors hover:bg-slate-50/50">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              {player.photo ? (
                                <img
                                  src={player.photo}
                                  alt={player.name}
                                  className="h-10 w-10 rounded-full object-cover border border-slate-200"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                  }}
                                />
                              ) : (
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-sm font-bold text-slate-700">
                                  {getInitials(player.name)}
                                </div>
                              )}
                              <div>
                                <div className="font-semibold text-slate-900">
                                  {player.name}
                                </div>
                                <div className="text-xs text-slate-500">
                                  {player.position || 'Sem posição'} • {player.age ? `${player.age} anos` : 'Idade N/A'}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <div className="font-medium text-slate-700">{player.team || '-'}</div>
                            <div className="text-xs text-slate-500">{player.category || player.province || '-'}</div>
                          </td>

                          <td className="px-6 py-4 text-center">
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                                player.active
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50'
                                  : 'bg-rose-50 text-rose-700 border border-rose-200/50'
                              }`}
                            >
                              {player.active ? 'Ativo' : 'Inativo'}
                            </span>
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => handleToggleTop5(player)}
                                title={player.is_top_5 ? "Remover dos Top 5" : "Adicionar aos Top 5"}
                                className={`flex h-8 w-8 items-center justify-center rounded-lg border transition ${
                                  player.is_top_5
                                    ? "border-amber-300 bg-amber-100 text-amber-600 hover:bg-amber-200"
                                    : "border-slate-200 text-slate-400 hover:border-amber-200 hover:bg-amber-50 hover:text-amber-500"
                                }`}
                              >
                                <Star size={15} fill={player.is_top_5 ? "currentColor" : "none"} />
                              </button>

                              <button
                                type="button"
                                onClick={() => handleToggleActive(player.id)}
                                title={player.active ? 'Desativar Jogador' : 'Ativar Jogador'}
                                className={`flex h-8 w-8 items-center justify-center rounded-lg border transition ${
                                  player.active
                                    ? 'border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                                    : 'border-slate-200 text-slate-400 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600'
                                }`}
                              >
                                <Power size={15} />
                              </button>

                              <Link
                                to={`/admin/editplayer/${player.id}`}
                                title="Editar Jogador"
                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                              >
                                <Pencil size={15} />
                              </Link>

                              <button
                                type="button"
                                onClick={() => handleRemovePlayer(player.id)}
                                title="Remover Jogador"
                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
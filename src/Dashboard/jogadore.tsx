import { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Users, 
  UserCheck, 
  UserX,
  MapPin, 
  X,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Header } from '../components/header/header';
import { PlayersTable, Top5Cards, type Player } from '../components/PlayersTable';

// Importa a instância centralizada do Supabase
import { supabase } from '../lib/supabaseClient'; 

function normalizeText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

export default function AdminJogadores() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // ==========================================================================
  // 1. CARREGAR JOGADORES REAIS DO SUPABASE
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
          console.log('Jogadores carregados com sucesso:', data);
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

  // ==========================================================================
  // 2. ATUALIZAR STATUS (ATIVO / INATIVO) NO SUPABASE
  // ==========================================================================
  const toggleActive = async (id: string | number) => {
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
  // 3. APAGAR JOGADOR NO SUPABASE
  // ==========================================================================
  const removePlayer = async (id: string | number) => {
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
  // 4. ATUALIZAR DESTAQUE (TOP 5) NO SUPABASE
  // ==========================================================================
  const handleToggleTop5 = async (player: Player) => {
    const newTop5 = !player.is_top_5;

    setPlayers((prev) =>
      prev.map((p) => (p.id === player.id ? { ...p, is_top_5: newTop5 } : p))
    );

    const { error } = await supabase
      .from('players')
      .update({ is_top_5: newTop5 })
      .eq('id', player.id);

    if (error) {
      console.error('Erro ao atualizar Top 5:', error);
      setPlayers((prev) =>
        prev.map((p) => (p.id === player.id ? { ...p, is_top_5: !newTop5 } : p))
      );
    }
  };

  // ==========================================================================
// 5. TROCAR POSIÇÃO DE UM JOGADOR NO TOP 5 (MOVER PARA CIMA/BAIXO)
// ==========================================================================
const handleMoveTop5 = async (playerId: string | number, direction: 'up' | 'down') => {
  const player = players.find((p) => p.id === playerId);
  if (!player) return;

  const cat = (player.category || '').trim().toLowerCase();
  const isSenior = cat === 'sénior' || cat === 'senior';

  const group = players
    .filter((p) => {
      const pCat = (p.category || '').trim().toLowerCase();
      const matchCat = isSenior
        ? (pCat === 'sénior' || pCat === 'senior')
        : (pCat === 'juvenil' || pCat === 'júnior' || pCat === 'junior');
      return p.is_top_5 && matchCat;
    })
    .sort((a, b) => (a.top_5_order ?? 9999) - (b.top_5_order ?? 9999));

  const currentIndex = group.findIndex((p) => p.id === playerId);
  if (currentIndex === -1) return;

  const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
  if (targetIndex < 0 || targetIndex >= group.length) return;

  const current = group[currentIndex];
  const target = group[targetIndex];

  const currentOrder = current.top_5_order ?? currentIndex + 1;
  const targetOrder = target.top_5_order ?? targetIndex + 1;

  // Atualiza localmente primeiro (otimista)
  setPlayers((prev) =>
    prev.map((p) => {
      if (p.id === current.id) return { ...p, top_5_order: targetOrder };
      if (p.id === target.id) return { ...p, top_5_order: currentOrder };
      return p;
    })
  );

  const { error: error1 } = await supabase
    .from('players')
    .update({ top_5_order: targetOrder })
    .eq('id', current.id);

  const { error: error2 } = await supabase
    .from('players')
    .update({ top_5_order: currentOrder })
    .eq('id', target.id);

  if (error1 || error2) {
    console.error('Erro ao trocar posição:', error1 || error2);
    alert('Não foi possível salvar a nova posição.');
    // Reverte em caso de erro
    setPlayers((prev) =>
      prev.map((p) => {
        if (p.id === current.id) return { ...p, top_5_order: currentOrder };
        if (p.id === target.id) return { ...p, top_5_order: targetOrder };
        return p;
      })
    );
  }
};

  // Filtragem da busca
  const filteredPlayers = useMemo(() => {
    const term = normalizeText(search);
    if (!term) return players;
    return players.filter(
      (player) =>
        normalizeText(player.name || '').includes(term) ||
        normalizeText(player.team || '').includes(term) ||
        normalizeText(player.category || '').includes(term) ||
        normalizeText(player.province || '').includes(term)
    );
  }, [players, search]);

  const activePlayers = useMemo(
    () => filteredPlayers.filter((p) => Boolean(p.active)),
    [filteredPlayers]
  );

  const inactivePlayers = useMemo(
    () => filteredPlayers.filter((p) => !p.active),
    [filteredPlayers]
  );

  return (
    <div className="min-h-screen bg-slate-50/60 p-4 font-sans text-slate-900 sm:p-6 md:p-8">
      <Header />
      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* HEADER */}
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
            <div className="relative w-full sm:w-64">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Pesquisar jogadores..."
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
            {/* DESTAQUES TOP 5 */}
            <Top5Cards 
              players={players} 
              onToggleTop5={handleToggleTop5} 
            />

            {/* MÉTRICAS */}
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
                    <p className="text-xl font-bold text-emerald-700">{activePlayers.length}</p>
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
                    <p className="text-xl font-bold text-rose-700">{inactivePlayers.length}</p>
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
                    <p className="text-xl font-bold text-slate-900">
                      {new Set(players.map((p) => p.team).filter(Boolean)).size}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* TABELA ATIVOS */}
            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 bg-emerald-50/40 px-6 py-4">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
                  <h2 className="text-base font-bold text-slate-900">Jogadores Ativos</h2>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                    {activePlayers.length}
                  </span>
                </div>
                <span className="text-xs font-medium text-emerald-700">Disponíveis para a Temporada</span>
              </div>
              <div className="p-2 sm:p-4">
                <PlayersTable
                  players={activePlayers}
                  onToggleActive={toggleActive}
                  onRemovePlayer={removePlayer}
                  onToggleTop5={handleToggleTop5}
                />
              </div>
            </section>

            {/* TABELA INATIVOS */}
            <section className="rounded-2xl border border-slate-200 bg-white/90 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 bg-slate-100/70 px-6 py-4">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-3 w-3 rounded-full bg-slate-400" />
                  <h2 className="text-base font-bold text-slate-800">Jogadores Inativos / Dispensados</h2>
                  <span className="rounded-full bg-slate-200 px-2.5 py-0.5 text-xs font-bold text-slate-700">
                    {inactivePlayers.length}
                  </span>
                </div>
                <span className="text-xs text-slate-400">Fora de competição</span>
              </div>
              <div className="p-2 sm:p-4">
                {inactivePlayers.length > 0 ? (
                  <PlayersTable
                    players={inactivePlayers}
                    onToggleActive={toggleActive}
                    onRemovePlayer={removePlayer}
                    onToggleTop5={handleToggleTop5}
                  />
                ) : (
                  <div className="flex items-center justify-center gap-2 py-8 text-xs text-slate-400">
                    <AlertCircle size={14} />
                    <span>Nenhum jogador inativo no momento.</span>
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
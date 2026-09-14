import { Link } from 'react-router-dom';
import { Pencil, Trash2, Power, Star, ChevronUp, ChevronDown } from 'lucide-react';

// Exportamos a interface aqui para todo o projeto usar!
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

export function getInitials(name: string): string {
  if (!name) return '??';
  const nameParts = name.trim().split(/\s+/);
  if (nameParts.length === 1) return nameParts[0].substring(0, 2).toUpperCase();
  return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
}

// ============================================================================
// COMPONENTE: CARDS DE DESTAQUE (TOP 5)
// ============================================================================
interface Top5CardsProps {
  players: Player[];
  onToggleTop5: (player: Player) => void;
  onViewPlayer?: (id: string | number) => void;
  onMoveTop5?: (playerId: string | number, direction: 'up' | 'down') => void;
}

export function Top5Cards({ players, onToggleTop5, onViewPlayer, onMoveTop5 }: Top5CardsProps) {
  const top5Seniors = players
    .filter((p) => {
      const cat = p.category ? p.category.trim().toLowerCase() : '';
      return p.is_top_5 && (cat === 'sénior' || cat === 'senior');
    })
    .sort((a, b) => (a.top_5_order ?? 9999) - (b.top_5_order ?? 9999));

  const top5Juniors = players
    .filter((p) => {
      const cat = p.category ? p.category.trim().toLowerCase() : '';
      return p.is_top_5 && (cat === 'juvenil' || cat === 'júnior' || cat === 'junior');
    })
    .sort((a, b) => (a.top_5_order ?? 9999) - (b.top_5_order ?? 9999));

  const renderCards = (title: string, list: Player[], emptyMsg: string) => (
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
          {list.map((player, index) => {
            const isFirst = index === 0;
            const isLast = index === list.length - 1;

            return (
              <div
                key={player.id}
                className="relative flex flex-col items-center justify-between rounded-2xl border border-amber-200 bg-amber-50/40 p-4 text-center transition-all hover:shadow-md hover:border-amber-300"
              >
                <button
                  type="button"
                  onClick={() => onToggleTop5(player)}
                  title="Remover do Top 5"
                  className="absolute top-2.5 right-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-white/80 text-amber-500 shadow-sm transition hover:bg-rose-50 hover:text-rose-600"
                >
                  <Star size={13} fill="currentColor" />
                </button>

                {onMoveTop5 && (
                  <div className="absolute left-2.5 top-2.5 flex flex-col gap-0.5">
                    <button
                      type="button"
                      onClick={() => onMoveTop5(player.id, 'up')}
                      disabled={isFirst}
                      title="Mover para cima"
                      className={`flex h-5 w-5 items-center justify-center rounded-full border shadow-sm transition ${
                        isFirst
                          ? 'border-slate-200 bg-white text-slate-300 cursor-not-allowed'
                          : 'border-amber-300 bg-white text-amber-600 hover:bg-amber-100'
                      }`}
                    >
                      <ChevronUp size={11} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onMoveTop5(player.id, 'down')}
                      disabled={isLast}
                      title="Mover para baixo"
                      className={`flex h-5 w-5 items-center justify-center rounded-full border shadow-sm transition ${
                        isLast
                          ? 'border-slate-200 bg-white text-slate-300 cursor-not-allowed'
                          : 'border-amber-300 bg-white text-amber-600 hover:bg-amber-100'
                      }`}
                    >
                      <ChevronDown size={11} />
                    </button>
                  </div>
                )}

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
                  <h4 
                    onClick={() => onViewPlayer && onViewPlayer(player.id)}
                    className="truncate text-sm font-bold text-slate-800 cursor-pointer hover:underline"
                  >
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
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {renderCards(
        "Destaques da Temporada — Top 5 Sénior",
        top5Seniors,
        "Nenhum atleta sénior selecionado. Clique na estrela na tabela abaixo para adicionar."
      )}
      {renderCards(
        "Destaques da Temporada — Top 5 Júnior / Juvenil",
        top5Juniors,
        "Nenhum atleta júnior selecionado. Clique na estrela na tabela abaixo para adicionar."
      )}
    </div>
  );
}

// ============================================================================
// COMPONENTE: TABELA GERAL DE JOGADORES
// ============================================================================
interface PlayersTableProps {
  players: Player[];
  onToggleActive: (id: string | number) => void;
  onRemovePlayer: (id: string | number) => void;
  onToggleTop5: (player: Player) => void;
  onViewPlayer?: (id: string | number) => void;
}

export function PlayersTable({
  players,
  onToggleActive,
  onRemovePlayer,
  onToggleTop5,
  onViewPlayer
}: PlayersTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
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
          {players.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-6 py-8 text-center text-sm text-slate-400">
                Nenhum jogador encontrado.
              </td>
            </tr>
          ) : (
            players.map((player) => (
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
                      <div
                        className="font-semibold text-slate-900 cursor-pointer transition-colors hover:text-blue-600 hover:underline"
                        onClick={() => onViewPlayer && onViewPlayer(player.id)}
                      >
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
                      onClick={() => onToggleTop5(player)}
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
                      onClick={() => onToggleActive(player.id)}
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
                      onClick={() => onRemovePlayer(player.id)}
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
  );
}
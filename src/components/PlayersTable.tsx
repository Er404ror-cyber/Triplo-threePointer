import { useNavigate, Link } from 'react-router-dom';
import { 
  Star, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  ChevronUp, 
  ChevronDown, 
  ExternalLink 
} from 'lucide-react';

export interface Player {
  id: string | number;
  name: string;
  team_id?: string | number;
  teamId?: string | number;
  team?: string;
  category?: string;
  division?: string;
  province?: string;
  age?: number | string;
  height?: string;
  photo?: string | null;
  initials?: string;
  active?: boolean;
  is_top_5?: boolean;
  top_5_order?: number;
}

interface PlayersTableProps {
  players: Player[];
  onToggleActive: (id: string | number) => void;
  onRemovePlayer: (id: string | number) => void;
  onToggleTop5: (player: Player) => void;
}

interface Top5CardsProps {
  players: Player[];
  onToggleTop5: (player: Player) => void;
  onMoveTop5?: (playerId: string | number, direction: 'up' | 'down') => void;
}

// =============================================================================
// COMPONENTE: TOP 5 CARDS (CLICÁVEIS)
// =============================================================================
export function Top5Cards({ players, onToggleTop5, onMoveTop5 }: Top5CardsProps) {
  const navigate = useNavigate();

  const top5Players = players
    .filter((p) => p.is_top_5)
    .sort((a, b) => (a.top_5_order ?? 9999) - (b.top_5_order ?? 9999));

  if (top5Players.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
          <Star size={16} className="text-amber-500 fill-amber-500" />
          Destaques Top 5 da Temporada ({top5Players.length})
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {top5Players.map((player, index) => (
          <div
            key={player.id}
            onClick={() => navigate(`/admin/jogadores/${player.id}`)}
            className="group relative flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-white p-3.5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-amber-400 hover:shadow-md"
            title="Clique para ver os detalhes do atleta"
          >
            {/* Foto ou Iniciais */}
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100 font-bold text-slate-600 border border-slate-200">
              {player.photo ? (
                <img src={player.photo} alt={player.name} className="h-full w-full object-cover" />
              ) : (
                player.initials || player.name.substring(0, 2).toUpperCase()
              )}
              <span className="absolute -top-1 -left-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[9px] font-black text-white shadow">
                {index + 1}
              </span>
            </div>

            {/* Informações */}
            <div className="min-w-0 flex-1">
              <h4 className="truncate text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                {player.name}
              </h4>
              <p className="truncate text-[10px] font-medium text-slate-500">
                {player.team || 'Sem clube'}
              </p>
              <span className="inline-block rounded bg-amber-50 px-1.5 py-0.5 text-[9px] font-bold text-amber-700 border border-amber-200 mt-0.5">
                {player.category || player.division || 'Geral'}
              </span>
            </div>

            {/* Ações (com stopPropagation para não abrir os detalhes) */}
            <div className="flex flex-col items-center gap-1 shrink-0">
              {onMoveTop5 && (
                <div className="flex flex-col" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => onMoveTop5(player.id, 'up')}
                    className="p-0.5 text-slate-400 hover:text-slate-700 disabled:opacity-20"
                    title="Mover para cima"
                  >
                    <ChevronUp size={12} />
                  </button>
                  <button
                    type="button"
                    disabled={index === top5Players.length - 1}
                    onClick={() => onMoveTop5(player.id, 'down')}
                    className="p-0.5 text-slate-400 hover:text-slate-700 disabled:opacity-20"
                    title="Mover para baixo"
                  >
                    <ChevronDown size={12} />
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleTop5(player);
                }}
                className="rounded-lg p-1 text-amber-500 hover:bg-amber-50 transition"
                title="Remover do Top 5"
              >
                <Star size={15} className="fill-amber-500" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// =============================================================================
// COMPONENTE: TABELA DE JOGADORES (LINHAS E CAMPOS CLICÁVEIS)
// =============================================================================
export function PlayersTable({
  players,
  onToggleActive,
  onRemovePlayer,
  onToggleTop5,
}: PlayersTableProps) {
  const navigate = useNavigate();

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <th className="py-3 px-4">Atleta</th>
            <th className="py-3 px-4">Clube</th>
            <th className="py-3 px-4">Categoria / Divisão</th>
            <th className="py-3 px-4">Idade</th>
            <th className="py-3 px-4">Altura</th>
            <th className="py-3 px-4">Província</th>
            <th className="py-3 px-4 text-center">Top 5</th>
            <th className="py-3 px-4 text-center">Estado</th>
            <th className="py-3 px-4 text-right">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-xs">
          {players.map((player) => (
            <tr
              key={player.id}
              onClick={() => navigate(`/admin/jogadores/${player.id}`)}
              className="group cursor-pointer transition-colors hover:bg-blue-50/40"
            >
              {/* ATLETA: FOTO + NOME */}
              <td className="py-3 px-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 border border-slate-200 overflow-hidden font-bold text-slate-600 shadow-sm">
                    {player.photo ? (
                      <img
                        src={player.photo}
                        alt={player.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      player.initials || player.name.substring(0, 2).toUpperCase()
                    )}
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 group-hover:text-blue-600 flex items-center gap-1 transition-colors">
                      {player.name}
                      <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 text-blue-500 transition-opacity" />
                    </span>
                    <p className="text-[10px] text-slate-400">ID: {player.id}</p>
                  </div>
                </div>
              </td>

              {/* CLUBE */}
              <td className="py-3 px-4 font-semibold text-slate-700">
                {player.team || 'Não atribuído'}
              </td>

              {/* CATEGORIA */}
              <td className="py-3 px-4">
                <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700 border border-slate-200">
                  {player.category || player.division || 'Geral'}
                </span>
              </td>

              {/* IDADE */}
              <td className="py-3 px-4 text-slate-600">
                {player.age ? `${player.age} anos` : '—'}
              </td>

              {/* ALTURA */}
              <td className="py-3 px-4 text-slate-600">
                {player.height ? `${player.height}m` : '—'}
              </td>

              {/* PROVÍNCIA */}
              <td className="py-3 px-4 text-slate-600">
                {player.province || '—'}
              </td>

              {/* TOP 5 */}
              <td className="py-3 px-4 text-center">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleTop5(player);
                  }}
                  className={`rounded-lg p-1.5 transition ${
                    player.is_top_5
                      ? 'text-amber-500 hover:bg-amber-50'
                      : 'text-slate-300 hover:text-amber-500 hover:bg-amber-50/50'
                  }`}
                  title={player.is_top_5 ? 'Remover do Top 5' : 'Marcar no Top 5'}
                >
                  <Star size={16} className={player.is_top_5 ? 'fill-amber-500' : ''} />
                </button>
              </td>

              {/* ESTADO (ATIVO / INATIVO) */}
              <td className="py-3 px-4 text-center">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleActive(player.id);
                  }}
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold transition ${
                    player.active
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                      : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                  }`}
                >
                  {player.active ? (
                    <>
                      <CheckCircle2 size={11} /> Ativo
                    </>
                  ) : (
                    <>
                      <XCircle size={11} /> Inativo
                    </>
                  )}
                </button>
              </td>

              {/* AÇÕES */}
              <td className="py-3 px-4 text-right">
                <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                  <Link
                    to={`/admin/jogadores/${player.id}`}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition"
                    title="Ver detalhes"
                  >
                    <ExternalLink size={15} />
                  </Link>

                  <button
                    type="button"
                    onClick={() => onRemovePlayer(player.id)}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                    title="Eliminar atleta"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
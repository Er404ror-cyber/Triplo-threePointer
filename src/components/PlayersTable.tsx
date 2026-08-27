import { Trash2, CheckCircle2, XCircle, Pencil } from 'lucide-react';
import type { Player } from '../data/playersData';
import { Link } from 'react-router-dom'; // 💡 Importado para permitir navegação para a página de edição

interface PlayersTableProps {
  players: Player[];
  search?: string;
  onToggleActive: (id: string) => void;
  onRemovePlayer: (id: string) => void;
}

export function PlayersTable({
  players,
  onToggleActive,
  onRemovePlayer,
}: PlayersTableProps) {
  if (players.length === 0) {
    return (
      <div className="py-8 text-center text-xs text-slate-400">
        Nenhum jogador encontrado nesta secção.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-slate-600">
        <thead className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          <tr>
            <th className="px-6 py-3.5">Jogador</th>
            <th className="px-6 py-3.5">Equipa</th>
            <th className="px-6 py-3.5">Divisão</th>
            <th className="px-6 py-3.5">Província</th>
            <th className="px-6 py-3.5 text-center">Estado (Clique p/ Mudar)</th>
            <th className="px-6 py-3.5 text-right">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {players.map((player) => (
            <tr
              key={player.id}
              className={`transition hover:bg-slate-50/80 ${
                !player.active ? 'bg-slate-50/40 text-slate-400' : ''
              }`}
            >
              {/* Foto e Nome */}
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <img
                    src={player.photo || '/placeholder.jpg'}
                    alt={player.name}
                    className={`h-10 w-10 rounded-full object-cover border border-slate-200 ${
                      !player.active ? 'grayscale opacity-60' : ''
                    }`}
                  />
                  <span
                    className={`font-semibold ${
                      player.active ? 'text-slate-900' : 'text-slate-500 line-through'
                    }`}
                  >
                    {player.name}
                  </span>
                </div>
              </td>

              {/* Equipa */}
              <td className="px-6 py-4 font-medium text-slate-700">
                {player.team}
              </td>

              {/* Divisão */}
              <td className="px-6 py-4">
                <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
                  {player.division || '1ª Divisão'}
                </span>
              </td>

              {/* Província */}
              <td className="px-6 py-4">{player.province || '—'}</td>

              {/* BOTÃO INTERATIVO DE ATIVO / INATIVO */}
              <td className="px-6 py-4 text-center">
                <button
                  type="button"
                  onClick={() => onToggleActive(player.id)}
                  title={
                    player.active
                      ? 'Clique para desativar (enviar para baixo)'
                      : 'Clique para ativar (enviar para cima)'
                  }
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold shadow-sm transition-all duration-200 active:scale-95 cursor-pointer ${
                    player.active
                      ? 'border border-emerald-300 bg-emerald-50 text-emerald-700 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700'
                      : 'border border-slate-300 bg-slate-100 text-slate-600 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700'
                  }`}
                >
                  {player.active ? (
                    <>
                      <CheckCircle2 size={13} className="text-emerald-600" />
                      <span>Ativo</span>
                    </>
                  ) : (
                    <>
                      <XCircle size={13} className="text-slate-400" />
                      <span>Inativo</span>
                    </>
                  )}
                </button>
              </td>

              {/* Ações (Editar e Remover) */}
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  
                  {/* 💡 Botão de Editar Adicionado Novamente */}
                  <Link
                    to={`/admin/editplay/${player.id}`}
                    title="Editar Jogador"
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                  >
                    <Pencil size={15} />
                  </Link>

                  {/* Botão de Remover */}
                  <button
                    type="button"
                    title="Remover Jogador"
                    onClick={() => onRemovePlayer(player.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
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
import { Trash2, Power } from 'lucide-react';
import type { Player } from '../data/playersData';

interface PlayersTableProps {
  players: Player[];
  search: string;
  onToggleActive: (id: string) => void;
  onRemovePlayer: (id: string) => void;
}

export function PlayersTable({
  players,
  search,
  onToggleActive,
  onRemovePlayer,
}: PlayersTableProps) {
  if (players.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
        Nenhum jogador encontrado{search ? ` para "${search}"` : ''}.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="border-b border-slate-100 bg-slate-50/50 text-xs text-slate-400 uppercase">
            <tr>
              <th className="px-6 py-3.5 font-semibold">Jogador</th>
              <th className="px-6 py-3.5 font-semibold">Equipa</th>
              <th className="px-6 py-3.5 font-semibold">Divisão</th>
              <th className="px-6 py-3.5 font-semibold">Província</th>
              <th className="px-6 py-3.5 font-semibold">Estado</th>
              <th className="px-6 py-3.5 font-semibold text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {players.map((player) => (
              <tr key={player.id} className="transition-colors hover:bg-slate-50/80">
                {/* FOTO EM CÍRCULO E NOME */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 overflow-hidden rounded-full border border-slate-200 bg-slate-100 shrink-0">
                      {player.avatarUrl || player.photo ? (
                        <img
                          src={player.avatarUrl || player.photo}
                          alt={player.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center font-semibold text-xs text-slate-500">
                          {player.name.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{player.name}</p>
                      {player.position && (
                        <p className="text-xs text-slate-400">{player.position}</p>
                      )}
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 font-medium text-slate-700">{player.team}</td>
                <td className="px-6 py-4">{player.division || '—'}</td>
                <td className="px-6 py-4">{player.province || '—'}</td>

                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                      player.active
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        player.active ? 'bg-emerald-500' : 'bg-slate-400'
                      }`}
                    />
                    {player.active ? 'Ativo' : 'Inativo'}
                  </span>
                </td>

                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onToggleActive(player.id)}
                      title={player.active ? 'Desativar' : 'Ativar'}
                      className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                    >
                      <Power size={16} />
                    </button>
                    <button
                      onClick={() => onRemovePlayer(player.id)}
                      title="Remover"
                      className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
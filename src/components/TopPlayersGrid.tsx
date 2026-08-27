import { Shield, Layers, MapPin } from "lucide-react";
import type { Player } from "../data/playersData";

interface TopPlayersGridProps {
  players: Player[];
}

export function TopPlayersGrid({ players }: TopPlayersGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
      {players.map((player) => (
        <div
          key={player.id}
          className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm transition hover:shadow-md"
        >
          {/* Foto e Badge de Status */}
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
            <img
  src={player.photo || "/placeholder.jpg"}
  alt={player.name}
  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
/>
            <span
              className={`absolute right-2.5 top-2.5 rounded-full px-2 py-0.5 text-[10px] font-semibold backdrop-blur-md ${
                player.active
                  ? "bg-emerald-500/90 text-white"
                  : "bg-slate-700/80 text-white"
              }`}
            >
              {player.active ? "Ativo" : "Inativo"}
            </span>
          </div>

          {/* Conteúdo Abaixo da Foto */}
          <div className="flex flex-1 flex-col p-3.5">
            {/* Nome do Jogador */}
            <h3
              title={player.name}
              className="truncate text-sm font-bold text-slate-900"
            >
              {player.name}
            </h3>

            {/* Informações Estruturadas em Linhas Uniformes */}
            <div className="mt-3 flex flex-1 flex-col justify-end space-y-1.5 border-t border-slate-100 pt-2.5 text-xs">
              {/* Equipa */}
              <div className="flex items-center justify-between gap-1">
                <span className="flex items-center gap-1 text-slate-400">
                  <Shield size={12} className="shrink-0" />
                  <span>Equipa</span>
                </span>
                <span
                  title={player.team}
                  className="max-w-[100px] truncate text-right font-medium text-slate-700"
                >
                  {player.team}
                </span>
              </div>

              {/* Divisão */}
              <div className="flex items-center justify-between gap-1">
                <span className="flex items-center gap-1 text-slate-400">
                  <Layers size={12} className="shrink-0" />
                  <span>Divisão</span>
                </span>
                <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-700">
                  {player.division || "1ª Divisão"}
                </span>
              </div>

              {/* Província */}
              <div className="flex items-center justify-between gap-1">
                <span className="flex items-center gap-1 text-slate-400">
                  <MapPin size={12} className="shrink-0" />
                  <span>Província</span>
                </span>
                <span
                  title={player.province}
                  className="max-w-[100px] truncate text-right font-medium text-slate-600"
                >
                  {player.province || "—"}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
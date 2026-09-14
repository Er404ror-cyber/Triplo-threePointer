import { Link, useParams } from 'react-router-dom';
import { ChevronLeft, Users } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient'; 

import { TeamDetailsCard } from '../components/TeamDetailsCard';
import { TeamNotFound } from '../components/TeamNotFound';
import { TopPlayersGrid } from '../components/TopPlayersGrid'; 

// Criamos um molde temporário apenas para a matemática da ordenação não dar erros
type SortablePlayer = {
  is_top_5?: boolean | string | number | null;
  name?: string;
};

export default function T_Details() {
  const { id } = useParams<{ id: string }>();

  const { data: teamData, isLoading, error, refetch } = useQuery({
    queryKey: ['team-details-page', id],
    queryFn: async () => {
      if (!id) throw new Error("ID da equipa não encontrado");

      const { data: team, error: teamError } = await supabase
        .from('teams')
        .select('*')
        .eq('id', id)
        .single();
      
      if (teamError) throw new Error(teamError.message);
      if (!team) return null;

      let { data: players } = await supabase
        .from('players')
        .select('*')
        .eq('team_id', id);

      if (!players || players.length === 0) {
        const { data: playersAlt } = await supabase
          .from('players')
          .select('*')
          .eq('teamId', id);
        
        players = playersAlt || [];
      }

      return {
        ...team,
        players: players
      };
    },
    enabled: !!id
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>
      </div>
    );
  }

  if (error || !teamData) {
    return <TeamNotFound />;
  }

// Ordena: jogadores com estrela primeiro (por ordem de chegada = top_5_order),
// depois os restantes mantêm a ordem original.
const rawPlayers = teamData.players || [];

const top5Players = rawPlayers
  .filter((p) => p.is_top_5)
  .sort((a, b) => (a.top_5_order ?? 9999) - (b.top_5_order ?? 9999));

const otherPlayers = rawPlayers.filter((p) => !p.is_top_5);

const teamPlayers = [...top5Players, ...otherPlayers];

// Troca a posição de um jogador do Top 5 com o vizinho (cima ou baixo)
const handleMoveTop5 = async (playerId: string | number, direction: 'up' | 'down') => {
  const currentIndex = top5Players.findIndex((p) => p.id === playerId);
  if (currentIndex === -1) return;

  const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
  if (targetIndex < 0 || targetIndex >= top5Players.length) return;

  const current = top5Players[currentIndex];
  const target = top5Players[targetIndex];

  // Se algum dos dois ainda não tem top_5_order definido, atribui com base na posição atual
  const currentOrder = current.top_5_order ?? currentIndex + 1;
  const targetOrder = target.top_5_order ?? targetIndex + 1;

  // Troca os valores no Supabase
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
    return;
  }

  refetch();
};
  // Clonamos a lista e usamos o molde temporário (SortablePlayer) para agradar ao TypeScript
  const jogadoresOrdenados = [...teamPlayers].sort((a, b) => {
    const playerA = a as SortablePlayer;
    const playerB = b as SortablePlayer;

    const isStarA = playerA.is_top_5 === true || String(playerA.is_top_5).toLowerCase() === 'true' || playerA.is_top_5 === 1;
    const isStarB = playerB.is_top_5 === true || String(playerB.is_top_5).toLowerCase() === 'true' || playerB.is_top_5 === 1;

    if (isStarA && !isStarB) return -1;
    if (!isStarA && isStarB) return 1;

    const nomeA = playerA.name || '';
    const nomeB = playerB.name || '';
    return nomeA.localeCompare(nomeB);
  });

  const teamDataForCard = {
    ...teamData,
    players: teamPlayers.length
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 font-sans text-slate-900 sm:p-6 md:p-8">
      <div className="mx-auto max-w-5xl space-y-8">
        
        <div>
          <Link
            to="/admin/equipas"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
          >
            <ChevronLeft size={16} />
            Voltar às equipas
          </Link>
        </div>

        <TeamDetailsCard team={teamDataForCard} />

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800">Plantel da Equipa</h2>
            <Link
              to="/admin/newplay"
              className="text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              + Adicionar Jogador
            </Link>
          </div>

          {jogadoresOrdenados.length > 0 ? (
            <TopPlayersGrid players={jogadoresOrdenados as any} />
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-12 text-center shadow-sm">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <Users size={24} />
              </div>
              <h3 className="text-sm font-bold text-slate-700">Plantel Vazio</h3>
              <p className="mt-1 max-w-sm text-xs text-slate-500">
                Ainda não existem jogadores associados a esta equipa.
              </p>
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
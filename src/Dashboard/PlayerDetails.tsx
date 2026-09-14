import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';
import { ChevronLeft, User, Shield, MapPin, Calendar, Ruler } from 'lucide-react';

export default function PlayerDetails() {
  const { id } = useParams<{ id: string }>();

  const { data: player, isLoading, error } = useQuery({
    queryKey: ['player-details', id],
    queryFn: async () => {
      if (!id) throw new Error("ID do jogador não encontrado");

      // 1. Busca os dados do jogador
      const { data: playerData, error: playerError } = await supabase
        .from('players')
        .select('*')
        .eq('id', id)
        .single();
      
      if (playerError) throw new Error(playerError.message);
      if (!playerData) return null;

      // 2. Identifica o ID da equipa (team_id)
      const teamId = playerData.team_id || playerData.teamId;

      let teamName = 'Sem equipa';
      if (teamId) {
        // 3. Vai buscar APENAS o nome à tabela 'teams' para evitar erros de colunas inexistentes
        const { data: teamData, error: teamErr } = await supabase
          .from('teams')
          .select('name')
          .eq('id', teamId)
          .maybeSingle();
        
        if (!teamErr && teamData) {
          teamName = teamData.name;
        }
      }

      return {
        ...playerData,
        teamName: teamName // Nome real da equipa limpo e pronto a usar
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

  if (error || !player) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-8 text-center">
        <h2 className="text-xl font-bold text-slate-800">Jogador não encontrado</h2>
        <p className="mt-2 text-slate-500">Não foi possível carregar os detalhes deste atleta.</p>
        <Link to="/admin/jogadores" className="mt-4 text-blue-600 hover:underline">Voltar aos jogadores</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-4 font-sans text-slate-900 sm:p-6 md:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        
        <Link 
          to="/admin/jogadores"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
        >
          <ChevronLeft size={16} /> Voltar à lista de jogadores
        </Link>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white sm:p-8">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
              
              {player.photo ? (
                <img 
                  src={player.photo} 
                  alt={player.name} 
                  className="h-24 w-24 rounded-full object-cover border-4 border-white/20 shadow-md"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/10 border-4 border-white/20 text-2xl font-bold text-white shadow-inner">
                  <User size={36} />
                </div>
              )}

              <div className="text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                  <h1 className="text-2xl font-bold">{player.name}</h1>
                  {player.is_top_5 && (
                    <span className="rounded-full bg-amber-400/20 px-3 py-0.5 text-xs font-bold text-amber-200 border border-amber-400/30">
                      ★ Top 5
                    </span>
                  )}
                </div>
                <p className="mt-1 text-blue-100 text-sm">
                  {player.position || 'Posição não definida'}
                </p>
                <div className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    player.active ? 'bg-emerald-500/20 text-emerald-100' : 'bg-rose-500/20 text-rose-100'
                  }`}>
                    {player.active ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
              </div>

            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 sm:p-8">
            
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                <Shield size={20} />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400">Equipa</p>
                {/* Mostra o nome real da equipa em vez do código UUID */}
                <p className="text-sm font-semibold text-slate-800">{player.teamName}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                <MapPin size={20} />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400">Província</p>
                <p className="text-sm font-semibold text-slate-800">{player.province || 'Não especificada'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                <Calendar size={20} />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400">Idade</p>
                <p className="text-sm font-semibold text-slate-800">{player.age ? `${player.age} anos` : 'Não informada'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                <Ruler size={20} />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400">Altura</p>
                <p className="text-sm font-semibold text-slate-800">{player.height || 'Não informada'}</p>
              </div>
            </div>

          </div>

          {player.description && (
            <div className="border-t border-slate-100 p-6 sm:p-8">
              <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Sobre o Atleta</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{player.description}</p>
            </div>
          )}

          <div className="flex items-center justify-end bg-slate-50 px-6 py-4 border-t border-slate-100">
            <Link
              to={`/admin/editplayer/${player.id}`}
              className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
            >
              Editar Jogador
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
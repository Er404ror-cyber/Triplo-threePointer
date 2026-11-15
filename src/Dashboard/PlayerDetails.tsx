import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';
import { ChevronLeft, User, Shield, MapPin, Calendar, Ruler, Edit3, Palette } from 'lucide-react';

// Analisa a foto do jogador e sugere uma cor de banner que combine (transformando preto em cinzento-escuro)
function extractColorFromImageUrl(imageUrl: string): Promise<string | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = imageUrl;

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 50;
        canvas.height = 50;

        if (!ctx) return resolve(null);

        ctx.drawImage(img, 0, 0, 50, 50);
        const imageData = ctx.getImageData(0, 0, 50, 50).data;

        let rTotal = 0, gTotal = 0, bTotal = 0, count = 0;

        for (let i = 0; i < imageData.length; i += 4) {
          const r = imageData[i];
          const g = imageData[i + 1];
          const b = imageData[i + 2];
          const a = imageData[i + 3];

          if (a < 128) continue;
          if (r > 245 && g > 245 && b > 245) continue;

          rTotal += r;
          gTotal += g;
          bTotal += b;
          count++;
        }

        if (count === 0) return resolve('#334155');

        let rAvg = Math.round(rTotal / count);
        let gAvg = Math.round(gTotal / count);
        let bAvg = Math.round(bTotal / count);

        const brightness = (rAvg * 299 + gAvg * 587 + bAvg * 114) / 1000;

        if (brightness < 35) {
          rAvg = Math.min(255, rAvg + 45);
          gAvg = Math.min(255, gAvg + 45);
          bAvg = Math.min(255, bAvg + 52);
        } else if (brightness > 175) {
          rAvg = Math.round(rAvg * 0.6);
          gAvg = Math.round(gAvg * 0.6);
          bAvg = Math.round(bAvg * 0.6);
        }

        const toHex = (n: number) => n.toString(16).padStart(2, '0');
        resolve(`#${toHex(rAvg)}${toHex(gAvg)}${toHex(bAvg)}`);
      } catch {
        resolve(null);
      }
    };

    img.onerror = () => resolve(null);
  });
}

export default function PlayerDetails() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [bannerColor, setBannerColor] = useState<string | null>(null);

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

      let teamName = playerData.team || 'Sem equipa';
      let teamHeaderColor = null;

      if (teamId) {
        // 3. Vai buscar o nome e a cor da equipa à tabela 'teams'
        const { data: teamData, error: teamErr } = await supabase
          .from('teams')
          .select('name, header_color')
          .eq('id', teamId)
          .maybeSingle();
        
        if (!teamErr && teamData) {
          teamName = teamData.name;
          teamHeaderColor = teamData.header_color;
        }
      }

      return {
        ...playerData,
        teamId,
        teamName,
        teamHeaderColor
      };
    },
    // Aproveita os dados já carregados na lista de jogadores (t_jogadores) para exibir na hora sem loading
    placeholderData: () => {
      const cachedPlayers = queryClient.getQueryData<any[]>(['players-list']);
      const found = cachedPlayers?.find((p) => String(p.id) === String(id));
      if (!found) return undefined;

      return {
        ...found,
        teamId: found.team_id || found.teamId,
        teamName: found.team || 'A carregar equipa...',
        teamHeaderColor: null
      };
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 10, // Mantém em cache por 10 minutos sem recarregar do zero
    gcTime: 1000 * 60 * 30,    // Guarda na memória por 30 minutos
    refetchOnWindowFocus: false,
  });

  const playerPhoto = player?.photo || player?.photo_url || player?.image_url || player?.foto;

  // Analisa automaticamente a foto do jogador para sugerir a cor do banner
  useEffect(() => {
    if (!player) return;

    if (player.header_color) {
      setBannerColor(player.header_color);
    } else if (playerPhoto) {
      extractColorFromImageUrl(playerPhoto).then((suggested) => {
        if (suggested) {
          setBannerColor(suggested);
        } else if (player.teamHeaderColor) {
          setBannerColor(player.teamHeaderColor);
        }
      });
    } else if (player.teamHeaderColor) {
      setBannerColor(player.teamHeaderColor);
    }
  }, [player, playerPhoto]);

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

  const activeBannerColor = bannerColor || player.teamHeaderColor;

  return (
    <div className="min-h-screen bg-slate-100 p-4 font-sans text-slate-900 sm:p-6 md:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        
        {/* Topo com Voltar, Cor do Banner e Botão de Editar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link 
            to="/admin/jogadores"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
          >
            <ChevronLeft size={16} /> Voltar à lista de jogadores
          </Link>

          <div className="flex items-center gap-2.5">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50">
              <Palette size={14} className="text-slate-500" />
              <span>Cor do Banner</span>
              <input
                type="color"
                value={activeBannerColor || '#2563eb'}
                onChange={(e) => setBannerColor(e.target.value)}
                className="h-5 w-6 cursor-pointer rounded border-0 bg-transparent p-0"
              />
            </label>

            <Link
              to={`/admin/editplayer/${player.id}`}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800 active:scale-95"
            >
              <Edit3 size={14} /> Editar Jogador
            </Link>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div 
            className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white transition-colors duration-300 sm:p-8"
            style={activeBannerColor ? { background: activeBannerColor } : undefined}
          >
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
              
              {playerPhoto ? (
                <img 
                  src={playerPhoto} 
                  alt={player.name} 
                  crossOrigin="anonymous"
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
                <p className="mt-1 text-white/85 text-sm">
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
                {player.teamId ? (
                  <Link 
                    to={`/admin/equipas/${player.teamId}`}
                    className="text-sm font-semibold text-blue-600 hover:underline"
                  >
                    {player.teamName}
                  </Link>
                ) : (
                  <p className="text-sm font-semibold text-slate-800">{player.teamName}</p>
                )}
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
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
            >
              <Edit3 size={14} /> Editar Jogador
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
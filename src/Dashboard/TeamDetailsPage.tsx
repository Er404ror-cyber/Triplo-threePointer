import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '.././lib/supabaseClient'; 
import { ChevronLeft, Users, Shield, MapPin, Calendar, Award, Edit3, Plus, Palette } from 'lucide-react';

import { TopPlayersGrid } from '.././components/TopPlayersGrid'; 

// Analisa uma URL de imagem (com suporte a CORS do Supabase) e sugere uma cor de banner
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

          // Ignora píxeis transparentes e brancos de fundo
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

        // Se a imagem for preta ou muito escura -> cinzento-escuro elegante
        if (brightness < 35) {
          rAvg = Math.min(255, rAvg + 45);
          gAvg = Math.min(255, gAvg + 45);
          bAvg = Math.min(255, bAvg + 52);
        } else if (brightness > 175) {
          // Se for muito clara -> escurece para destacar o texto branco
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

function getPlayerCategory(p: any): 'senior' | 'junior' {
  const raw = (p.category || p.division || p.categoria || '').toLowerCase().trim();
  if (raw.includes('junior') || raw.includes('júnior') || raw.includes('juvenil')) return 'junior';
  return 'senior';
}

function sortByTop5Order(list: any[]) {
  const top5 = list
    .filter((p) => p.is_top_5)
    .sort((a, b) => (a.top_5_order ?? 9999) - (b.top_5_order ?? 9999));
  const others = list.filter((p) => !p.is_top_5);
  return [...top5, ...others];
}

export default function TeamDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [bannerColor, setBannerColor] = useState<string | null>(null);

 const { data: teamData, isLoading, error, refetch } = useQuery({
    queryKey: ['team-details-dashboard', id],
    queryFn: async () => {
      if (!id) throw new Error("ID da equipa não encontrado");

      // Busca os dados da equipa e apenas os jogadores desta equipa em paralelo
      const [
        { data: team, error: teamError },
        { data: matchedPlayers, error: playersError }
      ] = await Promise.all([
        supabase
          .from('teams')
          .select('*')
          .eq('id', id)
          .single(),
        supabase
          .from('players')
          .select('*')
          .eq('team_id', id)
      ]);

      if (teamError) throw new Error(teamError.message);
      if (!team) return null;

      if (playersError) {
        console.error("Erro ao buscar jogadores:", playersError.message);
      }

      return {
        ...team,
        players: matchedPlayers || []
      };
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 10, // Mantém no cache por 10 minutos sem recarregar do zero
    gcTime: 1000 * 60 * 30,    // Guarda na memória por 30 minutos
    refetchOnWindowFocus: false,
  });

  // Se a equipa já tiver header_color, usa-a. Se não tiver (ou for o azul padrão), analisa a foto automaticamente
  useEffect(() => {
    if (!teamData) return;

    if (teamData.header_color) {
      setBannerColor(teamData.header_color);
    } else if (teamData.crest_url) {
      extractColorFromImageUrl(teamData.crest_url).then(async (suggested) => {
        if (suggested) {
          setBannerColor(suggested);
          // Guarda a cor sugerida automaticamente no Supabase
          await supabase
            .from('teams')
            .update({ header_color: suggested })
            .eq('id', teamData.id);
        }
      });
    }
  }, [teamData]);

  // Permite alterar manualmente ou re-analisar a cor diretamente nos detalhes
  const handleBannerColorChange = async (newColor: string) => {
    setBannerColor(newColor);
    if (!teamData?.id) return;
    await supabase
      .from('teams')
      .update({ header_color: newColor })
      .eq('id', teamData.id);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>
      </div>
    );
  }

  if (error || !teamData) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-8 text-center">
        <h2 className="text-xl font-bold text-slate-800">Equipa não encontrada</h2>
        <p className="mt-2 text-slate-500">Não foi possível carregar os detalhes desta equipa.</p>
        <Link to="/admin/equipas" className="mt-4 text-blue-600 hover:underline">Voltar às equipas</Link>
      </div>
    );
  }

  const rawPlayers = teamData.players || [];

  // Separa por categoria e ordena: destaques (estrela) primeiro, por ordem de chegada (top_5_order)
  const seniorPlayers = sortByTop5Order(rawPlayers.filter((p: any) => getPlayerCategory(p) === 'senior'));
  const juniorPlayers = sortByTop5Order(rawPlayers.filter((p: any) => getPlayerCategory(p) === 'junior'));

  const teamPlayers = [...seniorPlayers, ...juniorPlayers];

  // Troca a posição de um jogador do Top 5 com o vizinho (cima ou baixo), dentro da mesma categoria
  const handleMoveTop5 = async (playerId: string | number, direction: 'up' | 'down') => {
    const player = rawPlayers.find((p: any) => p.id === playerId);
    if (!player) return;

    const category = getPlayerCategory(player);
    const groupTop5 = (category === 'senior' ? seniorPlayers : juniorPlayers).filter((p: any) => p.is_top_5);

    const currentIndex = groupTop5.findIndex((p: any) => p.id === playerId);
    if (currentIndex === -1) return;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= groupTop5.length) return;

    const current = groupTop5[currentIndex];
    const target = groupTop5[targetIndex];

    const currentOrder = current.top_5_order ?? currentIndex + 1;
    const targetOrder = target.top_5_order ?? targetIndex + 1;

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

  const activeBannerColor = bannerColor || teamData.header_color;

  return (
    <div className="min-h-screen bg-slate-50/60 p-4 font-sans text-slate-900 sm:p-6 md:p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        
        {/* Navegação de Volta e Ações */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link 
            to="/admin/equipas" 
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-slate-800"
          >
            <ChevronLeft size={16} /> Voltar às Equipas
          </Link>

          <div className="flex items-center gap-2.5">
            {/* Botão rápido para mudar ou sincronizar a cor do banner com a foto */}
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50">
              <Palette size={14} className="text-slate-500" />
              <span>Cor do Banner</span>
              <input
                type="color"
                value={activeBannerColor || '#2563eb'}
                onChange={(e) => handleBannerColorChange(e.target.value)}
                className="h-5 w-6 cursor-pointer rounded border-0 bg-transparent p-0"
              />
            </label>

            {/* Botão de Editar Equipa */}
            <Link 
              to={`/admin/editteam/${teamData.id}`} 
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800 active:scale-95"
            >
              <Edit3 size={14} /> Editar Equipa
            </Link>
          </div>
        </div>

        {/* CARTÃO DE DETALHES */}
        <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
          <div 
            className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 p-6 text-white transition-colors duration-300 sm:p-8"
            style={activeBannerColor ? { background: activeBannerColor } : undefined}
          >
            <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
              
              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/20 bg-white/10 text-white shadow-inner backdrop-blur-md">
                {teamData.crest_url ? (
                  <img 
                    src={teamData.crest_url} 
                    alt={teamData.name} 
                    crossOrigin="anonymous"
                    className="h-full w-full rounded-2xl object-cover" 
                  />
                ) : (
                  <Shield size={36} className="text-white/90" />
                )}
              </div>

              <div className="text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center gap-2.5 sm:justify-start">
                  <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{teamData.name}</h1>
                  <span className="rounded-full border border-white/30 bg-white/20 px-3 py-0.5 text-xs font-bold text-white backdrop-blur-sm">
                    {teamData.division || 'Divisão Principal'}
                  </span>
                </div>
                <p className="mt-1 max-w-xl text-sm leading-relaxed text-white/85">
                  {teamData.description || teamData.history || 'Sem descrição ou história registada para esta equipa.'}
                </p>
              </div>

            </div>
          </div>

          {/* Grelha de Informações Rápidas */}
          <div className="grid grid-cols-1 gap-4 border-t border-slate-100 bg-slate-50/50 p-6 sm:grid-cols-2 sm:p-8">
            
            <div className="flex items-center gap-3.5 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <MapPin size={18} />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Cidade / Província</p>
                <p className="text-sm font-bold text-slate-800">{teamData.city || teamData.province || 'Não informada'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <Award size={18} />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Divisão</p>
                <p className="text-sm font-bold text-slate-800">{teamData.division || 'N/A'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <Calendar size={18} />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Fundação</p>
                <p className="text-sm font-bold text-slate-800">{teamData.founded || teamData.fundacao || 'N/A'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Users size={18} />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Atletas no Plantel</p>
                <p className="text-sm font-bold text-slate-800">{teamPlayers.length} Jogadores</p>
              </div>
            </div>

          </div>
        </div>

        {/* SECÇÃO DO PLANTEL */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">Plantel da Equipa</h2>
              <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-700">
                {teamPlayers.length}
              </span>
            </div>
            
            <Link 
              to={`/admin/newplay?teamId=${id}`}
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-95"
            >
              <Plus size={15} /> Adicionar Jogador
            </Link>
          </div>

          {teamPlayers.length > 0 ? (
            <div className="space-y-8">
              {seniorPlayers.length > 0 && (
                <div>
                  <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Sénior ({seniorPlayers.length})
                  </h3>
                  <TopPlayersGrid players={seniorPlayers} onMoveTop5={handleMoveTop5} />
                </div>
              )}
              {juniorPlayers.length > 0 && (
                <div>
                  <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Júnior / Juvenil ({juniorPlayers.length})
                  </h3>
                  <TopPlayersGrid players={juniorPlayers} onMoveTop5={handleMoveTop5} />
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-16 text-center shadow-sm">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <Users size={24} />
              </div>
              <h3 className="text-sm font-bold text-slate-800">Plantel Vazio</h3>
              <p className="mt-1 max-w-sm text-xs text-slate-500">
                Ainda não existem atletas inscritos ou associados a esta equipa.
              </p>
              <Link
                to={`/admin/newplay?teamId=${id}`}
                className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
              >
                <Plus size={14} /> Adicionar Primeiro Jogador
              </Link>
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
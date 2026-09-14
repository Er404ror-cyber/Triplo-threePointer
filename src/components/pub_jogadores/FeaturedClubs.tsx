import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabaseClient'; // Ajuste o caminho se necessário
import { useTranslate } from '../../context/LanguageProvider';

// Paleta de cores para o caso da equipa não ter "header_color" definido na base de dados
const fallbackColors = [
  '#16a34a', '#dc2626', '#2563eb', '#f59e0b', '#0ea5e9', 
  '#1f2937', '#3b82f6', '#b91c1c', '#ea580c', '#8b5cf6'
];

export function FeaturedClubs() {
  const { t } = useTranslate();

  const { data: featuredClubs = [], isLoading, error } = useQuery({
    queryKey: ['public-featured-teams'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .limit(10);
      
      if (error) throw new Error(error.message);
      return data || [];
    }
  });

  return (
    <section className="py-16 pb-32">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-16">

        {/* Cabeçalho */}
        <div className="mb-10">
          <div className="text-[10px] font-bold text-gray-500 tracking-[0.25em] uppercase mb-2">
            {t('teams_section_eyebrow')}
          </div>
          <h2 className="text-3xl font-black tracking-tight text-white uppercase">
            {t('meet_our_teams')}
          </h2>
        </div>

        {/* Loading / Erro */}
        {isLoading && (
          <div className="flex justify-center py-10">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-700 border-t-[#dc2626]"></div>
          </div>
        )}
        
        {error && (
          <div className="text-red-500 text-sm font-medium py-10 text-center">
            Erro ao carregar equipas.
          </div>
        )}

        {/* Grelha de Clubes */}
        {!isLoading && !error && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {featuredClubs.map((club, index) => {
              // 1. Sigla de recurso: as 3 primeiras letras do campo 'name'
              const sigla = club.name?.substring(0, 3).toUpperCase() || 'XXX';
              
              // 2. Cor: tenta usar o 'header_color', se não existir usa a cor da paleta
              const teamColor = club.header_color || fallbackColors[index % fallbackColors.length];

              return (
                <div 
                  key={club.id} 
                  className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-white/5 transition-colors"
                >
                  
                  {/* Se houver crest_url, mostra a imagem. Senão, mostra o bloco colorido */}
                  {club.crest_url ? (
                    <img 
                      src={club.crest_url} 
                      alt={`Emblema de ${club.name}`} 
                      className="w-14 h-14 object-contain drop-shadow-md"
                    />
                  ) : (
                    <div 
                      className="w-14 h-12 rounded-xl flex items-center justify-center text-[13px] font-black text-white shadow-lg"
                      style={{ backgroundColor: teamColor }} // Usamos style inline para aceitar códigos HEX dinâmicos
                    >
                      {sigla}
                    </div>
                  )}

                  {/* Nome da Equipa */}
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center leading-tight">
                    {club.name}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Banner do World Cup (Mantido inalterado) */}
        <div className="mt-12 bg-[#0a0a0a] border border-white/5 rounded-[2rem] p-8 lg:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="flex flex-col items-start gap-4 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#dc2626]"></span>
              <span className="text-[10px] font-bold text-gray-500 tracking-[0.25em] uppercase">
                {t('match_footer_tag')}
              </span>
            </div>

            <h2 className="text-3xl lg:text-4xl font-black uppercase tracking-tight text-white">
              {t('match_footer_title')}
            </h2>

            <p className="text-gray-500 text-sm leading-relaxed max-w-md">
              {t('match_footer_description')}
            </p>

            <button className="mt-2 bg-[#dc2626] hover:bg-red-700 text-white text-[11px] font-bold uppercase tracking-widest px-6 py-3 rounded-full transition-colors">
              {t('featured_player_button')}
            </button>
          </div>

          <div className="flex flex-col items-center md:items-end gap-2">
            <span className="text-[10px] font-bold text-gray-500 tracking-[0.25em] uppercase">
              {t('match_points_label')}
            </span>
            <div className="flex items-center gap-3 text-2xl font-black text-gray-400">
              <span>FRM</span>
              <span className="text-[#facc15] tracking-widest text-3xl">3 : 0</span>
              <span>CDS</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
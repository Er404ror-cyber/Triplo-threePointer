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
          <div className="text-xs font-bold text-red-500 tracking-[0.25em] uppercase mb-2">
            {t('teams_section_eyebrow')}
          </div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white uppercase">
            {t('meet_our_teams')}
          </h2>
        </div>

        {/* Loading / Erro */}
        {isLoading && (
          <div className="flex justify-center py-16">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-800 border-t-[#dc2626]"></div>
          </div>
        )}
        
        {error && (
          <div className="text-red-500 text-sm font-semibold py-12 text-center">
            Erro ao carregar equipas.
          </div>
        )}

        {/* Grelha de Clubes Redesenhada */}
        {!isLoading && !error && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {featuredClubs.map((club, index) => {
              const sigla = club.name?.substring(0, 3).toUpperCase() || 'XXX';
              const teamColor = club.header_color || fallbackColors[index % fallbackColors.length];

              return (
                <div 
                  key={club.id} 
                  className="group relative bg-gradient-to-b from-[#141414] to-[#0a0a0a] border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-between min-h-[220px] cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:border-white/30 hover:shadow-2xl hover:shadow-black/80 overflow-hidden"
                >
                  {/* Brilho de fundo sutil com a cor da equipa no hover */}
                  <div 
                    className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-20 pointer-events-none"
                    style={{ backgroundColor: teamColor }}
                  />

                  {/* Container da Foto/Emblema em Destaque */}
                  <div className="relative w-full flex items-center justify-center py-2">
                    <div className="relative w-20 h-20 md:w-24 md:h-24 flex items-center justify-center rounded-2xl bg-white/[0.04] border border-white/5 p-3 group-hover:bg-white/[0.08] transition-all duration-300">
                      {club.crest_url ? (
                        <img 
                          src={club.crest_url} 
                          alt={`Emblema de ${club.name}`} 
                          className="w-full h-full object-contain filter drop-shadow-[0_6px_10px_rgba(0,0,0,0.5)] transform transition-transform duration-300 group-hover:scale-110"
                        />
                      ) : (
                        <div 
                          className="w-full h-full rounded-xl flex items-center justify-center text-lg font-black text-white shadow-lg tracking-wider"
                          style={{ backgroundColor: teamColor }}
                        >
                          {sigla}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Nome da Equipa em Alto Destaque */}
                  <div className="w-full text-center mt-3 flex flex-col items-center">
                    <h3 className="text-sm md:text-base font-extrabold text-white tracking-wide uppercase leading-tight line-clamp-2 transition-colors duration-200 group-hover:text-red-500">
                      {club.name}
                    </h3>
                    
                    {/* Barra decorativa com a cor da equipa que expande no hover */}
                    <span 
                      className="mt-2.5 h-[2px] w-4 rounded-full transition-all duration-300 group-hover:w-12"
                      style={{ backgroundColor: teamColor }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Banner do World Cup */}
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
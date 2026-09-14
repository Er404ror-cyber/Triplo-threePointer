import React from 'react';
import { useTranslate } from '../../context/LanguageProvider'; // Ajuste o caminho

export function MatchHero() {
  const { t } = useTranslate();

  return (
    <section className="min-h-screen flex flex-col relative">
      <main className="flex-1 w-full max-w-[1400px] mx-auto flex flex-col lg:flex-row px-6 lg:px-16 pt-24 lg:pt-32 pb-20 gap-16 lg:gap-24">
        <div className="flex-1 flex flex-col justify-center">
          <div className="bg-[#0f131a] rounded-2xl p-6 sm:p-8 flex items-center justify-between w-full max-w-[480px]">
            <div className="flex flex-col items-center gap-3 w-32">
              <div className="w-14 h-14 rounded-full bg-[#f59e0b] flex items-center justify-center text-[#090b10] font-black text-lg">
                CDS
              </div>
              <span className="text-[11px] text-gray-400 font-medium text-center">{t('team_arena_legends')}</span>
            </div>
            
            <div className="text-6xl sm:text-[64px] font-black text-[#ff0000] tracking-widest leading-none pb-4">
              0:3
            </div>
            
            <div className="flex flex-col items-center gap-3 w-32">
              <div className="w-14 h-14 rounded-full bg-[#dc2626] flex items-center justify-center text-[#090b10] font-black text-lg">
                FRM
              </div>
              <span className="text-[11px] text-gray-400 font-medium text-center">{t('team_battle_royale')}</span>
            </div>
          </div>
          
          <h1 className="text-6xl sm:text-7xl lg:text-[80px] font-black text-white mt-16 tracking-tight leading-none uppercase">
            {t('goal_text')}
          </h1>
          <p className="text-gray-400 mt-6 text-sm sm:text-base max-w-md leading-relaxed pr-4">
            {t('match_result_description')}
          </p>
        </div>
        
        <div className="flex-1 w-full min-h-[400px] lg:min-h-[600px] flex items-stretch py-4 lg:py-0">
          <div className="w-full h-full border border-[#3f1d24] rounded-[2rem] bg-transparent relative overflow-hidden flex items-center justify-center">
          </div>
        </div>
      </main>
      
      <footer className="absolute bottom-6 left-6 lg:left-16 flex gap-3 text-[10px] font-bold text-gray-600 tracking-[0.25em] uppercase">
        {t('gallery_eyebrow')}
      </footer>
    </section>
  );
}
import React from 'react';
import { useTranslate } from '../context/LanguageProvider';

export const HeroSection: React.FC = () => {
  const { t } = useTranslate();

  return (
    <section className="relative w-full bg-gray-900 pt-8 pb-12 px-4 md:pt-10 md:pb-20 md:px-12 border-b border-red-900/30">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="flex flex-col items-center text-center md:items-start md:text-left">

          {/* Placar */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mb-5 sm:mb-6 bg-black/40 p-4 sm:p-6 rounded-2xl border border-gray-800 w-full max-w-xs sm:max-w-none">
            <div className="text-center shrink-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-600 rounded-full mb-1.5 sm:mb-2 flex items-center justify-center font-bold text-xs sm:text-base mx-auto">
                CDS
              </div>
              <p className="text-[10px] sm:text-xs text-gray-400 whitespace-nowrap">
                {t('team_arena_legends')}
              </p>
            </div>

            <div className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tighter text-red-600 shrink-0">
              0 : 3
            </div>

            <div className="text-center shrink-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-700 rounded-full mb-1.5 sm:mb-2 flex items-center justify-center font-bold text-xs sm:text-base mx-auto">
                FRM
              </div>
              <p className="text-[10px] sm:text-xs text-gray-400 whitespace-nowrap">
                {t('team_battle_royale')}
              </p>
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black uppercase tracking-tight text-white mb-2 leading-tight break-words">
            {t('goal_text')}
          </h1>
          <p className="text-gray-400 max-w-md text-xs sm:text-sm md:text-base">
            {t('match_result_description')}
          </p>
        </div>

        <div className="relative flex justify-center md:justify-end">
          <img
            src="https://picsum.photos/seed/hero-player/450/500"
            alt="Hero"
            loading="lazy"
            className="w-full max-w-[450px] h-[280px] sm:h-[360px] md:h-[500px] object-cover rounded-3xl border border-red-500/20"
          />
        </div>
      </div>
    </section>
  );
};
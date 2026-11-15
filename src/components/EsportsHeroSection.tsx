import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useTranslate } from '../context/LanguageProvider';

export const EsportsHeroSection: React.FC = () => {
  const { t } = useTranslate();

  return (
    <section className="relative overflow-hidden bg-cover bg-center">
      <img 
        src="src/img/Gemini_Generated_Image_1uz94z1uz94z1uz9.jpg" 
        alt="Hero background" 
        className="absolute inset-0 h-full w-full object-cover" 
      />
      
      <div
        className="absolute inset-0 bg-gradient-to-r from-[#0a0e14] from-20% via-[#0a0e14] via-35% to-transparent to-55%"
        aria-hidden
      />
      <div
        className="absolute -right-32 top-0 h-full w-2/3 opacity-40 blur-sm"
        aria-hidden
      />
      
      <div className="relative mx-auto max-w-7xl px-6 py-20 md:py-28">
        <p className="mb-4 text-xs font-bold tracking-[0.3em] text-blue-400">
          {t('hero_eyebrow')}
        </p>
        <h1 className="max-w-xl text-4xl font-black leading-tight tracking-tight md:text-6xl text-wrap line-clamp-3 wrap-break-word">
          {t('coaching_text')}
        </h1>
        <p className="mt-6 max-w-md text-sm text-slate-400">
          {t('hero_description')}
        </p>
        
        <a
          href="#"
          className="mt-8 inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-white hover:text-blue-400"
        >
          {t('read_more')}
          <ChevronRight size={14} className="text-white" />
          <ChevronRight size={14} className="text-white/40" />
          <ChevronRight size={14} className="text-white/20" />
        </a>
      </div>
    </section>
  );
};
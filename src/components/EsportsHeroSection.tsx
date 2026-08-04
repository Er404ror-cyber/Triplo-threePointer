import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useTranslate } from '../context/LanguageProvider';
import { HERO_IMAGE } from '../data/esportsData';

export const EsportsHeroSection: React.FC = () => {
  const { t } = useTranslate();

  return (
    <section
      className="relative overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `url(${HERO_IMAGE})` }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to right, #0a0e14 20%, #0a0e14 35%, transparent 55%)',
        }}
        aria-hidden
      />
      <div
        className="absolute -right-32 top-0 h-full w-2/3 opacity-40 blur-sm"
        style={{
          background:
            'radial-gradient(circle at 70% 30%, rgba(56,120,255,0.35), transparent 60%)',
        }}
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
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslate, type TranslationKey } from '../../context/LanguageProvider';

export const WatchHeader: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslate();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-5 sm:px-8 pt-4 pb-10 bg-gradient-to-b from-black/80 via-black/35 to-transparent pointer-events-none transition-opacity duration-300">
      
      {/* Botão Voltar */}
      <button 
        type="button"
        onClick={() => navigate(-1)} 
        title={t('back' as TranslationKey)}
        aria-label={t('back' as TranslationKey)}
        className="pointer-events-auto flex items-center gap-2 text-white font-semibold text-xs sm:text-sm bg-black/40 hover:bg-black/70  px-3.5 py-2 rounded-xl shadow-sm hover:text-orange-400 active:scale-95 transition-all cursor-pointer"
      >
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          className="w-4 h-4"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        <span>{t('back' as TranslationKey)}</span>
      </button>

      {/* Botão Início / Publicações */}
      <button 
        type="button"
        onClick={() => navigate('/publications')} 
        title={t('home' as TranslationKey)}
        aria-label={t('home' as TranslationKey)}
        className="pointer-events-auto flex items-center gap-2 text-white font-semibold text-xs sm:text-sm bg-black/40 hover:bg-black/70  px-3.5 py-2 rounded-xl shadow-sm hover:text-orange-400 active:scale-95 transition-all cursor-pointer"
      >
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          className="w-4 h-4"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        <span>{t('home' as TranslationKey)}</span>
      </button>

    </header>
  );
};
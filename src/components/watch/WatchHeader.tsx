import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslate, type TranslationKey } from '../../context/LanguageProvider';

export const WatchHeader: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslate();

  // Botão ergonômico: toque fácil, leve e com excelente contraste sobre qualquer mídia
  const buttonClasses =
    "pointer-events-auto inline-flex items-center justify-center gap-2 text-white font-medium text-xs sm:text-sm px-3.5 sm:px-4 py-2 sm:py-2.5 min-h-[38px] sm:min-h-[40px] rounded-full bg-black/75 hover:bg-black active:scale-95 transition-transform duration-100 cursor-pointer select-none shadow-md hover:text-orange-400";

  return (
    <header className="sticky top-0 z-40 w-full bg-transparent pointer-events-none">
      <div className="flex items-center justify-between px-3.5 sm:px-6 py-2.5 sm:py-3">
        {/* Botão Voltar */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          title={t('back' as TranslationKey)}
          aria-label={t('back' as TranslationKey)}
          className={buttonClasses}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4 shrink-0">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span className="leading-none">{t('back' as TranslationKey)}</span>
        </button>

        {/* Botão Início / Publicações */}
        <button
          type="button"
          onClick={() => navigate('/publications')}
          title={t('home' as TranslationKey)}
          aria-label={t('home' as TranslationKey)}
          className={buttonClasses}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 shrink-0">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="leading-none">{t('home' as TranslationKey)}</span>
        </button>
      </div>
    </header>
  );
};
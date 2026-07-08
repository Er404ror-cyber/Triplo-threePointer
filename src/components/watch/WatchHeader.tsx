import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const WatchHeader: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="w-full h-14 flex items-center px-4 bg-white dark:bg-[#0f0f0f] transition-colors border-b border-slate-200 dark:border-white/10">
      <button 
        onClick={() => navigate('/publications')} 
        className="flex items-center gap-2 text-slate-900 dark:text-white font-bold hover:bg-slate-100 dark:hover:bg-white/10 px-3 py-1.5 rounded-lg transition-all"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        {t('watch.back')}
      </button>
    </div>
  );
};
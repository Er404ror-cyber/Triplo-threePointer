import React from 'react';
import { useTranslate } from '../context/LanguageProvider';
import { TEAM_CARDS, CARD_IMAGE_OVERLAY } from '../data/esportsData';

export const TeamsSection: React.FC = () => {
  const { t } = useTranslate();

  return (
    <section className="relative overflow-hidden bg-cover bg-center py-20">
      <div className="absolute inset-0 bg-[#070a10]/90" aria-hidden />

      <div className="absolute left-[50%] top-24">
        <svg
          viewBox="0 0 200 200"
          className="pointer-events-none h-30 -translate-x-1/2 -translate-y-1/2 opacity-[0.07]"
          aria-hidden
        >
          <circle cx="100" cy="100" r="92" stroke="white" strokeWidth="4" fill="none" />
          <line x1="8" y1="100" x2="192" y2="100" stroke="white" strokeWidth="4" />
          <line x1="100" y1="8" x2="100" y2="192" stroke="white" strokeWidth="4" />
          <path d="M 30 30 Q 100 100 30 170" stroke="white" strokeWidth="4" fill="none" />
          <path d="M 170 30 Q 100 100 170 170" stroke="white" strokeWidth="4" fill="none" />
        </svg>
      </div>

      <div className="relative mx-auto max-w-5xl px-6 text-center">
        <h2 className="text-3xl font-black md:text-4xl">{t('meet_our_teams')}</h2>
        <p className="mt-2 text-sm font-bold tracking-[0.25em] text-blue-400">
          {t('hashtag_vxgwin')}
        </p>

        <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {TEAM_CARDS.map((team) => (
            <button
              key={team.id}
              className="group relative flex min-h-32.5 flex-col justify-end overflow-hidden rounded-xl bg-cover bg-center px-4 py-4 text-left transition-all duration-300 hover:-translate-y-1 hover:border-blue-400/50 hover:shadow-[0_0_25px_5px_rgba(56,120,255,0.45)] border-blue-500 shadow-[0_0_20px_4px_rgba(56,120,255,0.4)]"
              style={{ backgroundImage: `url(${team.media_url})` }}
            >
              <div className={CARD_IMAGE_OVERLAY} aria-hidden />

              <span className="relative block">
                <span className="block wrap-break-word text-sm font-bold text-white line-clamp-1 bwrap-break-word">
                  {t(team.titleKey)}
                </span>
                <span className="block text-xs text-slate-300">
                  {team.members} {t('members_label')}
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
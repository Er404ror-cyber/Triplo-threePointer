import React from 'react';
import { useTranslate } from '../context/LanguageProvider';

export interface Team {
  id: string;
  titleKey: Parameters<ReturnType<typeof useTranslate>['t']>[0];
  initials: string;
  color: string;
}

interface TeamsGridProps {
  teams: Team[];
}

export const TeamsGrid: React.FC<TeamsGridProps> = ({ teams }) => {
  const { t } = useTranslate();

  return (
    <section className="w-full py-8 md:py-16 px-4 md:px-12 bg-black border-t border-zinc-900">
      <div className="max-w-7xl mx-auto">
        <span className="text-xs text-gray-500 font-mono">
          {t('teams_section_eyebrow')}
        </span>
        <h2 className="text-2xl md:text-3xl font-black tracking-tight mt-1 mb-6 md:mb-8">
          {t('meet_our_teams')}
        </h2>

        {/* 
          💡 MUDANÇA PRINCIPAL:
          - grid-cols-1: No telemóvel fica 1 por linha (um debaixo do outro).
          - sm:grid-cols-2: Em ecrãs pequenos/médios passa para 2 por linha.
          - md:grid-cols-3 & lg:grid-cols-5: Em tablets/computadores fica até 5 por linha.
        */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {teams.map((team) => (
            <div
              key={team.id}
              className="flex items-center sm:flex-col justify-start sm:justify-center gap-4 sm:gap-3 rounded-2xl border border-zinc-800 bg-zinc-950 p-4 sm:p-5 w-full"
            >
              <div
                className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl text-xs sm:text-sm font-black text-white shrink-0"
                style={{ backgroundColor: team.color }}
              >
                {team.initials}
              </div>
              <p className="text-sm sm:text-xs font-bold uppercase tracking-wider text-gray-300 text-left sm:text-center">
                {t(team.titleKey)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
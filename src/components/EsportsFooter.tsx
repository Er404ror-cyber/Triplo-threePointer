import React from 'react';
import { Users } from 'lucide-react';
import { useTranslate } from '../context/LanguageProvider';
import { FOOTER_KEYS } from '../data/esportsData';

export const EsportsFooter: React.FC = () => {
  const { t } = useTranslate();

  return (
    <footer className="bg-[#070a10] py-16">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white">
            <span className="text-xs font-black">V</span>
          </div>
          <span className="text-lg font-black tracking-widest">VXG</span>
        </div>

        <nav className="flex flex-wrap justify-center gap-6 text-xs font-bold uppercase tracking-widest text-slate-400">
          {FOOTER_KEYS.map((key) => (
            <a key={key} href="#" className="hover:text-white">
              {t(key)}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4 text-slate-400">
          <Users size={16} className="cursor-pointer hover:text-white" />
          <Users size={16} className="cursor-pointer hover:text-white" />
          <Users size={16} className="cursor-pointer hover:text-white" />
        </div>

        <p className="text-[11px] text-slate-500">
          {t('footer_copyright')}
        </p>
      </div>
    </footer>
  );
};
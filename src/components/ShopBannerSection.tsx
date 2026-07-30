import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useTranslate } from '../context/LanguageProvider';
import { SHOP_IMAGE } from '../data/esportsData';

export const ShopBannerSection: React.FC = () => {
  const { t } = useTranslate();

  return (
    <section
      className="relative overflow-hidden border-b border-white/5 bg-cover bg-center py-24"
      style={{ backgroundImage: `url(${SHOP_IMAGE})` }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to right, #0a0e14 20%, #0a0e14 35%, transparent 55%)',
        }}
        aria-hidden
      />
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 md:grid-cols-2">
        <div>
          <h2 className="text-3xl font-black leading-tight md:text-4xl line-clamp-3 bwrap-break-word">
            {t('shop_title')}
          </h2>
          <p className="mt-4 max-w-sm text-sm text-slate-400">
            {t('shop_description')}
          </p>
          <a
            href="#"
            className="mt-8 inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-white hover:text-blue-400"
          >
            {t('shop_now')}
            <ChevronRight size={14} className="text-white" />
            <ChevronRight size={14} className="text-white/40" />
            <ChevronRight size={14} className="text-white/20" />
          </a>
        </div>
      </div>
    </section>
  );
};
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useTranslate } from '../context/LanguageProvider';

export const ShopBannerSection: React.FC = () => {
  const { t } = useTranslate();

  return (
    <section className="relative overflow-hidden border-b border-white/5 py-24">
      {/* Imagem de fundo */}
      <img
        src="src/img/Mocambique-basquetebol-feminino.jpg"
        alt="Banner da Loja"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Degradê sobreposto substituindo o style inline */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-[#0a0e14] from-20% via-[#0a0e14] via-35% to-transparent to-55%"
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 md:grid-cols-2">
        <div>
          <h2 className="text-3xl font-black leading-tight md:text-4xl line-clamp-3 break-words">
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
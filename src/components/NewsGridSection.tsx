import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useTranslate } from '../context/LanguageProvider';
import { NEWS, CARD_IMAGE_OVERLAY } from '../data/esportsData';

export const NewsGridSection: React.FC = () => {
  const { t } = useTranslate();

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <div className="relative mx-auto max-w-5xl p-8 text-center">
        <h2 className="text-3xl font-black md:text-4xl">{t('news_grid_title')}</h2>
        <p className="mt-2 text-sm font-bold tracking-[0.25em] text-blue-400">
          {t('hashtag_vxgwin')}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {NEWS.map((item) => (
          <a
            key={item.id}
            href="#"
            className="group relative flex min-h-50 flex-col justify-end overflow-hidden rounded-2xl bg-cover bg-center p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-400/50 hover:shadow-[0_0_25px_5px_rgba(56,120,255,0.45)]"
            style={{ backgroundImage: `url(${item.media_url})` }}
          >
            <div className={CARD_IMAGE_OVERLAY} aria-hidden />

            <div className="relative">
              <p className="text-[11px] font-bold tracking-widest text-slate-300">
                {item.created_at} &middot; {t(item.categoryKey)}
              </p>
              <h3 className="mt-2 w-[70%] text-xl font-black leading-snug text-white line-clamp-2 bwrap-break-word">
                {t(item.titleKey)}
              </h3>
            </div>
          </a>
        ))}
      </div>

      <div className="mt-10 text-center">
        <a
          href="#"
          className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-slate-300 hover:text-white"
        >
          {t('all_news')}
          <ChevronRight size={14} className="text-white" />
          <ChevronRight size={14} className="text-white/40" />
          <ChevronRight size={14} className="text-white/20" />
        </a>
      </div>
    </section>
  );
};
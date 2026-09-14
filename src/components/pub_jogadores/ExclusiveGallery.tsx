import React from 'react';
import { useTranslate } from '../../context/LanguageProvider'; // Ajuste o caminho

export function ExclusiveGallery() {
  const { t } = useTranslate();

  const topRowItems = [0, 1, 2, 3, 4].map((i) => ({
    id: `top-${i}`,
    header: `${t('gallery_a_title')} ${i}`,
    title: t('gallery_a_title'),
    subtitle: t('gallery_a_subtitle'),
    isHighlighted: i === 3,
  }));

  const bottomRowItems = [0, 1, 2, 3, 4].map((i) => ({
    id: `bottom-${i}`,
    header: `${t('gallery_b_title')} ${i}`,
    title: t('gallery_b_title'),
    subtitle: t('gallery_b_subtitle'),
  }));

  return (
    <>
      <style>{`
        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scroll-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-scroll-left { animation: scroll-left 40s linear infinite; }
        .animate-scroll-right { animation: scroll-right 40s linear infinite; }
        .pause-on-hover:hover { animation-play-state: paused; }
      `}</style>

      <section className="py-16 sm:py-24">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-16 mb-12">
          <div className="text-[10px] font-bold text-gray-500 tracking-[0.25em] uppercase mb-2">
            {t('gallery_eyebrow')}
          </div>
          <h2 className="text-3xl font-black uppercase tracking-tight text-white">
            {t('gallery_title')}
          </h2>
        </div>

        <div className="flex w-max animate-scroll-right pause-on-hover mb-6">
          {[1, 2].map((setIndex) => (
            <div key={`set-top-${setIndex}`} className="flex gap-6 pr-6">
              {topRowItems.map((item) => (
                <div
                  key={`${setIndex}-${item.id}`}
                  className={`relative flex flex-col justify-between w-[280px] h-[380px] bg-[#0a0a0a] rounded-2xl p-5 transition-transform duration-300 hover:scale-[1.02] cursor-pointer ${
                    item.isHighlighted 
                      ? 'border border-[#dc2626] shadow-[0_0_15px_rgba(220,38,38,0.15)]' 
                      : 'border border-white/5'
                  }`}
                >
                  <span className="text-[11px] font-bold text-gray-300 uppercase tracking-wider">{item.header}</span>
                  <div className="flex flex-col gap-1 mt-auto">
                    <h3 className="text-[#facc15] font-black text-[15px] uppercase tracking-wide">{item.title}</h3>
                    <p className="text-gray-500 font-bold text-[10px] uppercase tracking-widest">{item.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="flex w-max animate-scroll-left pause-on-hover">
          {[1, 2].map((setIndex) => (
            <div key={`set-bottom-${setIndex}`} className="flex gap-6 pr-6">
              {bottomRowItems.map((item) => (
                <div key={`${setIndex}-${item.id}`} className="relative flex flex-col justify-between w-[280px] h-[380px] bg-[#0a0a0a] rounded-2xl border border-white/5 p-5 transition-transform duration-300 hover:scale-[1.02] cursor-pointer">
                  <span className="text-[11px] font-bold text-gray-300 uppercase tracking-wider">{item.header}</span>
                  <div className="flex flex-col gap-1 mt-auto">
                    <h3 className="text-[#ef4444] font-black text-[15px] uppercase tracking-wide">{item.title}</h3>
                    <p className="text-gray-500 font-bold text-[10px] uppercase tracking-widest">{item.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
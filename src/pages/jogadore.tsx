import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Gamepad2, Plus, X } from 'lucide-react';
import { useTranslate } from '../context/LanguageProvider';
import { Header } from '../components/header/header';
import { Link } from 'react-router-dom';

const CR7_IMAGES_ROW_1 = [
  "https://picsum.photos/seed/gallery-a-1/500/700",
  "https://picsum.photos/seed/gallery-a-2/500/700",
  "https://picsum.photos/seed/gallery-a-3/500/700",
  "https://picsum.photos/seed/gallery-a-4/500/700",
  "https://picsum.photos/seed/gallery-a-5/500/700",
];

const CR7_IMAGES_ROW_2 = [
  "https://picsum.photos/seed/gallery-b-1/500/700",
  "https://picsum.photos/seed/gallery-b-2/500/700",
  "https://picsum.photos/seed/gallery-b-3/500/700",
  "https://picsum.photos/seed/gallery-b-4/500/700",
  "https://picsum.photos/seed/gallery-b-5/500/700",
];
// Obtenha o tipo das chaves aceitas por t()
type TranslationKey = Parameters<ReturnType<typeof useTranslate>['t']>[0];

interface Team {
  id: string;
  titleKey: TranslationKey; // Em vez de string
  initials: string;
  color: string;
}

// Escudos fictícios (iniciais + cor), não são logos reais de equipas
const TEAMS: Team[] = [
  { id: '1', titleKey: 'team_battle_royale', initials: 'FRM', color: '#166534' },
  { id: '2', titleKey: 'team_arena_legends', initials: 'CDS', color: '#b91c1c' },
  { id: '3', titleKey: 'team_driftwood', initials: 'MAX', color: '#1d4ed8' },
  { id: '4', titleKey: 'team_politecnica', initials: 'PLT', color: '#ca8a04' },
  { id: '5', titleKey: 'team_tactical_six', initials: 'DSM', color: '#0ea5e9' },
  { id: '6', titleKey: 'team_alemanha', initials: 'ALE', color: '#1f2937' },
  { id: '7', titleKey: 'team_italia', initials: 'ITA', color: '#0369a1' },
  { id: '8', titleKey: 'team_inglaterra', initials: 'ING', color: '#7f1d1d' },
  { id: '9', titleKey: 'team_holanda', initials: 'HOL', color: '#ea580c' },
  { id: '10', titleKey: 'team_belgica', initials: 'BEL', color: '#991b1b' },
];


interface QuickAction {
  icon: React.ElementType;
  title: string;
  description: string;
  path: string;
  buttonText: string;
}


const QUICK_ACTIONS: QuickAction[] = [
  {
    icon: Gamepad2,
    title: 'Adicionar nova partida',
    description: 'Registe o resultado ou agende um novo jogo.',
    path: '/admin/newtime', // Invertido: agora aponta para newtime
    buttonText: 'Adicionar partida',
  },
];

export default function Jogadores() {
  const { t } = useTranslate();
  const [mobileIndex1, setMobileIndex1] = useState(0);
  const [mobileIndex2, setMobileIndex2] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const scrollRef1 = useRef<HTMLDivElement>(null);
  const scrollRef2 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef2.current) {
      scrollRef2.current.scrollLeft = scrollRef2.current.scrollWidth;
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setMobileIndex1((prev) => (prev + 1) % CR7_IMAGES_ROW_1.length);
      setMobileIndex2((prev) => (prev + 1) % CR7_IMAGES_ROW_2.length);

      if (scrollRef1.current) {
        const { scrollLeft, clientWidth, scrollWidth } = scrollRef1.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef1.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollRef1.current.scrollBy({ left: 240, behavior: 'smooth' });
        }
      }

      if (scrollRef2.current) {
        const { scrollLeft, scrollWidth } = scrollRef2.current;
        if (scrollLeft <= 10) {
          scrollRef2.current.scrollTo({ left: scrollWidth, behavior: 'smooth' });
        } else {
          scrollRef2.current.scrollBy({ left: -240, behavior: 'smooth' });
        }
      }
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden">
      <Header />

      {/* ----------------- SECÇÃO 1: HERO / PLACAR ----------------- */}
      <section className="relative w-full bg-gray-900 pt-8 pb-12 px-4 md:pt-10 md:pb-20 md:px-12 border-b border-red-900/30">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            
            {QUICK_ACTIONS.map((action) => (
                                       <div
                                         key={action.title}
                                         className="group rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-sm"
                                       >
                                       
                                         <Link
                                           to={action.path}
                                           className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-700"
                                         >
                                           <Plus size={13} />
                                           {action.buttonText}
                                         </Link>
                                       </div>
                                     ))}

            {/* Placar — envolve em telas pequenas, sem estourar a largura */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mb-5 sm:mb-6 bg-black/40 p-4 sm:p-6 rounded-2xl border border-gray-800 w-full max-w-xs sm:max-w-none">
              <div className="text-center shrink-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-600 rounded-full mb-1.5 sm:mb-2 flex items-center justify-center font-bold text-xs sm:text-base mx-auto">
                  CDS
                </div>
                <p className="text-[10px] sm:text-xs text-gray-400 whitespace-nowrap">{t('team_arena_legends')}</p>
              </div>

              <div className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tighter text-red-600 shrink-0">
                0 : 3
              </div>

              <div className="text-center shrink-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-700 rounded-full mb-1.5 sm:mb-2 flex items-center justify-center font-bold text-xs sm:text-base mx-auto">
                  FRM
                </div>
                <p className="text-[10px] sm:text-xs text-gray-400 whitespace-nowrap">{t('team_battle_royale')}</p>
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black uppercase tracking-tight text-white mb-2 leading-tight break-words">
              {t('goal_text')}
            </h1>
            <p className="text-gray-400 max-w-md text-xs sm:text-sm md:text-base">
              {t('match_result_description')}
            </p>
          </div>

          <div className="relative flex justify-center md:justify-end">
            <img
              src="https://picsum.photos/seed/hero-player/450/500"
              alt="Hero"
              loading="lazy"
              className="w-full max-w-[450px] h-[280px] sm:h-[360px] md:h-[500px] object-cover rounded-3xl border border-red-500/20"
            />
          </div>
        </div>
      </section>

      {/* ----------------- SECÇÃO 2: DUAS GALERIAS COM SCROLL AUTOMÁTICO ----------------- */}
      <section className="w-full py-12 md:py-16 px-4 md:px-12 bg-black space-y-10 md:space-y-12">
        <div className="max-w-7xl mx-auto mb-4">
          <span className="text-xs text-gray-500 font-mono">{t('gallery_eyebrow')}</span>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight mt-1">{t('gallery_title')}</h2>
        </div>

        {/* ================= GALERIA 1 (Scroll para a Direita) ================= */}
        <div>
          {/* DESKTOP */}
          <div className="hidden md:block relative w-full overflow-hidden">
            <div ref={scrollRef1} className="flex gap-6 overflow-x-auto no-scrollbar pb-4 snap-x" style={{ scrollbarWidth: 'none' }}>
              {CR7_IMAGES_ROW_1.map((img, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedImage(img)}
                  className="min-w-[260px] h-[350px] rounded-2xl overflow-hidden relative cursor-pointer border border-zinc-800 hover:border-red-500 transition-colors duration-200 snap-start flex-shrink-0"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10" />
                  <img
                    src={img}
                    alt={`${t('gallery_a_title')} ${index}`}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-6 left-6 z-20">
                    <p className="text-yellow-500 font-black text-xl tracking-tighter">{t('gallery_a_title')}</p>
                    <p className="text-xs text-gray-300 uppercase tracking-widest">{t('gallery_a_subtitle')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* MOBILE (Quadrado Fixo 1) */}
          <div className="block md:hidden w-full max-w-[340px] mx-auto relative aspect-square rounded-2xl overflow-hidden border border-zinc-700 bg-zinc-900">
            <div onClick={() => setSelectedImage(CR7_IMAGES_ROW_1[mobileIndex1])} className="w-full h-full cursor-pointer relative">
              <img
                src={CR7_IMAGES_ROW_1[mobileIndex1]}
                alt={t('gallery_a_album')}
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-4 left-4"><p className="text-yellow-500 font-black text-lg">{t('gallery_a_album')}</p></div>
            </div>
            <button onClick={() => setMobileIndex1((p) => (p === 0 ? CR7_IMAGES_ROW_1.length - 1 : p - 1))} className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white"><ChevronLeft size={20} /></button>
            <button onClick={() => setMobileIndex1((p) => (p + 1) % CR7_IMAGES_ROW_1.length)} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white"><ChevronRight size={20} /></button>
          </div>
        </div>

        {/* ================= GALERIA 2 (Scroll Inverso para a Esquerda) ================= */}
        <div>
          {/* DESKTOP */}
          <div className="hidden md:block relative w-full overflow-hidden">
            <div ref={scrollRef2} className="flex gap-6 overflow-x-auto no-scrollbar pb-4 snap-x" style={{ scrollbarWidth: 'none' }}>
              {CR7_IMAGES_ROW_2.map((img, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedImage(img)}
                  className="min-w-[260px] h-[350px] rounded-2xl overflow-hidden relative cursor-pointer border border-zinc-800 hover:border-red-500 transition-colors duration-200 snap-start flex-shrink-0"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10" />
                  <img
                    src={img}
                    alt={`${t('gallery_b_title')} ${index}`}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-6 left-6 z-20">
                    <p className="text-red-500 font-black text-xl tracking-tighter">{t('gallery_b_title')}</p>
                    <p className="text-xs text-gray-300 uppercase tracking-widest">{t('gallery_b_subtitle')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* MOBILE (Quadrado Fixo 2) */}
          <div className="block md:hidden w-full max-w-[340px] mx-auto relative aspect-square rounded-2xl overflow-hidden border border-zinc-700 bg-zinc-900 mt-6">
            <div onClick={() => setSelectedImage(CR7_IMAGES_ROW_2[mobileIndex2])} className="w-full h-full cursor-pointer relative">
              <img
                src={CR7_IMAGES_ROW_2[mobileIndex2]}
                alt={t('gallery_b_album')}
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-4 left-4"><p className="text-red-500 font-black text-lg">{t('gallery_b_album')}</p></div>
            </div>
            <button onClick={() => setMobileIndex2((p) => (p === 0 ? CR7_IMAGES_ROW_2.length - 1 : p - 1))} className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white"><ChevronLeft size={20} /></button>
            <button onClick={() => setMobileIndex2((p) => (p + 1) % CR7_IMAGES_ROW_2.length)} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white"><ChevronRight size={20} /></button>
          </div>
        </div>
      </section>

      {/* ----------------- SECÇÃO 3: EQUIPAS EM DESTAQUE ----------------- */}
      <section className="w-full py-12 md:py-16 px-4 md:px-12 bg-black border-t border-zinc-900">
        <div className="max-w-7xl mx-auto">
          <span className="text-xs text-gray-500 font-mono">{t('teams_section_eyebrow')}</span>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight mt-1 mb-6 md:mb-8">{t('meet_our_teams')}</h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
            {TEAMS.map((team) => (
              <div
                key={team.id}
                className="flex flex-col items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-950 p-4 sm:p-5"
              >
                <div
                  className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl text-xs sm:text-sm font-black text-white shrink-0"
                  style={{ backgroundColor: team.color }}
                >
                  {team.initials}
                </div>
                <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-300 text-center">
                 {t(team.titleKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------- SECÇÃO 4: RODAPÉ / COPA QATAR ----------------- */}
      <section className="w-full py-12 md:py-16 px-4 md:px-12 bg-black border-t border-zinc-900">
        <div className="max-w-4xl mx-auto bg-zinc-950 rounded-3xl p-6 sm:p-8 md:p-12 border border-zinc-800 flex flex-col md:flex-row items-center gap-6 md:gap-8">
          <div className="flex-1 space-y-3 sm:space-y-4 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <span className="w-2 h-2 rounded-full bg-red-600" />
              <p className="text-xs font-mono text-gray-400 tracking-widest">{t('match_footer_tag')}</p>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold uppercase">{t('match_footer_title')}</h3>
            <p className="text-sm text-gray-400 leading-relaxed">{t('match_footer_description')}</p>
            <button className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-6 py-3 rounded-full uppercase tracking-wider">
              {t('featured_player_button')}
            </button>
          </div>
          <div className="w-full md:w-[280px] bg-black/50 border border-zinc-800 p-6 rounded-2xl flex flex-col items-center justify-center text-center">
            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-2">{t('match_points_label')}</p>
            <div className="flex items-center gap-4">
              <span className="font-bold text-sm">FRM</span>
              <span className="text-3xl font-black text-yellow-500">3 : 0</span>
              <span className="font-bold text-sm">CDS</span>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- MODAL DE CLIQUE ----------------- */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <button onClick={() => setSelectedImage(null)} className="absolute top-6 right-6 p-3 rounded-full bg-zinc-900 text-white">
            <X size={24} />
          </button>
          <img src={selectedImage} alt="Expanded View" className="max-w-full max-h-[85vh] object-contain rounded-xl border border-zinc-800" />
        </div>
      )}
    </div>
  );
}
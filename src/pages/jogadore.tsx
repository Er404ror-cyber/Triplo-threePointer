import { useTranslate } from '../context/LanguageProvider';
import { Header } from '../components/header/header';
import { HeroSection } from '../components//HeroSection';
import { GalleryRow } from '../components/GalleryRow';
import { TeamsGrid, type Team } from '../components/TeamsGrid';
import { ImageModal } from '../components/ImageModal';
import { useGalleryCarousel } from '../types/useGalleryCarousel';

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


export default function Jogadores() {
  const { t } = useTranslate();
  const {
    mobileIndex1,
    setMobileIndex1,
    mobileIndex2,
    setMobileIndex2,
    selectedImage,
    setSelectedImage,
    scrollRef1,
    scrollRef2,
  } = useGalleryCarousel(CR7_IMAGES_ROW_1.length, CR7_IMAGES_ROW_2.length);

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden">
      <Header />

      {/* SECÇÃO 1: HERO */}
      <HeroSection />

      {/* SECÇÃO 2: GALERIAS */}
      <section className="w-full py-12 md:py-16 px-4 md:px-12 bg-black space-y-10 md:space-y-12">
        <div className="max-w-7xl mx-auto mb-4">
          <span className="text-xs text-gray-500 font-mono">{t('gallery_eyebrow')}</span>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight mt-1">
            {t('gallery_title')}
          </h2>
        </div>

        <GalleryRow
          images={CR7_IMAGES_ROW_1}
          titleKey={t('gallery_a_title')}
          subtitleKey={t('gallery_a_subtitle')}
          albumKey={t('gallery_a_album')}
          mobileIndex={mobileIndex1}
          scrollRef={scrollRef1}
          onSelectImage={setSelectedImage}
          onPrevMobile={() =>
            setMobileIndex1((p) => (p === 0 ? CR7_IMAGES_ROW_1.length - 1 : p - 1))
          }
          onNextMobile={() =>
            setMobileIndex1((p) => (p + 1) % CR7_IMAGES_ROW_1.length)
          }
        />

        <GalleryRow
          images={CR7_IMAGES_ROW_2}
          titleKey={t('gallery_b_title')}
          subtitleKey={t('gallery_b_subtitle')}
          albumKey={t('gallery_b_album')}
          mobileIndex={mobileIndex2}
          scrollRef={scrollRef2}
          onSelectImage={setSelectedImage}
          onPrevMobile={() =>
            setMobileIndex2((p) => (p === 0 ? CR7_IMAGES_ROW_2.length - 1 : p - 1))
          }
          onNextMobile={() =>
            setMobileIndex2((p) => (p + 1) % CR7_IMAGES_ROW_2.length)
          }
          isRedVariant
        />
      </section>

      {/* SECÇÃO 3: EQUIPAS */}
      <TeamsGrid teams={TEAMS} />

      {/* SECÇÃO 4: RODAPÉ DESTAQUE */}
      <section className="w-full py-12 md:py-16 px-4 md:px-12 bg-black border-t border-zinc-900">
        <div className="max-w-4xl mx-auto bg-zinc-950 rounded-3xl p-6 sm:p-8 md:p-12 border border-zinc-800 flex flex-col md:flex-row items-center gap-6 md:gap-8">
          <div className="flex-1 space-y-3 sm:space-y-4 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <span className="w-2 h-2 rounded-full bg-red-600" />
              <p className="text-xs font-mono text-gray-400 tracking-widest">
                {t('match_footer_tag')}
              </p>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold uppercase">
              {t('match_footer_title')}
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              {t('match_footer_description')}
            </p>
            <button className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-6 py-3 rounded-full uppercase tracking-wider">
              {t('featured_player_button')}
            </button>
          </div>
          <div className="w-full md:w-[280px] bg-black/50 border border-zinc-800 p-6 rounded-2xl flex flex-col items-center justify-center text-center">
            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-2">
              {t('match_points_label')}
            </p>
            <div className="flex items-center gap-4">
              <span className="font-bold text-sm">FRM</span>
              <span className="text-3xl font-black text-yellow-500">3 : 0</span>
              <span className="font-bold text-sm">CDS</span>
            </div>
          </div>
        </div>
      </section>

      {/* MODAL */}
      <ImageModal imageUrl={selectedImage} onClose={() => setSelectedImage(null)} />
    </div>
  );
}
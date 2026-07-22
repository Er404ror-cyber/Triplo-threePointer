import { 
  ChevronRight,
  Users,
} from 'lucide-react';
import { useTranslate } from '../context/LanguageProvider';

/**
 * Réplica de landing page de organização de eSports.
 * Observação: usei uma marca fictícia ("VXG") e imagens/placeholders genéricos
 * no lugar de logotipos, fotos de jogadores reais e artes de jogos licenciados,
 * pois esses elementos são protegidos por direitos autorais / marca registrada
 * e não podem ser reproduzidos.
 */


interface NewsItem {
  id: string;
  created_at: string;
  categoryKey: string;
  titleKey: string;
  media_url: string;
}

const NEWS: NewsItem[] = [
  {
    id: "1",
    created_at: 'AUG 17, 2020',
    categoryKey: 'news_cat_tactical_fps',
    titleKey: 'news_title_1',
    media_url: "https://picsum.photos/seed/vxg-tactical/800/600",
  },
  {
    id: "3",
    created_at: 'AUG 4, 2020',
    categoryKey: 'news_cat_battle_royale',
    titleKey: 'news_title_3',
    media_url: "https://picsum.photos/seed/vxg-royale/800/600",
  },
  {
    id: "4",
    created_at: 'JUL 29, 2020',
    categoryKey: 'news_cat_arena_legends',
    titleKey: 'news_title_4',
    media_url: "https://picsum.photos/seed/vxg-arena/800/600",
  },
  {
    id: "5",
    created_at: 'JUL 5, 2020',
    categoryKey: 'news_cat_survival',
    titleKey: 'news_title_5',
    media_url: "https://picsum.photos/seed/vxg-driftwood/800/600",
  },
  {
    id: "6",
    created_at: 'JUN 2, 2020',
    categoryKey: 'news_cat_vxg_news',
    titleKey: 'news_title_6',
    media_url: "https://picsum.photos/seed/vxg-hiring/800/600",
  },
  {
    id: "7",
    created_at: 'MAY 28, 2020',
    categoryKey: 'news_cat_race_league',
    titleKey: 'news_title_7',
    media_url: "https://picsum.photos/seed/vxg-race/800/600",
  },
];

interface TeamCardItem {
  id: string;
  titleKey: string;
  members: string;
  media_url: string;
}

const TEAM_CARDS: TeamCardItem[] = [
  { id: "1", titleKey: 'team_arena_legends', members: "9", media_url: "https://picsum.photos/seed/vxg-team-arena/600/400" },
  { id: "2", titleKey: 'team_battle_royale', members: "14", media_url: "https://picsum.photos/seed/vxg-team-royale/600/400" },
  { id: "3", titleKey: 'team_driftwood', members: "12", media_url: "https://picsum.photos/seed/vxg-team-driftwood/600/400" },
  { id: "4", titleKey: 'team_tactical_six', members: "6", media_url: "https://picsum.photos/seed/vxg-team-tactical/600/400" },
  { id: "5", titleKey: 'team_smash_circuit', members: "2", media_url: "https://picsum.photos/seed/vxg-team-smash/600/400" },
  { id: "6", titleKey: 'team_apex_arena', members: "5", media_url: "https://picsum.photos/seed/vxg-team-apex/600/400" },
  { id: "7", titleKey: 'team_card_masters', members: "21", media_url: "https://picsum.photos/seed/vxg-team-cards/600/400" },
  { id: "8", titleKey: 'team_realm_wars', members: "7", media_url: "https://picsum.photos/seed/vxg-team-realm/600/400" },
  { id: "9", titleKey: 'team_valor_ops', members: "5", media_url: "https://picsum.photos/seed/vxg-team-valor/600/400" },
  { id: "10", titleKey: 'team_tactics_league', members: "3", media_url: "https://picsum.photos/seed/vxg-team-tactics/600/400" },
  { id: "11", titleKey: 'team_stream_team', members: "18", media_url: "https://picsum.photos/seed/vxg-team-stream/600/400" },
];

const HERO_IMAGE = "https://picsum.photos/seed/vxg-hero/1600/900";
const SHOP_IMAGE = "https://picsum.photos/seed/vxg-shop/1600/900";
const CARD_IMAGE_OVERLAY = "absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent";

export default function EsportsLandingPage() {
  const { t } = useTranslate();

  return (
    <div className="min-h-screen bg-[#0a0e14] text-slate-200 font-sans">

      {/* HERO */}
      <section
        className="relative overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: `url(${HERO_IMAGE})` }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to right, #0a0e14 20%, #0a0e14 35%, transparent 55%)',
          }}
          aria-hidden
        />
        <div
          className="absolute -right-32 top-0 h-full w-2/3 opacity-40 blur-sm"
          style={{
            background:
              'radial-gradient(circle at 70% 30%, rgba(56,120,255,0.35), transparent 60%)',
          }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-7xl px-6 py-20 md:py-28">
          <p className="mb-4 text-xs font-bold tracking-[0.3em] text-blue-400 ">
            {t('hero_eyebrow')}
          </p>
          <h1 className="max-w-xl text-4xl font-black leading-tight tracking-tight md:text-6xl text-wrap line-clamp-3 wrap-break-word ">
            {t('coaching_text')}
          </h1>
          <p className="mt-6 max-w-md text-sm text-slate-400">
            {t('hero_description')}
          </p>
          
          <a  href="#"
            className="mt-8 inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-white hover:text-blue-400"
          >
            {t('read_more')}
            <ChevronRight size={14} className="text-white" />
            <ChevronRight size={14} className="text-white/40" />
            <ChevronRight size={14} className="text-white/20" />
          </a>
        </div>
      </section>

      {/* NEWS GRID */}
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

      {/* MEET OUR TEAMS */}
      <section className="relative overflow-hidden bg-cover bg-center py-20">
        <div className="absolute inset-0 bg-[#070a10]/90" aria-hidden />

        <div className='absolute left-[50%] top-24'>
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

      {/* SHOP BANNER */}
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

      {/* FOOTER */}
      <footer className="bg-[#070a10] py-16">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white">
              <span className="text-xs font-black">V</span>
            </div>
            <span className="text-lg font-black tracking-widest">VXG</span>
          </div>

          <nav className="flex flex-wrap justify-center gap-6 text-xs font-bold uppercase tracking-widest text-slate-400">
            {[
              'footer_home',
              'footer_calendar',
              'footer_teams',
              'footer_partners',
              'footer_branding_gallery',
              'footer_contact',
              'footer_store',
            ].map((key) => (
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
    </div>
  );
}
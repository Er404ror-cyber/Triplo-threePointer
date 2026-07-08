import { 
  ChevronDown,
  ChevronRight,
  Users,
} from 'lucide-react';

/**
 * Réplica de landing page de organização de eSports.
 * Observação: usei uma marca fictícia ("VXG") e imagens/placeholders genéricos
 * no lugar de logotipos, fotos de jogadores reais e artes de jogos licenciados,
 * pois esses elementos são protegidos por direitos autorais / marca registrada
 * e não podem ser reproduzidos.
 */

const NAV_LINKS = ['Teams', 'Facility', 'News', 'Partners', 'Store', 'More', 'Contact'];

interface NewsItem {
  id: string;
  created_at: string;
  category: string;
  title: string;
  media_url: string;
}
const NEWS: NewsItem[] = [
  {
    id: "1",
    created_at: 'AUG 17, 2020',
    category: 'TACTICAL FPS',
    title: 'Roster Swap for VXG TacticalRoster Swap for VXG TacticalRoster Swap for VXG TacticalRoster Swap for VXG TacticalRoster Swap for VXG Tactical',
    media_url: "https://picsum.photos/seed/vxg-tactical/800/600",
  },
  {
    id: "3",
    created_at: 'AUG 4, 2020',
    category: 'BATTLE ROYALE',
    title: 'Welcome Back VXG Royale',
    media_url: "https://picsum.photos/seed/vxg-royale/800/600",
  },
  {
    id: "4",
    created_at: 'JUL 29, 2020',
    category: 'ARENA LEGENDS',
    title: 'NovaSlays joins VXG Arena',
    media_url: "https://picsum.photos/seed/vxg-arena/800/600",
  },
  {
    id: "5",
    created_at: 'JUL 5, 2020',
    category: 'SURVIVAL',
    title: 'Welcome VXG Driftwood!',
    media_url: "https://picsum.photos/seed/vxg-driftwood/800/600",
  },
  {
    id: "6",
    created_at: 'JUN 2, 2020',
    category: 'VXG NEWS',
    title: 'Hiring: E-Commerce Manager',
    media_url: "https://picsum.photos/seed/vxg-hiring/800/600",
  },
  {
    id: "7",
    created_at: 'MAY 28, 2020',
    category: 'RACE LEAGUE',
    title: 'VXG Race League Roster Gets Alpha',
    media_url: "https://picsum.photos/seed/vxg-race/800/600",
  },
];
interface TeamCardItem {
  id: string;
  title: string;
  team_name: string;
  members: string;
  media_url: string;
}

const TEAM_CARDS: TeamCardItem[] = [
  {
    id: "1",
    title: "Arena Legends",
    team_name: "Arena Legends",
    members: "9",
    media_url: "https://picsum.photos/seed/vxg-team-arena/600/400",
  },
  {
    id: "2",
    title: "Battle Royale",
    team_name: "Battle Royale",
    members: "14",
    media_url: "https://picsum.photos/seed/vxg-team-royale/600/400",
  },
  {
    id: "3",
    title: "Driftwood",
    team_name: "Driftwood",
    members: "12",
    media_url: "https://picsum.photos/seed/vxg-team-driftwood/600/400",
  },
  {
    id: "4",
    title: "Tactical Six",
    team_name: "Tactical Six",
    members: "6",
    media_url: "https://picsum.photos/seed/vxg-team-tactical/600/400",
  },
  {
    id: "5",
    title: "Smash Circuit",
    team_name: "Smash Circuit",
    members: "2",
    media_url: "https://picsum.photos/seed/vxg-team-smash/600/400",
  },
  {
    id: "6",
    title: "Apex Arena",
    team_name: "Apex Arena",
    members: "5",
    media_url: "https://picsum.photos/seed/vxg-team-apex/600/400",
  },
  {
    id: "7",
    title: "Card Masters",
    team_name: "Card Masters",
    members: "21",
    media_url: "https://picsum.photos/seed/vxg-team-cards/600/400",
  },
  {
    id: "8",
    title: "Realm Wars",
    team_name: "Realm Wars",
    members: "7",
    media_url: "https://picsum.photos/seed/vxg-team-realm/600/400",
  },
  {
    id: "9",
    title: "Valor Ops",
    team_name: "Valor Ops",
    members: "5",
    media_url: "https://picsum.photos/seed/vxg-team-valor/600/400",
  },
  {
    id: "10",
    title: "Tactics League",
    team_name: "Tactics League",
    members: "3",
    media_url: "https://picsum.photos/seed/vxg-team-tactics/600/400",
  },
  {
    id: "11",
    title: "Stream Team",
    team_name: "Stream Team",
    members: "18",
    media_url: "https://picsum.photos/seed/vxg-team-stream/600/400",
  },
];
const HERO_IMAGE = "https://picsum.photos/seed/vxg-hero/1600/900";
const SHOP_IMAGE = "https://picsum.photos/seed/vxg-shop/1600/900";
const CARD_IMAGE_OVERLAY = "absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent";

export default function EsportsLandingPage() {

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
          <p className="mb-4 text-xs font-bold tracking-[0.3em] text-blue-400">
            2020 ARENA SUMMER SPLIT
          </p>
          <h1 className="max-w-2xl text-4xl font-black leading-tight tracking-tight md:text-6xl">
            VXG Coaching Restructure for the Summer Split
          </h1>
          <p className="mt-6 max-w-md text-sm text-slate-400">
            Today, we&apos;re announcing a new head coach for our primary Arena
            Legends squad heading into the 2020 Summer Split.
          </p>
          <a
            href="#"
            className="mt-8 inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-white hover:text-blue-400"
          >
            READ MORE
            <ChevronRight size={14} className="text-white" />
            <ChevronRight size={14} className="text-white/40" />
            <ChevronRight size={14} className="text-white/20" />
          </a>
        </div>
      </section>

      {/* NEWS GRID */}
      <section className="mx-auto max-w-7xl px-6 py-12">   

        <div className="relative mx-auto max-w-5xl p-8 text-center"><h2 className="text-3xl font-black md:text-4xl">NEWS GRID</h2>
          <p className="mt-2 text-sm font-bold tracking-[0.25em] text-blue-400">
            #VXGWIN
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {NEWS.map((item) => (
            <a
           key={item.title}
              href="#"
              className="group relative flex min-h-50 flex-col justify-end overflow-hidden rounded-2xl bg-cover bg-center p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-400/50 hover:shadow-[0_0_25px_5px_rgba(56,120,255,0.45)] "
              style={{ backgroundImage: `url(${item.media_url})` }}
            >
              <div className={CARD_IMAGE_OVERLAY} aria-hidden />

              <div className="relative">
                <p className="text-[11px] font-bold tracking-widest text-slate-300">
                  {item.created_at} &middot; {item.category}
                </p>
                <h3 className="mt-2 w-[70%] text-xl font-black leading-snug text-white line-clamp-2 bwrap-break-word">
                  {item.title}
                </h3>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-10 text-center">
          <a
            href="#"
            className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-slate-300 hover:text-white "
          >
            ALL NEWS
             <ChevronRight size={14} className="text-white" />
            <ChevronRight size={14} className="text-white/40" />
            <ChevronRight size={14} className="text-white/20" />
          </a>
        </div>
      </section>

     {/* MEET OUR TEAMS */}
     <section
        className="relative overflow-hidden  bg-cover bg-center py-20"
      >
        <div className="absolute inset-0 bg-[#070a10]/90" aria-hidden />

<div className='absolute left-[50%] top-24'>
       <svg
          viewBox="0 0 200 200"
          className="pointer-events-none  h-30  -translate-x-1/2 -translate-y-1/2 opacity-[0.07]"
          aria-hidden
        >
          <circle cx="100" cy="100" r="92" stroke="white" strokeWidth="4" fill="none" />
          <line x1="8" y1="100" x2="192" y2="100" stroke="white" strokeWidth="4" />
          <line x1="100" y1="8" x2="100" y2="192" stroke="white" strokeWidth="4" />
          <path
            d="M 30 30 Q 100 100 30 170"
            stroke="white"
            strokeWidth="4"
            fill="none"
          />
          <path
            d="M 170 30 Q 100 100 170 170"
            stroke="white"
            strokeWidth="4"
            fill="none"
          />
        </svg>
    </div>     

        <div className="relative mx-auto max-w-5xl px-6 text-center"><h2 className="text-3xl font-black md:text-4xl">Meet Our Teams</h2>
          <p className="mt-2 text-sm font-bold tracking-[0.25em] text-blue-400">
            #VXGWIN
          </p>

        <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM_CARDS.map((team) => {
              return (
                <button
                  key={team.id}
                  className={`group relative flex min-h-32.5 flex-col justify-end overflow-hidden rounded-xl bg-cover bg-center px-4 py-4 text-left transition-all duration-300 hover:-translate-y-1 hover:border-blue-400/50 hover:shadow-[0_0_25px_5px_rgba(56,120,255,0.45)] 
                    border-blue-500 shadow-[0_0_20px_4px_rgba(56,120,255,0.4)]'
                      
                  }`}
                  style={{ backgroundImage: `url(${team.media_url})` }}
                >
                  <div className={CARD_IMAGE_OVERLAY} aria-hidden />

                  <span className="relative block">
                    <span className="block wrap-break-word text-sm font-bold text-white line-clamp-1 bwrap-break-word">
                      {team.title}
                    </span>
                    <span className="block text-xs text-slate-300">
                      {team.members} Members
                    </span>
                  </span>
                </button>
              );
            })}
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
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 md:grid-cols-2"><div>
            <h2 className="text-3xl font-black leading-tight md:text-4xl line-clamp-3 bwrap-break-word">
              Shop Official VXG Apparel  Accessories
            </h2>
            <p className="mt-4 max-w-sm text-sm text-slate-400">
              Apparel and accessories from the one and only VXG, including pro
              jerseys, member items, and more.
            </p>
            <a
              href="#"
              className="mt-8 inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-white hover:text-blue-400"
            >
              SHOP NOW
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
            {['Home', 'Calendar', 'Teams', 'Partners', 'Branding & Gallery', 'Contact', 'Store'].map(
              (link) => (
                <a key={link} href="#" className="hover:text-white">
                  {link}
                </a>
              )
            )}
          </nav>

          <div className="flex items-center gap-4 text-slate-400">
            <Users size={16} className="cursor-pointer hover:text-white" />
            <Users size={16} className="cursor-pointer hover:text-white" />
            <Users size={16} className="cursor-pointer hover:text-white" />
          </div>

          <p className="text-[11px] text-slate-500">
            Copyright © 2020 VXG. Design inspired layout, built for demonstration.
          </p>
        </div>
      </footer>
    </div>
  );
}

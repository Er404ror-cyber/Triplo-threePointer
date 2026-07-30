import type { TranslationKey } from '../context/LanguageProvider';

export interface NewsItem {
  id: string;
  created_at: string;
  categoryKey: TranslationKey;
  titleKey: TranslationKey;
  media_url: string;
}

export interface TeamCardItem {
  id: string;
  titleKey: TranslationKey;
  members: string;
  media_url: string;
}

export const NEWS: NewsItem[] = [
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

export const TEAM_CARDS: TeamCardItem[] = [
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

export const FOOTER_KEYS: TranslationKey[] = [
  'home',
  'calendar',
  'nav_teams',
  'nav_partners',
  'nav_more',
  'nav_contact',
  'nav_store',
];

export const HERO_IMAGE = "https://picsum.photos/seed/vxg-hero/1600/900";
export const SHOP_IMAGE = "https://picsum.photos/seed/vxg-shop/1600/900";
export const CARD_IMAGE_OVERLAY = "absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent";
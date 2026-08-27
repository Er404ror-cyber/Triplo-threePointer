import { useState, useMemo, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';
import type { PostType } from '../types/database';
import type { PostWithRelations } from '../types/watch';
import { SmartThumbnail } from '../components/watch/SmartThumbnail';
import { useTranslate, type TranslationKey } from '../context/LanguageProvider';

type SortOption = 'latest' | 'popular' | 'discussed';

function formatTimeAgo(
  dateString: string,
  lang: string,
  t: (key: TranslationKey) => string
): string {
  const date = new Date(dateString).getTime();
  const now = Date.now();
  const diffInSeconds = Math.floor((date - now) / 1000);

  const rtf = new Intl.RelativeTimeFormat(lang === 'pt' ? 'pt-PT' : 'en-US', {
    numeric: 'auto',
  });

  const intervals = [
    { unit: 'year', seconds: 31536000 },
    { unit: 'month', seconds: 2592000 },
    { unit: 'day', seconds: 86400 },
    { unit: 'hour', seconds: 3600 },
    { unit: 'minute', seconds: 60 },
  ] as const;

  for (const { unit, seconds } of intervals) {
    const value = Math.floor(Math.abs(diffInSeconds) / seconds);
    if (value >= 1) {
      return rtf.format(Math.sign(diffInSeconds) * value, unit);
    }
  }

  return t('justNow');
}

// Item orgânico sem estrutura de "caixa/cartão"
const FeedItem = memo(
  ({
    post,
    deviceId,
    locale,
    language,
    onSelect,
    t,
  }: {
    post: PostWithRelations;
    deviceId: string;
    locale: string;
    language: string;
    onSelect: (post: PostWithRelations) => void;
    t: (key: TranslationKey) => string;
  }) => {
    return (
      <article
        onClick={() => onSelect(post)}
        className="group cursor-pointer flex flex-col gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-3xl"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onSelect(post)}
      >
        {/* Thumbnail Soft Flutuante */}
        <div className="w-full aspect-video rounded-3xl overflow-hidden relative bg-[#e3e7ee] dark:bg-[#1a1c22] shadow-[4px_6px_16px_rgba(163,177,198,0.35)] dark:shadow-[4px_6px_16px_rgba(0,0,0,0.5)]">
          <div className="w-full h-full group-hover:scale-105 transition-transform duration-300 ease-out">
            <SmartThumbnail mediaUrl={post.media_url} mediaType={post.media_type} />
          </div>

          {/* Tag Soft Embutida */}
          <span className="absolute bottom-3 right-3 bg-[#c85a17]/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-xl uppercase tracking-wider shadow-sm backdrop-blur-sm">
            {t(post.type as TranslationKey)}
          </span>
        </div>

        {/* Tipografia Direta no Feed */}
        <div className="flex flex-col px-1.5 pt-0.5">
          <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm sm:text-base leading-snug line-clamp-2 group-hover:text-[#c85a17] transition-colors">
            {post.title}
          </h3>

          <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            <span>
              {Intl.NumberFormat(locale, { notation: 'compact' }).format(post.likes?.length || 0)}{' '}
              {t('likes')}
            </span>
            <span>•</span>
            <span>
              {Intl.NumberFormat(locale, { notation: 'compact' }).format(post.comments?.length || 0)}{' '}
              {t('comments')}
            </span>
            <span>•</span>
            <span className="text-slate-400 dark:text-slate-500">
              {formatTimeAgo(post.created_at, language, t)}
            </span>
          </div>
        </div>
      </article>
    );
  }
);
FeedItem.displayName = 'FeedItem';

// Skeleton sem caixas externas
const FeedSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-x-6 gap-y-10">
    {[...Array(8)].map((_, i) => (
      <div key={i} className="flex flex-col gap-2.5 opacity-60">
        <div className="w-full aspect-video bg-[#e3e7ee] dark:bg-[#1a1c22] rounded-3xl" />
        <div className="flex flex-col gap-2 px-1.5 pt-1">
          <div className="h-4 bg-[#e3e7ee] dark:bg-[#1a1c22] rounded-full w-full" />
          <div className="h-3 bg-[#e3e7ee] dark:bg-[#1a1c22] rounded-full w-2/3" />
        </div>
      </div>
    ))}
  </div>
);

export default function PublicationsFeed() {
  const { t, language } = useTranslate();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<PostType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('latest');

  const [deviceId] = useState<string>(() => {
    if (typeof window === 'undefined') return '';
    try {
      let localId = localStorage.getItem('visitor_device_id');
      if (!localId) {
        localId = crypto.randomUUID();
        localStorage.setItem('visitor_device_id', localId);
      }
      return localId;
    } catch {
      return '';
    }
  });

  const { data: posts = [], isLoading } = useQuery<PostWithRelations[]>({
    queryKey: ['posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*, comments(*), likes(device_id)')
        .order('created_at', { ascending: false });

      if (error || !data) return [];

      return data.map((post: any) => ({
        ...post,
        comments: post.comments
          ? post.comments.sort(
              (a: any, b: any) =>
                new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            )
          : [],
      })) as PostWithRelations[];
    },
    enabled: !!deviceId,
    staleTime: 1000 * 60 * 15,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,

  });

  const filteredAndSortedPosts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return posts
      .filter((post) => {
        const matchesCategory = filter === 'all' || post.type === filter;
        const matchesSearch =
          !query ||
          post.title?.toLowerCase().includes(query) ||
          post.description?.toLowerCase().includes(query);

        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'popular') {
          return (b.likes?.length || 0) - (a.likes?.length || 0);
        }
        if (sortBy === 'discussed') {
          return (b.comments?.length || 0) - (a.comments?.length || 0);
        }
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
  }, [posts, filter, searchQuery, sortBy]);

  const isBrowsingAll = filter === 'all' && !searchQuery.trim() && sortBy === 'latest';
  const recentHighlightPosts = useMemo(
    () => (isBrowsingAll ? filteredAndSortedPosts.slice(0, 4) : []),
    [isBrowsingAll, filteredAndSortedPosts]
  );
  const remainingPosts = useMemo(
    () => (isBrowsingAll ? filteredAndSortedPosts.slice(4) : filteredAndSortedPosts),
    [isBrowsingAll, filteredAndSortedPosts]
  );

  const handlePostClick = (post: PostWithRelations) => {
    navigate(`/publications/${post.id}`, {
      state: {
        post,
        likesCount: post.likes?.length || 0,
        commentsCount: post.comments?.length || 0,
        hasLiked: post.likes?.some((l) => l.device_id === deviceId) ?? false,
        fromFeed: true,
      },
    });
  };

  const locale = language === 'pt' ? 'pt-PT' : 'en-US';

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-4 bg-[#eef1f6] dark:bg-[#111215] min-h-screen text-slate-800 dark:text-slate-100 transition-colors">
      
      {/* Busca Soft UI Estilo Neumórfico Inset */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="relative flex items-center bg-[#eef1f6] dark:bg-[#111215] rounded-2xl shadow-[inset_3px_3px_6px_rgba(163,177,198,0.5),inset_-3px_-3px_6px_rgba(255,255,255,0.8)] dark:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.6),inset_-3px_-3px_6px_rgba(255,255,255,0.03)] px-3 py-1.5">
          <span className="pl-2 text-[#c85a17] text-base select-none">
            🏀
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full pl-3 pr-8 py-1.5 bg-transparent text-sm outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="mr-1 w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs rounded-full"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Controles Flutuantes Soft */}
      <div className="sticky top-0 z-20 bg-[#eef1f6]/90 dark:bg-[#111215]/90 py-3 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 mb-8 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        
        {/* Soft Chips */}
        <div className="flex gap-2.5 overflow-x-auto no-scrollbar items-center py-1">
          {(['all', 'post', 'event', 'treino', 'calendar'] as const).map((type) => {
            const isActive = filter === type;
            return (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? 'bg-[#c85a17] text-white shadow-[3px_3px_8px_rgba(200,90,23,0.35)]'
                    : 'bg-[#eef1f6] dark:bg-[#111215] text-slate-600 dark:text-slate-300 shadow-[3px_3px_6px_rgba(163,177,198,0.4),-3px_-3px_6px_rgba(255,255,255,0.8)] dark:shadow-[3px_3px_6px_rgba(0,0,0,0.5),-3px_-3px_6px_rgba(255,255,255,0.03)] hover:text-[#c85a17]'
                }`}
              >
                {t(type as TranslationKey)}
              </button>
            );
          })}
        </div>

        {/* Dropdown de Ordenação */}
        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            aria-label={t('sortBy')}
            className="bg-[#eef1f6] dark:bg-[#111215] shadow-[3px_3px_6px_rgba(163,177,198,0.4),-3px_-3px_6px_rgba(255,255,255,0.8)] dark:shadow-[3px_3px_6px_rgba(0,0,0,0.5),-3px_-3px_6px_rgba(255,255,255,0.03)] text-xs sm:text-sm text-slate-700 dark:text-slate-300 py-2 px-4 rounded-2xl outline-none cursor-pointer"
          >
            <option value="latest">{t('latest')}</option>
            <option value="popular">{t('popular')}</option>
            <option value="discussed">{t('discussed')}</option>
          </select>
        </div>
      </div>

      {/* Feed Principal Sem Moldura */}
      {isLoading ? (
        <FeedSkeleton />
      ) : filteredAndSortedPosts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center px-4">
          <div className="w-14 h-14 rounded-full bg-[#eef1f6] dark:bg-[#111215] shadow-[4px_4px_10px_rgba(163,177,198,0.4),-4px_-4px_10px_rgba(255,255,255,0.8)] dark:shadow-[4px_4px_10px_rgba(0,0,0,0.5),-4px_-4px_10px_rgba(255,255,255,0.03)] flex items-center justify-center text-[#c85a17] mb-3 text-2xl">
            🏀
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">
            {t('noResults')}
          </p>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Seção 1: Recentes & Destaques */}
          {isBrowsingAll && recentHighlightPosts.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-5 px-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#c85a17]" />
                <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                  {t('recentHighlights')}
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-x-6 gap-y-10">
                {recentHighlightPosts.map((post) => (
                  <FeedItem
                    key={post.id}
                    post={post}
                    deviceId={deviceId}
                    locale={locale}
                    language={language}
                    onSelect={handlePostClick}
                    t={t}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Seção 2: Todas as Publicações */}
          <section>
            {isBrowsingAll && remainingPosts.length > 0 && (
              <div className="flex items-center gap-2 mb-5 px-1">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400 dark:bg-slate-600" />
                <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  {t('exploreAll')}
                </h2>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-x-6 gap-y-10">
              {remainingPosts.map((post) => (
                <FeedItem
                  key={post.id}
                  post={post}
                  deviceId={deviceId}
                  locale={locale}
                  language={language}
                  onSelect={handlePostClick}
                  t={t}
                />
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
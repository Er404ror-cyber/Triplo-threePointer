import React, { useMemo, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { PostWithRelations } from '../../types/watch';
import { SmartThumbnail } from './SmartThumbnail';
import { getRelativeTime } from '../../utils/timeFormat';
import { useTranslate } from '../../context/LanguageProvider';

interface RelatedSidebarProps {
  posts: PostWithRelations[];
}

const RelatedPostItem = memo(
  ({
    post,
    onSelect,
    t,
    formatter,
  }: {
    post: PostWithRelations;
    onSelect: (id: string) => void;
    t: (key: string, params?: Record<string, any>) => string;
    formatter: Intl.NumberFormat;
  }) => {
    const likesCount = post.likes?.length || 0;
    const postTypeKey = post.type ? post.type.toLowerCase() : 'post';
    const fallbackInitial = t('postInitial');

    return (
      <article
        onClick={() => onSelect(post.id)}
        aria-label={t('openPostAria', { title: post.title })}
        className="group flex flex-col sm:flex-row gap-3 sm:gap-2.5 p-2 sm:p-1.5 rounded-2xl cursor-pointer hover:bg-slate-100/70 dark:hover:bg-white/5 active:scale-[0.99] transition-all select-none"
        style={{ contentVisibility: 'auto', containIntrinsicSize: '0 280px' }}
      >
        {/* 1. THUMBNAIL */}
        <div className="relative w-full sm:w-40 md:w-44 lg:w-40 xl:w-44 shrink-0 aspect-video rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800 ring-1 ring-black/5 dark:ring-white/10">
          <SmartThumbnail mediaUrl={post.media_url} mediaType={post.media_type} />

          {post.type && (
            <span className="absolute bottom-2 sm:bottom-1.5 right-2 sm:right-1.5 px-1.5 py-0.5 rounded-md bg-black/80 backdrop-blur-sm text-[11px] sm:text-[10px] font-bold text-white uppercase tracking-wider z-10 pointer-events-none">
              {t(postTypeKey)}
            </span>
          )}
        </div>

        {/* 2. INFORMAÇÕES */}
        <div className="flex gap-3 sm:gap-0 flex-1 min-w-0 sm:flex-col sm:justify-start">
          <div 
            aria-hidden="true" 
            className="sm:hidden w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold flex items-center justify-center text-sm uppercase shrink-0 mt-0.5"
          >
            {post.type ? post.type.charAt(0).toUpperCase() : fallbackInitial}
          </div>

          <div className="flex flex-col flex-1 min-w-0">
            <h5 className="font-semibold text-slate-900 dark:text-slate-100 text-[15px] sm:text-[13.5px] leading-snug line-clamp-2 break-words group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {post.title}
            </h5>

            <div className="flex items-center flex-wrap gap-x-1.5 gap-y-0.5 mt-1 sm:mt-1.5 text-[13px] sm:text-[11.5px] text-slate-500 dark:text-slate-400 font-medium">
              <span className="capitalize">{t(postTypeKey)}</span>

              <span className="text-[9px] opacity-40">•</span>

              <time dateTime={post.created_at} className="truncate">
                {getRelativeTime(post.created_at, t)}
              </time>

              <span className="text-[9px] opacity-40">•</span>

              <span 
                className="flex items-center gap-1 font-semibold tabular-nums text-slate-600 dark:text-slate-300"
                aria-label={t('likesCountAria', { count: likesCount })}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-rose-500" aria-hidden="true">
                  <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                </svg>
                {formatter.format(likesCount)}
              </span>
            </div>
          </div>
        </div>
      </article>
    );
  }
);

RelatedPostItem.displayName = 'RelatedPostItem';

export const RelatedSidebar: React.FC<RelatedSidebarProps> = ({ posts }) => {
  const { t, language } = useTranslate();
  const navigate = useNavigate();

  const formatter = useMemo(() => {
    return new Intl.NumberFormat(language || 'pt-PT', { notation: 'compact' });
  }, [language]);

  const handleSelectPost = useCallback(
    (id: string) => {
      navigate(`/publications/${id}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [navigate]
  );

  if (!posts || posts.length === 0) return null;

  return (
    <aside className="w-full flex flex-col gap-4" aria-label={t('sidebarAria')}>
      <div className="flex items-center justify-between px-1">
        <h4 className="font-bold text-[17px] sm:text-[16px] text-slate-900 dark:text-white tracking-tight">
          {t('upNext')}
        </h4>
        <span className="text-xs text-slate-400 font-medium tabular-nums">
          {posts.length} {t('recommendationsCount')}
        </span>
      </div>

      <div className="flex flex-col gap-5 sm:gap-2">
        {posts.map((post) => (
          <RelatedPostItem
            key={post.id}
            post={post}
            onSelect={handleSelectPost}
            t={t}
            formatter={formatter}
          />
        ))}
      </div>
    </aside>
  );
};
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { PostWithRelations } from '../../types/watch';
import { SmartThumbnail } from './SmartThumbnail';
import { getRelativeTime } from '../../utils/timeFormat'; // IMPORTANTE

interface RelatedSidebarProps {
  posts: PostWithRelations[];
}

export const RelatedSidebar: React.FC<RelatedSidebarProps> = ({ posts }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const formatter = new Intl.NumberFormat('pt-PT', { notation: 'compact' });

  return (
    <div className="w-full flex flex-col gap-5 lg:gap-3">
      <h4 className="font-extrabold text-base lg:text-sm tracking-widest uppercase text-slate-900 dark:text-white mb-2 px-1 lg:px-0">
        {t('watch.upNext')}
      </h4>
      
      {posts.map((p) => (
        <div
          key={p.id}
          onClick={() => { navigate(`/publications/${p.id}`); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="flex flex-col sm:flex-row gap-3 cursor-pointer group min-w-0"
        >
          <div className="w-full sm:w-[220px] lg:w-[168px] aspect-video shrink-0 sm:rounded-xl overflow-hidden relative bg-slate-200 dark:bg-slate-800">
            <SmartThumbnail mediaUrl={p.media_url} mediaType={p.media_type} />
            <span className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-[11px] font-medium px-1.5 py-0.5 rounded shadow-sm">
              {t(`types.${p.type}`)}
            </span>
          </div>

          <div className="flex flex-col justify-start min-w-0 px-3 sm:px-0 py-1">
            <h5 className="font-bold text-slate-900 dark:text-[#f1f1f1] text-[16px] sm:text-[14px] leading-tight line-clamp-2 break-words group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {p.title}
            </h5>
            
            <p className="text-[13px] text-slate-600 dark:text-[#aaaaaa] mt-1.5 line-clamp-2 leading-snug">
              {p.description || t('watch.noDescription')}
            </p>
            
            <div className="flex flex-wrap items-center gap-1.5 text-[12px] font-medium text-slate-500 dark:text-[#888888] mt-2">
              <span>{formatter.format(p.likes?.length || 0)} {t('watch.likes')}</span>
              <span className="text-[10px]">•</span>
              <span>{formatter.format(p.comments?.length || 0)} coms</span>
              <span className="text-[10px]">•</span>
              {/* UTILIZA O TEMPO RELATIVO */}
              <span>{getRelativeTime(p.created_at)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { PostWithRelations } from '../../types/watch';
import { getRelativeTime } from '../../utils/timeFormat';

interface PostInfoProps {
  post: PostWithRelations;
  hasLiked: boolean;
  onLike: () => void;
}

export const PostInfo: React.FC<PostInfoProps> = ({ post, hasLiked, onLike }) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isExpandable, setIsExpandable] = useState(false);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const formatter = new Intl.NumberFormat('pt-PT', { notation: 'compact' });

  useEffect(() => {
    const el = descriptionRef.current;
    if (!el) return;

    let animationFrameId: number;
    const checkHeight = () => {
      animationFrameId = requestAnimationFrame(() => {
        setIsExpandable(el.scrollHeight > el.clientHeight);
      });
    };

    const observer = new ResizeObserver(checkHeight);
    observer.observe(el);
    checkHeight();

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, [post.description]);

  const handleShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: post.title, url: window.location.href }); } 
      catch (err) { console.error(err); }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copiado!');
    }
  };

  return (
    <div className="w-full max-w-full px-4 lg:px-0">
      <h1 className="text-[19px] sm:text-2xl font-bold text-[#0f0f0f] dark:text-[#f1f1f1] mb-2 break-words leading-tight tracking-tight">
        {post.title}
      </h1>
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 mt-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-900 dark:bg-white text-white dark:text-[#0f0f0f] font-extrabold flex items-center justify-center uppercase shrink-0 text-sm shadow-sm">
            {post.type.charAt(0)}
          </div>
          <div className="flex flex-col justify-center leading-tight">
            <span className="font-bold text-[#0f0f0f] dark:text-[#f1f1f1] text-[15px] capitalize">
              {t(`types.${post.type}`)}
            </span>
            <span className="text-[12px] font-medium text-[#606060] dark:text-[#aaaaaa]">
              {new Date(post.created_at).toLocaleDateString('pt-PT', { year: 'numeric', month: 'short', day: 'numeric' })}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
          {/* Botão com Cor Azul de Conversão Suprema */}
          <button
            onClick={onLike}
            className={`flex items-center gap-2 px-4.5 py-2 rounded-full text-sm font-semibold transition-all active:scale-95 shrink-0 ${
              hasLiked 
                ? 'bg-[#065fd4] text-white dark:bg-[#3ea6ff] dark:text-[#0f0f0f] shadow-md shadow-blue-500/10' 
                : 'bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 text-[#0f0f0f] dark:text-[#f1f1f1]'
            }`}
          >
            <svg viewBox="0 0 24 24" fill={hasLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
            </svg>
            <span>{formatter.format(post.likes?.length || 0)}</span>
          </button>

          <button 
            onClick={handleShare} 
            className="flex items-center gap-2 px-4.5 py-2 rounded-full text-sm font-semibold bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 text-[#0f0f0f] dark:text-[#f1f1f1] transition-all active:scale-95 shrink-0"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13"></path>
            </svg>
            <span>{t('actions.share')}</span>
          </button>
        </div>
      </div>

      <div 
        onClick={() => isExpandable && !isExpanded && setIsExpanded(true)}
        className={`mt-3 bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/15 rounded-xl p-3.5 text-sm transition-colors ${isExpandable && !isExpanded ? 'cursor-pointer' : 'cursor-auto'}`}
      >
        <div className="font-semibold text-[#0f0f0f] dark:text-[#f1f1f1] mb-1 text-[13px]">
          {formatter.format(post.likes?.length || 0)} gostos • {getRelativeTime(post.created_at)}
        </div>
        <div 
          ref={descriptionRef}
          className={`text-[#0f0f0f] dark:text-[#f1f1f1] leading-relaxed break-words whitespace-pre-line text-[14px] ${!isExpanded ? 'line-clamp-2 overflow-hidden' : ''}`}
        >
          {post.description || t('watch.noDescription')}
        </div>
        {isExpandable && (
          <button 
            onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
            className="mt-2 font-bold text-[#065fd4] dark:text-[#3ea6ff] hover:underline text-[13px]"
          >
            {isExpanded ? t('watch.showLess') : t('watch.showMore')}
          </button>
        )}
      </div>
    </div>
  );
};
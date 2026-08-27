import React, { useState, useRef, useEffect } from 'react';
import { useTranslate } from '../../context/LanguageProvider';
import type { PostWithRelations } from '../../types/watch';
import { getRelativeTime } from '../../utils/timeFormat';

interface PostInfoProps {
  post: PostWithRelations;
  hasLiked: boolean;
  onLike: () => void;
}

export const PostInfo: React.FC<PostInfoProps> = ({ post, hasLiked, onLike }) => {
  const { t, language } = useTranslate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isExpandable, setIsExpandable] = useState(false);
  const descriptionRef = useRef<HTMLDivElement>(null);
  
  const currentLang = language || 'pt-PT';
  const numberFormatter = new Intl.NumberFormat(currentLang, { notation: 'compact' });

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
      try { 
        await navigator.share({ title: post.title, url: window.location.href }); 
      } catch (err) { 
        console.error(err); 
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert(t('alertLinkCopied'));
    }
  };

  const likesCount = post.likes?.length || 0;
  const formattedLikes = numberFormatter.format(likesCount);

  return (
    <div className="w-full max-w-full">
      <h1 className="text-xl sm:text-2xl font-bold text-[#0f0f0f] dark:text-[#f1f1f1] mb-3 break-words leading-snug">
        {post.title}
      </h1>
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-slate-900 dark:bg-white text-white dark:text-[#0f0f0f] font-bold flex items-center justify-center uppercase shrink-0 text-[17px] shadow-sm">
            {post.type.charAt(0)}
          </div>
          <div className="flex flex-col justify-center">
            <span className="font-bold text-[#0f0f0f] dark:text-[#f1f1f1] text-[15px] capitalize">
              {t(post.type)}
            </span>
            <span className="text-[13px] font-medium text-slate-500 dark:text-slate-400">
              {new Date(post.created_at).toLocaleDateString(currentLang, { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              })}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-2 sm:pb-0">
          <button
            onClick={onLike}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[14px] font-semibold transition-all duration-200 active:scale-95 shrink-0 ${
              hasLiked 
                ? 'bg-[#065fd4] text-white dark:bg-[#3ea6ff] dark:text-[#0f0f0f] shadow-md' 
                : 'bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 text-[#0f0f0f] dark:text-[#f1f1f1]'
            }`}
          >
            <svg viewBox="0 0 24 24" fill={hasLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
            </svg>
            <span>{formattedLikes}</span>
          </button>

          <button 
            onClick={handleShare} 
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-[14px] font-semibold bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 text-[#0f0f0f] dark:text-[#f1f1f1] transition-all duration-200 active:scale-95 shrink-0"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13"></path>
            </svg>
            <span>{t('actionShare')}</span>
          </button>
        </div>
      </div>

      <div 
        onClick={() => isExpandable && !isExpanded && setIsExpanded(true)}
        className={`mt-4 bg-slate-50 hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10 rounded-2xl p-4 transition-colors duration-300 ${isExpandable && !isExpanded ? 'cursor-pointer' : 'cursor-auto'}`}
      >
        <div className="font-semibold text-[#0f0f0f] dark:text-[#f1f1f1] mb-2 text-[14px]">
          {t('likesCount').replace('{n}', formattedLikes)} • {getRelativeTime(post.created_at, t)}
        </div>
        <div 
          ref={descriptionRef}
          className={`text-[#0f0f0f] dark:text-[#f1f1f1] leading-relaxed break-words whitespace-pre-line text-[14px] md:text-[15px] ${!isExpanded ? 'line-clamp-2 overflow-hidden' : ''}`}
        >
          {post.description || t('watchNoDescription')}
        </div>
        {isExpandable && (
          <button 
            onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
            className="mt-2 font-bold text-slate-600 dark:text-slate-300 hover:text-[#0f0f0f] dark:hover:text-white transition-colors text-[14px]"
          >
            {isExpanded ? t('watchShowLess') : t('watchShowMore')}
          </button>
        )}
      </div>
    </div>
  );
};
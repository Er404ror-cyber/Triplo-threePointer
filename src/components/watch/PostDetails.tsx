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

  // SOLUÇÃO PROFISSIONAL PARA O ERRO CASCADING RENDERS
  useEffect(() => {
    const el = descriptionRef.current;
    if (!el) return;

    let animationFrameId: number;
    const checkHeight = () => {
      // requestAnimationFrame tira a execução do fluxo síncrono do React
      animationFrameId = requestAnimationFrame(() => {
        const isContentLonger = el.scrollHeight > el.clientHeight;
        setIsExpandable(isContentLonger);
      });
    };

    const observer = new ResizeObserver(checkHeight);
    observer.observe(el);
    checkHeight(); // Chamada inicial

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, [post.description]); // Reexecuta se a descrição mudar

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
    <div className="w-full max-w-full">
      <h1 className="text-[20px] sm:text-2xl font-bold text-slate-900 dark:text-[#f1f1f1] mb-2 break-words leading-tight">
        {post.title}
      </h1>
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 mt-1">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-900 dark:bg-white text-white dark:text-black font-bold flex items-center justify-center uppercase shrink-0 text-lg">
            {post.title.charAt(0)}
          </div>
          <div className="flex flex-col justify-center leading-tight">
            <span className="font-bold text-slate-900 dark:text-[#f1f1f1] text-[15px]">Oficial</span>
            <span className="text-[12px] font-medium text-slate-500 dark:text-[#aaaaaa]">
              {formatter.format(post.likes?.length || 0)} inscritos
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
          <button
            onClick={onLike}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors shrink-0 ${
              hasLiked 
                ? 'bg-slate-900 text-white dark:bg-white dark:text-black' 
                : 'bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-white/10 dark:text-white hover:dark:bg-white/20'
            }`}
          >
            <svg viewBox="0 0 24 24" fill={hasLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
            </svg>
            <span>{formatter.format(post.likes?.length || 0)}</span>
          </button>
          <button onClick={handleShare} className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-white/10 dark:text-white hover:dark:bg-white/20 transition-colors shrink-0">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13"></path></svg>
            <span>{t('actions.share')}</span>
          </button>
        </div>
      </div>

      <div 
        onClick={() => isExpandable && !isExpanded && setIsExpanded(true)}
        className={`mt-3 bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 rounded-xl p-3 sm:p-4 text-sm transition-colors ${isExpandable && !isExpanded ? 'cursor-pointer' : 'cursor-auto'}`}
      >
        <div className="font-semibold text-slate-900 dark:text-[#f1f1f1] mb-1 text-[14px]">
          {formatter.format(post.likes?.length || 0)} interações • {getRelativeTime(post.created_at)} • #{t(`types.${post.type}`)}
        </div>
        
        {/* A DIV QUE CORTA O TEXTO */}
        <div 
          ref={descriptionRef}
          className={`text-slate-800 dark:text-[#f1f1f1] leading-relaxed break-words whitespace-pre-line text-[14px] ${!isExpanded ? 'line-clamp-2 overflow-hidden' : ''}`}
        >
          {post.description || t('watch.noDescription')}
        </div>
        
        {isExpandable && (
          <button 
            onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
            className="mt-2 font-bold text-slate-900 dark:text-white hover:underline text-[14px]"
          >
            {isExpanded ? t('watch.showLess') : t('watch.showMore')}
          </button>
        )}
      </div>
    </div>
  );
};
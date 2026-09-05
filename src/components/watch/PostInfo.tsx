import React, { useState, useRef, useLayoutEffect, useMemo, useCallback } from 'react';
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
  const [animatingLike, setAnimatingLike] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);

  const currentLang = language || 'pt-PT';
  const rawLikesCount = post.likes?.length || 0;

  const formattedLikes = useMemo(() => {
    return new Intl.NumberFormat(currentLang, { notation: 'compact' }).format(rawLikesCount);
  }, [rawLikesCount, currentLang]);

  const formattedDate = useMemo(() => {
    return new Date(post.created_at).toLocaleDateString(currentLang, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }, [post.created_at, currentLang]);

  useLayoutEffect(() => {
    const el = descriptionRef.current;
    if (el) {
      setIsExpandable(el.scrollHeight > el.clientHeight);
    }
  }, [post.description]);

  const triggerToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  }, []);

  const handleLikeClick = useCallback(() => {
    if (!hasLiked) {
      setAnimatingLike(true);
      setTimeout(() => setAnimatingLike(false), 300);
    }
    onLike();
  }, [hasLiked, onLike]);

  // Função utilitária leve para converter URL de imagem em File para o Web Share
  const fetchMediaAsFile = async (url: string): Promise<File | null> => {
    try {
      const response = await fetch(url, { mode: 'cors' });
      if (!response.ok) return null;
      const blob = await response.blob();
      const extension = blob.type.split('/')[1] || 'jpg';
      return new File([blob], `share-preview.${extension}`, { type: blob.type });
    } catch {
      return null;
    }
  };

  const handleShare = useCallback(async () => {
    if (isSharing) return;
    setIsSharing(true);

    const currentUrl = window.location.href;
    const mediaUrl = post.thumbnail_url || post.cover_image || post.media_url;

    // Snippet de curiosidade
    const cleanSnippet = post.description
      ? `\n\n"${post.description.slice(0, 110).trim()}${post.description.length > 110 ? '...' : ''}"`
      : '';

    const likesBadge = rawLikesCount > 0 ? `🔥 +${formattedLikes} ${t('shareBadgeReactions')}\n` : '';
    const shareTitle = `✨ ${post.title}`;
    const shareBody = `${shareTitle}\n${likesBadge}${cleanSnippet}\n\n👉 ${t('shareCtaPrompt')}`;

    try {
      let fileToSend: File | null = null;

      // Baixa a imagem apenas se o browser suportar compartilhamento de arquivos
      if (mediaUrl && navigator.canShare) {
        fileToSend = await fetchMediaAsFile(mediaUrl);
      }

      const shareData: ShareData = {
        title: post.title,
        text: shareBody,
        url: currentUrl,
      };

      // Injeta o arquivo de imagem se compatível com o SO do usuário
      if (fileToSend && navigator.canShare({ files: [fileToSend] })) {
        shareData.files = [fileToSend];
      }

      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        // Fallback: copia conteúdo persuasivo com link para clipboard
        await navigator.clipboard.writeText(`${shareBody}\n${currentUrl}`);
        triggerToast(t('toastLinkCopied'));
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        await navigator.clipboard.writeText(`${shareBody}\n${currentUrl}`);
        triggerToast(t('toastLinkCopied'));
      }
    } finally {
      setIsSharing(false);
    }
  }, [isSharing, post, rawLikesCount, formattedLikes, t, triggerToast]);

  const softCardBase =
    'bg-[#f4f6fa] dark:bg-[#181a1f] border border-slate-200/70 dark:border-white/5 shadow-sm';

  return (
    <section className="w-full max-w-full text-slate-800 dark:text-slate-100 select-none sm:select-text relative">
      {/* Toast de Feedback */}
      <div 
        aria-live="polite"
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-full bg-slate-900/90 dark:bg-white/90 text-white dark:text-slate-950 text-xs font-semibold shadow-lg backdrop-blur-sm transition-all duration-200 pointer-events-none ${
          toastMessage ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-95'
        }`}
      >
        {toastMessage}
      </div>

      {/* Título */}
      <h1 className="text-xl sm:text-2xl font-bold mb-4 break-words leading-tight">
        {post.title}
      </h1>

      {/* Barra de Metadados & Ações */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        {/* Autor / Tipo */}
        <div className="flex items-center gap-3">
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-[16px] uppercase shrink-0 text-slate-700 dark:text-slate-200 ${softCardBase}`}
          >
            {post.type.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-[15px] capitalize leading-snug">
              {t(post.type)}
            </span>
            <span className="text-[12px] text-slate-500 dark:text-slate-400">
              {formattedDate}
            </span>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1 sm:pb-0">
          {/* Like */}
          <button
            type="button"
            onClick={handleLikeClick}
            aria-label={hasLiked ? t('ariaActionUnlike') : t('ariaActionLike')}
            aria-pressed={hasLiked}
            className={`group relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-[14px] font-semibold transition-all duration-150 shrink-0 cursor-pointer select-none active:scale-95 ${
              hasLiked
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/25 border border-rose-600'
                : 'bg-white dark:bg-[#202329] text-slate-700 dark:text-slate-200 border border-slate-200/90 dark:border-white/10 hover:border-rose-300 dark:hover:border-rose-500/30 hover:text-rose-600 dark:hover:text-rose-400 shadow-sm'
            }`}
          >
            <span
              className={`inline-flex items-center justify-center transition-transform duration-200 will-change-transform ${
                animatingLike ? 'scale-125' : 'group-hover:scale-110'
              }`}
            >
              <svg
                viewBox="0 0 24 24"
                className="w-[18px] h-[18px]"
                fill={hasLiked ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth={hasLiked ? '0' : '2'}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
              </svg>
            </span>

            <span className="font-medium tracking-tight">
              {hasLiked ? t('actionLiked') : t('actionLike')}
            </span>

            <span
              className={`text-xs pl-1.5 border-l tabular-nums font-bold ${
                hasLiked
                  ? 'border-rose-400/50 text-white'
                  : 'border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 group-hover:text-rose-600 dark:group-hover:text-rose-400'
              }`}
            >
              {rawLikesCount > 0 ? formattedLikes : '0'}
            </span>
          </button>

          {/* Share */}
          <button
            type="button"
            disabled={isSharing}
            onClick={handleShare}
            aria-label={t('ariaActionShare')}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-[14px] font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-white/5 active:scale-95 transition-all duration-150 shrink-0 cursor-pointer disabled:opacity-50 ${softCardBase}`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`w-4 h-4 text-blue-500 dark:text-blue-400 ${isSharing ? 'animate-spin' : ''}`}
            >
              {isSharing ? (
                <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="12" />
              ) : (
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13" />
              )}
            </svg>
            <span className="font-medium">
              {isSharing ? t('actionSharing') : t('actionShare')}
            </span>
          </button>
        </div>
      </div>

      {/* Cartão de Descrição */}
      <div
        onClick={() => isExpandable && !isExpanded && setIsExpanded(true)}
        className={`mt-4 p-4 rounded-2xl transition-colors duration-150 ${softCardBase} ${
          isExpandable && !isExpanded ? 'cursor-pointer hover:border-slate-300 dark:hover:border-white/10' : ''
        }`}
      >
        <div className="font-semibold text-slate-600 dark:text-slate-400 mb-2 text-[13px] flex items-center gap-2">
          <span>{t('likesCount').replace('{n}', formattedLikes)}</span>
          <span>•</span>
          <time dateTime={post.created_at}>{getRelativeTime(post.created_at, t)}</time>
        </div>

        <div
          ref={descriptionRef}
          className={`text-slate-800 dark:text-slate-200 leading-relaxed break-words whitespace-pre-line text-[14px] ${
            !isExpanded ? 'line-clamp-2 overflow-hidden' : ''
          }`}
        >
          {post.description || t('watchNoDescription')}
        </div>

        {isExpandable && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="mt-2 text-[13px] font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-block cursor-pointer"
          >
            {isExpanded ? t('watchShowLess') : t('watchShowMore')}
          </button>
        )}
      </div>
    </section>
  );
};
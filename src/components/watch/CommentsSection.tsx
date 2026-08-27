import React, { useState, useRef, useEffect } from 'react';
import { useTranslate } from '../../context/LanguageProvider';
import type { PostWithRelations } from '../../types/watch';
import { getRelativeTime } from '../../utils/timeFormat';

// --- SUB-COMPONENTE: COMMENT CARD ---
const CommentCard = ({ comment, deviceId, t }: { comment: any, deviceId: string, t: any }) => {
  const [isTextExpanded, setIsTextExpanded] = useState(false);
  const isLongText = comment.content.length > 250;

  return (
    <div className="flex gap-3.5 text-sm w-full group">
      <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 text-[#0f0f0f] dark:text-[#f1f1f1] font-bold flex items-center justify-center text-[15px] uppercase shrink-0">
        {comment.user_name?.slice(0, 1)}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-[13px] text-[#0f0f0f] dark:text-[#f1f1f1] truncate">
            @{comment.user_name.replace(/\s+/g, '').toLowerCase()}
          </span>
          <span className="text-[12px] text-slate-500 dark:text-slate-400">
            {getRelativeTime(comment.created_at, t)}
          </span>
          {comment.device_id === deviceId && (
            <span className="bg-slate-200 dark:bg-white/20 text-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ml-1">
              {t('watchYou')}
            </span>
          )}
        </div>
        <p className={`text-[14px] text-[#0f0f0f] dark:text-[#f1f1f1] leading-relaxed break-words whitespace-pre-wrap ${!isTextExpanded && isLongText ? 'line-clamp-3' : ''}`}>
          {comment.content}
        </p>
        {isLongText && (
          <button 
            onClick={() => setIsTextExpanded(!isTextExpanded)}
            className="mt-1 font-semibold text-slate-500 dark:text-slate-400 hover:text-[#0f0f0f] dark:hover:text-white transition-colors text-[13px]"
          >
            {isTextExpanded ? t('watchReadLess') : t('watchReadMore')}
          </button>
        )}
      </div>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL ---
interface CommentsSectionProps {
  post: PostWithRelations;
  deviceId: string;
  userName: string;
  onSubmit: (content: string) => void;
}

const MAX_CHARS = 600;

export const CommentsSection: React.FC<CommentsSectionProps> = ({ post, deviceId, userName, onSubmit }) => {
  const { t, language } = useTranslate();
  const [text, setText] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [initialCount, setInitialCount] = useState(3);
  const [isFocused, setIsFocused] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const currentLang = language || 'pt-PT';
  const numberFormatter = new Intl.NumberFormat(currentLang);

  useEffect(() => {
    const handleResize = () => setInitialCount(window.innerWidth < 640 ? 2 : 5);
    handleResize(); 
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [text]);

  const handleSubmit = () => {
    if (!text.trim() || text.length > MAX_CHARS) return;
    onSubmit(text);
    setText('');
    setIsExpanded(true);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const commentsList = post.comments || [];
  const visibleComments = isExpanded ? commentsList : commentsList.slice(0, initialCount);
  const hasMoreComments = commentsList.length > initialCount && !isExpanded;

  return (
    <div className="w-full">
      {/* Cabeçalho */}
      <h3 className="text-lg font-bold text-[#0f0f0f] dark:text-[#f1f1f1] mb-6">
        {numberFormatter.format(commentsList.length)} {t('watchComments')}
      </h3>

      {/* Barra de Escrever */}
      <div className="flex items-start gap-4 mb-8">
        <div className="w-10 h-10 rounded-full bg-[#065fd4] dark:bg-[#3ea6ff] text-white dark:text-[#0f0f0f] font-bold flex items-center justify-center text-[15px] uppercase shrink-0 shadow-sm mt-1">
          {userName ? userName.slice(0, 1) : 'U'}
        </div>
        <div className="flex-1 min-w-0">
          <div className={`relative border-b-2 transition-colors duration-300 ${isFocused ? 'border-[#0f0f0f] dark:border-white' : 'border-slate-300 dark:border-slate-700'}`}>
            <textarea
              ref={textareaRef}
              placeholder={t('placeholderWriteComment')}
              value={text}
              maxLength={MAX_CHARS}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); } }}
              className="w-full bg-transparent py-2 text-[14px] md:text-[15px] text-[#0f0f0f] dark:text-[#f1f1f1] resize-none overflow-hidden min-h-[32px] outline-none placeholder:text-slate-500 dark:placeholder:text-slate-400 leading-relaxed"
              rows={1}
            />
          </div>
          
          <div className={`flex justify-between items-center mt-2 transition-opacity duration-300 ${isFocused || text.length > 0 ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
            <span className={`text-[12px] font-medium transition-colors ${text.length >= MAX_CHARS ? 'text-red-500' : 'text-slate-500'}`}>
              {text.length} / {MAX_CHARS}
            </span>
            <div className="flex gap-2">
              <button 
                onClick={() => {
                  setText('');
                  if (textareaRef.current) textareaRef.current.style.height = 'auto';
                }} 
                className="px-4 py-2 text-[14px] font-semibold text-[#0f0f0f] dark:text-[#f1f1f1] hover:bg-slate-100 dark:hover:bg-white/10 rounded-full transition-all"
              >
                {t('actionCancel')}
              </button>
              <button 
                onClick={handleSubmit} 
                disabled={!text.trim()}
                className="px-4 py-2 text-[14px] font-semibold bg-[#065fd4] dark:bg-[#3ea6ff] text-white dark:text-[#0f0f0f] rounded-full hover:bg-blue-700 dark:hover:bg-[#65b8ff] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('actionComment')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Comentários */}
      <div className="space-y-6">
        {visibleComments.map((c) => (
          <CommentCard key={c.id} comment={c} deviceId={deviceId} t={t} />
        ))}
      </div>

      {/* Botão Expandir */}
      {hasMoreComments && (
        <button 
          onClick={() => setIsExpanded(true)}
          className="mt-6 w-full md:w-auto px-6 py-2.5 rounded-full border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-white/10 font-semibold text-[14px] text-[#0f0f0f] dark:text-[#f1f1f1] transition-colors"
        >
          {t('watchShowAllComments').replace('{n}', commentsList.length.toString())}
        </button>
      )}
    </div>
  );
};
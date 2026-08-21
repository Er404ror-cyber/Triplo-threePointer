import React, { useState, useRef, useEffect } from 'react';
import { useTranslate } from '../../context/LanguageProvider';
import type { PostWithRelations } from '../../types/watch';
import { getRelativeTime } from '../../utils/timeFormat';

// --- SUB-COMPONENTE: COMMENT CARD ---
// Gere o layout de cartão e a truncatura de textos longos para cada comentário
const CommentCard = ({ comment, deviceId, t }: { comment: any, deviceId: string, t: any }) => {
  const [isTextExpanded, setIsTextExpanded] = useState(false);
  const isLongText = comment.content.length > 200;

  return (
    <div className="flex gap-4 text-sm w-full group bg-black/5 dark:bg-white/5 p-4 rounded-xl hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
      <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-white/10 text-[#0f0f0f] dark:text-[#f1f1f1] font-bold flex items-center justify-center text-sm uppercase shrink-0">
        {comment.user_name?.slice(0, 1)}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 mb-1.5 text-[13px]">
          <span className="font-bold text-[#0f0f0f] dark:text-[#f1f1f1] truncate">
            @{comment.user_name.replace(/\s+/g, '').toLowerCase()}
          </span>
          <span className="text-[#606060] dark:text-[#aaaaaa] font-medium">
            {getRelativeTime(comment.created_at, t)}
          </span>
          {comment.device_id === deviceId && (
            <span className="bg-black/10 dark:bg-white/20 text-[#606060] dark:text-[#aaaaaa] px-1.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider">
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
            className="mt-1 font-bold text-[#606060] dark:text-[#aaaaaa] hover:text-[#0f0f0f] dark:hover:text-[#f1f1f1] transition-colors text-[13px]"
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
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const currentLang = language || 'pt-PT';
  const numberFormatter = new Intl.NumberFormat(currentLang);

  // Deteta se está no telemóvel para mostrar menos comentários iniciais (2 no telemóvel, 3 no PC)
  useEffect(() => {
    const handleResize = () => {
      setInitialCount(window.innerWidth < 640 ? 2 : 3);
    };
    handleResize(); // Corre logo na primeira renderização
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
    <div className="pt-2 w-full">
      {/* Cabeçalho */}
      <div className="flex items-center gap-6 mb-5">
        <h3 className="text-lg font-bold text-[#0f0f0f] dark:text-[#f1f1f1]">
          {numberFormatter.format(commentsList.length)} {t('watchComments')}
        </h3>
      </div>

      {/* Barra de Escrever */}
      <div className="flex items-start gap-4 mb-8">
        <div className="w-10 h-10 rounded-full bg-[#065fd4] dark:bg-[#3ea6ff] text-white dark:text-[#0f0f0f] font-bold flex items-center justify-center text-sm uppercase shrink-0 shadow-sm">
          {userName ? userName.slice(0, 1) : 'U'}
        </div>
        <div className="flex-1 min-w-0">
          <textarea
            ref={textareaRef}
            placeholder={t('placeholderWriteComment')}
            value={text}
            maxLength={MAX_CHARS}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); } }}
            className="w-full bg-transparent border-b border-black/10 dark:border-white/20 focus:border-black dark:focus:border-white py-1 text-[14px] text-[#0f0f0f] dark:text-[#f1f1f1] transition-colors resize-none overflow-hidden min-h-[28px] outline-none placeholder:text-[#606060] dark:placeholder:text-[#aaaaaa] leading-relaxed"
            rows={1}
          />
          <div className="flex justify-between items-center mt-2 h-8">
            <span className={`text-[12px] font-medium transition-colors ${text.length >= MAX_CHARS ? 'text-red-500' : 'text-transparent'}`}>
              {text.length} / {MAX_CHARS}
            </span>
            {text.trim() && (
              <div className="flex gap-2 animate-fadeIn">
                <button 
                  onClick={() => {
                    setText('');
                    if (textareaRef.current) textareaRef.current.style.height = 'auto';
                  }} 
                  className="px-4 py-2 text-sm font-semibold text-[#0f0f0f] dark:text-[#f1f1f1] hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-all active:scale-95"
                >
                  {t('actionCancel')}
                </button>
                <button 
                  onClick={handleSubmit} 
                  className="px-4 py-2 text-sm font-semibold bg-[#065fd4] dark:bg-[#3ea6ff] text-white dark:text-[#0f0f0f] rounded-full hover:bg-blue-700 dark:hover:bg-[#65b8ff] transition-all active:scale-95 shadow-sm"
                >
                  {t('actionComment')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lista de Comentários em Cards (com Scroll quando expandido) */}
      <div className={`space-y-4 ${isExpanded ? 'max-h-[500px] overflow-y-auto pr-2 custom-scrollbar' : ''}`}>
        {visibleComments.map((c) => (
          <CommentCard key={c.id} comment={c} deviceId={deviceId} t={t} />
        ))}
      </div>

      {/* Botão Expandir */}
      {hasMoreComments && (
        <button 
          onClick={() => setIsExpanded(true)}
          className="mt-6 w-full py-3 rounded-xl bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 font-bold text-sm text-[#0f0f0f] dark:text-[#f1f1f1] transition-colors shadow-sm"
        >
          {t('watchShowAllComments').replace('{n}', commentsList.length.toString())}
        </button>
      )}
    </div>
  );
};
import React, { useState, useRef, useEffect, useCallback, useMemo, memo } from 'react';
import { useTranslate } from '../../context/LanguageProvider';
import type { PostWithRelations } from '../../types/watch';
import { getRelativeTime } from '../../utils/timeFormat';

const MAX_CHARS = 600;

// --- SUB-COMPONENTE: COMMENT CARD (Isolado com memo + CSS Containment) ---
const CommentCard = memo(({ comment, deviceId, t }: { comment: any; deviceId: string; t: any }) => {
  const [isTextExpanded, setIsTextExpanded] = useState(false);
  const isLongText = comment.content.length > 250;
  const isOwner = comment.device_id === deviceId;

  return (
    <article 
      className="flex gap-3.5 text-sm w-full group [contain:content]" 
      style={{ contentVisibility: 'auto', containIntrinsicSize: '0 72px' }}
    >
      <div 
        aria-hidden="true"
        className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 text-[#0f0f0f] dark:text-[#f1f1f1] font-bold flex items-center justify-center text-[15px] uppercase shrink-0 select-none"
      >
        {comment.user_name?.[0] || 'U'}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="font-semibold text-[13px] text-[#0f0f0f] dark:text-[#f1f1f1] truncate">
            @{comment.user_name.replace(/\s+/g, '').toLowerCase()}
          </span>
          <time className="text-[12px] text-slate-500 dark:text-slate-400">
            {getRelativeTime(comment.created_at, t)}
          </time>
          {isOwner && (
            <span className="bg-blue-100 dark:bg-blue-900/40 text-[#065fd4] dark:text-[#3ea6ff] px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
              {t('watchYou')}
            </span>
          )}
        </div>

        <p className={`text-[14px] text-[#0f0f0f] dark:text-[#f1f1f1] leading-relaxed break-words whitespace-pre-wrap ${!isTextExpanded && isLongText ? 'line-clamp-3' : ''}`}>
          {comment.content}
        </p>

        {isLongText && (
          <button 
            type="button"
            onClick={() => setIsTextExpanded(prev => !prev)}
            className="mt-1 font-semibold text-slate-500 dark:text-slate-400 hover:text-[#065fd4] dark:hover:text-[#3ea6ff] text-[13px] cursor-pointer"
          >
            {isTextExpanded ? t('watchReadLess') : t('watchReadMore')}
          </button>
        )}
      </div>
    </article>
  );
});

CommentCard.displayName = 'CommentCard';

// --- COMPONENTE PRINCIPAL ---
interface CommentsSectionProps {
  post: PostWithRelations;
  deviceId: string;
  userName: string;
  onSubmit: (content: string) => void;
}

export const CommentsSection: React.FC<CommentsSectionProps> = ({ post, deviceId, userName, onSubmit }) => {
  const { t, language } = useTranslate();
  const [text, setText] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const commentsList = post.comments || [];

  // Formatação sem alocação repetida de instâncias
  const formattedCount = useMemo(() => {
    return new Intl.NumberFormat(language || 'pt-PT').format(commentsList.length);
  }, [commentsList.length, language]);

  // Ajuste de altura sob demanda direto no DOM (evita re-renders e layout thrashing)
  const handleInput = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const target = e.target;
    setText(target.value);
    target.style.height = 'auto';
    target.style.height = `${target.scrollHeight}px`;
  }, []);

  const handleCancel = useCallback(() => {
    setText('');
    setIsFocused(false);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, []);

  const handleSubmit = useCallback(() => {
    const cleanText = text.trim();
    if (!cleanText || cleanText.length > MAX_CHARS) return;
    onSubmit(cleanText);
    setText('');
    setIsFocused(false);
    setIsExpanded(true);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [text, onSubmit]);

  // Exibe 3 comentários iniciais em telas menores e expande sem window resize listeners caros
  const initialLimit = 4;
  const visibleComments = isExpanded ? commentsList : commentsList.slice(0, initialLimit);
  const remainingCount = commentsList.length - initialLimit;

  // Feedback de progresso e fricção cognitiva
  const charsRemaining = MAX_CHARS - text.length;
  const isNearLimit = charsRemaining <= 50;

  return (
    <section className="w-full">
      {/* Cabeçalho com Prova Social Ativa */}
      <div className="flex items-center gap-3 mb-6">
        <h3 className="text-lg font-bold text-[#0f0f0f] dark:text-[#f1f1f1] tracking-tight">
          {formattedCount} {t('watchComments')}
        </h3>
        {commentsList.length > 0 && (
          <span className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Comunidade ativa
          </span>
        )}
      </div>

      {/* Caixa de Entrada: Redução do limiar de atrito inicial */}
      <div className="flex items-start gap-3.5 mb-8">
        <div 
          aria-hidden="true"
          className="w-10 h-10 rounded-full bg-[#065fd4] dark:bg-[#3ea6ff] text-white dark:text-[#0f0f0f] font-bold flex items-center justify-center text-[15px] uppercase shrink-0 select-none shadow-sm"
        >
          {userName?.[0] || 'U'}
        </div>

        <div className="flex-1 min-w-0">
          <div 
            className={`border-b-2 transition-colors duration-150 ${
              isFocused ? 'border-[#065fd4] dark:border-[#3ea6ff]' : 'border-slate-300 dark:border-slate-700'
            }`}
          >
            <textarea
              ref={textareaRef}
              placeholder={commentsList.length === 0 ? "Seja o primeiro a opinar..." : "Adicione um comentário à discussão..."}
              value={text}
              maxLength={MAX_CHARS}
              onFocus={() => setIsFocused(true)}
              onChange={handleInput}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              className="w-full bg-transparent py-2 text-[14px] md:text-[15px] text-[#0f0f0f] dark:text-[#f1f1f1] resize-none overflow-hidden min-h-[36px] outline-none placeholder:text-slate-500 dark:placeholder:text-slate-400 leading-relaxed"
              rows={1}
            />
          </div>
          
          {/* Ações e Feedback: Desmontagem estática com CSS visando zero Layout Shift */}
          <div 
            className={`flex justify-between items-center mt-2.5 transition-all duration-150 ${
              isFocused || text.length > 0 
                ? 'opacity-100 translate-y-0 pointer-events-auto' 
                : 'opacity-0 -translate-y-1 pointer-events-none h-0 overflow-hidden'
            }`}
          >
            <span className={`text-[12px] font-mono tabular-nums ${isNearLimit ? 'text-amber-500 font-bold' : 'text-slate-400'}`}>
              {charsRemaining} caracteres restantes
            </span>

            <div className="flex items-center gap-2">
              <button 
                type="button"
                onClick={handleCancel} 
                className="px-3.5 py-1.5 text-[13px] font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full transition-colors active:scale-95"
              >
                {t('actionCancel')}
              </button>
              <button 
                type="button"
                onClick={handleSubmit} 
                disabled={!text.trim()}
                className="px-4 py-1.5 text-[13px] font-semibold bg-[#065fd4] dark:bg-[#3ea6ff] text-white dark:text-[#0f0f0f] rounded-full hover:brightness-105 active:scale-95 transition-all disabled:opacity-40 disabled:pointer-events-none shadow-sm"
              >
                {t('actionComment')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lista com Virtualização Nativa do Browser (Content-Visibility) */}
      <div className="space-y-5">
        {visibleComments.map((c) => (
          <CommentCard key={c.id} comment={c} deviceId={deviceId} t={t} />
        ))}
      </div>

      {/* Botão de Revelação Progressiva com Sinal de Recompensa */}
      {!isExpanded && remainingCount > 0 && (
        <button 
          type="button"
          onClick={() => setIsExpanded(true)}
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-800 dark:text-slate-200 font-semibold text-[13px] transition-colors active:scale-95 cursor-pointer"
        >
          <span>Ler mais {remainingCount} opiniões</span>
          <span className="text-xs text-slate-400">↓</span>
        </button>
      )}
    </section>
  );
};
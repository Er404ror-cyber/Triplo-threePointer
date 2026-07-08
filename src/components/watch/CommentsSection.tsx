import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { PostWithRelations } from '../../types/watch';
import { getRelativeTime } from '../../utils/timeFormat';

interface CommentsSectionProps {
  post: PostWithRelations;
  deviceId: string;
  userName: string;
  onSubmit: (content: string) => void;
}

const MAX_CHARS = 600;
const INITIAL_COMMENTS_COUNT = 3;

export const CommentsSection: React.FC<CommentsSectionProps> = ({ post, deviceId, userName, onSubmit }) => {
  const { t } = useTranslation();
  const [text, setText] = useState('');
  const [isExpanded, setIsExpanded] = useState(false); // Controla se mostramos 3 ou todos

  const handleSubmit = () => {
    if (!text.trim() || text.length > MAX_CHARS) return;
    onSubmit(text);
    setText('');
    setIsExpanded(true); // Se o utilizador comentar, abrimos a lista para ele ver o seu comentário
  };

  const commentsList = post.comments || [];
  const visibleComments = isExpanded ? commentsList : commentsList.slice(0, INITIAL_COMMENTS_COUNT);
  const hasMoreComments = commentsList.length > INITIAL_COMMENTS_COUNT && !isExpanded;

  return (
    <div className="pt-2 w-full">
      {/* Cabeçalho */}
      <div className="flex items-center gap-6 mb-5">
        <h3 className="text-lg font-bold text-[#0f0f0f] dark:text-[#f1f1f1]">
          {Intl.NumberFormat('pt-PT').format(commentsList.length)} {t('watch.comments')}
        </h3>
      </div>

      {/* Barra de Escrever (Sempre Visível para Conversão) */}
      <div className="flex items-start gap-4 mb-6">
        <div className="w-10 h-10 rounded-full bg-[#065fd4] dark:bg-[#3ea6ff] text-white dark:text-[#0f0f0f] font-bold flex items-center justify-center text-sm uppercase shrink-0">
          {userName ? userName.slice(0, 1) : 'U'}
        </div>
        <div className="flex-1 min-w-0">
          <textarea
            placeholder={t('placeholders.writeComment')}
            value={text}
            maxLength={MAX_CHARS}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); } }}
            className="w-full bg-transparent border-b border-black/10 dark:border-white/20 focus:border-black dark:focus:border-white py-1 text-sm text-[#0f0f0f] dark:text-[#f1f1f1] transition-colors resize-none overflow-hidden h-auto min-h-[28px] outline-none placeholder:text-[#606060] dark:placeholder:text-[#aaaaaa]"
            rows={1}
          />
          <div className="flex justify-between items-center mt-2 h-8">
            <span className={`text-[12px] ${text.length >= MAX_CHARS ? 'text-red-500' : 'text-transparent'}`}>
              {text.length} / {MAX_CHARS}
            </span>
            {text.trim() && (
              <div className="flex gap-2 animate-fadeIn">
                <button onClick={() => setText('')} className="px-4 py-2 text-sm font-medium text-[#0f0f0f] dark:text-[#f1f1f1] hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors">
                  {t('actions.cancel')}
                </button>
                <button onClick={handleSubmit} className="px-4 py-2 text-sm font-medium bg-[#065fd4] dark:bg-[#3ea6ff] text-white dark:text-[#0f0f0f] rounded-full hover:bg-blue-700 dark:hover:bg-[#65b8ff] transition-colors">
                  {t('actions.comment')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lista de Comentários */}
      <div className="space-y-5">
        {visibleComments.map((c) => (
          <div key={c.id} className="flex gap-4 text-sm w-full group">
            <div className="w-10 h-10 rounded-full bg-black/10 dark:bg-white/10 text-[#0f0f0f] dark:text-[#f1f1f1] font-bold flex items-center justify-center text-sm uppercase shrink-0">
              {c.user_name?.slice(0, 1)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-0.5 text-[13px]">
                <span className="font-semibold text-[#0f0f0f] dark:text-[#f1f1f1] truncate">@{c.user_name.replace(/\s+/g, '').toLowerCase()}</span>
                <span className="text-[#606060] dark:text-[#aaaaaa]">{getRelativeTime(c.created_at)}</span>
                {c.device_id === deviceId && <span className="bg-black/10 dark:bg-white/20 text-[#606060] dark:text-[#aaaaaa] px-1.5 py-0.5 rounded text-[10px] font-bold">{t('watch.you')}</span>}
              </div>
              <p className="text-[14px] text-[#0f0f0f] dark:text-[#f1f1f1] leading-normal break-words whitespace-pre-wrap">{c.content}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Botão Expandir (Estilo YouTube UI) */}
      {hasMoreComments && (
        <button 
          onClick={() => setIsExpanded(true)}
          className="mt-5 w-full py-2.5 rounded-full bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 font-semibold text-sm text-[#0f0f0f] dark:text-[#f1f1f1] transition-colors"
        >
          Mostrar mais {commentsList.length - INITIAL_COMMENTS_COUNT} comentários
        </button>
      )}
    </div>
  );
};
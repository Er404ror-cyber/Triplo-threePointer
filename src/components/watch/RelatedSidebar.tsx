import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { PostWithRelations } from '../../types/watch';
import { SmartThumbnail } from './SmartThumbnail';
import { getRelativeTime } from '../../utils/timeFormat';
import { useTranslate } from '../../context/LanguageProvider';

interface RelatedSidebarProps {
  posts: PostWithRelations[];
}

export const RelatedSidebar: React.FC<RelatedSidebarProps> = ({ posts }) => {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const formatter = new Intl.NumberFormat('pt-PT', { notation: 'compact' });

  if (!posts || posts.length === 0) return null;

  return (
    <div className="w-full flex flex-col gap-4 lg:gap-5">
      {/* Cabeçalho da Sidebar */}
      <div className="flex items-center justify-between px-1 lg:px-0 mb-1">
        <h4 className="font-extrabold text-[16px] tracking-wide text-slate-900 dark:text-white">
          {t('watchUpNext' as any)}
        </h4>
      </div>
      
      {/* Lista de Recomendações */}
      <div className="flex flex-col gap-3 sm:gap-4">
        {posts.map((p) => {
          const likesCount = p.likes?.length || 0;
          
          // MOVIDO PARA AQUI: Agora o 'p' existe porque estamos dentro do map!
          const typeTranslationKey = p.type 
            ? `type${p.type.charAt(0).toUpperCase()}${p.type.slice(1)}` 
            : '';
          
          return (
            <div
              key={p.id}
              onClick={() => { 
                navigate(`/publications/${p.id}`); 
                window.scrollTo({ top: 0, behavior: 'smooth' }); 
              }}
              className="flex flex-row gap-3 sm:gap-4 cursor-pointer group min-w-0 p-1.5 sm:p-2 lg:p-0 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-all duration-300 items-start"
            >
              {/* 1. ZONA VISUAL */}
              <div 
                className="w-[180px] sm:w-[214px] lg:w-[214px] shrink-0 aspect-video rounded-xl overflow-hidden relative shadow-sm border border-slate-200/60 dark:border-white/5 bg-black/5 group-hover:shadow-md transition-all duration-300"
              >
                <SmartThumbnail mediaUrl={p.media_url} mediaType={p.media_type} />
                
                {/* Badge de Tipo */}
                {p.type && (
                  <div className="absolute bottom-1.5 right-1.5 bg-black/80 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] font-bold text-white uppercase tracking-wider shadow-sm z-10 pointer-events-none">
                  {t(p.type as any)}
                  </div>
                )}
              </div>

              {/* 2. ZONA DE INFORMAÇÃO */}
              <div className="flex flex-col justify-start min-w-0 flex-1 py-0.5 sm:py-1">
                {/* Título */}
                <h5 className="font-bold text-slate-900 dark:text-[#f1f1f1] text-[14px] sm:text-[15px] leading-[1.3] line-clamp-2 break-words group-hover:text-blue-600 dark:group-hover:text-[#3ea6ff] transition-colors">
                  {p.title}
                </h5>

                {/* Descrição */}
                {p.description && (
                  <p className="text-[12px] sm:text-[13px] font-normal text-slate-500 dark:text-[#aaaaaa] line-clamp-2 mt-1 leading-snug opacity-90">
                    {p.description}
                  </p>
                )}
                
                {/* Meta Dados */}
                <div className="flex flex-wrap items-center gap-1.5 text-[11px] sm:text-[12px] font-medium text-slate-500 dark:text-[#888888] mt-1.5 sm:mt-2">
                  {/* Likes */}
                  <span className="flex items-center gap-1">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-slate-400 dark:text-[#777]">
                      <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                    </svg>
                    {formatter.format(likesCount)}
                  </span>
                  
                  <span className="text-[8px] opacity-40 text-slate-400 dark:text-[#666]">•</span>
                  
                  {/* Tempo Relativo */}
                  <span className="truncate">
                  {getRelativeTime(p.created_at, t)}
                   </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
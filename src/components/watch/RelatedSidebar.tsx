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
    <div className="w-full flex flex-col gap-5">
      {/* Cabeçalho da Sidebar */}
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-[18px] text-slate-900 dark:text-white tracking-tight">
          {t('watchUpNext' as any)}
        </h4>
      </div>
      
      {/* Lista de Recomendações */}
      <div className="flex flex-col gap-2">
        {posts.map((p) => {
          const likesCount = p.likes?.length || 0;
          
          return (
            <div
              key={p.id}
              onClick={() => { 
                navigate(`/publications/${p.id}`); 
                window.scrollTo({ top: 0, behavior: 'smooth' }); 
              }}
              className="flex flex-row gap-3 cursor-pointer group p-2 -mx-2 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors duration-200 items-start"
            >
              {/* 1. ZONA VISUAL (Thumbnail) */}
              <div 
                className="relative w-40 sm:w-44 lg:w-40 xl:w-44 shrink-0 aspect-video rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-sm border border-slate-200/50 dark:border-white/5 group-hover:shadow-md transition-shadow duration-300"
              >
                <SmartThumbnail mediaUrl={p.media_url} mediaType={p.media_type} />
                
                {/* Badge de Tipo */}
                {p.type && (
                  <div className="absolute bottom-1.5 right-1.5 bg-black/80 backdrop-blur-md px-1.5 py-0.5 rounded-[4px] text-[10px] font-bold text-white uppercase tracking-wider z-10 pointer-events-none">
                    {t(p.type as any)}
                  </div>
                )}
              </div>

              {/* 2. ZONA DE INFORMAÇÃO */}
              <div className="flex flex-col justify-start min-w-0 flex-1">
                {/* Título - Limitado a 2 linhas para manter o cartão compacto */}
                <h5 className="font-semibold text-slate-900 dark:text-[#f1f1f1] text-[14px] leading-snug line-clamp-2 break-words group-hover:text-[#065fd4] dark:group-hover:text-[#3ea6ff] transition-colors mt-0.5">
                  {p.title}
                </h5>
                
                {/* Meta Dados (Sem descrição, direto para as métricas) */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:flex-wrap gap-x-1.5 gap-y-0.5 text-[12px] font-medium text-slate-500 dark:text-[#aaaaaa] mt-1.5">
                  {/* Tempo Relativo */}
                  <span className="truncate">
                    {getRelativeTime(p.created_at, t)}
                  </span>
                  
                  <span className="hidden sm:inline-block text-[8px] opacity-50">•</span>
                  
                  {/* Likes */}
                  <span className="flex items-center gap-1">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 opacity-80">
                      <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                    </svg>
                    {formatter.format(likesCount)}
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
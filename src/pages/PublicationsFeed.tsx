import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabaseClient';
import type { PostType } from '../types/database';
import type { PostWithRelations } from '../types/watch';
import { SmartThumbnail } from '../components/watch/SmartThumbnail';

const FeedSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
    {[...Array(8)].map((_, i) => (
      <div key={i} className="flex flex-col gap-3 animate-pulse">
        <div className="w-full aspect-video bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
        <div className="flex flex-col gap-2 pt-1">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
        </div>
      </div>
    ))}
  </div>
);

export default function PublicationsFeed() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<PostType | 'all'>('all');
  const [deviceId, setDeviceId] = useState<string>('');

  useEffect(() => {
    let localId = localStorage.getItem('visitor_device_id');
    if (!localId) {
      localId = crypto.randomUUID();
      localStorage.setItem('visitor_device_id', localId);
    }
    setDeviceId(localId);
  }, []);

  const { data: posts = [], isLoading } = useQuery<PostWithRelations[]>({
    queryKey: ['posts'],
    queryFn: async () => {
      const { data } = await supabase
        .from('posts')
        .select('*, comments(*), likes(device_id)')
        .order('created_at', { ascending: false });
        
      if (!data) return [];
      
      return data.map((post: any) => ({
        ...post,
        comments: post.comments 
          ? post.comments.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) 
          : []
      })) as PostWithRelations[];
    },
    enabled: !!deviceId,
    // POUPAR O PLANO FREE: Os dados ficam em cache durante 15 minutos sem bater no Supabase novamente
    staleTime: 1000 * 60 * 15, 
    gcTime: 1000 * 60 * 30, // Mantém os dados na memória (garbage collection) por 30 mins
  });

  const filteredPosts = filter === 'all' ? posts : posts.filter(p => p.type === filter);

  return (
    <div className="w-full max-w-[2200px] mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-2 bg-white dark:bg-[#0f0f0f] min-h-screen transition-colors duration-300">
      
      {/* Barra de Filtros Sticky */}
      <div className="flex gap-3 overflow-x-auto pb-3 mb-6 sticky top-0 bg-white/95 dark:bg-[#0f0f0f]/95 backdrop-blur-sm z-20 pt-4 scrollbar-none">
        {(['all', 'post', 'event', 'treino', 'calendar'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              filter === type 
                ? 'bg-slate-900 text-white dark:bg-white dark:text-black' 
                : 'bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-white/10 dark:text-white hover:dark:bg-white/20'
            }`}
          >
            {type === 'all' ? 'Tudo' : t(`types.${type}`)}
          </button>
        ))}
      </div>

      {isLoading ? (
        <FeedSkeleton />
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-20 text-slate-500 dark:text-slate-400 font-medium">Nenhuma publicação encontrada.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => navigate(`/publications/${post.id}`)}
              className="group cursor-pointer flex flex-col gap-3 min-w-0"
            >
              <div className="rounded-xl overflow-hidden relative">
                <SmartThumbnail mediaUrl={post.media_url} mediaType={post.media_type} />
                <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[11px] font-medium px-1.5 py-0.5 rounded shadow-sm">
                  {t(`types.${post.type}`)}
                </span>
              </div>

              <div className="flex flex-col flex-1 min-w-0 px-1 pt-1">
                <h3 className="font-semibold text-slate-900 dark:text-[#f1f1f1] text-base leading-tight line-clamp-2 break-words">
                  {post.title}
                </h3>
                
                <div className="flex items-center gap-1.5 text-[13px] text-slate-500 dark:text-[#aaaaaa] mt-1.5">
                  <span>{Intl.NumberFormat('pt-PT', { notation: 'compact' }).format(post.likes?.length || 0)} gostos</span>
                  <span className="text-[10px]">•</span>
                  <span>{Intl.NumberFormat('pt-PT', { notation: 'compact' }).format(post.comments?.length || 0)} coms</span>
                  <span className="text-[10px]">•</span>
                  <span>{new Date(post.created_at).toLocaleDateString('pt-PT', { month: 'short', day: 'numeric' })}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
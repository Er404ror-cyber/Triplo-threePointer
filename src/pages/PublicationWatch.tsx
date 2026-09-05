import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';
import type { PostWithRelations } from '../types/watch';
import { AdvancedPlayer } from '../components/watch/AdvancedPlayer';
import { PostInfo } from '../components/watch/PostInfo';
import { CommentsSection } from '../components/watch/CommentsSection';
import { RelatedSidebar } from '../components/watch/RelatedSidebar';
import { NameModal } from '../components/watch/NameModal';
import { WatchHeader } from '../components/watch/WatchHeader';
import { useTranslate } from '../context/LanguageProvider';

interface PendingComment {
  postId: string;
  content: string;
}

export default function PublicationWatch() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { t } = useTranslate();

  // 1. Identificadores do visitante com inicialização única em memória
  const [deviceId] = useState<string>(() => {
    if (typeof window === 'undefined') return '';
    let localId = localStorage.getItem('visitor_device_id');
    if (!localId) {
      localId = crypto.randomUUID();
      localStorage.setItem('visitor_device_id', localId);
    }
    return localId;
  });

  const [userName, setUserName] = useState<string>(() => {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem('visitor_user_name') || '';
  });

  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  
  // Rascunho de comentário salvo no sessionStorage para não perder digitação
  const [pendingComment, setPendingComment] = useState<PendingComment | null>(() => {
    if (typeof window === 'undefined') return null;
    const saved = sessionStorage.getItem('pending_watch_comment');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (pendingComment) {
      sessionStorage.setItem('pending_watch_comment', JSON.stringify(pendingComment));
    } else {
      sessionStorage.removeItem('pending_watch_comment');
    }
  }, [pendingComment]);

  // Fila de likes persistida em ref: não bloqueia renders e sobrevive a navegações rápidas
  const pendingLikesRef = useRef<Map<string, { currentHasLiked: boolean; timer: ReturnType<typeof setTimeout> }>>(new Map());

  useEffect(() => {
    const activeLikes = pendingLikesRef.current;
    return () => {
      activeLikes.forEach(({ timer }) => clearTimeout(timer));
    };
  }, []);

  // 2. API Post Principal: Ordenação direta no SQL do Supabase (poupa CPU do cliente)
  const { data: currentPost, isLoading: isLoadingCurrent } = useQuery<PostWithRelations | null>({
    queryKey: ['post', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('posts')
        .select('*, comments(*), likes(device_id)')
        .eq('id', id)
        .order('created_at', { foreignTable: 'comments', ascending: false })
        .maybeSingle();

      if (error || !data) return null;
      return data as PostWithRelations;
    },
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 15,       // 15 minutos sem refetch desnecessário
    gcTime: 1000 * 60 * 60,          // 1 hora no cache de memória
    refetchOnWindowFocus: false,     // Poupa bateria ao trocar de aba
    refetchOnReconnect: false,
  });

  // 3. API Sidebar: Chave estática e payload mínimo (poupa transferência de dados móveis)
  const { data: rawSidebar = [] } = useQuery<PostWithRelations[]>({
    queryKey: ['sidebar_posts_list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('id, title, type, media_url, media_type, created_at')
        .limit(12);

      if (error || !data) return [];
      return data as PostWithRelations[];
    },
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const sidebarPosts = useMemo(() => {
    return rawSidebar.filter((p) => p.id !== id);
  }, [rawSidebar, id]);

  // 4. Like otimista à prova de spam e desacoplado de re-render
  const handleLikeAntiSpam = useCallback(
    (targetPostId: string, currentHasLiked: boolean) => {
      if (!deviceId || !targetPostId) return;

      queryClient.setQueryData<PostWithRelations | null>(['post', targetPostId], (old) => {
        if (!old) return old;
        const currentLikes = old.likes || [];
        return {
          ...old,
          likes: currentHasLiked
            ? currentLikes.filter((l) => l.device_id !== deviceId)
            : [...currentLikes, { device_id: deviceId }],
        };
      });

      const existing = pendingLikesRef.current.get(targetPostId);
      if (existing) clearTimeout(existing.timer);

      const timer = setTimeout(async () => {
        try {
          if (currentHasLiked) {
            await supabase.from('likes').delete().eq('post_id', targetPostId).eq('device_id', deviceId);
          } else {
            await supabase.from('likes').insert({ post_id: targetPostId, device_id: deviceId });
          }
        } catch {
          queryClient.invalidateQueries({ queryKey: ['post', targetPostId] });
        } finally {
          pendingLikesRef.current.delete(targetPostId);
        }
      }, 500);

      pendingLikesRef.current.set(targetPostId, { currentHasLiked, timer });
    },
    [deviceId, queryClient]
  );

  // 5. Mutação de Comentários com rollback otimista
  const commentMutation = useMutation({
    mutationFn: async ({ postId, content, name }: { postId: string; content: string; name: string }) => {
      const { error } = await supabase
        .from('comments')
        .insert({ post_id: postId, content, user_name: name, device_id: deviceId });
      if (error) throw error;
    },
    onMutate: async ({ postId, content, name }) => {
      await queryClient.cancelQueries({ queryKey: ['post', postId] });
      const previousPost = queryClient.getQueryData<PostWithRelations>(['post', postId]);

      queryClient.setQueryData<PostWithRelations | null>(['post', postId], (old) => {
        if (!old) return old;
        return {
          ...old,
          comments: [
            {
              id: crypto.randomUUID(),
              post_id: postId,
              content,
              user_name: name,
              device_id: deviceId,
              created_at: new Date().toISOString(),
            },
            ...(old.comments || []),
          ],
        };
      });

      return { previousPost };
    },
    onError: (_err, vars, ctx) => {
      if (ctx?.previousPost) {
        queryClient.setQueryData(['post', vars.postId], ctx.previousPost);
      }
    },
    onSettled: (_data, _error, vars) => {
      queryClient.invalidateQueries({ queryKey: ['post', vars.postId] });
    },
  });

  const handleIntentToComment = useCallback(
    (content: string) => {
      if (!currentPost) return;
      if (!userName.trim()) {
        setPendingComment({ postId: currentPost.id, content });
        setIsNameModalOpen(true);
        return;
      }
      commentMutation.mutate({ postId: currentPost.id, content, name: userName });
    },
    [currentPost, userName, commentMutation]
  );

  const handleSaveNameModal = useCallback(
    (name: string) => {
      const trimmed = name.trim();
      if (!trimmed) return;

      setUserName(trimmed);
      localStorage.setItem('visitor_user_name', trimmed);
      setIsNameModalOpen(false);

      if (pendingComment) {
        commentMutation.mutate({
          postId: pendingComment.postId,
          content: pendingComment.content,
          name: trimmed,
        });
        setPendingComment(null);
      }
    },
    [pendingComment, commentMutation]
  );

  const handleCloseModal = useCallback(() => {
    setIsNameModalOpen(false);
  }, []);

  if (isLoadingCurrent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f9fc] dark:bg-[#0c0e14]">
        <div className="w-6 h-6 border-2 border-slate-300 dark:border-slate-700 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!currentPost) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f9fc] dark:bg-[#0c0e14]">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          {t('publicationNotFound')}
        </p>
      </div>
    );
  }

  const currentHasLiked = currentPost.likes?.some((l) => l.device_id === deviceId) || false;

  return (
    <div className="w-full bg-[#f9f6f0] dark:bg-[#0c0e14] min-h-screen text-slate-800 dark:text-[#e2e8f0]">
      <WatchHeader />

      <main className="max-w-[1560px] mx-auto pb-12 pt-0 lg:pt-4 px-0 lg:px-6">
        <div className="flex flex-col lg:grid lg:grid-cols-12 lg:gap-6">
          
          {/* Lado Esquerdo: Player + Conteúdo */}
          <div className="lg:col-span-8 2xl:col-span-9 w-full min-w-0 flex flex-col">
            
            {/* Player Container: Flexível sem aspect ratio fixo (evita cortes) e sem repaints na GPU */}
            <div 
              className="w-full bg-black lg:rounded-xl overflow-hidden border-y lg:border border-slate-200 dark:border-[#1a1e27] flex items-center justify-center min-h-[220px] sm:min-h-[360px] md:min-h-[440px]"
              style={{ contain: 'layout style' }}
            >
              <div className="w-full h-full flex items-center justify-center">
                <AdvancedPlayer mediaUrl={currentPost.media_url} mediaType={currentPost.media_type} />
              </div>
            </div>

            <div className="pt-4 px-4 lg:px-0">
              <PostInfo
                post={currentPost}
                hasLiked={currentHasLiked}
                onLike={() => handleLikeAntiSpam(currentPost.id, currentHasLiked)}
              />

              <div className="mt-6 border-t border-slate-200 dark:border-[#1a1e27] pt-5">
                <CommentsSection
                  post={currentPost}
                  deviceId={deviceId}
                  userName={userName}
                  onSubmit={handleIntentToComment}
                />
              </div>
            </div>
          </div>

          {/* Lado Direito: Sidebar com contenção de renderização para bateria e GPU */}
          <aside 
            className="lg:col-span-4 2xl:col-span-3 px-4 lg:px-0 pt-6 lg:pt-0 border-t border-slate-200 dark:border-[#1a1e27] lg:border-none mt-6 lg:mt-0"
            style={{ contentVisibility: 'auto', containIntrinsicSize: '0 600px' }}
          >
            <RelatedSidebar posts={sidebarPosts} />
          </aside>

        </div>
      </main>

      <NameModal
        isOpen={isNameModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveNameModal}
      />
    </div>
  );
}
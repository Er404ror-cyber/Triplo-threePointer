import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabaseClient';
import type { PostWithRelations } from '../types/watch';

import { AdvancedPlayer } from '../components/watch/AdvancedPlayer';
import { PostInfo } from '../components/watch/PostInfo';
import { CommentsSection } from '../components/watch/CommentsSection';
import { RelatedSidebar } from '../components/watch/RelatedSidebar';
import { NameModal } from '../components/watch/NameModal';
import { WatchHeader } from '../components/watch/WatchHeader';

export default function PublicationWatch() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const [deviceId, setDeviceId] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [pendingComment, setPendingComment] = useState<{ postId: string; content: string } | null>(null);

  const likeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let localId = localStorage.getItem('visitor_device_id');
    if (!localId) {
      localId = crypto.randomUUID();
      localStorage.setItem('visitor_device_id', localId);
    }
    setDeviceId(localId);

    const savedName = localStorage.getItem('visitor_user_name');
    if (savedName) setUserName(savedName);
  }, []);

  const { data: posts = [], isLoading } = useQuery<PostWithRelations[]>({
    queryKey: ['posts'],
    queryFn: async () => {
      const { data } = await supabase.from('posts').select('*, comments(*), likes(device_id)').order('created_at', { ascending: false });
      if (!data) return [];
      return data.map((post: any) => ({
        ...post,
        comments: post.comments ? post.comments.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) : []
      })) as PostWithRelations[];
    },
    enabled: !!deviceId,
    staleTime: 1000 * 60 * 15,
  });

  const currentPost = posts.find((p) => p.id === id);
  const fallbackRecommendations = posts.filter((p) => p.id !== id).sort((a, b) => (a.type === currentPost?.type ? -1 : 1));

  // Função Anti-Spam de Likes Otimizada
  const handleLikeAntiSpam = (postId: string, currentHasLiked: boolean) => {
    queryClient.setQueryData(['posts'], (old: any) =>
      old.map((p: any) => {
        if (p.id !== postId) return p;
        const currentLikes = p.likes || [];
        return {
          ...p,
          likes: currentHasLiked
            ? currentLikes.filter((l: any) => l.device_id !== deviceId)
            : [...currentLikes, { device_id: deviceId }]
        };
      })
    );

    if (likeTimeoutRef.current) clearTimeout(likeTimeoutRef.current);

    likeTimeoutRef.current = setTimeout(async () => {
      try {
        if (currentHasLiked) {
          await supabase.from('likes').delete().eq('post_id', postId).eq('device_id', deviceId);
        } else {
          await supabase.from('likes').insert({ post_id: postId, device_id: deviceId });
        }
      } catch (error) {
        console.error('Erro ao sincronizar like:', error);
      }
    }, 1000); 
  };

  const commentMutation = useMutation({
    mutationFn: async ({ postId, content, name }: { postId: string; content: string; name: string }) => {
      await supabase.from('comments').insert({ post_id: postId, content, user_name: name, device_id: deviceId });
    },
    onMutate: async ({ postId, content, name }) => {
      await queryClient.cancelQueries({ queryKey: ['posts'] });
      const previous = queryClient.getQueryData(['posts']);
      queryClient.setQueryData(['posts'], (old: any) =>
        old.map((p: any) => p.id !== postId ? p : { ...p, comments: [{ id: crypto.randomUUID(), content, user_name: name, device_id: deviceId, created_at: new Date().toISOString() }, ...(p.comments || [])] })
      );
      return { previous };
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['posts'] }),
  });

  const handleIntentToComment = (content: string) => {
    if (!currentPost) return;
    if (!userName.trim()) {
      setPendingComment({ postId: currentPost.id, content });
      setIsNameModalOpen(true);
      return;
    }
    commentMutation.mutate({ postId: currentPost.id, content, name: userName });
  };

  const handleSaveNameModal = (name: string) => {
    const trimmed = name.trim();
    if (trimmed && pendingComment) {
      setUserName(trimmed);
      localStorage.setItem('visitor_user_name', trimmed);
      setIsNameModalOpen(false);
      commentMutation.mutate({ postId: pendingComment.postId, content: pendingComment.content, name: trimmed });
      setPendingComment(null);
    }
  };

  if (isLoading) return <div className="h-screen flex items-center justify-center text-slate-500 dark:text-slate-400 bg-white dark:bg-[#0f0f0f]">A carregar publicação...</div>;
  if (!currentPost) return <div className="p-12 text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-[#0f0f0f] h-screen">Publicação não encontrada.</div>;

  const currentHasLiked = currentPost.likes?.some(l => l.device_id === deviceId) || false;

  return (
    <div className="w-full overflow-x-hidden bg-white dark:bg-[#0f0f0f] min-h-screen transition-colors duration-300 relative">
      
<WatchHeader />

      {/* Margem superior `pt-20` (ou maior) para não prender a tela debaixo do header global */}
      <div className="max-w-[1800px] mx-auto pb-16 pt-4 lg:pt-6 text-slate-900 dark:text-white">
        <div className="flex flex-col lg:grid lg:grid-cols-12 lg:gap-8">
          
          <div className="lg:col-span-8 w-full min-w-0 flex flex-col">
            
            <div className="w-full bg-black lg:rounded-2xl overflow-hidden shadow-xl lg:mb-5 relative">
              <AdvancedPlayer mediaUrl={currentPost.media_url} mediaType={currentPost.media_type} />
            </div>

            <div className="pt-2 lg:pt-0 z-10">
              <PostInfo 
                post={currentPost} 
                hasLiked={currentHasLiked} 
                onLike={() => handleLikeAntiSpam(currentPost.id, currentHasLiked)} 
              />
              
              <div className="px-4 lg:px-0 mt-6 w-full">
                <CommentsSection post={currentPost} deviceId={deviceId} userName={userName} onSubmit={handleIntentToComment} />
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 px-4 lg:px-0 pt-8 lg:pt-0 border-t border-slate-200 dark:border-white/10 lg:border-none mt-8 lg:mt-0">
            <RelatedSidebar posts={fallbackRecommendations} />
          </div>

        </div>
      </div>

      <NameModal isOpen={isNameModalOpen} onClose={() => setIsNameModalOpen(false)} onSave={handleSaveNameModal} />
    </div>
  );
}
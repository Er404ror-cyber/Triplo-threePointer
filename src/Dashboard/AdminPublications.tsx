import React, { useState } from 'react';
import type { Post, PostType } from '../types/database';
// Caso utilize o seu LanguageProvider customizado, substitua por: import { useTranslate } from './LanguageProvider';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabaseClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { 
  Link2, UploadCloud, Trash2, Image as ImageIcon, 
  CheckCircle2, AlertCircle, Plus, X, FileImage, 
} from 'lucide-react';

const POST_TYPES: PostType[] = ['post', 'event', 'treino', 'calendar'];

const isValidSocialLink = (url: string) => {
  try {
    const parsedUrl = new URL(url);
    const validDomains = [
      'youtube.com', 'youtu.be', 'instagram.com', 
      'tiktok.com', 'facebook.com', 'twitter.com', 
      'x.com', 'linkedin.com'
    ];
    return validDomains.some(domain => parsedUrl.hostname.includes(domain));
  } catch {
    return false;
  }
};

const formatDescription = (text: string) => {
  return text
    .trim()
    .replace(/\n\s*\n\s*\n+/g, '\n\n')
    .replace(/^ +/gm, ''); 
};

export default function AdminPublications() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<PostType>('post');
  
  const [mediaSource, setMediaSource] = useState<'upload' | 'link'>('upload');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaLink, setMediaLink] = useState('');
  const [linkError, setLinkError] = useState('');

  const { data: posts = [], isLoading: isLoadingPosts } = useQuery({
    queryKey: ['admin-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Post[];
    },
  });

  const handleUploadCloudinary = async (file: File) => {
    const preset = import.meta.env.VITE_CLOUDINARY_PRESET;
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

    if (!preset || !cloudName) {
      throw new Error('Configuração do Cloudinary em falta nas variáveis de ambiente.');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', preset);
    
    const isVideo = file.type.startsWith('video/');
    const resourceType = isVideo ? 'video' : 'image';

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`, {
      method: 'POST',
      body: formData
    });
    
    if (!res.ok) throw new Error('Falha no upload da mídia');
    const data = await res.json();
    return { url: data.secure_url, mediaType: resourceType };
  };

  const createPostMutation = useMutation({
    mutationFn: async () => {
      let finalUrl = '';
      let finalMediaType = 'link';

      if (mediaSource === 'upload' && mediaFile) {
        const { url, mediaType } = await handleUploadCloudinary(mediaFile);
        finalUrl = url;
        finalMediaType = mediaType;
      } else if (mediaSource === 'link' && mediaLink) {
        finalUrl = mediaLink;
        finalMediaType = 'link'; 
      }

      const cleanText = formatDescription(description);

      const { error } = await supabase.from('posts').insert({
        title,
        description: cleanText,
        type,
        media_url: finalUrl,
        media_type: finalMediaType,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-posts'] });
      setTitle('');
      setDescription('');
      setMediaFile(null);
      setMediaLink('');
      setLinkError('');
      setIsFormOpen(false);
    },
    onError: (error: Error) => {
      alert('Erro ao criar publicação: ' + error.message);
    }
  });

  const deletePostMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('posts').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-posts'] }),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLinkError('');

    if (mediaSource === 'upload' && !mediaFile) {
      return alert('Por favor, seleciona um ficheiro.');
    }

    if (mediaSource === 'link') {
      if (!isValidSocialLink(mediaLink)) {
        setLinkError('Insere um link válido do YouTube, Instagram, TikTok, etc.');
        return;
      }
    }

    createPostMutation.mutate();
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Tens a certeza que desejas eliminar esta publicação?')) {
      deletePostMutation.mutate(id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gerir Publicações</h1>
          <p className="text-sm text-gray-500 mt-1">Cria e organiza os conteúdos da plataforma.</p>
        </div>
        
        <button 
          onClick={() => setIsFormOpen(!isFormOpen)}
          className={`px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all duration-200 active:scale-95 ${
            isFormOpen 
              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
              : 'bg-gray-900 text-white hover:bg-black shadow-md shadow-gray-900/20'
          }`}
        >
          {isFormOpen ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          {isFormOpen ? 'Cancelar' : 'Nova Publicação'}
        </button>
      </div>

      {/* FORMULÁRIO */}
      {isFormOpen && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-md animate-in fade-in slide-in-from-top-4 duration-300">
          <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Título da Publicação</label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={e => setTitle(e.target.value)} 
                  placeholder="Ex: Novo Treino Disponível" 
                  className="w-full border border-gray-200 bg-gray-50/50 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition-all" 
                  required 
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Categoria</label>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {POST_TYPES.map(postType => (
                    <button 
                      key={postType} 
                      type="button" 
                      onClick={() => setType(postType)} 
                      className={`py-2 px-4 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 border ${
                        type === postType 
                          ? 'bg-gray-900 border-gray-900 text-white' 
                          : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {type === postType && <CheckCircle2 className="w-4 h-4" />}
                      {t(`types.${postType}`)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-semibold text-gray-700">Mídia da Publicação</label>
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button 
                      type="button" 
                      onClick={() => setMediaSource('upload')} 
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${mediaSource === 'upload' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}
                    >
                      Upload
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setMediaSource('link')} 
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${mediaSource === 'link' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}
                    >
                      Link Social
                    </button>
                  </div>
                </div>

                {mediaSource === 'upload' ? (
                  <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 bg-gray-50 rounded-2xl cursor-pointer hover:bg-gray-100 hover:border-gray-400 transition-all group overflow-hidden relative">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                      {mediaFile ? (
                        <>
                          <FileImage className="w-10 h-10 text-gray-900 mb-2" />
                          <p className="text-sm font-semibold text-gray-900 truncate max-w-[250px]">{mediaFile.name}</p>
                          <p className="text-xs text-gray-500 mt-1">Clica para trocar de ficheiro</p>
                        </>
                      ) : (
                        <>
                          <UploadCloud className="w-10 h-10 text-gray-400 group-hover:text-gray-600 mb-2 transition-colors" />
                          <p className="text-sm font-medium text-gray-600">
                            <span className="font-semibold text-gray-900">Clica para enviar</span> ou arrasta o ficheiro
                          </p>
                          <p className="text-xs text-gray-400 mt-1">Imagens (PNG, JPG) ou Vídeos (MP4)</p>
                        </>
                      )}
                    </div>
                    <input 
                      type="file" 
                      accept="image/*,video/*" 
                      onChange={e => setMediaFile(e.target.files?.[0] || null)} 
                      className="hidden" 
                      required={mediaSource === 'upload'} 
                    />
                  </label>
                ) : (
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Link2 className="h-5 w-5 text-gray-400" />
                    </div>
                    <input 
                      type="url" 
                      value={mediaLink} 
                      onChange={e => { setMediaLink(e.target.value); if (linkError) setLinkError(''); }} 
                      placeholder="Cola o link do YouTube, Instagram, etc." 
                      className={`w-full pl-11 pr-4 py-3.5 bg-gray-50/50 border rounded-xl outline-none transition-all ${
                        linkError ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:ring-gray-900 focus:border-gray-900'
                      }`} 
                      required={mediaSource === 'link'} 
                    />
                    {linkError && (
                      <p className="text-red-500 text-xs mt-2 flex items-center gap-1.5 font-medium">
                        <AlertCircle className="w-4 h-4" /> {linkError}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex justify-between items-end">
                  Descrição
                  <span className="text-xs text-gray-400 font-normal">Formatado automaticamente</span>
                </label>
                <textarea 
                  rows={4} 
                  value={description} 
                  onChange={e => setDescription(e.target.value)} 
                  placeholder="Escreve a legenda ou detalhes..." 
                  className="w-full border border-gray-200 bg-gray-50/50 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition-all resize-none" 
                  required 
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button 
                type="submit" 
                disabled={createPostMutation.isPending} 
                className="w-full sm:w-auto px-8 py-3.5 bg-gray-900 text-white font-semibold rounded-xl hover:bg-black transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2 shadow-lg shadow-gray-900/20 active:scale-[0.98]"
              >
                {createPostMutation.isPending ? (
                  <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> A Guardar...</>
                ) : 'Publicar Conteúdo'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* GRID DE CARDS */}
      <div className="w-full">
        {isLoadingPosts ? (
          <div className="p-12 text-center text-gray-400 animate-pulse font-medium bg-white rounded-3xl border border-gray-100">
            A carregar publicações...
          </div>
        ) : posts.length === 0 ? (
          <div className="p-16 flex flex-col items-center justify-center text-center bg-white rounded-3xl border border-gray-100 shadow-sm">
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4">
              <ImageIcon className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Sem publicações</h3>
            <p className="text-gray-500 mt-1 max-w-sm">Ainda não criaste nenhum conteúdo. Clica em "Nova Publicação" para começar.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {posts.map(post => (
              <div key={post.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col group relative">
                <Link to={`/admin/publications/${post.id}`} className="flex-1 flex flex-col">
                  {/* Media Preview */}
                  <div className="w-full h-48 bg-gray-100 relative overflow-hidden flex items-center justify-center">
                    {post.media_type === 'video' ? (
                      <video src={post.media_url} className="w-full h-full object-cover" />
                    ) : post.media_type === 'image' ? (
                      <img src={post.media_url} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="flex flex-col items-center text-gray-400 p-4 text-center">
                        <Link2 className="w-8 h-8 mb-2" />
                        <span className="text-xs truncate max-w-[200px]">{post.media_url}</span>
                      </div>
                    )}
                    <span className="absolute top-3 left-3 bg-gray-900/80 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-lg font-medium capitalize">
                      {post.type}
                    </span>
                  </div>

                  {/* Conteúdo */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900 group-hover:text-gray-700 transition-colors line-clamp-1">{post.title}</h3>
                      <p className="text-sm text-gray-500 mt-2 line-clamp-2">{post.description}</p>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center text-xs text-gray-400">
                      <span>{new Date(post.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </Link>

                {/* Botão Eliminar */}
                <button
                  onClick={(e) => handleDelete(e, post.id)}
                  className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-md text-red-600 hover:bg-red-600 hover:text-white rounded-xl transition-all shadow-sm opacity-0 group-hover:opacity-100"
                  title="Eliminar Publicação"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
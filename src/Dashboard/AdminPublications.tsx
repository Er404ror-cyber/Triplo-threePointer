import React, { useState } from 'react';
import type { Post, PostType } from '../types/database';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabaseClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { 
  Link2, UploadCloud, Trash2, Image as ImageIcon, 
  CheckCircle2, AlertCircle, Plus, X, FileImage, 
  PlayCircle, Globe
} from 'lucide-react';

const POST_TYPES: PostType[] = ['post', 'event', 'treino', 'calendar'];

// Validador atualizado com as regras de 2026 (CDNs, parâmetros e formatos modernos)
const isValidMediaLink = (url: string) => {
  try {
    const lowerUrl = url.toLowerCase();
    const validDomains = [
      'youtube.com', 'youtu.be', 'instagram.com', 
      'tiktok.com', 'facebook.com', 'fb.watch', 'fbcdn.net',
      'vimeo.com', 'twitter.com', 'x.com', 'linkedin.com', 'twimg.com'
    ];
    
    // Aceita também ficheiros diretos de imagem ou vídeo com ou sem parâmetros (?xyz=123)
    const hasMediaExtension = /\.(mp4|webm|ogg|mov|jpeg|jpg|gif|png|webp)(?:\?|$)/i.test(lowerUrl);
    
    return validDomains.some(domain => lowerUrl.includes(domain)) || hasMediaExtension;
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
        // Se o link inserido for reconhecido claramente como imagem nativa (CDN)
        if (/\.(jpeg|jpg|gif|png|webp)(?:\?|$)/i.test(mediaLink) || mediaLink.includes('fbcdn.net')) {
          finalMediaType = 'image';
        } else if (/\.(mp4|webm|ogg|mov)(?:\?|$)/i.test(mediaLink)) {
          finalMediaType = 'native';
        } else {
          finalMediaType = 'link'; 
        }
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
      return alert('Por favor, seleciona um ficheiro válido.');
    }

    if (mediaSource === 'link') {
      if (!isValidMediaLink(mediaLink)) {
        setLinkError('Insere um link válido de rede social, imagem ou vídeo direto.');
        return;
      }
    }

    createPostMutation.mutate();
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Tens a certeza que desejas eliminar esta publicação permanentemente?')) {
      deletePostMutation.mutate(id);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 pb-12 px-4 sm:px-6">
      {/* HEADER PREMIUM */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/70 backdrop-blur-md p-6 rounded-[2rem] border border-gray-200/60 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Gerir Publicações</h1>
          <p className="text-sm text-gray-500 mt-1 font-medium">Cria e organiza os conteúdos da plataforma.</p>
        </div>
        
        <button 
          onClick={() => setIsFormOpen(!isFormOpen)}
          className={`px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all duration-200 active:scale-95 ${
            isFormOpen 
              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
              : 'bg-gray-900 text-white hover:bg-black shadow-lg shadow-gray-900/20'
          }`}
        >
          {isFormOpen ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          {isFormOpen ? 'Cancelar' : 'Criar Novo'}
        </button>
      </div>

      {/* FORMULÁRIO COMPACTO E MODERNO */}
      {isFormOpen && (
        <div className="bg-white p-6 sm:p-10 rounded-[2rem] border border-gray-200/60 shadow-xl shadow-gray-200/40 animate-in fade-in slide-in-from-top-4 duration-300">
          <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              <div className="md:col-span-2 space-y-2">
                <label className="block text-sm font-bold text-gray-800">Título Principal</label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={e => setTitle(e.target.value)} 
                  placeholder="Ex: Lançamento da Nova Funcionalidade" 
                  className="w-full border-2 border-gray-100 bg-gray-50/50 rounded-2xl px-5 py-4 focus:ring-0 focus:border-gray-900 outline-none transition-colors text-gray-900 font-medium placeholder:font-normal" 
                  required 
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="block text-sm font-bold text-gray-800">Categoria</label>
                <div className="flex flex-wrap gap-3">
                  {POST_TYPES.map(postType => (
                    <button 
                      key={postType} 
                      type="button" 
                      onClick={() => setType(postType)} 
                      className={`py-2.5 px-5 rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 border-2 ${
                        type === postType 
                          ? 'bg-gray-900 border-gray-900 text-white shadow-md shadow-gray-900/20' 
                          : 'bg-white border-gray-100 text-gray-500 hover:border-gray-300 hover:text-gray-800'
                      }`}
                    >
                      {type === postType && <CheckCircle2 className="w-4 h-4" />}
                      {t(`types.${postType}`)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2 bg-gray-50/50 border-2 border-gray-100 rounded-[1.5rem] p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-bold text-gray-800">Conteúdo Multimédia</label>
                  <div className="flex bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
                    <button 
                      type="button" 
                      onClick={() => setMediaSource('upload')} 
                      className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${mediaSource === 'upload' ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-800'}`}
                    >
                      Upload Local
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setMediaSource('link')} 
                      className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${mediaSource === 'link' ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-800'}`}
                    >
                      Link / URL
                    </button>
                  </div>
                </div>

                {mediaSource === 'upload' ? (
                  <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 bg-white rounded-2xl cursor-pointer hover:bg-gray-50 hover:border-gray-500 transition-all group">
                    <div className="flex flex-col items-center justify-center text-center px-4">
                      {mediaFile ? (
                        <>
                          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-3">
                            <FileImage className="w-6 h-6" />
                          </div>
                          <p className="text-sm font-bold text-gray-900 truncate max-w-[250px]">{mediaFile.name}</p>
                          <p className="text-xs text-gray-500 mt-1 font-medium">Clica para trocar de ficheiro</p>
                        </>
                      ) : (
                        <>
                          <div className="w-12 h-12 bg-gray-100 text-gray-400 group-hover:text-gray-900 group-hover:bg-gray-200 rounded-full flex items-center justify-center mb-3 transition-colors">
                            <UploadCloud className="w-6 h-6" />
                          </div>
                          <p className="text-sm font-bold text-gray-800">
                            Clica para enviar <span className="font-medium text-gray-500">ou arrasta o ficheiro</span>
                          </p>
                          <p className="text-xs text-gray-400 mt-1">Suporta Imagens e Vídeos</p>
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
                      placeholder="Cola o link do YouTube, Facebook, Reels, TikTok..." 
                      className={`w-full pl-12 pr-4 py-4 bg-white border-2 rounded-2xl outline-none transition-all font-medium text-gray-900 ${
                        linkError ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-gray-900'
                      }`} 
                      required={mediaSource === 'link'} 
                    />
                    {linkError && (
                      <p className="text-red-500 text-sm mt-2 flex items-center gap-1.5 font-bold">
                        <AlertCircle className="w-4 h-4" /> {linkError}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="flex justify-between items-end text-sm font-bold text-gray-800">
                  Descrição / Legenda
                  <span className="text-xs text-gray-400 font-medium">Formatação otimizada automaticamente</span>
                </label>
                <textarea 
                  rows={5} 
                  value={description} 
                  onChange={e => setDescription(e.target.value)} 
                  placeholder="Escreve o texto da publicação..." 
                  className="w-full border-2 border-gray-100 bg-gray-50/50 rounded-2xl px-5 py-4 focus:ring-0 focus:border-gray-900 outline-none transition-colors resize-none text-gray-900 font-medium placeholder:font-normal" 
                  required 
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button 
                type="submit" 
                disabled={createPostMutation.isPending} 
                className="w-full sm:w-auto px-10 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-black transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-3 shadow-xl shadow-gray-900/20 active:scale-[0.98]"
              >
                {createPostMutation.isPending ? (
                  <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> A Publicar...</>
                ) : 'Publicar Agora'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* GALERIA TIPO PINTEREST / CANVA */}
      <div className="w-full mt-8">
        {isLoadingPosts ? (
          <div className="p-16 text-center text-gray-400 animate-pulse font-bold bg-white/50 rounded-[2rem] border border-gray-100">
            A carregar o teu mural...
          </div>
        ) : posts.length === 0 ? (
          <div className="p-20 flex flex-col items-center justify-center text-center bg-white/50 backdrop-blur-sm rounded-[2rem] border border-gray-200/60 shadow-sm">
            <div className="w-20 h-20 bg-gray-100 rounded-[1.5rem] flex items-center justify-center mb-6">
              <ImageIcon className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-extrabold text-gray-900">Mural Vazio</h3>
            <p className="text-gray-500 mt-2 max-w-sm font-medium">Ainda não tens conteúdos criados. Clica em "Criar Novo" ali em cima para começar a encher o teu mural.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {posts.map(post => (
              <div key={post.id} className="bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group relative">
                
                <Link to={`/admin/publications/${post.id}`} className="flex-1 flex flex-col">
                  {/* Media Preview Elegante */}
                  <div className="w-full h-56 bg-gray-100 relative overflow-hidden flex items-center justify-center">
                    {post.media_type === 'video' || post.media_type === 'native' ? (
                      <>
                        <video src={post.media_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <PlayCircle className="w-12 h-12 text-white/90 drop-shadow-md" />
                        </div>
                      </>
                    ) : post.media_type === 'image' ? (
                      <img src={post.media_url} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      // Pré-visualização elegante para Links de Redes Sociais
                      <div className="flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 w-full h-full text-gray-400 p-6 text-center group-hover:bg-gray-100 transition-colors">
                        <Globe className="w-10 h-10 mb-3 text-gray-300" />
                        <span className="text-xs font-semibold truncate w-full text-gray-500">{new URL(post.media_url).hostname.replace('www.', '')}</span>
                      </div>
                    )}
                    
                    {/* Badge da Categoria */}
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-gray-900 text-xs px-3 py-1.5 rounded-xl font-bold uppercase tracking-wider shadow-sm">
                      {post.type}
                    </div>
                  </div>

                  {/* Detalhes de Texto */}
                  <div className="p-6 flex-1 flex flex-col justify-between bg-white z-10">
                    <div>
                      <h3 className="font-extrabold text-gray-900 text-lg group-hover:text-blue-600 transition-colors line-clamp-1">
                        {post.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-2 line-clamp-2 font-medium leading-relaxed">
                        {post.description}
                      </p>
                    </div>

                    <div className="mt-5 pt-5 border-t border-gray-100 flex justify-between items-center text-xs font-bold text-gray-400 uppercase tracking-wider">
                      <span>{new Date(post.created_at).toLocaleDateString('pt-PT')}</span>
                    </div>
                  </div>
                </Link>

                {/* Botão Eliminar Premium */}
                <button
                  onClick={(e) => handleDelete(e, post.id)}
                  className="absolute top-4 right-4 p-2.5 bg-red-500/90 backdrop-blur-md text-white rounded-xl shadow-lg opacity-0 transform scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 hover:bg-red-600 z-20"
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
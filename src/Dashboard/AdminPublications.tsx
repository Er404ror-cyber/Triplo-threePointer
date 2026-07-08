import { useState, useEffect } from 'react';
import type { Post, PostType } from '../types/database';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabaseClient';

export default function AdminPublications() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<PostType>('post');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    fetchAdminPosts();
  }, []);

  const fetchAdminPosts = async () => {
    const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
    if (data) setPosts(data as Post[]);
  };

  const handleUploadCloudinary = async (file: File): Promise<{ url: string; mediaType: 'image' | 'video' }> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_PRESET);
    
    const isVideo = file.type.startsWith('video/');
    const resourceType = isVideo ? 'video' : 'image';

    const res = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`, {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    return { url: data.secure_url, mediaType: resourceType };
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !mediaFile) return alert('Preencha todos os campos');
    setIsSubmitting(true);

    try {
      const { url, mediaType } = await handleUploadCloudinary(mediaFile);
      await supabase.from('posts').insert({
        title,
        description,
        type,
        media_url: url,
        media_type: mediaType
      });

      setTitle('');
      setDescription('');
      setMediaFile(null);
      fetchAdminPosts();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Deseja eliminar esta publicação?')) {
      await supabase.from('posts').delete().eq('id', id);
      fetchAdminPosts();
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="bg-white p-6 rounded-2xl border shadow-sm h-fit">
        <h2 className="text-xl font-bold mb-4">{t('actions.newPost')}</h2>
        <form onSubmit={handleCreatePost} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full border rounded-xl px-4 py-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
            <select value={type} onChange={e => setType(e.target.value as PostType)} className="w-full border rounded-xl px-4 py-2">
              <option value="post">{t('types.post')}</option>
              <option value="event">{t('types.event')}</option>
              <option value="treino">{t('types.treino')}</option>
              <option value="calendar">{t('types.calendar')}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mídia (Imagem/Vídeo)</label>
            <input type="file" accept="image/*,video/*" onChange={e => setMediaFile(e.target.files?.[0] || null)} className="w-full text-sm" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
            <textarea rows={4} value={description} onChange={e => setDescription(e.target.value)} className="w-full border rounded-xl px-4 py-2" required />
          </div>
          <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition disabled:opacity-50">
            {isSubmitting ? 'A carregar mídia...' : t('actions.save')}
          </button>
        </form>
      </div>

      <div className="lg:col-span-2 space-y-4">
        <h2 className="text-xl font-bold">Gerir Publicações</h2>
        <div className="bg-white rounded-2xl border overflow-hidden">
          <ul className="divide-y">
            {posts.map(p => (
              <li key={p.id} className="p-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <img src={p.media_type === 'video' ? 'https://placehold.co/600x400/000000/FFFFFF?text=Video' : p.media_url} className="w-16 h-16 object-cover rounded-lg" />
                  <div>
                    <h3 className="font-bold">{p.title}</h3>
                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full uppercase font-semibold">{t(`types.${p.type}`)}</span>
                  </div>
                </div>
                <button onClick={() => handleDelete(p.id)} className="text-sm text-red-600 font-medium bg-red-50 px-3 py-1.5 rounded-xl hover:bg-red-100">
                  {t('actions.delete')}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
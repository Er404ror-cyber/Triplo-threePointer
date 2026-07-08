import React from 'react';

interface MediaViewerProps {
  mediaUrl: string;
  mediaType: string;
  title: string;
}

export const MediaViewer: React.FC<MediaViewerProps> = ({ mediaUrl, mediaType, title }) => {
  if (!mediaUrl) return null;

  return (
    <div className="aspect-video bg-black w-full rounded-2xl overflow-hidden shadow-md border border-slate-200/50 flex items-center justify-center">
      {mediaType === 'video' ? (
        <video
          src={mediaUrl}
          controls
          preload="metadata" // POUPA BATERIA E DADOS: Não carrega o vídeo todo à partida
          controlsList="nodownload"
          className="w-full h-full object-contain"
          poster="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600"
        />
      ) : (
        <img
          src={mediaUrl}
          alt={title}
          loading="lazy"
          className="w-full h-full object-contain"
        />
      )}
    </div>
  );
};
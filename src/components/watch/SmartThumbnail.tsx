import React, { useMemo } from 'react';
import { parseMediaUrl } from '../../utils/mediaParser';

interface SmartThumbnailProps {
  mediaUrl: string;
  mediaType: 'video' | 'image';
}

export const SmartThumbnail: React.FC<SmartThumbnailProps> = ({ mediaUrl, mediaType }) => {
  const media = useMemo(() => parseMediaUrl(mediaUrl, mediaType), [mediaUrl, mediaType]);

  const containerClass = "w-full aspect-video bg-slate-900 rounded-2xl overflow-hidden relative shadow-sm border border-slate-200/40 group-hover:shadow-xl transition-all duration-500";
  const overlayClass = "absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500 flex items-center justify-center";

  if (media.platform === 'image' || media.platform === 'youtube') {
    return (
      <div className={containerClass}>
        <img 
          src={media.thumbnailUrl!} 
          alt="Thumbnail" 
          loading="lazy"
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className={overlayClass}>
          {media.platform === 'youtube' && (
            <div className="w-12 h-12 bg-red-600/90 rounded-full flex items-center justify-center backdrop-blur-md shadow-lg transform group-hover:scale-110 transition-transform">
              <span className="text-white text-xl ml-1">▶</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (media.platform === 'native') {
    return (
      <div className={containerClass}>
        <video 
          src={media.thumbnailUrl!} 
          preload="metadata"
          muted 
          playsInline
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className={overlayClass}>
          <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg border border-white/30 transform group-hover:scale-110 transition-transform">
            <span className="text-white text-xl ml-1">▶</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClass}>
      <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-950 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 blur-3xl rounded-full"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full"></div>
        <div className="z-10 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-xl shadow-xl flex items-center gap-2">
          <span className="text-white font-bold text-sm tracking-wide capitalize">{media.platform}</span>
        </div>
      </div>
    </div>
  );
};
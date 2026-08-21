import React, { useMemo, useState, useEffect } from 'react';
import { parseSocialMediaUrl } from '../../utils/mediaParser';
import { useTranslate } from '../../context/LanguageProvider';
// Importa o teu novo hook

interface SmartThumbnailProps {
  mediaUrl: string;
  mediaType: 'video' | 'image' | 'link';
}

export const SmartThumbnail: React.FC<SmartThumbnailProps> = ({ mediaUrl, mediaType }) => {
  const { t } = useTranslate(); // Novo hook aplicado
  const media = useMemo(() => parseSocialMediaUrl(mediaUrl, mediaType), [mediaUrl, mediaType]);
  
  const initialThumbnail = useMemo(() => {
    if (media.thumbnailUrl) return media.thumbnailUrl;
    
    if (media.platform === 'youtube' && media.embedUrl) {
      const ytId = media.embedUrl.split('embed/')[1]?.split('?')[0];
      if (ytId) return `https://i.ytimg.com/vi/${ytId}/maxresdefault.jpg`;
    }
    
    return undefined;
  }, [media]);
  
  const [imgError, setImgError] = useState<boolean>(false);
  const [iframeError, setIframeError] = useState<boolean>(false);
  const [imgSrc, setImgSrc] = useState<string | undefined>(initialThumbnail);

  useEffect(() => {
    setImgSrc(initialThumbnail);
    setImgError(false);
    setIframeError(false);
  }, [initialThumbnail]);

  const containerClass = "relative w-full h-full bg-[#111] overflow-hidden group flex items-center justify-center rounded-md"; 
  const mediaElementClass = "absolute inset-0 w-full h-full object-cover bg-black opacity-90 transition-opacity duration-300 group-hover:opacity-100";

  if (media.platform === 'image') {
    return (
      <div className={containerClass}>
        <img 
          src={media.embedUrl} 
          alt="Conteúdo visual" 
          loading="lazy"
          decoding="async"
          className={mediaElementClass}
        />
      </div>
    );
  }

  if (media.platform === 'native') {
    return (
      <div className={containerClass}>
        <video 
          src={`${media.embedUrl}#t=0.1`} 
          preload="metadata" 
          muted 
          playsInline
          className={mediaElementClass}
        />
      </div>
    );
  }

  if (mediaType === 'link' && media.platform === 'generic') {
    return (
      <div className={`${containerClass} bg-[#1a1a1a] p-4 text-center border border-white/5`}>
        <div className="flex flex-col items-center justify-center z-10 transition-opacity duration-300 opacity-80 group-hover:opacity-100">
          <div className="w-10 h-10 bg-blue-500/10 text-blue-400 rounded-full flex items-center justify-center mb-2">
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
            </svg>
          </div>
          <span className="text-[11px] font-semibold text-slate-400">
            {t('externalLink' as any)}
          </span>
        </div>
      </div>
    );
  }

  const handleThumbnailError = () => {
    if (media.platform === 'youtube' && imgSrc) {
      const ytId = media.embedUrl.split('embed/')[1]?.split('?')[0];
      if (ytId) {
        if (imgSrc.includes('maxresdefault')) {
          setImgSrc(`https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`);
          return;
        } 
        if (imgSrc.includes('hqdefault')) {
          setImgSrc(`https://i.ytimg.com/vi/${ytId}/0.jpg`);
          return;
        }
      }
    }
    setImgError(true);
  };

  if (imgSrc && !imgError) {
    return (
      <div className={containerClass}>
        <img 
          src={imgSrc} 
          alt={`Thumbnail ${media.platform}`} 
          loading="lazy"
          decoding="async"
          onError={handleThumbnailError}
          className={mediaElementClass}
        />
      </div>
    );
  }

  if (media.platform === 'youtube') {
    return (
      <div className={`${containerClass} bg-[#1a1a1a] border border-white/5`}>
        <div className="w-10 h-10 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity duration-300">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
    );
  }

  let iframeUrl = media.embedUrl;
  if (media.platform === 'facebook' && !iframeUrl.includes('plugins/video.php')) {
    iframeUrl = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(mediaUrl)}&show_text=false&width=auto`;
  }

  if (iframeError) {
    return (
      <div className={`${containerClass} bg-[#1a1a1a] p-4 text-center border border-white/5`}>
        <div className="flex flex-col items-center justify-center z-10 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-10 h-10 bg-white/5 text-white/30 rounded-full flex items-center justify-center mb-2">
            <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          </div>
          <span className="text-[11px] font-semibold text-white/40">
            {t('unavailable' as any)}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClass}>
      <iframe 
        src={iframeUrl} 
        title={`Preview do ${media.platform}`} 
        className={`${mediaElementClass} border-0 pointer-events-none`}
        style={{ objectFit: 'cover' }}
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        loading="lazy" 
        scrolling="no"
        onError={() => setIframeError(true)}
      />
    </div>
  );
};
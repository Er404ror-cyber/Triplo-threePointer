import React, { useMemo, useState, useEffect } from 'react';
import { parseSocialMediaUrl } from '../../utils/mediaParser';
import { useTranslate } from '../../context/LanguageProvider';

interface SmartThumbnailProps {
  mediaUrl: string;
  mediaType: 'video' | 'image' | 'link';
}

export const SmartThumbnail: React.FC<SmartThumbnailProps> = ({ mediaUrl, mediaType }) => {
  const { t } = useTranslate();
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

  const containerClass = "absolute inset-0 w-full h-full bg-[#111] overflow-hidden group flex items-center justify-center"; 
  const mediaElementClass = "absolute top-0 left-0 w-full h-full object-cover bg-black transition-transform duration-500 group-hover:scale-105";

  // ==========================================
  // FALLBACK UI (Quando ocorre erro na Thumbnail)
  // ==========================================
  const renderFallback = () => {
    let icon;
    
    if (mediaType === 'video') {
      icon = (
        <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
        </svg>
      );
    } else if (mediaType === 'image') {
      icon = (
        <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
      );
    } else {
      icon = (
        <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
        </svg>
      );
    }

    return (
      <div className={`${containerClass} bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900`}>
        <div className="flex flex-col items-center justify-center z-10 transition-transform duration-300 group-hover:scale-105">
          <div className="w-10 h-10 bg-black/5 dark:bg-white/5 text-slate-500 dark:text-slate-400 rounded-full flex items-center justify-center mb-1.5 shadow-sm border border-black/5 dark:border-white/5">
            {icon}
          </div>
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 opacity-90 px-2 text-center line-clamp-1">
            {t('unavailable' as any) || 'Indisponível'}
          </span>
        </div>
      </div>
    );
  };

  // Se já detetámos um erro anterior, mostramos logo o Fallback
  if (imgError || iframeError) {
    return renderFallback();
  }

  // ==========================================
  // IMAGENS NATIVAS
  // ==========================================
  if (media.platform === 'image') {
    return (
      <div className={containerClass}>
        <img 
          src={media.embedUrl} 
          alt="Conteúdo visual" 
          loading="lazy"
          decoding="async"
          onError={() => setImgError(true)}
          className={mediaElementClass}
        />
      </div>
    );
  }

  // ==========================================
  // VÍDEOS NATIVOS
  // ==========================================
  if (media.platform === 'native') {
    return (
      <div className={containerClass}>
        <video 
          src={`${media.embedUrl}#t=0.1`} 
          preload="metadata" 
          muted 
          playsInline
          onError={() => setImgError(true)}
          className={mediaElementClass}
        />
      </div>
    );
  }

  // ==========================================
  // LINKS GENÉRICOS (Usam o Fallback diretamente)
  // ==========================================
  if (mediaType === 'link' && media.platform === 'generic') {
    return renderFallback();
  }

  // ==========================================
  // GESTÃO DE ERROS PARA THUMBNAILS (Ex: YouTube)
  // ==========================================
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

  if (imgSrc) {
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

  // ==========================================
  // ÚLTIMO RECURSO: IFRAME
  // ==========================================
  let iframeUrl = media.embedUrl;
  if (media.platform === 'facebook' && !iframeUrl.includes('plugins/video.php')) {
    iframeUrl = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(mediaUrl)}&show_text=false&width=auto`;
  }

  return (
    <div className={containerClass}>
      <iframe 
        src={iframeUrl} 
        title={`Preview do ${media.platform}`} 
        className="absolute top-0 left-0 w-full h-full border-0 pointer-events-none group-hover:scale-100 object-cover"
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        loading="lazy" 
        scrolling="no"
        onError={() => setIframeError(true)}
      />
    </div>
  );
};
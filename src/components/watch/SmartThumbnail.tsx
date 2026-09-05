import React, { useMemo, useState, useEffect, useCallback, memo } from 'react';
import { parseSocialMediaUrl } from '../../utils/mediaParser';
import { useTranslate } from '../../context/LanguageProvider';

interface SmartThumbnailProps {
  mediaUrl: string;
  mediaType: 'video' | 'image' | 'link';
}

export const SmartThumbnail: React.FC<SmartThumbnailProps> = memo(({ mediaUrl, mediaType }) => {
  const { t } = useTranslate();
  const media = useMemo(() => parseSocialMediaUrl(mediaUrl, mediaType), [mediaUrl, mediaType]);

  const [currentSrc, setCurrentSrc] = useState<string | undefined>(media.thumbnailUrl);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    setCurrentSrc(media.thumbnailUrl);
    setHasError(false);
    setIsLoaded(false);
  }, [media]);

  const handleImageError = useCallback(() => {
    if (media.platform === 'youtube' && currentSrc) {
      if (currentSrc.includes('hqdefault')) {
        setCurrentSrc(currentSrc.replace('hqdefault.jpg', '0.jpg'));
        return;
      }
    }
    setHasError(true);
  }, [media.platform, currentSrc]);

  // Badge da Plataforma
  const renderOriginBadge = () => {
    let icon = null;

    switch (media.platform) {
      case 'youtube':
        icon = (
          <svg fill="currentColor" viewBox="0 0 24 24" className="w-2.5 h-2.5 text-[#FF0000]">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        );
        break;
      case 'facebook':
        icon = (
          <svg fill="currentColor" viewBox="0 0 24 24" className="w-2.5 h-2.5 text-[#1877F2]">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        );
        break;
      default:
        icon = mediaType === 'image' ? (
          <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="w-2.5 h-2.5 text-stone-200">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5z" />
          </svg>
        ) : (
          <svg fill="currentColor" viewBox="0 0 24 24" className="w-2.5 h-2.5 text-stone-200">
            <path d="M8 5v14l11-7z" />
          </svg>
        );
    }

    return (
      <div 
        aria-hidden="true" 
        className="absolute top-1.5 left-1.5 z-30 flex items-center justify-center w-5 h-5 rounded-md bg-black/60 border border-white/10 shadow-sm pointer-events-none"
      >
        {icon}
      </div>
    );
  };

  const renderFallback = () => (
    <div 
      role="img"
      aria-label={t('contentUnavailable')}
      className="absolute inset-0 w-full h-full bg-[#e8e4dc] dark:bg-[#191b22] flex flex-col items-center justify-center p-2 select-none"
    >
      <div className="w-8 h-8 rounded-lg bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 flex items-center justify-center text-stone-400">
        <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-2.36a.75.75 0 011.03.67v6.38a.75.75 0 01-1.03.67l-4.72-2.36M4.5 18.75h10.5a2.25 2.25 0 002.25-2.25V7.5A2.25 2.25 0 0015 5.25H4.5A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
        </svg>
      </div>
      <span className="text-[10px] font-medium text-stone-500 dark:text-stone-400 mt-1 truncate">
        {t('contentUnavailable')}
      </span>
    </div>
  );

  if (hasError) {
    return renderFallback();
  }

  // 1. VÍDEO LOCAL (Nativo)
  if (media.platform === 'native') {
    return (
      <div className="absolute inset-0 w-full h-full bg-[#121316] overflow-hidden select-none">
        {renderOriginBadge()}
        
        <video
          src={`${media.embedUrl}#t=0.001`}
          preload="metadata"
          muted
          playsInline
          onError={() => setHasError(true)}
          className="w-full h-full object-cover pointer-events-none"
        />

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-8 h-8 rounded-full bg-black/40 border border-white/20 flex items-center justify-center text-white/90 shadow-sm">
            <svg fill="currentColor" viewBox="0 0 24 24" className="w-3.5 h-3.5 translate-x-0.5">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  // 2. FACEBOOK (Iframe Leve Contido com CSS Containment)
  if (media.platform === 'facebook') {
    return (
      <div 
        className="absolute inset-0 w-full h-full bg-[#0a0b0e] overflow-hidden flex items-center justify-center select-none"
        style={{ contain: 'strict', contentVisibility: 'auto' }}
      >
        {renderOriginBadge()}

        {/* Container que enquadra o poster do vídeo e remove barras pretas */}
        <div className="w-full h-full relative overflow-hidden flex items-center justify-center pointer-events-none">
          <iframe
            src={media.embedUrl}
            title="Facebook Video Thumbnail"
            loading="lazy"
            scrolling="no"
            tabIndex={-1}
            onError={() => setHasError(true)}
            className="w-[115%] h-[115%] max-w-none border-0 pointer-events-none transform scale-105 origin-center object-cover"
          />
        </div>

        {/* Indicador de Play Discreto no Canto */}
        <div className="absolute bottom-1.5 right-1.5 z-10 w-5 h-5 rounded-md bg-black/70 border border-white/10 flex items-center justify-center text-white/90 pointer-events-none">
          <svg fill="currentColor" viewBox="0 0 24 24" className="w-2.5 h-2.5 translate-x-px">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>

        {/* Máscara de Bloqueio de Toques: Isola o iframe da CPU/GPU */}
        <div className="absolute inset-0 z-20 bg-transparent cursor-pointer" />
      </div>
    );
  }

  // 3. IMAGENS E YOUTUBE
  if (currentSrc) {
    return (
      <div className="absolute inset-0 w-full h-full bg-[#e8e4dc] dark:bg-[#15171e] overflow-hidden select-none">
        {renderOriginBadge()}
        
        <img
          src={currentSrc}
          alt=""
          loading="lazy"
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          onError={handleImageError}
          className={`w-full h-full object-cover transition-opacity duration-150 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {mediaType === 'video' && isLoaded && (
          <div className="absolute bottom-1.5 right-1.5 z-10 w-5 h-5 rounded-md bg-black/70 border border-white/10 flex items-center justify-center text-white/90 pointer-events-none">
            <svg fill="currentColor" viewBox="0 0 24 24" className="w-2.5 h-2.5 translate-x-px">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        )}
      </div>
    );
  }

  // 4. OUTRAS PLATAFORMAS (TikTok, Instagram, Vimeo)
  if (media.embedUrl && media.platform !== 'generic') {
    return (
      <div 
        className="absolute inset-0 w-full h-full bg-[#0a0b0e] overflow-hidden select-none"
        style={{ contain: 'strict', contentVisibility: 'auto' }}
      >
        {renderOriginBadge()}
        <iframe
          src={media.embedUrl}
          title={`${media.platform} preview`}
          loading="lazy"
          scrolling="no"
          tabIndex={-1}
          onError={() => setHasError(true)}
          className="w-full h-full border-0 pointer-events-none"
        />
        <div className="absolute inset-0 z-20 bg-transparent cursor-pointer" />
      </div>
    );
  }

  return renderFallback();
});

SmartThumbnail.displayName = 'SmartThumbnail';
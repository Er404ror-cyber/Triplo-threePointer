import React, { useMemo, useState, useEffect } from 'react';
import { parseSocialMediaUrl } from '../../utils/mediaParser';

interface AdvancedPlayerProps {
  mediaUrl: string;
  mediaType: 'video' | 'image' | 'link';
}

export const AdvancedPlayer: React.FC<AdvancedPlayerProps> = ({ mediaUrl, mediaType }) => {
  const media = useMemo(() => parseSocialMediaUrl(mediaUrl, mediaType), [mediaUrl, mediaType]);

  const [isFullscreenImage, setIsFullscreenImage] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(false);
  }, [media.embedUrl]);

  useEffect(() => {
    if (isFullscreenImage) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [isFullscreenImage]);

  // Loading discreto sem molduras, integrado ao fundo preto
  const renderLoadingSkeleton = () => (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black select-none pointer-events-none">
      <div className="relative flex items-center justify-center w-12 h-12 mb-3">
        <div className="w-8 h-8 border-2 border-neutral-800 border-t-orange-500 rounded-full animate-spin" />
      </div>
      <span className="text-[11px] font-medium tracking-wider uppercase text-neutral-500">
        A carregar...
      </span>
    </div>
  );

  // Container fluido de borda a borda (sem bordas, sem cantos arredondados, sem margens)
  const baseWrapperClasses = "w-full bg-black flex items-center justify-center relative overflow-hidden select-none m-0 p-0 rounded-none border-0";

  // ==========================================
  // 1. IMAGEM (Edge-to-edge)
  // ==========================================
  if (media.platform === 'image') {
    return (
      <>
        <div className={`${baseWrapperClasses} min-h-[40vh] sm:min-h-[55vh] max-h-[85vh]`}>
          {!isLoaded && renderLoadingSkeleton()}

          <img
            src={media.embedUrl}
            alt="Conteúdo Visual"
            loading="lazy"
            onLoad={() => setIsLoaded(true)}
            onClick={() => setIsFullscreenImage(true)}
            className={`w-full h-auto max-h-[85vh] object-contain cursor-zoom-in transition-opacity duration-200 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {isLoaded && (
            <button
              type="button"
              onClick={() => setIsFullscreenImage(true)}
              className="absolute bottom-4 right-4 bg-black/60 hover:bg-black text-white p-2.5 rounded-full active:scale-90 transition-transform cursor-pointer shadow-md"
              title="Expandir"
              aria-label="Expandir"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M20.25 3.75v4.5m0-4.5h-4.5m4.5 0L15 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 20.25v-4.5m0 4.5h-4.5m4.5 0L15 15" />
              </svg>
            </button>
          )}
        </div>

        {/* Modal Fullscreen limpo */}
        {isFullscreenImage && (
          <div
            className="fixed inset-0 z-[99999] bg-black flex items-center justify-center cursor-zoom-out p-0"
            onClick={() => setIsFullscreenImage(false)}
          >
            <img
              src={media.embedUrl}
              alt="Ecrã Inteiro"
              className="w-full h-full object-contain pointer-events-none"
            />
            <button
              type="button"
              className="absolute top-4 right-4 text-white bg-black/70 hover:bg-black p-3 rounded-full active:scale-90 transition-transform cursor-pointer"
              onClick={() => setIsFullscreenImage(false)}
              aria-label="Fechar"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </>
    );
  }

  // ==========================================
  // 2. VÍDEO NATIVO (MP4, WEBM)
  // ==========================================
  if (media.platform === 'native') {
    return (
      <div className={`${baseWrapperClasses} min-h-[40vh] sm:min-h-[55vh] max-h-[85vh]`}>
        {!isLoaded && renderLoadingSkeleton()}

        <video
          src={media.embedUrl}
          controls
          playsInline
          preload="metadata"
          controlsList="nodownload"
          onLoadedData={() => setIsLoaded(true)}
          className={`w-full h-full max-h-[85vh] object-contain focus:outline-none bg-black transition-opacity duration-200 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </div>
    );
  }

  // ==========================================
  // 3. IFRAMES (YOUTUBE, SHORTS, TIKTOK)
  // ==========================================
  const isVertical = Boolean(media.isVertical);

  // Shorts ocupam a tela vertical limpa; vídeos horizontais usam aspect ratio total
  const wrapperClass = isVertical
    ? 'h-[80vh] sm:h-[88vh] w-full'
    : 'w-full aspect-video max-h-[85vh]';

  const iframeClass = isVertical
    ? 'h-full aspect-[9/16] max-w-full'
    : 'absolute top-0 left-0 w-full h-full';

  return (
    <div className={`${baseWrapperClasses} ${wrapperClass}`}>
      {!isLoaded && renderLoadingSkeleton()}

      <iframe
        src={media.embedUrl}
        title="Reprodutor Multimédia"
        className={`${iframeClass} border-0 rounded-none bg-black transition-opacity duration-200 ${
          isLoaded ? 'opacity-100 z-20' : 'opacity-0'
        }`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  );
};
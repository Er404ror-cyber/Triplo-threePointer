import React, { useMemo, useState, useEffect } from 'react';
import { parseSocialMediaUrl } from '../../utils/mediaParser';

interface AdvancedPlayerProps {
  mediaUrl: string;
  mediaType: 'video' | 'image' | 'link';
}

export const AdvancedPlayer: React.FC<AdvancedPlayerProps> = ({ mediaUrl, mediaType }) => {
  const media = useMemo(() => parseSocialMediaUrl(mediaUrl, mediaType), [mediaUrl, mediaType]);
  
  const [isFullscreenImage, setIsFullscreenImage] = useState(false);
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);

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

  const baseWrapperClasses = "w-full bg-black lg:rounded-2xl flex items-center justify-center relative overflow-hidden group border border-slate-200/5 dark:border-white/5 transition-all duration-300 shadow-xl";

  // ==========================================
  // 1. IMAGEM
  // ==========================================
  if (media.platform === 'image') {
    return (
      <>
        <div className={`${baseWrapperClasses} min-h-[30vh] max-h-[85vh]`}>
          <img 
            src={media.embedUrl} 
            alt="Conteúdo Visual" 
            loading="lazy"
            className="w-auto h-auto max-w-full max-h-[85vh] object-contain cursor-zoom-in transition-all duration-500 group-hover:scale-[1.02] group-hover:opacity-95" 
            onClick={() => setIsFullscreenImage(true)}
          />
          <button 
            onClick={() => setIsFullscreenImage(true)}
            className="absolute bottom-4 right-4 bg-black/60 hover:bg-[#065fd4] dark:hover:bg-[#3ea6ff] text-white p-2.5 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-md shadow-md transform active:scale-95"
            title="Ver Ecrã Inteiro"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M20.25 3.75v4.5m0-4.5h-4.5m4.5 0L15 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 20.25v-4.5m0 4.5h-4.5m4.5 0L15 15"></path>
            </svg>
          </button>
        </div>

        {isFullscreenImage && (
          <div 
            className="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-xl flex items-center justify-center select-none cursor-zoom-out animate-in fade-in duration-200"
            onClick={() => setIsFullscreenImage(false)}
          >
            <img 
              src={media.embedUrl} 
              alt="Ecrã Inteiro" 
              className="max-w-full max-h-[95vh] object-contain pointer-events-none p-2 md:p-8 drop-shadow-2xl" 
            />
            <button 
              className="absolute top-6 right-6 text-white bg-white/10 hover:bg-red-500/90 p-3 rounded-full backdrop-blur-md transition-colors active:scale-95 shadow-xl border border-white/20"
              onClick={() => setIsFullscreenImage(false)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        )}
      </>
    );
  }

  // ==========================================
  // 2. VÍDEO NATIVO
  // ==========================================
  if (media.platform === 'native') {
    return (
      <div className={`${baseWrapperClasses} min-h-[30vh] max-h-[85vh]`}>
        <video 
          src={media.embedUrl} 
          controls 
          playsInline 
          preload="metadata" 
          controlsList="nodownload" 
          className="w-auto h-auto max-w-full max-h-[85vh] object-contain focus:outline-none bg-black" 
        />
      </div>
    );
  }

  // ==========================================
  // 3. IFRAMES SOCIAIS (YOUTUBE / TIKTOK / SHORTS)
  // ==========================================
  // Adapta o layout exterior e interior baseando-se no formato:
  const wrapperAspectClass = media.isVertical 
    ? 'h-[75vh] md:h-[85vh]' // Fixa a altura para vídeos tipo TikTok sem distorcer o layout da página
    : 'aspect-video'; // 16:9 clássico para tipo YouTube

  const iframeClass = media.isVertical
    ? 'h-full aspect-[9/16]' // O iframe fica centrado na vertical, com o aspecto correto (gera pilar lateral preto)
    : 'absolute top-0 left-0 w-full h-full'; // YouTube ocupa todo o espaço possível

  return (
    <div className={`${baseWrapperClasses} ${wrapperAspectClass}`}>
      {!isIframeLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900 z-10">
          <div className="w-10 h-10 border-4 border-slate-700 border-t-[#3ea6ff] rounded-full animate-spin"></div>
        </div>
      )}

      <iframe 
        src={media.embedUrl} 
        title="Reprodutor Multimédia" 
        className={`${iframeClass} border-0 bg-transparent transition-opacity duration-700 ${isIframeLoaded ? 'opacity-100 z-20' : 'opacity-0'}`} 
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
        allowFullScreen 
        loading="lazy"
        onLoad={() => setIsIframeLoaded(true)}
      />
    </div>
  );
};
import React, { useMemo, useState, useEffect } from 'react';
import { parseMediaUrl } from '../../utils/mediaParser';

interface AdvancedPlayerProps {
  mediaUrl: string;
  mediaType: 'video' | 'image';
}

export const AdvancedPlayer: React.FC<AdvancedPlayerProps> = ({ mediaUrl, mediaType }) => {
  const media = useMemo(() => parseMediaUrl(mediaUrl, mediaType), [mediaUrl, mediaType]);
  const [isFullscreenImage, setIsFullscreenImage] = useState(false);

  // Bloqueia o scroll de fundo e limpa interferências quando o fullscreen abre
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

  const wrapperClass = "w-full aspect-video bg-black lg:rounded-2xl overflow-hidden flex items-center justify-center relative shadow-lg group border border-slate-200/5 dark:border-white/5";

  if (media.platform === 'image') {
    return (
      <>
        <div className={wrapperClass}>
          <img 
            src={media.embedUrl} 
            alt="Conteúdo" 
            className="w-full h-full object-contain cursor-pointer transition-all duration-300 group-hover:opacity-90" 
            onClick={() => setIsFullscreenImage(true)}
          />
          {/* Botão de Zoom Otimizado */}
          <button 
            onClick={() => setIsFullscreenImage(true)}
            className="absolute bottom-4 right-4 bg-black/60 hover:bg-[#065fd4] dark:hover:bg-[#3ea6ff] text-white p-2.5 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-200 backdrop-blur-md shadow-md transform active:scale-95"
            title="Ecrã Inteiro"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M20.25 3.75v4.5m0-4.5h-4.5m4.5 0L15 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 20.25v-4.5m0 4.5h-4.5m4.5 0L15 15"></path>
            </svg>
          </button>
        </div>

        {/* Modal de Elite Suprema contra Falhas Visuais (Z-INDEX TOTAL) */}
        {isFullscreenImage && (
          <div 
            className="fixed inset-0 z-[99999] bg-black/98 sm:bg-black/95 backdrop-blur-lg flex items-center justify-center select-none cursor-pointer animate-fadeIn"
            onClick={() => setIsFullscreenImage(false)}
          >
            <img 
              src={media.embedUrl} 
              alt="Fullscreen" 
              className="max-w-full max-h-full object-contain pointer-events-none p-2" 
            />
            
            {/* Botão de Fechar Chique e Destacado */}
            <button 
              className="absolute top-5 right-5 text-white bg-white/10 hover:bg-[#065fd4] dark:hover:bg-[#3ea6ff] p-3 rounded-full backdrop-blur-md transition-all active:scale-95 shadow-xl border border-white/10"
              onClick={() => setIsFullscreenImage(false)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>

            <div className="absolute bottom-6 bg-black/40 border border-white/5 backdrop-blur-md px-4 py-2 rounded-full text-white/60 text-xs font-semibold tracking-wider uppercase pointer-events-none">
              Toca em qualquer ponto para fechar
            </div>
          </div>
        )}
      </>
    );
  }

  if (media.platform === 'native') {
    return (
      <div className={wrapperClass}>
        <video 
          src={media.embedUrl} 
          controls 
          preload="metadata" 
          controlsList="nodownload" 
          className="w-full h-full object-contain focus:outline-none bg-black p-0.5" 
        />
      </div>
    );
  }

  return (
    <div className={wrapperClass}>
      <iframe 
        src={media.embedUrl} 
        title="Media Player" 
        className="absolute top-0 left-0 w-full h-full border-0 bg-black" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
        allowFullScreen 
        loading="lazy" 
      />
    </div>
  );
};
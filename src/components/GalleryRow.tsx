import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface GalleryRowProps {
  images: string[];
  titleKey: string;
  subtitleKey: string;
  albumKey: string;
  mobileIndex: number;
  scrollRef: React.RefObject<HTMLDivElement | null>;
  onSelectImage: (img: string) => void;
  onPrevMobile: () => void;
  onNextMobile: () => void;
  isRedVariant?: boolean;
}

export const GalleryRow: React.FC<GalleryRowProps> = ({
  images,
  titleKey,
  subtitleKey,
  albumKey,
  mobileIndex,
  scrollRef,
  onSelectImage,
  onPrevMobile,
  onNextMobile,
  isRedVariant = false,
}) => {
  return (
    <div>
      {/* DESKTOP */}
      <div className="hidden md:block relative w-full overflow-hidden">
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto no-scrollbar pb-4 snap-x"
          style={{ scrollbarWidth: 'none' }}
        >
          {images.map((img, index) => (
            <div
              key={index}
              onClick={() => onSelectImage(img)}
              className="min-w-[260px] h-[350px] rounded-2xl overflow-hidden relative cursor-pointer border border-zinc-800 hover:border-red-500 transition-colors duration-200 snap-start flex-shrink-0"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10" />
              <img
                src={img}
                alt={`${titleKey} ${index}`}
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-6 left-6 z-20">
                <p
                  className={`${
                    isRedVariant ? 'text-red-500' : 'text-yellow-500'
                  } font-black text-xl tracking-tighter`}
                >
                  {titleKey}
                </p>
                <p className="text-xs text-gray-300 uppercase tracking-widest">
                  {subtitleKey}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MOBILE */}
      <div className="block md:hidden w-full max-w-[340px] mx-auto relative aspect-square rounded-2xl overflow-hidden border border-zinc-700 bg-zinc-900 mt-4">
        <div
          onClick={() => onSelectImage(images[mobileIndex])}
          className="w-full h-full cursor-pointer relative"
        >
          <img
            src={images[mobileIndex]}
            alt={albumKey}
            loading="lazy"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute bottom-4 left-4">
            <p
              className={`${
                isRedVariant ? 'text-red-500' : 'text-yellow-500'
              } font-black text-lg`}
            >
              {albumKey}
            </p>
          </div>
        </div>
        <button
          onClick={onPrevMobile}
          className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={onNextMobile}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};
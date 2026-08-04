import React from 'react';
import { X } from 'lucide-react';

interface ImageModalProps {
  imageUrl: string | null;
  onClose: () => void;
}

export const ImageModal: React.FC<ImageModalProps> = ({ imageUrl, onClose }) => {
  if (!imageUrl) return null;

  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
      <button
        onClick={onClose}
        className="absolute top-6 right-6 p-3 rounded-full bg-zinc-900 text-white hover:bg-zinc-800 transition-colors"
      >
        <X size={24} />
      </button>
      <img
        src={imageUrl}
        alt="Expanded View"
        className="max-w-full max-h-[85vh] object-contain rounded-xl border border-zinc-800"
      />
    </div>
  );
};
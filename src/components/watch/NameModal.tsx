import React, { useState, useEffect, useCallback, memo } from 'react';
import { useTranslate } from '../../context/LanguageProvider';

export interface NameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
}

const NameModalComponent = ({ isOpen, onClose, onSave }: NameModalProps) => {
  const { t } = useTranslate();
  const [name, setName] = useState('');

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) {
      setName('');
      return;
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const isSaveDisabled = !name.trim();

  const handleSave = () => {
    const trimmed = name.trim();
    if (trimmed) {
      onSave(trimmed);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-name-title"
      className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 select-none"
      onClick={onClose}
    >
      {/* Card Soft Clean: Zero sombras pesadas, apenas superfícies limpas e bordas de 1px */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm p-6 rounded-2xl flex flex-col gap-4 bg-[#f8fafc] dark:bg-[#181a20] border border-slate-200/80 dark:border-white/10"
      >
        <div className="flex flex-col gap-1">
          <h3
            id="modal-name-title"
            className="text-base font-semibold text-slate-900 dark:text-slate-100 tracking-tight"
          >
            {t('modalNameTitle')}
          </h3>

          <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
            {t('modalNameSubtitle')}
          </p>
        </div>

        {/* Input Suave e Leve */}
        <div className="relative w-full">
          <input
            type="text"
            maxLength={30}
            value={name}
            placeholder={t('placeholderYourName')}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !isSaveDisabled && handleSave()}
            className="w-full px-3.5 py-2.5 rounded-xl text-sm font-medium bg-slate-200/50 dark:bg-[#222630] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 border border-transparent focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-colors duration-100"
            autoFocus
          />

          <span
            className={`absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-mono select-none ${
              name.length >= 25 ? 'text-rose-500 font-semibold' : 'text-slate-400 dark:text-slate-600'
            }`}
          >
            {name.length}/30
          </span>
        </div>

        {/* Ações */}
        <div className="flex gap-2.5 justify-end items-center pt-1">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-white/5 active:bg-slate-300/60 dark:active:bg-white/10 transition-colors duration-75 outline-none"
          >
            {t('actionCancel')}
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaveDisabled}
            className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 active:bg-blue-800 disabled:opacity-40 disabled:pointer-events-none transition-colors duration-75 outline-none"
          >
            {t('actionSave')}
          </button>
        </div>
      </div>
    </div>
  );
};

export const NameModal = memo(NameModalComponent);
NameModal.displayName = 'NameModal';

export default NameModal;
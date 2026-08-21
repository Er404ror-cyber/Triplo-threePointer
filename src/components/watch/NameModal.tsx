import React, { useState } from 'react';
import { useTranslate } from '../../context/LanguageProvider';

interface NameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
}

export const NameModal: React.FC<NameModalProps> = ({ isOpen, onClose, onSave }) => {
  const { t } = useTranslate();
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    if (name.trim()) {
      onSave(name);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 transition-opacity">
      <div className="bg-white dark:bg-[#212121] rounded-2xl max-w-sm w-full p-6 shadow-2xl flex flex-col gap-2">
        
        <h3 className="text-xl font-bold text-[#0f0f0f] dark:text-[#f1f1f1]">
          {t('modalNameTitle')}
        </h3>
        
        <p className="text-[14px] text-[#606060] dark:text-[#aaaaaa] leading-relaxed mb-4">
          {t('modalNameSubtitle')}
        </p>
        
        <div className="relative w-full mb-6">
          <input
            type="text"
            maxLength={30}
            value={name}
            placeholder={t('placeholderYourName')}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            className="w-full bg-transparent border-b border-black/20 dark:border-white/20 py-2 text-[15px] text-[#0f0f0f] dark:text-[#f1f1f1] focus:outline-none focus:border-[#065fd4] dark:focus:border-[#3ea6ff] transition-colors placeholder:text-[#606060] dark:placeholder:text-[#aaaaaa]"
            autoFocus
          />
          {/* Indicador de limite de caracteres semelhante ao do YouTube */}
          <span className={`absolute right-0 bottom-2 text-[12px] font-medium transition-colors ${name.length >= 30 ? 'text-red-500' : 'text-transparent'}`}>
            {name.length}/30
          </span>
        </div>

        <div className="flex gap-3 justify-end mt-2">
          <button 
            onClick={onClose} 
            className="px-4.5 py-2 rounded-full text-sm font-semibold text-[#0f0f0f] dark:text-[#f1f1f1] hover:bg-black/5 dark:hover:bg-white/10 transition-all active:scale-95"
          >
            {t('actionCancel')}
          </button>
          
          <button 
            onClick={handleSave} 
            disabled={!name.trim()}
            className="px-4.5 py-2 rounded-full text-sm font-semibold bg-[#065fd4] dark:bg-[#3ea6ff] text-white dark:text-[#0f0f0f] hover:bg-blue-700 dark:hover:bg-[#65b8ff] disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 shadow-sm"
          >
            {t('actionSave')}
          </button>
        </div>
        
      </div>
    </div>
  );
};
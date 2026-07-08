import React, { useState } from 'react';

interface NameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
}

export const NameModal: React.FC<NameModalProps> = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-[#212121] rounded-xl max-w-sm w-full p-6 shadow-xl space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Como te chamas?</h3>
        <p className="text-sm text-slate-600 dark:text-[#aaaaaa]">Junta-te à conversa. Só precisas de inserir o teu nome uma vez.</p>
        <input
          type="text"
          maxLength={30}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSave(name)}
          className="w-full bg-transparent border-b-2 border-slate-300 dark:border-white/20 py-2 text-base text-slate-900 dark:text-white focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 transition-colors"
          autoFocus
        />
        <div className="flex gap-2 justify-end pt-2">
          <button onClick={onClose} className="px-4 py-2 rounded-full text-sm font-medium text-slate-700 dark:text-[#f1f1f1] hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">Cancelar</button>
          <button onClick={() => onSave(name)} className="px-4 py-2 rounded-full text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors">Guardar</button>
        </div>
      </div>
    </div>
  );
};
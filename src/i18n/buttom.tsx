import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  // Proteção: Se o i18n ou i18n.language ainda não existirem, assume 'pt'
  const currentLanguage = i18n.language ? i18n.language.split('-')[0] : 'pt';
  const isEnglish = currentLanguage === 'en';

  const toggleLanguage = () => {
    i18n.changeLanguage(isEnglish ? 'pt' : 'en');
  };

  return (
    <button
      onClick={toggleLanguage}
      aria-label={isEnglish ? 'Mudar para Português' : 'Switch to English'}
      className={`group relative h-9 w-18 rounded-full border backdrop-blur-xl transition-all duration-300 active:scale-95 ${
        isEnglish
          ? 'border-blue-400/40 bg-linear-to-r from-blue-950/80 to-blue-900/60 shadow-[0_0_18px_2px_rgba(56,120,255,0.35)]'
          : 'border-emerald-400/30 bg-linear-to-r from-emerald-950/80 to-emerald-900/60 shadow-[0_0_18px_2px_rgba(16,185,129,0.25)]'
      }`}
    >
      {/* Trilho interno com leve textura/inset shadow para efeito 3D sutil */}
      <span
        className="absolute inset-0 rounded-full"
        style={{ boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.35)' }}
        aria-hidden
      />

      {/* Rótulo do lado oposto à bolinha, discreto */}
      <span
        className={`absolute top-1/2 -translate-y-1/2 text-[9px] font-bold uppercase tracking-widest text-white/40 transition-opacity duration-300 ${
          isEnglish ? 'left-2.5 opacity-100' : 'right-2.5 opacity-100'
        }`}
      >
        {isEnglish ? 'PT' : 'EN'}
      </span>

      {/* Bolinha deslizante com bandeira e gradiente */}
      <span
        className={`absolute top-1 flex h-7 w-7 items-center justify-center rounded-full bg-linear-to-br from-white to-slate-200 text-sm shadow-[0_2px_6px_rgba(0,0,0,0.4)] transition-transform duration-300 ease-out ${
          isEnglish ? 'translate-x-9.75' : 'translate-x-1'
        }`}
      >
        <span className="drop-shadow-sm">{isEnglish ? '🇬🇧' : '🇵🇹'}</span>
      </span>
    </button>
  );
}
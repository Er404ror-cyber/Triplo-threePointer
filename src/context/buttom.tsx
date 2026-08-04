import { useTranslate } from "./LanguageProvider";

// Configuração visual apenas para o switch
const languageMeta = {
  pt: { name: "PT", flag: "🇵🇹" },
  en: { name: "EN", flag: "🇬🇧" },
};

export default function LanguageSwitcher() {
  const { language, setLanguage } = useTranslate();

  const isEnglish = language === "en";

  const toggleLanguage = () => {
    setLanguage(isEnglish ? "pt" : "en");
  };

  return (
    <button
      onClick={toggleLanguage}
      aria-label={isEnglish ? "Mudar para Português" : "Switch to English"}
      className={`group relative h-9 w-18 rounded-full border backdrop-blur-xl transition-all duration-300 active:scale-95 ${
        isEnglish
          ? "border-blue-400/40 bg-linear-to-r from-blue-950/80 to-blue-900/60 shadow-[0_0_18px_2px_rgba(56,120,255,0.35)]"
          : "border-emerald-400/30 bg-linear-to-r from-emerald-950/80 to-emerald-900/60 shadow-[0_0_18px_2px_rgba(16,185,129,0.25)]"
      }`}
    >
      <span
        className="absolute inset-0 rounded-full"
        style={{ boxShadow: "inset 0 1px 3px rgba(0,0,0,0.35)" }}
        aria-hidden
      />

      <span
        className={`absolute top-1/2 -translate-y-1/2 text-[9px] font-bold uppercase tracking-widest text-white/40 ${
          isEnglish ? "left-2.5" : "right-2.5"
        }`}
      >
        {isEnglish ? languageMeta.pt.name : languageMeta.en.name}
      </span>

      <span
        className={`absolute top-1 flex h-7 w-7 items-center justify-center rounded-full bg-linear-to-br from-white to-slate-200 text-sm shadow-[0_2px_6px_rgba(0,0,0,0.4)] transition-transform duration-300 ease-out ${
          isEnglish ? "translate-x-9.75" : "translate-x-1"
        }`}
      >
        <span className="drop-shadow-sm">
          {isEnglish ? languageMeta.en.flag : languageMeta.pt.flag}
        </span>
      </span>
    </button>
  );
}
import { useTranslation } from 'react-i18next';
import { resources } from './translations';

// Configuração visual apenas para o select não ficar dependente do ficheiro de traduções
const languageMeta = {
  pt: { name: 'PT', flag: '🇵🇹' },
  en: { name: 'EN', flag: '🇬🇧' }
};

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  // Limpa o idioma atual (ex: transforma 'pt-BR' ou 'pt-MZ' em apenas 'pt')
  const currentLanguage = i18n.language ? i18n.language.split('-')[0] : 'pt';
  
  // Deteta automaticamente os códigos de idiomas ativos (ex: ['pt', 'en'])
  const availableLanguages = Object.keys(resources);

  return (
    <select
      value={currentLanguage}
      onChange={(e) => i18n.changeLanguage(e.target.value)}
      className="bg-gray-100 text-sm rounded-lg p-1.5 border border-gray-300 focus:ring-2 focus:ring-blue-500 text-slate-800 font-medium cursor-pointer"
    >
      {availableLanguages.map((lang) => {
        const meta = languageMeta[lang] || { name: lang.toUpperCase(), flag: '🌐' };
        return (
          <option key={lang} value={lang}>
            {meta.flag} {meta.name}
          </option>
        );
      })}
    </select>
  );
}
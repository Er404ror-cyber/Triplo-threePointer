import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  // Proteção: Se o i18n ou i18n.language ainda não existirem, assume 'pt'
  const currentLanguage = i18n.language ? i18n.language.split('-')[0] : 'pt';

  return (
    <select
      value={currentLanguage}
      onChange={(e) => i18n.changeLanguage(e.target.value)}
      className="bg-gray-100 text-sm rounded-lg p-1.5 border border-gray-300 focus:ring-2 focus:ring-blue-500 text-slate-800 font-medium"
    >
      <option value="pt">🇵🇹 PT</option>
      <option value="en">🇬🇧 EN</option>
    </select>
  );
}
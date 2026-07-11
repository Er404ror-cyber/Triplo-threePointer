import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { resources } from './translations';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'pt',
    load: 'languageOnly',
    // Remove a necessidade do nó "translation" no objeto de recursos
    defaultNS: '',
    ns: [''],
    interpolation: { escapeValue: false }
  });

export default i18n;
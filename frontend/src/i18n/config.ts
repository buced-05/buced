import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import fr from './locales/fr.json';
import es from './locales/es.json';
import ko from './locales/ko.json';
import zh from './locales/zh.json';
import en from './locales/en.json';

const resources = {
  fr: { translation: fr },
  es: { translation: es },
  ko: { translation: ko },
  zh: { translation: zh },
  en: { translation: en },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'fr',
    defaultNS: 'translation',
    ns: 'translation',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
  });

export default i18n;


import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslation from './en.json';
import taTranslation from './ta.json';
import hiTranslation from './hi.json';

const resources = {
  en: {
    translation: enTranslation,
  },
  ta: {
    translation: taTranslation,
  },
  hi: {
    translation: hiTranslation,
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // Default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already safe from xss
    },
  });

export default i18n;

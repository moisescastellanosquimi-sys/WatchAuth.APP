import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import en from './locales/en.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import ar from './locales/ar.json';
import zh from './locales/zh.json';

const resources = {
  en: { translation: en },
  es: { translation: es },
  fr: { translation: fr },
  ar: { translation: ar },
  zh: { translation: zh },
};

const getDeviceLanguage = (): string => {
  try {
    const locales = Localization.getLocales();
    if (locales && locales.length > 0 && locales[0]?.languageCode) {
      return locales[0].languageCode;
    }
  } catch (error) {
    console.log('Failed to get device language:', error);
  }
  return 'en';
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getDeviceLanguage(),
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    compatibilityJSON: 'v4',
  });

export default i18n;

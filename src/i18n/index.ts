import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'react-native-localize';
import { I18nManager } from 'react-native';

import en from './en.json';
import ar from './ar.json';

const resources = {
  en: {
    translation: en,
  },
  ar: {
    translation: ar,
  },
};

// Get device language
const deviceLanguage = getLocales()[0]?.languageCode || 'en';
const isRTL = deviceLanguage === 'ar';

// Configure RTL
I18nManager.allowRTL(true);
I18nManager.forceRTL(isRTL);

i18n.use(initReactI18next).init({
  resources,
  lng: deviceLanguage,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

export const changeLanguage = (language: string) => {
  const isRTL = language === 'ar';
  I18nManager.forceRTL(isRTL);
  i18n.changeLanguage(language);
};

export default i18n;

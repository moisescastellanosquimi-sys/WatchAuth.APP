import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import '../i18n';

const LANGUAGE_STORAGE_KEY = '@language';

export type Language = 'en' | 'es' | 'fr' | 'ar' | 'zh';

export const LANGUAGES: { code: Language; name: string; nativeName: string }[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
];

export const [LanguageProvider, useLanguage] = createContextHook(() => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState<Language>(i18n.language as Language);

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (savedLanguage && LANGUAGES.some(lang => lang.code === savedLanguage)) {
          await i18n.changeLanguage(savedLanguage);
          setCurrentLanguage(savedLanguage as Language);
        }
      } catch (error) {
        console.error('Failed to load language:', error);
      }
    };

    loadLanguage();
  }, [i18n]);

  useEffect(() => {
    const onLanguageChanged = (lng: string) => {
      console.log('Language changed to:', lng);
      setCurrentLanguage(lng as Language);
    };

    i18n.on('languageChanged', onLanguageChanged);

    return () => {
      i18n.off('languageChanged', onLanguageChanged);
    };
  }, [i18n]);

  const changeLanguage = async (languageCode: Language) => {
    try {
      console.log('Changing language to:', languageCode);
      await i18n.changeLanguage(languageCode);
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, languageCode);
      setCurrentLanguage(languageCode);
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };

  return {
    currentLanguage,
    changeLanguage,
    languages: LANGUAGES,
  };
});

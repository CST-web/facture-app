
import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { Language, Direction } from '../types';
import { translations } from '../lib/i18n';

interface TranslationsContextType {
  language: Language;
  direction: Direction;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const TranslationsContext = createContext<TranslationsContextType | undefined>(undefined);

export const TranslationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const savedLang = localStorage.getItem('invoice_lang') as Language;
    if (savedLang) return savedLang;

    const browserLang = navigator.language.split('-')[0];
    if (browserLang === 'fr' || browserLang === 'ar') {
      return browserLang;
    }
    return 'en';
  });

  const direction = useMemo(() => (language === 'ar' ? 'rtl' : 'ltr'), [language]);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = direction;
    document.body.className = direction === 'rtl' ? 'font-cairo' : 'font-sans';
    localStorage.setItem('invoice_lang', language);
  }, [language, direction]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = useCallback((key: string): string => {
    return translations[key]?.[language] || key;
  }, [language]);

  const value = useMemo(() => ({
    language,
    direction,
    setLanguage,
    t,
  }), [language, direction, t]);

  return (
    <TranslationsContext.Provider value={value}>
      {children}
    </TranslationsContext.Provider>
  );
};

export const useTranslations = (): TranslationsContextType => {
  const context = useContext(TranslationsContext);
  if (context === undefined) {
    throw new Error('useTranslations must be used within a TranslationsProvider');
  }
  return context;
};
   
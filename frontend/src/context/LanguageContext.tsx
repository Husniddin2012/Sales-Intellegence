import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, TRANSLATIONS } from '../services/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
  languages: { id: Language; label: string; flag: string }[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const AVAILABLE_LANGUAGES: { id: Language; label: string; flag: string }[] = [
  { id: 'uz', label: "O'zbekcha", flag: "🇺🇿" },
  { id: 'ru', label: "Русский", flag: "🇷🇺" },
  { id: 'en', label: "English", flag: "🇬🇧" }
];

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('sales_intel_lang') as Language;
    return saved || 'uz';
  });

  useEffect(() => {
    localStorage.setItem('sales_intel_lang', language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string, fallback?: string): string => {
    const item = TRANSLATIONS[key];
    if (!item) return fallback || key;
    return item[language] || item['uz'] || fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, languages: AVAILABLE_LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};

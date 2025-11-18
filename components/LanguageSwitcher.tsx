
import React from 'react';
import { useTranslations } from '../hooks/useTranslations';
import { Language } from '../types';

const languages: { code: Language; name: string; flag: string }[] = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'ar', name: 'العربية', flag: '🇲🇦' },
];

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useTranslations();

  return (
    <div className="flex items-center space-x-2 rtl:space-x-reverse">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code)}
          className={`px-3 py-2 text-sm rounded-md transition-colors ${
            language === lang.code
              ? 'bg-blue-600 text-white shadow'
              : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
          }`}
          title={lang.name}
        >
          <span className="hidden sm:inline">{lang.flag} {lang.name}</span>
          <span className="sm:hidden">{lang.flag}</span>
        </button>
      ))}
    </div>
  );
};
   
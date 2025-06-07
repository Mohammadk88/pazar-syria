'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Language, languages, translations } from '@/lib/i18n';

interface LanguageStore {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
  getDirection: () => 'ltr' | 'rtl';
  getFontFamily: () => string;
}

export const useLanguage = create<LanguageStore>()(
  persist(
    (set, get) => ({
      currentLanguage: 'ar' as Language,
      
      setLanguage: (language: Language) => {
        set({ currentLanguage: language });
        
        // Update document direction and font
        if (typeof document !== 'undefined') {
          const direction = languages[language].direction;
          const fontFamily = languages[language].fontFamily;
          
          document.documentElement.dir = direction;
          document.documentElement.lang = language;
          document.body.className = `font-${fontFamily} ${direction}`;
        }
      },
      
      t: (key: string) => {
        const { currentLanguage } = get();
        const translation = translations[currentLanguage];
        return translation[key as keyof typeof translation] || key;
      },
      
      getDirection: () => {
        const { currentLanguage } = get();
        return languages[currentLanguage].direction;
      },
      
      getFontFamily: () => {
        const { currentLanguage } = get();
        return languages[currentLanguage].fontFamily;
      }
    }),
    {
      name: 'language-storage',
    }
  )
);

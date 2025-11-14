import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import i18n from '../i18n/config';

type Language = 'fr' | 'es' | 'ko' | 'zh' | 'en';

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: 'fr',
      setLanguage: (lang: Language) => {
        i18n.changeLanguage(lang);
        set({ language: lang });
        // Recharger la page automatiquement après un court délai pour appliquer les changements
        setTimeout(() => {
          window.location.reload();
        }, 100);
      },
    }),
    {
      name: 'buced-language-store',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state?.language) {
          i18n.changeLanguage(state.language);
        }
      },
    },
  ),
);


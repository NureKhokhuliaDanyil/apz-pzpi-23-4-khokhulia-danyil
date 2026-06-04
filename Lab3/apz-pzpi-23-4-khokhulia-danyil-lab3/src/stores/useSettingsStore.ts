/* ───────────────────────────────────────────
 *  Settings store — language & theme
 * ─────────────────────────────────────────── */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import i18n from '../i18n/i18n';

export type Theme = 'dark' | 'light';
export type Lang = 'uk' | 'en';

interface SettingsState {
  theme: Theme;
  lang: Lang;
  setTheme: (t: Theme) => void;
  setLang: (l: Lang) => void;
  toggleTheme: () => void;
}

/** Apply data-theme attribute to document root */
function applyTheme(t: Theme) {
  document.documentElement.setAttribute('data-theme', t);
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      lang: 'uk',

      setTheme: (t) => {
        applyTheme(t);
        set({ theme: t });
      },

      setLang: (l) => {
        i18n.changeLanguage(l);
        document.documentElement.lang = l;
        set({ lang: l });
      },

      toggleTheme: () => {
        const next = get().theme === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        set({ theme: next });
      },
    }),
    {
      name: 'wc_settings',
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyTheme(state.theme);
          i18n.changeLanguage(state.lang);
          document.documentElement.lang = state.lang;
        }
      },
    },
  ),
);

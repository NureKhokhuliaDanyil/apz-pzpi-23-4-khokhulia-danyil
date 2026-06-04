/* ───────────────────────────────────────────
 *  i18next configuration
 * ─────────────────────────────────────────── */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import uk from './locales/uk.json';
import en from './locales/en.json';

const savedLang = (() => {
  try {
    const raw = localStorage.getItem('wc_settings');
    if (raw) return JSON.parse(raw)?.state?.lang ?? 'uk';
  } catch { /* fallback */ }
  return 'uk';
})();

i18n.use(initReactI18next).init({
  resources: {
    uk: { translation: uk },
    en: { translation: en },
  },
  lng: savedLang,
  fallbackLng: 'uk',
  interpolation: { escapeValue: false },
});

export default i18n;

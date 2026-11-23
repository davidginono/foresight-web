import { createContext, useContext, useLayoutEffect, useMemo, useState } from 'react';
import { Globe } from 'lucide-react';
import { translate } from './locale.js';

const preferenceKey = 'foresight-language';
const LanguageContext = createContext(null);

function preferredLocale() {
  try { return localStorage.getItem(preferenceKey) === 'sw' ? 'sw' : 'en'; }
  catch { return 'en'; }
}

export function LanguageProvider({ children }) {
  const [locale, setLocale] = useState(preferredLocale);
  useLayoutEffect(() => { document.documentElement.lang = locale; }, [locale]);
  const language = useMemo(() => ({
    locale,
    t: message => translate(locale, message),
    setLocale(nextLocale) {
      setLocale(nextLocale);
      try { localStorage.setItem(preferenceKey, nextLocale); } catch { /* Storage may be disabled. */ }
    },
  }), [locale]);
  return <LanguageContext.Provider value={language}>{children}</LanguageContext.Provider>;
}

export function useLanguage() { return useContext(LanguageContext); }

export function LanguageSwitch() {
  const { locale, setLocale } = useLanguage();
  const target = locale === 'en' ? 'sw' : 'en';
  return <button type="button" className="site-language-switch" lang={target} onClick={() => setLocale(target)}
    aria-label={target === 'sw' ? 'Soma kwa Kiswahili' : 'Read in English'}>
    <Globe size={17} aria-hidden="true" />{target === 'sw' ? 'Kiswahili' : 'English'}
  </button>;
}

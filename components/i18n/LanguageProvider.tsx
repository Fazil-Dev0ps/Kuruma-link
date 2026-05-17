"use client";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { DEFAULT_LANG, LANG_COOKIE, dictionaries, isLang, t as tBase, type Lang, type TKey } from "@/lib/i18n";

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: TKey) => string;
};

const LanguageContext = createContext<Ctx | null>(null);

function readCookie(): Lang | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|; )lang=([^;]+)/);
  if (!match) return null;
  const v = decodeURIComponent(match[1]);
  return isLang(v) ? v : null;
}

function writeCookie(lang: Lang) {
  if (typeof document === "undefined") return;
  document.cookie = `${LANG_COOKIE}=${lang}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
}

export function LanguageProvider({
  initialLang,
  children,
}: {
  initialLang?: Lang;
  children: React.ReactNode;
}) {
  const [lang, setLangState] = useState<Lang>(initialLang ?? DEFAULT_LANG);

  useEffect(() => {
    const fromCookie = readCookie();
    if (fromCookie && fromCookie !== lang) setLangState(fromCookie);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    writeCookie(next);
    if (typeof document !== "undefined") {
      document.documentElement.lang = next;
    }
  }, []);

  const t = useCallback((key: TKey) => tBase(key, lang), [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    return {
      lang: DEFAULT_LANG,
      setLang: () => {},
      t: (key: TKey) => (dictionaries[DEFAULT_LANG] as Record<string, string>)[key] ?? key,
    } as Ctx;
  }
  return ctx;
}

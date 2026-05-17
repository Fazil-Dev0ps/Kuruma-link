import { cookies } from "next/headers";
import { DEFAULT_LANG, LANG_COOKIE, isLang, t as tBase, type Lang, type TKey } from "./i18n";

export function getServerLang(): Lang {
  const store = cookies();
  const v = store.get(LANG_COOKIE)?.value;
  return isLang(v) ? v : DEFAULT_LANG;
}

export function getServerT() {
  const lang = getServerLang();
  return {
    lang,
    t: (key: TKey) => tBase(key, lang),
  };
}

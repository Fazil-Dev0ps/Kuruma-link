"use client";
import { useLanguage } from "./LanguageProvider";
import type { Lang } from "@/lib/i18n";

export default function LangSwitcher({ tone = "auto" }: { tone?: "auto" | "dark" | "light" }) {
  const { lang, setLang } = useLanguage();

  function pick(next: Lang) {
    if (next === lang) return;
    setLang(next);
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  }

  const isLight = tone === "light";
  const base = isLight
    ? "border-white/30 text-white"
    : "border-line text-ink";
  const activeClass = isLight ? "bg-white/20 text-white" : "bg-ink text-white";

  return (
    <div className={`inline-flex items-center rounded-md border ${base} text-xs overflow-hidden`}>
      <button
        type="button"
        onClick={() => pick("ja")}
        className={`px-2 py-1 transition-colors ${lang === "ja" ? activeClass : ""}`}
        aria-pressed={lang === "ja"}
      >
        JP
      </button>
      <span className={isLight ? "h-4 w-px bg-white/30" : "h-4 w-px bg-line"} />
      <button
        type="button"
        onClick={() => pick("en")}
        className={`px-2 py-1 transition-colors ${lang === "en" ? activeClass : ""}`}
        aria-pressed={lang === "en"}
      >
        EN
      </button>
    </div>
  );
}

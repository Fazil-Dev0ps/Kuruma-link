"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, ArrowRight, Car, Calendar, Globe } from "lucide-react";
import { useLanguage } from "@/components/i18n/LanguageProvider";

export default function HeroSection() {
  const { t } = useLanguage();
  const [loaded, setLoaded] = useState(false);
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => [
      t("home.hero.title.0"),
      t("home.hero.title.1"),
      t("home.hero.title.2"),
      t("home.hero.title.3"),
      t("home.hero.title.4"),
    ],
    [t]
  );
  const [brands, setBrands] = useState<{ name: string }[]>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [keyword, setKeyword] = useState("");
  const [brand, setBrand] = useState("");
  const [country, setCountry] = useState("");
  const [year, setYear] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setTitleNumber(titleNumber === titles.length - 1 ? 0 : titleNumber + 1);
    }, 2000);
    return () => clearTimeout(timer);
  }, [titleNumber, titles]);

  useEffect(() => {
    setLoaded(true);
    fetch("/api/brands")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setBrands(data);
      })
      .catch(() => {});
    fetch("/api/cars?limit=60")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data?.countries)) setCountries(data.countries);
      })
      .catch(() => {});
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const sp = new URLSearchParams();
    if (keyword.trim()) sp.set("q", keyword.trim());
    if (brand) sp.set("brand", brand);
    if (country) sp.set("country", country);
    if (year) sp.set("year", year);
    window.location.href = `/cars${sp.toString() ? `?${sp.toString()}` : ""}`;
  }

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-ink">
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-[1.5s] ease-out"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1544636331-e26879cd4d9b?q=80&w=2000&auto=format&fit=crop')",
          transform: loaded ? "scale(1)" : "scale(1.1)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pt-32">
        <div className="max-w-2xl">
          <h1
            className={`text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6 transition-all duration-700 delay-200 ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <span>{t("home.hero.findYour")}</span>
            <span className="relative flex w-full overflow-hidden md:pb-4 md:pt-1 h-[1.2em]">
              &nbsp;
              {titles.map((title, index) => (
                <motion.span
                  key={index}
                  className="absolute font-semibold italic text-accent"
                  initial={{ opacity: 0, y: "-100" }}
                  transition={{ type: "spring", stiffness: 50 }}
                  animate={
                    titleNumber === index
                      ? { y: 0, opacity: 1 }
                      : { y: titleNumber > index ? -150 : 150, opacity: 0 }
                  }
                >
                  {title}
                </motion.span>
              ))}
            </span>
            <span>{t("home.hero.atOurStore")}</span>
          </h1>

          <p className={`text-lg text-white/70 mb-8 max-w-md transition-all duration-700 delay-300 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            {t("home.hero.tagline")}
          </p>

          <div className={`flex flex-wrap items-center gap-4 transition-all duration-700 delay-500 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <Link
              href="/cars"
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white px-7 py-3.5 rounded-lg font-medium transition-all hover:shadow-lift-lg hover:-translate-y-0.5"
            >
              {t("home.hero.shopCars")}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/cars"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white px-7 py-3.5 rounded-lg font-medium transition-all hover:-translate-y-0.5"
            >
              {t("home.hero.browseAll")}
            </Link>
          </div>
        </div>

        <div className={`mt-12 max-w-5xl transition-all duration-700 delay-700 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <form onSubmit={handleSearch} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-2 md:p-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2 md:gap-3">
              <div className="lg:col-span-2 relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder={t("home.hero.searchPlaceholder")}
                  className="w-full bg-white/10 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:bg-white/15 transition-all"
                />
              </div>

              <div className="relative">
                <Car className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40 pointer-events-none" />
                <select
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full appearance-none bg-white/10 border border-white/10 rounded-xl pl-10 pr-8 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent/50 focus:bg-white/15 transition-all cursor-pointer [&>option]:text-ink [&>option]:bg-white"
                >
                  <option value="">{t("home.hero.allBrands")}</option>
                  {brands.map((b) => (
                    <option key={b.name} value={b.name}>{b.name}</option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40 pointer-events-none" />
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full appearance-none bg-white/10 border border-white/10 rounded-xl pl-10 pr-8 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent/50 focus:bg-white/15 transition-all cursor-pointer [&>option]:text-ink [&>option]:bg-white"
                >
                  <option value="">{t("home.hero.allCountries")}</option>
                  {countries.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40 pointer-events-none" />
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full appearance-none bg-white/10 border border-white/10 rounded-xl pl-10 pr-8 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent/50 focus:bg-white/15 transition-all cursor-pointer [&>option]:text-ink [&>option]:bg-white"
                >
                  <option value="">{t("home.hero.anyYear")}</option>
                  {years.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover text-white rounded-xl py-3 px-6 text-sm font-semibold transition-all hover:shadow-lift-lg hover:-translate-y-0.5 active:translate-y-0"
              >
                <Search className="h-4 w-4" />
                {t("home.hero.findCars")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

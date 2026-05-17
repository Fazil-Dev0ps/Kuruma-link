"use client";
import { useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, X } from "lucide-react";
import { useLanguage } from "@/components/i18n/LanguageProvider";

const selectClass =
  "flex h-9 w-full rounded-md border border-input bg-white px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export default function CarFilters({
  brands,
  countries = [],
}: {
  brands: string[];
  countries?: string[];
}) {
  const { t } = useLanguage();
  const pathname = usePathname();
  const params = useSearchParams();

  const [q, setQ] = useState(params.get("q") ?? "");
  const [brand, setBrand] = useState(params.get("brand") ?? "");
  const [country, setCountry] = useState(params.get("country") ?? "");
  const [year, setYear] = useState(params.get("year") ?? "");
  const [maxPrice, setMax] = useState(params.get("maxPrice") ?? "");

  useEffect(() => {
    setQ(params.get("q") ?? "");
    setBrand(params.get("brand") ?? "");
    setCountry(params.get("country") ?? "");
    setYear(params.get("year") ?? "");
    setMax(params.get("maxPrice") ?? "");
  }, [params]);

  function buildUrl(overrides: Record<string, string>) {
    const values = { q, brand, country, year, maxPrice, ...overrides };
    const sp = new URLSearchParams();
    if (values.q?.trim()) sp.set("q", values.q.trim());
    if (values.brand) sp.set("brand", values.brand);
    if (values.country) sp.set("country", values.country);
    if (values.year) sp.set("year", values.year);
    if (values.maxPrice) sp.set("maxPrice", values.maxPrice);
    const qs = sp.toString();
    return `${pathname}${qs ? `?${qs}` : ""}`;
  }

  function navigate(overrides: Record<string, string>) {
    window.location.href = buildUrl(overrides);
  }

  function onSearchKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      navigate({ q });
    }
  }

  function onPriceKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      navigate({ maxPrice });
    }
  }

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);
  const hasFilters = q || brand || country || year || maxPrice;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 items-end">
          <div className="sm:col-span-2 lg:col-span-2 space-y-1.5">
            <Label>{t("cars.filter.search")}</Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted" />
              <Input
                className="pl-8"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={onSearchKeyDown}
                placeholder={t("cars.filter.searchPlaceholder")}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>{t("cars.filter.brand")}</Label>
            <select
              className={selectClass}
              value={brand}
              onChange={(e) => navigate({ brand: e.target.value })}
            >
              <option value="">{t("common.all")}</option>
              {brands.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <Label>{t("cars.filter.country")}</Label>
            <select
              className={selectClass}
              value={country}
              onChange={(e) => navigate({ country: e.target.value })}
            >
              <option value="">{t("common.all")}</option>
              {countries.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <Label>{t("cars.filter.year")}</Label>
            <select
              className={selectClass}
              value={year}
              onChange={(e) => navigate({ year: e.target.value })}
            >
              <option value="">{t("common.any")}</option>
              {years.map((y) => (
                <option key={y} value={String(y)}>{y}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <Label>{t("cars.filter.maxPrice")}</Label>
            <Input
              type="number"
              min={0}
              value={maxPrice}
              onChange={(e) => setMax(e.target.value)}
              onKeyDown={onPriceKeyDown}
              placeholder={t("common.any")}
            />
          </div>
        </div>

        {hasFilters && (
          <div className="mt-3 flex justify-end">
            <button
              onClick={() => { window.location.href = pathname; }}
              className="inline-flex items-center gap-1.5 text-xs text-ink-muted hover:text-accent transition-colors"
            >
              <X className="h-3.5 w-3.5" />
              {t("common.clearFilters")}
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

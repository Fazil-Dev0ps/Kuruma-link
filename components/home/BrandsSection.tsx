"use client";
import Image from "next/image";
import Link from "next/link";
import SectionHeading from "./SectionHeading";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/components/i18n/LanguageProvider";

type Brand = {
  _id: string;
  name: string;
  logo: string;
  itemCount: number;
};

export default function BrandsSection() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/brands")
      .then((r) => r.json())
      .then((data) => {
        setBrands(Array.isArray(data) ? data : []);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  useEffect(() => {
    if (!loaded || brands.length === 0) return;
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          obs.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [loaded, brands.length]);

  if (!loaded || brands.length === 0) return null;

  return (
    <section ref={sectionRef} className="animate-on-scroll bg-cream py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-12">
          <SectionHeading title={t("home.brands.title")} highlight={t("home.brands.highlight")} />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-5">
          {brands.map((brand) => (
            <Link
              key={brand._id}
              href={`/cars?brand=${encodeURIComponent(brand.name)}`}
              className="block group"
            >
              <div className="p-6 text-center transition-all duration-300 hover:-translate-y-1">
                <div className="h-16 w-16 mx-auto mb-4 flex items-center justify-center overflow-hidden">
                  {brand.logo ? (
                    <Image
                      src={brand.logo}
                      alt={brand.name}
                      width={64}
                      height={64}
                      className="object-contain transition-transform group-hover:scale-110"
                    />
                  ) : (
                    <span className="text-xl font-bold text-ink-muted group-hover:text-accent transition-colors">
                      {brand.name.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-ink text-sm group-hover:text-accent transition-colors">
                  {brand.name}
                </h3>
                <p className="text-xs text-ink-muted mt-1">{brand.itemCount} {t("home.brands.carsSuffix")}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

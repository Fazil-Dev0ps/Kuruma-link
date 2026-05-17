"use client";
import Link from "next/link";
import SafeImage from "@/components/ui/safe-image";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { useScrollAnimation } from "./useScrollAnimation";
import SectionHeading from "./SectionHeading";
import { useLanguage } from "@/components/i18n/LanguageProvider";

type CarItem = {
  _id: string;
  title: string;
  brand: string;
  images: string[];
  price: number;
  status: string;
  year: number;
  country?: string;
};

export default function FeaturedCars({
  cars,
  title,
  highlight,
}: {
  cars: CarItem[];
  title?: string;
  highlight?: string;
}) {
  const sectionRef = useScrollAnimation();
  const { t } = useLanguage();
  if (cars.length === 0) return null;

  return (
    <section ref={sectionRef} className="animate-on-scroll bg-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-12">
          <SectionHeading
            title={title ?? t("home.featured.title")}
            highlight={highlight ?? t("home.featured.highlight")}
          />
          <Link
            href="/cars"
            className="text-sm text-ink hover:text-accent transition-colors underline underline-offset-4"
          >
            {t("home.featured.viewAll")}
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {cars.map((car) => {
            const img = car.images[0] ?? `https://picsum.photos/seed/${car._id}/600/400`;
            const sold = car.status === "sold";
            return (
              <Link key={car._id} href={`/cars/${car._id}`} className="group">
                <div className="bg-white rounded-2xl overflow-hidden border border-line hover:shadow-lift transition-all duration-300 hover:-translate-y-1">
                  <div className="relative aspect-[4/3] overflow-hidden bg-surface">
                    <SafeImage
                      src={img}
                      alt={car.title}
                      fill
                      sizes="(max-width:768px) 100vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge
                        variant={sold ? "secondary" : "default"}
                        className={sold ? "bg-white/90 text-ink" : "bg-accent text-white"}
                      >
                        {sold ? t("status.sold") : t("status.available")}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="text-[11px] text-ink-muted uppercase tracking-wide mb-1">
                      {car.brand} · {car.year}
                      {car.country ? <> · {car.country}</> : null}
                    </div>
                    <h3 className="font-medium text-ink text-sm line-clamp-2 mb-3 min-h-[2.5rem]">
                      {car.title}
                    </h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-ink-muted block">{t("car.price")}</span>
                        <span className="text-lg font-bold text-ink">{formatPrice(car.price)}</span>
                      </div>
                      <span className="px-4 py-2 rounded-lg text-xs font-medium bg-accent text-white hover:bg-accent-hover transition-colors">
                        {t("home.featured.view")}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

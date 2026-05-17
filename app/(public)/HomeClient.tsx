"use client";
import HeroSection from "@/components/home/HeroSection";
import BrandsSection from "@/components/home/BrandsSection";
import FeaturedCars from "@/components/home/FeaturedCars";
import { useLanguage } from "@/components/i18n/LanguageProvider";

type CarItem = {
  _id: string;
  title: string;
  brand: string;
  year: number;
  images: string[];
  price: number;
  status: string;
  country?: string;
};

export default function HomeClient({
  featured,
  latest,
}: {
  featured: CarItem[];
  latest: CarItem[];
}) {
  const { t } = useLanguage();
  return (
    <div>
      <HeroSection />
      <BrandsSection />
      {featured.length > 0 && (
        <FeaturedCars
          cars={featured}
          title={t("home.featured.title")}
          highlight={t("home.featured.highlight")}
        />
      )}
      <FeaturedCars
        cars={latest}
        title={t("home.latest.title")}
        highlight={t("home.latest.highlight")}
      />
    </div>
  );
}

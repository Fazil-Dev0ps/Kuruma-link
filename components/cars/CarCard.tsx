"use client";
import Link from "next/link";
import SafeImage from "@/components/ui/safe-image";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { useLanguage } from "@/components/i18n/LanguageProvider";

type Props = {
  car: {
    _id: string;
    title: string;
    brand: string;
    carModel: string;
    year: number;
    images: string[];
    price: number;
    status: string;
    country?: string;
  };
};

export default function CarCard({ car }: Props) {
  const { t } = useLanguage();
  const img = car.images[0] ?? `https://picsum.photos/seed/${car._id}/600/400`;
  const sold = car.status === "sold";
  return (
    <Link href={`/cars/${car._id}`} className="block group">
      <Card className="overflow-hidden hover:shadow-lift transition-shadow">
        <div className="relative aspect-[5/3] bg-surface overflow-hidden">
          <SafeImage
            src={img}
            alt={car.title}
            fill
            sizes="(max-width:768px) 100vw, 33vw"
            className="object-cover group-hover:scale-[1.02] transition-transform"
          />
          <div className="absolute top-2 left-2">
            <Badge variant={sold ? "secondary" : "default"}>
              {sold ? t("status.sold") : t("status.available")}
            </Badge>
          </div>
        </div>
        <div className="p-4 space-y-2">
          <span className="text-xs uppercase tracking-wide text-ink-muted">
            {car.brand} · {car.year}
            {car.country ? <> · {car.country}</> : null}
          </span>
          <h3 className="font-medium text-ink line-clamp-1">{car.title}</h3>
          <div className="flex items-baseline justify-between pt-1">
            <span className="text-xs text-ink-muted">{t("car.price")}</span>
            <span className="text-lg font-semibold text-ink">{formatPrice(car.price)}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}

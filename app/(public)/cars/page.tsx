import { Suspense } from "react";
import { dbConnect } from "@/lib/db";
import Car from "@/models/Car";
import CarCard from "@/components/cars/CarCard";
import CarFilters from "@/components/cars/CarFilters";
import { getServerT } from "@/lib/i18n-server";

export const dynamic = "force-dynamic";

type SP = { q?: string; brand?: string; country?: string; year?: string; maxPrice?: string };

export default async function CarsPage({ searchParams }: { searchParams: SP }) {
  const { t } = getServerT();
  await dbConnect();

  const filter: Record<string, any> = { status: { $ne: "hidden" } };
  if (searchParams.brand) filter.brand = new RegExp(`^${searchParams.brand}$`, "i");
  if (searchParams.country) filter.country = new RegExp(`^${searchParams.country}$`, "i");
  if (searchParams.year) filter.year = Number(searchParams.year);
  if (searchParams.q) {
    filter.$or = [
      { title: new RegExp(searchParams.q, "i") },
      { brand: new RegExp(searchParams.q, "i") },
      { carModel: new RegExp(searchParams.q, "i") },
    ];
  }
  const max = Number(searchParams.maxPrice) || 0;
  if (max) filter.price = { $lte: max };

  const [cars, brands, countriesRaw] = await Promise.all([
    Car.find(filter).sort({ createdAt: -1 }).limit(48).lean(),
    Car.distinct("brand"),
    Car.distinct("country"),
  ]);
  const countries = (countriesRaw as string[]).filter((c) => !!c);

  return (
    <div className="mx-auto max-w-6xl px-4 pt-28 pb-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-ink">{t("cars.title")}</h1>
        <p className="text-sm text-ink-muted">{t("cars.subtitle")}</p>
      </div>
      <div className="mb-6">
        <Suspense fallback={null}>
          <CarFilters brands={brands as string[]} countries={countries} />
        </Suspense>
      </div>
      {cars.length === 0 ? (
        <div className="card p-10 text-center text-ink-muted">{t("cars.noMatch")}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cars.map((c: any) => (
            <CarCard
              key={String(c._id)}
              car={{
                _id: String(c._id),
                title: c.title,
                brand: c.brand,
                carModel: c.carModel,
                year: c.year,
                images: c.images ?? [],
                price: c.price,
                status: c.status,
                country: c.country ?? "",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

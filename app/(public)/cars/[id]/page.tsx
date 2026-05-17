import { notFound } from "next/navigation";
import mongoose from "mongoose";
import { dbConnect } from "@/lib/db";
import Car from "@/models/Car";
import SafeImage from "@/components/ui/safe-image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import AddToCartButton from "@/components/cars/AddToCartButton";
import { getServerT } from "@/lib/i18n-server";

export const dynamic = "force-dynamic";

export default async function CarDetailPage({ params }: { params: { id: string } }) {
  if (!mongoose.isValidObjectId(params.id)) notFound();
  await dbConnect();
  const car = await Car.findById(params.id).lean();
  if (!car) notFound();
  const c: any = car;
  const { t } = getServerT();

  const statusLabel =
    c.status === "available" ? t("status.available") :
    c.status === "sold" ? t("status.sold") : t("status.hidden");

  return (
    <div className="mx-auto max-w-6xl px-4 pt-28 pb-8 grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-4">
        <Card className="overflow-hidden">
          <div className="relative aspect-[16/9] bg-surface">
            <SafeImage
              src={c.images?.[0] ?? `https://picsum.photos/seed/${c._id}/1200/700`}
              alt={c.title}
              fill
              sizes="(max-width:1024px) 100vw, 66vw"
              className="object-cover"
              priority
            />
          </div>
          {c.images?.length > 1 && (
            <div className="p-3 grid grid-cols-4 gap-2">
              {c.images.slice(1, 5).map((u: string, i: number) => (
                <div key={i} className="relative aspect-[4/3] rounded-lg overflow-hidden border border-border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={u} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-ink-muted">
              <span>{c.brand}</span>
              <span>·</span>
              <span>{c.carModel}</span>
              <span>·</span>
              <span>{c.year}</span>
            </div>
            <h1 className="text-2xl font-semibold text-ink mt-1">{c.title}</h1>
            <div className="flex flex-wrap gap-2 mt-3 text-xs">
              {c.mileage ? <Badge variant="secondary">{c.mileage.toLocaleString()} km</Badge> : null}
              {c.transmission ? <Badge variant="secondary">{c.transmission}</Badge> : null}
              {c.fuel ? <Badge variant="secondary">{c.fuel}</Badge> : null}
              {c.color ? <Badge variant="secondary">{c.color}</Badge> : null}
              {c.country ? <Badge variant="secondary">{c.country}</Badge> : null}
            </div>
            <p className="text-ink-soft mt-4 whitespace-pre-line">{c.description || t("car.noDescription")}</p>
          </CardContent>
        </Card>
      </div>

      <aside className="space-y-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-xs uppercase tracking-wide text-ink-muted">{t("car.price")}</div>
            <div className="mt-1 text-3xl font-semibold text-ink">{formatPrice(c.price)}</div>
            <div className="mt-1 text-xs text-ink-muted">{statusLabel}</div>
            <div className="mt-4 border-t border-border pt-4">
              <AddToCartButton
                car={{
                  _id: String(c._id),
                  title: c.title,
                  brand: c.brand,
                  images: c.images ?? [],
                  price: c.price,
                  status: c.status,
                }}
              />
            </div>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}

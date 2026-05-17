"use client";
import Link from "next/link";
import { Trash2, ShoppingCart, ArrowRight } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SafeImage from "@/components/ui/safe-image";
import { formatPrice } from "@/lib/utils";
import { useLanguage } from "@/components/i18n/LanguageProvider";

export default function CartPage() {
  const { items, total, remove, setQty } = useCart();
  const { t } = useLanguage();

  return (
    <div className="mx-auto max-w-5xl px-4 pt-28 pb-12">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-ink">{t("cart.title")}</h1>
        <p className="text-sm text-ink-muted">{t("cart.subtitle")}</p>
      </div>

      {items.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <ShoppingCart className="h-10 w-10 mx-auto text-ink-muted mb-3" />
            <p className="text-ink-muted mb-4">{t("cart.empty")}</p>
            <Button asChild>
              <Link href="/cars">{t("cart.browseCars")}</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid lg:grid-cols-[1fr_320px] gap-6">
          <div className="space-y-3">
            {items.map((it) => (
              <Card key={it.carId}>
                <CardContent className="py-4 flex gap-4 items-center">
                  <div className="relative h-20 w-28 shrink-0 rounded-lg overflow-hidden bg-surface">
                    <SafeImage
                      src={it.image || `https://picsum.photos/seed/${it.carId}/300/200`}
                      alt={it.title}
                      fill
                      sizes="120px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/cars/${it.carId}`} className="font-medium text-ink hover:text-accent block truncate">
                      {it.title}
                    </Link>
                    <div className="text-xs text-ink-muted">{it.brand}</div>
                    <div className="mt-2 flex items-center gap-2">
                      <label className="text-xs text-ink-muted">{t("cart.qty")}</label>
                      <input
                        type="number"
                        min={1}
                        value={it.quantity}
                        onChange={(e) => setQty(it.carId, Number(e.target.value) || 1)}
                        className="h-8 w-16 rounded-md border border-border px-2 text-sm"
                      />
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-ink">{formatPrice(it.price * it.quantity)}</div>
                    <button
                      onClick={() => remove(it.carId)}
                      className="mt-2 inline-flex items-center gap-1 text-xs text-ink-muted hover:text-destructive transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      {t("cart.remove")}
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="h-fit sticky top-24">
            <CardContent className="pt-6 space-y-3">
              <div className="flex justify-between text-sm text-ink-soft">
                <span>{t("cart.items")}</span>
                <span>{items.reduce((s, i) => s + i.quantity, 0)}</span>
              </div>
              <div className="flex justify-between text-base font-semibold pt-3 border-t border-border">
                <span>{t("cart.total")}</span>
                <span>{formatPrice(total)}</span>
              </div>
              <Button asChild className="w-full mt-3">
                <Link href="/checkout">
                  {t("cart.checkout")} <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

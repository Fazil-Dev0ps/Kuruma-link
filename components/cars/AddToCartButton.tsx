"use client";
import { toast } from "sonner";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart/CartProvider";
import { useLanguage } from "@/components/i18n/LanguageProvider";

type Props = {
  car: {
    _id: string;
    title: string;
    brand: string;
    images: string[];
    price: number;
    status: string;
  };
};

export default function AddToCartButton({ car }: Props) {
  const { add } = useCart();
  const { t } = useLanguage();

  if (car.status !== "available") {
    return <Button disabled className="w-full">{t("cart.notAvailable")}</Button>;
  }

  function onAdd() {
    add({
      carId: car._id,
      title: car.title,
      brand: car.brand,
      image: car.images?.[0] ?? "",
      price: car.price,
    });
    toast.success(t("toast.addedToCart"));
  }

  return (
    <Button onClick={onAdd} className="w-full">
      <ShoppingCart className="h-4 w-4" /> {t("cart.add")}
    </Button>
  );
}

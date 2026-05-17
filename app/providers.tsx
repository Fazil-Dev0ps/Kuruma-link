"use client";
import { SessionProvider } from "next-auth/react";
import { SWRConfig } from "swr";
import { Toaster } from "sonner";
import { fetcher } from "@/lib/fetcher";
import { CartProvider } from "@/components/cart/CartProvider";
import { LanguageProvider } from "@/components/i18n/LanguageProvider";
import type { Lang } from "@/lib/i18n";

export default function Providers({
  children,
  initialLang,
}: {
  children: React.ReactNode;
  initialLang?: Lang;
}) {
  return (
    <SessionProvider>
      <SWRConfig value={{ fetcher, revalidateOnFocus: false }}>
        <LanguageProvider initialLang={initialLang}>
          <CartProvider>
            {children}
            <Toaster richColors position="top-right" />
          </CartProvider>
        </LanguageProvider>
      </SWRConfig>
    </SessionProvider>
  );
}

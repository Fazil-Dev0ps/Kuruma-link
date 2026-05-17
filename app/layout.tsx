import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import { getServerLang } from "@/lib/i18n-server";

export const metadata: Metadata = {
  title: "クルマリンク — Car Store",
  description: "Premium cars at transparent prices.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const lang = getServerLang();
  return (
    <html lang={lang}>
      <body className="min-h-screen font-sans antialiased bg-surface text-ink">
        <Providers initialLang={lang}>{children}</Providers>
      </body>
    </html>
  );
}

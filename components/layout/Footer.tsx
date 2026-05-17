import Link from "next/link";
import Image from "next/image";
import { getServerT } from "@/lib/i18n-server";

export default function Footer() {
  const { t } = getServerT();
  return (
    <footer className="bg-ink text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/logo.png"
                alt="クルマリンク"
                width={320}
                height={110}
                className="h-24 w-auto object-contain"
              />
            </Link>
            <p className="text-sm text-white/60 leading-relaxed">
              {t("footer.tagline")}
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-white/80">
              {t("footer.quickLinks")}
            </h4>
            <ul className="space-y-3">
              <li><Link href="/" className="text-sm text-white/60 hover:text-accent transition-colors">{t("nav.home")}</Link></li>
              <li><Link href="/cars" className="text-sm text-white/60 hover:text-accent transition-colors">{t("nav.cars")}</Link></li>
              <li><Link href="/cart" className="text-sm text-white/60 hover:text-accent transition-colors">{t("nav.cart")}</Link></li>
              <li><Link href="/contact" className="text-sm text-white/60 hover:text-accent transition-colors">{t("nav.contact")}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-white/80">
              {t("footer.account")}
            </h4>
            <ul className="space-y-3">
              <li><Link href="/login" className="text-sm text-white/60 hover:text-accent transition-colors">{t("nav.login")}</Link></li>
              <li><Link href="/register" className="text-sm text-white/60 hover:text-accent transition-colors">{t("nav.signup")}</Link></li>
              <li><Link href="/dashboard" className="text-sm text-white/60 hover:text-accent transition-colors">{t("footer.allOrdersLink")}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-white/80">
              {t("footer.contact")}
            </h4>
            <ul className="space-y-3 text-sm text-white/60">
              <li>info@kurumalink.com</li>
              <li>{t("footer.contactSupport")}</li>
              <li>{t("footer.contactHours")}</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-sm text-white/40">
            &copy; {new Date().getFullYear()} クルマリンク. {t("footer.rights")}
          </span>
          <span className="text-sm text-white/40">{t("footer.premiumStore")}</span>
        </div>
      </div>
    </footer>
  );
}

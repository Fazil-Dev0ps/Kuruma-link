"use client";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LayoutDashboard, Settings, LogOut, Menu, X, Mail, Headphones, ShoppingCart } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import LangSwitcher from "@/components/i18n/LangSwitcher";

export default function Navbar() {
  const { data: session } = useSession();
  const user = session?.user;
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { count } = useCart();
  const { t } = useLanguage();

  const navLinks = [
    { key: "nav.home" as const, href: "/" },
    { key: "nav.cars" as const, href: "/cars" },
    { key: "nav.contact" as const, href: "/contact" },
  ];

  useEffect(() => {
    if (!isHome) return;
    const handleScroll = () => setScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  const solid = !isHome || scrolled;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        solid
          ? "bg-white/95 backdrop-blur-md shadow-card border-b border-line"
          : "bg-transparent"
      }`}
    >
      <div
        className={`transition-all duration-300 ${
          solid ? "bg-ink border-b border-white/10" : "bg-black/40 backdrop-blur-sm border-b border-white/10"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between">
          <div className="flex items-center gap-6 text-white/70 text-sm">
            <span className="hidden md:inline-flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5" />
              info@kurumalink.com
            </span>
            <span className="hidden md:inline-flex items-center gap-1.5">
              <Headphones className="h-3.5 w-3.5" />
              {t("nav.customerSupport")}
            </span>
          </div>
          <div className="flex items-center gap-4 text-white/70 text-sm">
            <Link href="/cars" className="hover:text-white transition-colors">
              {t("nav.browseCars")}
            </Link>
            <Link href="/contact" className="hover:text-white transition-colors">
              {t("nav.contact")}
            </Link>
            <LangSwitcher tone="light" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center group">
          <Image
            src="/logo.png"
            alt="クルマリンク"
            width={220}
            height={80}
            priority
            className="h-20 w-auto object-contain transition-transform group-hover:scale-105"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((item) => {
            const isActive =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.key}
                href={item.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  solid
                    ? isActive
                      ? "text-accent bg-accent-soft"
                      : "text-ink hover:bg-surface"
                    : isActive
                      ? "text-white bg-white/15"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                {t(item.key)}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/cart"
            className={`relative inline-flex items-center justify-center h-9 w-9 rounded-lg transition-colors ${
              solid ? "hover:bg-surface text-ink" : "hover:bg-white/10 text-white"
            }`}
            aria-label={t("nav.cart")}
          >
            <ShoppingCart className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 h-5 min-w-[20px] px-1 rounded-full bg-accent text-white text-[10px] font-bold flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className={`flex items-center gap-2 rounded-lg px-2 py-1 transition-colors ${solid ? "hover:bg-surface" : "hover:bg-white/10"}`}>
                  <Avatar className="h-8 w-8 border-2 border-accent">
                    <AvatarFallback className="bg-accent text-white text-xs font-bold">
                      {(user.name ?? "U").slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">
                    <LayoutDashboard className="h-4 w-4" /> {t("nav.dashboard")}
                  </Link>
                </DropdownMenuItem>
                {user.role === "admin" && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin">
                      <Settings className="h-4 w-4" /> {t("nav.adminPanel")}
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => signOut({ callbackUrl: "/" })}>
                  <LogOut className="h-4 w-4" /> {t("nav.signOut")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                asChild
                className={solid ? "" : "border-white/30 text-white bg-transparent hover:bg-white/10"}
              >
                <Link href="/login">{t("nav.login")}</Link>
              </Button>
              <Button size="sm" asChild className="bg-accent hover:bg-accent-hover text-white">
                <Link href="/register">{t("nav.signup")}</Link>
              </Button>
            </>
          )}

          <button className="md:hidden ml-2" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? (
              <X className={`h-6 w-6 ${solid ? "text-ink" : "text-white"}`} />
            ) : (
              <Menu className={`h-6 w-6 ${solid ? "text-ink" : "text-white"}`} />
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-line shadow-lift-lg animate-fade-up">
          <div className="px-6 py-4 space-y-2">
            {navLinks.map((item) => {
              const isActive =
                item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? "text-accent bg-accent-soft" : "text-ink hover:bg-surface"
                  }`}
                >
                  {t(item.key)}
                </Link>
              );
            })}
            <div className="pt-2 border-t border-line flex items-center justify-between">
              <span className="text-xs text-ink-muted">{t("lang.label")}</span>
              <LangSwitcher />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

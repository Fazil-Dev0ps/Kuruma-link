import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import PanelShell from "@/components/panel/PanelShell";
import type { NavItem } from "@/components/panel/Sidebar";
import { getServerT } from "@/lib/i18n-server";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/admin");
  if (session.user.role !== "admin") redirect("/");
  const { t } = getServerT();

  const items: NavItem[] = [
    { href: "/admin", label: t("admin.nav.overview"), icon: "dashboard" },
    { href: "/admin/cars", label: t("admin.nav.cars"), icon: "car" },
    { href: "/admin/brands", label: t("admin.nav.brands"), icon: "tag" },
    { href: "/admin/orders", label: t("admin.nav.orders"), icon: "orders" },
    { href: "/admin/users", label: t("admin.nav.users"), icon: "users" },
  ];

  return (
    <PanelShell title="クルマリンク" subtitle={t("admin.shellTitle")} items={items} breadcrumb={t("admin.overview")}>
      {children}
    </PanelShell>
  );
}

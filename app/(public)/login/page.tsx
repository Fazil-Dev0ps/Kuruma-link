import LoginForm from "@/components/auth/LoginForm";
import { getServerT } from "@/lib/i18n-server";

export default function LoginPage({ searchParams }: { searchParams: { callbackUrl?: string } }) {
  const { t } = getServerT();
  return (
    <div className="mx-auto max-w-md px-4 pt-28 pb-12">
      <h1 className="text-2xl font-semibold text-ink mb-6">{t("auth.login.title")}</h1>
      <LoginForm callbackUrl={searchParams.callbackUrl ?? "/"} />
    </div>
  );
}

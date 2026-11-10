import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { LoginForm } from "../../../features/auth/login-form";
import { safeNextPath } from "../../../features/auth/next-path";
import { getSession } from "../../../features/auth/server";
import { redirect } from "../../../i18n/navigation";
import { routing } from "../../../i18n/routing";

// Per-visitor page (it checks the sign-in cookie): never prerender it.
export const dynamic = "force-dynamic";

interface LoginPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ next?: string | string[] }>;
}

export default async function LoginPage({ params, searchParams }: LoginPageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const { next } = await searchParams;
  const target = safeNextPath(typeof next === "string" ? next : undefined);

  // Someone who is already signed in has nothing to do here. If the API cannot be asked, show the form anyway.
  const session = await getSession().catch(() => null);
  if (session) redirect({ href: target, locale });

  const t = await getTranslations("login");

  return (
    <main id="main" className="mx-auto w-full max-w-md space-y-6 p-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-primary">{t("title")}</h1>
        <p className="text-muted-foreground">{t("subtitle")}</p>
      </header>
      <LoginForm next={target} />
    </main>
  );
}

import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { requireSession } from "../../../features/auth/server";
import { SignOutButton } from "../../../features/auth/sign-out-button";
import { routing } from "../../../i18n/routing";

/** Needs a sign-in: without one, the guard sends the visitor to the login page and back here afterwards. */
export default async function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const session = await requireSession(locale, "/dashboard");
  const t = await getTranslations("dashboard");

  return (
    <main id="main" className="mx-auto w-full max-w-3xl space-y-4 p-6">
      <h1 className="text-2xl font-semibold text-primary">{t("title")}</h1>
      <p className="text-muted-foreground">
        {t("welcome", { name: session.user.displayName ?? session.user.mobile })}
      </p>
      <SignOutButton />
    </main>
  );
}

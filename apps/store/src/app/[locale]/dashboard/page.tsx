import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AccountRows } from "../../../components/account/account-links";
import { ProfileCard } from "../../../components/account/profile-card";
import { requireSession } from "../../../features/auth/server";
import { SignOutButton } from "../../../features/auth/sign-out-button";
import { routing } from "../../../i18n/routing";

/** On phones this is the account screen: profile, the options as rows, sign out. On desktop the layout has them. */
export default async function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const session = await requireSession(locale, "/dashboard");
  const t = await getTranslations("dashboard");

  return (
    <main id="main" className="space-y-6">
      <h1 className="text-2xl font-semibold text-primary">{t("title")}</h1>
      <p className="text-muted-foreground">
        {t("welcome", { name: session.user.displayName ?? session.user.mobile })}
      </p>
      <div className="space-y-6 md:hidden">
        <ProfileCard user={session.user} />
        <AccountRows />
        <SignOutButton className="w-full" />
      </div>
    </main>
  );
}

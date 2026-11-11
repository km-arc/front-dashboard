import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";
import { AccountSidebar } from "../../../components/account/account-links";
import { ProfileCard } from "../../../components/account/profile-card";
import { requireSession } from "../../../features/auth/server";
import { SignOutButton } from "../../../features/auth/sign-out-button";
import { routing } from "../../../i18n/routing";

// Everything under /dashboard depends on the visitor's sign-in: never prerender it at build time.
export const dynamic = "force-dynamic";

/**
 * The signed-in area. One guard for every page below it. On desktop the options sit in a sidebar; on phones each
 * page shows its own content and the overview doubles as the account screen.
 */
export default async function DashboardLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const session = await requireSession(locale, "/dashboard");

  return (
    <div className="mx-auto w-full max-w-5xl p-4 md:grid md:grid-cols-[16rem_minmax(0,1fr)] md:gap-8 md:p-6">
      <aside className="hidden space-y-4 md:block">
        <ProfileCard user={session.user} />
        <AccountSidebar />
        <SignOutButton className="w-full" />
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

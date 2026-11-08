import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";
import { getHtmlAttributes } from "@front-dashboard/ui/locales";
import { BRAND_STYLE_ID, getBrandSsr, getThemeInitScript } from "@front-dashboard/ui/theme-ssr";
import { Providers } from "../../components/providers";
import { BottomNav } from "../../components/shell/bottom-nav";
import { SiteFooter } from "../../components/shell/site-footer";
import { SiteHeader } from "../../components/shell/site-header";
import { SkipLink } from "../../components/shell/skip-link";
import { env } from "../../env";
import { APP_COLORS } from "../../lib/manifest";
import { routing } from "../../i18n/routing";
import "@fontsource-variable/inter";
import "@fontsource-variable/vazirmatn";
import "../globals.css";

interface LocaleLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

// `cover` lets the page extend under the notch and home indicator; the shell pads itself with safe-area insets.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  // Colors the browser or installed-app status bar; follows the system theme, not the in-app toggle.
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: APP_COLORS.backgroundLight },
    { media: "(prefers-color-scheme: dark)", color: APP_COLORS.backgroundDark },
  ],
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: Pick<LocaleLayoutProps, "params">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "app" });
  return {
    title: { default: t("name"), template: `%s · ${t("name")}` },
    description: t("description"),
    manifest: `/${locale}/manifest.webmanifest`,
    icons: {
      icon: [
        { url: "/icons/icon.svg", type: "image/svg+xml" },
        { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      ],
      apple: "/icons/apple-touch-icon.png",
    },
    appleWebApp: { capable: true, title: t("name"), statusBarStyle: "default" },
    formatDetection: { telephone: false },
  };
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const messages = await getMessages();
  // Step 2.1d replaces `null` with the brand fetched from the backend.
  const brand = null;
  const brandSsr = getBrandSsr(brand);

  return (
    <html {...getHtmlAttributes(locale)} {...brandSsr.attributes} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: getThemeInitScript() }} />
        {brandSsr.css ? (
          <style id={BRAND_STYLE_ID} dangerouslySetInnerHTML={{ __html: brandSsr.css }} />
        ) : null}
      </head>
      <body className="flex min-h-dvh flex-col bg-background pb-[calc(3.5rem+env(safe-area-inset-bottom))] text-foreground md:pb-0">
        <NextIntlClientProvider messages={messages}>
          <Providers locale={locale} timeZone={env.timeZone} brand={brand}>
            <SkipLink />
            <SiteHeader />
            <div className="flex-1">{children}</div>
            <SiteFooter />
            <BottomNav />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

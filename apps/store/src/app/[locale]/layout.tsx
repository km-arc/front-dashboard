import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";
import { getHtmlAttributes } from "@front-dashboard/ui/locales";
import { BRAND_STYLE_ID, getBrandSsr, getThemeInitScript } from "@front-dashboard/ui/theme-ssr";
import { Providers } from "../../components/providers";
import { env } from "../../env";
import { routing } from "../../i18n/routing";
import "@fontsource-variable/inter";
import "@fontsource-variable/vazirmatn";
import "../globals.css";

interface LocaleLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

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
      <body>
        <NextIntlClientProvider messages={messages}>
          <Providers locale={locale} timeZone={env.timeZone} brand={brand}>
            {children}
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

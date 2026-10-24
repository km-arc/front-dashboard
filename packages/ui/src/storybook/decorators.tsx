import type { Decorator, Preview } from "@storybook/react-vite";
import { useEffect, type ReactNode } from "react";
import { LocaleProvider } from "../i18n/locale-provider";
import { LOCALES, getDirection, getHtmlAttributes, type Locale } from "../i18n/locales";
import { UiProvider } from "../provider/ui-provider";
import { BrandProvider } from "../theme/brand-provider";
import { THEME_MODES, type ThemeMode } from "../theme/mode";
import { ThemeProvider } from "../theme/theme-provider";
import { BRAND_OPTIONS, getStoryBrand } from "./brands";

/** Toolbar controls: color mode, brand and locale (the locale also decides the direction). */
export const globalTypes: NonNullable<Preview["globalTypes"]> = {
  mode: {
    description: "Color mode",
    toolbar: {
      title: "Mode",
      icon: "mirror",
      dynamicTitle: true,
      items: THEME_MODES.map((value) => ({ value, title: value })),
    },
  },
  brand: {
    description: "Runtime brand",
    toolbar: {
      title: "Brand",
      icon: "paintbrush",
      dynamicTitle: true,
      items: BRAND_OPTIONS.map((value) => ({ value, title: value })),
    },
  },
  locale: {
    description: "Locale (sets text direction)",
    toolbar: {
      title: "Locale",
      icon: "globe",
      dynamicTitle: true,
      items: LOCALES.map((value) => ({ value, title: `${value} (${getDirection(value)})` })),
    },
  },
};

export const initialGlobals = { mode: "light", brand: "default", locale: "en" };

/** Mirrors what an app does: `<html lang dir>` comes from the active locale. */
function HtmlAttributes({ locale, children }: { locale: Locale; children: ReactNode }) {
  useEffect(() => {
    const { lang, dir } = getHtmlAttributes(locale);
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [locale]);
  return <>{children}</>;
}

/** Wraps every story in the real providers, driven by the toolbar. */
export const withProviders: Decorator = (Story, context) => {
  const mode = (context.globals.mode ?? initialGlobals.mode) as ThemeMode;
  const locale = (context.globals.locale ?? initialGlobals.locale) as Locale;
  const brand = getStoryBrand(String(context.globals.brand ?? initialGlobals.brand));
  return (
    // key + per-mode storage key: the provider re-reads its mode when the toolbar changes.
    <ThemeProvider key={mode} defaultMode={mode} storageKey={`sb-theme-${mode}`}>
      <BrandProvider brand={brand}>
        <LocaleProvider locale={locale}>
          <HtmlAttributes locale={locale}>
            <UiProvider dir={getDirection(locale)}>
              <Story />
            </UiProvider>
          </HtmlAttributes>
        </LocaleProvider>
      </BrandProvider>
    </ThemeProvider>
  );
};

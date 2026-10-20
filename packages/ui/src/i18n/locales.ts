export const LOCALES = ["en", "fa"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export type Direction = "ltr" | "rtl";
export type CalendarSystem = "gregory" | "persian";
export type NumberingSystem = "latn" | "arabext";

export interface LocaleInfo {
  locale: Locale;
  dir: Direction;
  /** Base BCP 47 tag handed to Intl. */
  intlLocale: string;
  /** Default calendar for dates shown to users of this locale. */
  calendar: CalendarSystem;
  /** Default digits: Persian digits for fa, Latin for en. */
  numberingSystem: NumberingSystem;
  /** Name of the language in itself (for language switchers). */
  nativeName: string;
}

export const LOCALE_INFO: Readonly<Record<Locale, LocaleInfo>> = {
  en: {
    locale: "en",
    dir: "ltr",
    intlLocale: "en-US",
    calendar: "gregory",
    numberingSystem: "latn",
    nativeName: "English",
  },
  fa: {
    locale: "fa",
    dir: "rtl",
    intlLocale: "fa-IR",
    calendar: "persian",
    numberingSystem: "arabext",
    nativeName: "فارسی",
  },
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

export function getDirection(locale: Locale): Direction {
  return LOCALE_INFO[locale].dir;
}

export function isRtl(locale: Locale): boolean {
  return getDirection(locale) === "rtl";
}

/**
 * Maps any user/browser/URL value ("fa-IR", "EN-gb", "fa_IR") to a supported locale,
 * falling back to `fallback` for anything unsupported.
 */
export function resolveLocale(input: string | null | undefined, fallback: Locale = DEFAULT_LOCALE) {
  const primary = input?.trim().toLowerCase().split(/[-_]/)[0];
  return isLocale(primary) ? primary : fallback;
}

/** Attributes for the root <html> element. */
export function getHtmlAttributes(locale: Locale): { lang: Locale; dir: Direction } {
  return { lang: locale, dir: getDirection(locale) };
}

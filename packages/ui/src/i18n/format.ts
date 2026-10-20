import { LOCALE_INFO, type CalendarSystem, type Locale, type NumberingSystem } from "./locales";

export type DateInput = Date | number | string;
export type DateStyle = "short" | "medium" | "long" | "full";

export interface FormatterOptions {
  /** Defaults to the locale's calendar (persian for fa, gregory for en). */
  calendar?: CalendarSystem;
  /** Defaults to the locale's digits (Persian digits for fa). */
  numberingSystem?: NumberingSystem;
  /** IANA zone, e.g. "Asia/Tehran". Defaults to the runtime's zone. */
  timeZone?: string;
}

export interface CalendarDate {
  year: number;
  /** 1-based month in the given calendar. */
  month: number;
  day: number;
}

/** "IRT" is not an ISO code: it denotes Toman (1 Toman = 10 Rial) and is handled by the formatter. */
export const TOMAN = "IRT";
const TOMAN_LABEL: Readonly<Record<Locale, string>> = { en: "Toman", fa: "تومان" };

export interface Formatters {
  readonly locale: Locale;
  number(value: number, options?: Intl.NumberFormatOptions): string;
  compact(value: number): string;
  percent(fraction: number, fractionDigits?: number): string;
  /** `currency`: ISO 4217 code, or "IRT" for Toman. */
  money(amount: number, currency: string, options?: Intl.NumberFormatOptions): string;
  /** Returns "" for invalid input instead of throwing, so a bad API value cannot crash a page. */
  date(value: DateInput, style?: DateStyle): string;
  dateTime(value: DateInput, style?: DateStyle): string;
  time(value: DateInput): string;
  relativeTime(value: DateInput, now?: DateInput): string;
  list(items: readonly string[], type?: "conjunction" | "disjunction"): string;
}

export function toDate(input: DateInput): Date | null {
  const date = input instanceof Date ? input : new Date(input);
  return Number.isNaN(date.getTime()) ? null : date;
}

const cache = new Map<string, unknown>();

function memo<T>(key: string, create: () => T): T {
  let hit = cache.get(key) as T | undefined;
  if (hit === undefined) {
    hit = create();
    cache.set(key, hit);
  }
  return hit;
}

function tagFor(locale: Locale, calendar: CalendarSystem, numbering: NumberingSystem): string {
  return `${LOCALE_INFO[locale].intlLocale}-u-ca-${calendar}-nu-${numbering}`;
}

const RELATIVE_UNITS: ReadonlyArray<readonly [Intl.RelativeTimeFormatUnit, number]> = [
  ["year", 365 * 86_400],
  ["month", 30 * 86_400],
  ["week", 7 * 86_400],
  ["day", 86_400],
  ["hour", 3_600],
  ["minute", 60],
  ["second", 1],
];

export function createFormatters(locale: Locale, options: FormatterOptions = {}): Formatters {
  const info = LOCALE_INFO[locale];
  const calendar = options.calendar ?? info.calendar;
  const numbering = options.numberingSystem ?? info.numberingSystem;
  const timeZone = options.timeZone;
  const tag = tagFor(locale, calendar, numbering);

  const numberFormat = (opts?: Intl.NumberFormatOptions) =>
    memo(`n|${tag}|${JSON.stringify(opts ?? {})}`, () => new Intl.NumberFormat(tag, opts));

  const dateFormat = (opts: Intl.DateTimeFormatOptions) =>
    memo(
      `d|${tag}|${timeZone ?? ""}|${JSON.stringify(opts)}`,
      () => new Intl.DateTimeFormat(tag, { ...opts, ...(timeZone ? { timeZone } : {}) }),
    );

  const withDate = (value: DateInput, opts: Intl.DateTimeFormatOptions): string => {
    const date = toDate(value);
    return date ? dateFormat(opts).format(date) : "";
  };

  const number: Formatters["number"] = (value, opts) => numberFormat(opts).format(value);

  return {
    locale,
    number,
    compact: (value) => numberFormat({ notation: "compact" }).format(value),
    percent: (fraction, fractionDigits = 0) =>
      numberFormat({
        style: "percent",
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits,
      }).format(fraction),
    money: (amount, currency, opts) => {
      if (currency === TOMAN) {
        return `${number(amount, { maximumFractionDigits: 0, ...opts })} ${TOMAN_LABEL[locale]}`;
      }
      return numberFormat({ style: "currency", currency, ...opts }).format(amount);
    },
    date: (value, style = "medium") => withDate(value, { dateStyle: style }),
    dateTime: (value, style = "medium") =>
      withDate(value, { dateStyle: style, timeStyle: "short" }),
    time: (value) => withDate(value, { timeStyle: "short" }),
    relativeTime: (value, now = new Date()) => {
      const target = toDate(value);
      const base = toDate(now);
      if (!target || !base) return "";
      const rtf = memo(
        `r|${tag}`,
        () => new Intl.RelativeTimeFormat(tag, { numeric: "auto", style: "long" }),
      );
      const diff = Math.round((target.getTime() - base.getTime()) / 1000);
      const abs = Math.abs(diff);
      const [unit, seconds] = RELATIVE_UNITS.find(([, s]) => abs >= s) ?? (["second", 1] as const);
      return rtf.format(Math.round(diff / seconds), unit);
    },
    list: (items, type = "conjunction") =>
      memo(`l|${tag}|${type}`, () => new Intl.ListFormat(tag, { type })).format(items),
  };
}

/**
 * Year/month/day of a date in a given calendar (e.g. Jalali), as plain numbers.
 * Building block for calendar widgets and date pickers. Returns null for invalid input.
 */
export function getCalendarDate(
  value: DateInput,
  calendar: CalendarSystem = "gregory",
  timeZone = "UTC",
): CalendarDate | null {
  const date = toDate(value);
  if (!date) return null;
  const parts = memo(
    `c|${calendar}|${timeZone}`,
    () =>
      new Intl.DateTimeFormat(`en-US-u-ca-${calendar}-nu-latn`, {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        timeZone,
      }),
  ).formatToParts(date);
  const pick = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  return { year: pick("year"), month: pick("month"), day: pick("day") };
}

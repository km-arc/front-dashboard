import { describe, expect, it } from "vitest";
import { createFormatters, getCalendarDate } from "./format";

// Fixed instant: 2026-10-20 12:00 UTC = 28 Mehr 1405 (Jalali).
const D = new Date("2026-10-20T12:00:00Z");
const en = createFormatters("en", { timeZone: "UTC" });
const fa = createFormatters("fa", { timeZone: "UTC" });

describe("numbers", () => {
  it("uses Latin digits for en and Persian digits for fa", () => {
    expect(en.number(1234567.5)).toBe("1,234,567.5");
    expect(fa.number(1234567.5)).toBe("۱٬۲۳۴٬۵۶۷٫۵");
  });

  it("lets apps force Latin digits in fa", () => {
    const latin = createFormatters("fa", { numberingSystem: "latn" });
    expect(latin.number(1234)).toContain("1");
    expect(latin.number(1234)).not.toContain("۱");
  });

  it("formats percent", () => {
    expect(en.percent(0.256)).toBe("26%");
    expect(fa.percent(0.256)).toContain("۲۶");
    expect(en.percent(0.256, 1)).toBe("25.6%");
  });

  it("formats compact numbers", () => {
    expect(en.compact(1_200_000)).toBe("1.2M");
  });
});

describe("money", () => {
  it("formats ISO currencies", () => {
    expect(en.money(1234.5, "USD")).toBe("$1,234.50");
    expect(fa.money(1200000, "IRR", { maximumFractionDigits: 0 })).toContain("۱٬۲۰۰٬۰۰۰");
  });

  it("formats Toman as a pseudo-currency", () => {
    expect(en.money(1200000, "IRT")).toBe("1,200,000 Toman");
    expect(fa.money(1200000, "IRT")).toBe("۱٬۲۰۰٬۰۰۰ تومان");
  });
});

describe("dates", () => {
  it("uses the Jalali calendar by default for fa", () => {
    expect(fa.date(D, "long")).toBe("۲۸ مهر ۱۴۰۵");
  });

  it("uses Gregorian for en and allows overriding the calendar", () => {
    expect(en.date(D, "long")).toBe("October 20, 2026");
    const faGregorian = createFormatters("fa", { calendar: "gregory", timeZone: "UTC" });
    expect(faGregorian.date(D, "long")).toContain("۲۰۲۶");
  });

  it("respects the time zone", () => {
    const late = new Date("2026-10-20T22:00:00Z");
    const tehran = createFormatters("en", { timeZone: "Asia/Tehran" });
    expect(tehran.date(late, "long")).toBe("October 21, 2026");
    expect(en.date(late, "long")).toBe("October 20, 2026");
  });

  it("accepts ISO strings and timestamps, returns '' for invalid input", () => {
    expect(en.date("2026-10-20T12:00:00Z", "long")).toBe("October 20, 2026");
    expect(en.date(D.getTime(), "long")).toBe("October 20, 2026");
    expect(en.date("not a date")).toBe("");
    expect(en.dateTime(Number.NaN)).toBe("");
    expect(en.time("")).toBe("");
  });

  it("formats date-time and time", () => {
    expect(en.time(D)).toBe("12:00 PM");
    expect(en.dateTime(D, "long")).toContain("October 20, 2026");
  });
});

describe("relativeTime", () => {
  const now = new Date("2026-10-20T12:00:00Z");
  const ago = (ms: number) => new Date(now.getTime() - ms);
  const DAY = 86_400_000;

  it("picks a sensible unit", () => {
    expect(en.relativeTime(ago(2 * DAY), now)).toBe("2 days ago");
    expect(en.relativeTime(ago(DAY), now)).toBe("yesterday");
    expect(en.relativeTime(ago(5 * 60_000), now)).toBe("5 minutes ago");
    expect(en.relativeTime(new Date(now.getTime() + 3 * 3_600_000), now)).toBe("in 3 hours");
  });

  it("localizes to Persian", () => {
    expect(fa.relativeTime(ago(3 * DAY), now)).toBe("۳ روز پیش");
    expect(fa.relativeTime(ago(DAY), now)).toBe("دیروز");
  });

  it("returns '' for invalid input", () => {
    expect(en.relativeTime("x", now)).toBe("");
  });
});

describe("list", () => {
  it("joins with locale rules", () => {
    expect(en.list(["a", "b", "c"])).toBe("a, b, and c");
  });
});

describe("getCalendarDate", () => {
  it("returns Jalali and Gregorian parts as numbers", () => {
    expect(getCalendarDate(D, "persian")).toEqual({ year: 1405, month: 7, day: 28 });
    expect(getCalendarDate(D, "gregory")).toEqual({ year: 2026, month: 10, day: 20 });
  });

  it("handles the zone and invalid input", () => {
    expect(getCalendarDate("2026-10-20T22:00:00Z", "gregory", "Asia/Tehran")?.day).toBe(21);
    expect(getCalendarDate("nope")).toBeNull();
  });
});

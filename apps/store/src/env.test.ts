import { describe, expect, it } from "vitest";
import { DEFAULT_LOCALE } from "@front-dashboard/ui/locales";
import { parseEnv } from "./env";

describe("parseEnv", () => {
  it("uses the defaults when nothing is set", () => {
    expect(parseEnv({})).toEqual({ defaultLocale: DEFAULT_LOCALE, timeZone: "Asia/Tehran" });
  });

  it("treats blank values as not set", () => {
    expect(parseEnv({ defaultLocale: "", timeZone: "  " })).toEqual({
      defaultLocale: DEFAULT_LOCALE,
      timeZone: "Asia/Tehran",
    });
  });

  it("accepts a configured default locale and time zone", () => {
    expect(parseEnv({ defaultLocale: "fa", timeZone: "Europe/Paris" })).toEqual({
      defaultLocale: "fa",
      timeZone: "Europe/Paris",
    });
  });

  it("rejects an unsupported default locale", () => {
    expect(() => parseEnv({ defaultLocale: "de" })).toThrow(/Invalid environment configuration/);
  });

  it("rejects an unknown time zone", () => {
    expect(() => parseEnv({ timeZone: "Mars/Olympus" })).toThrow(/time zone/);
  });
});

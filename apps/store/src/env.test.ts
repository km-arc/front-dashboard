import { describe, expect, it } from "vitest";
import { DEFAULT_LOCALE } from "@front-dashboard/ui/locales";
import { parseEnv } from "./env";

describe("parseEnv", () => {
  it("uses the defaults when nothing is set", () => {
    expect(parseEnv({})).toEqual({
      defaultLocale: DEFAULT_LOCALE,
      timeZone: "Asia/Tehran",
      apiBaseUrl: undefined,
      apiMocking: false,
    });
  });

  it("treats blank values as not set", () => {
    const raw = { defaultLocale: "", timeZone: "  ", apiBaseUrl: "", apiMocking: "" };
    expect(parseEnv(raw)).toEqual({
      defaultLocale: DEFAULT_LOCALE,
      timeZone: "Asia/Tehran",
      apiBaseUrl: undefined,
      apiMocking: false,
    });
  });

  it("accepts a configured default locale and time zone", () => {
    expect(parseEnv({ defaultLocale: "fa", timeZone: "Europe/Paris" })).toMatchObject({
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

  it("turns the sample API on only with the value enabled", () => {
    expect(parseEnv({ apiMocking: "enabled" }).apiMocking).toBe(true);
    expect(parseEnv({ apiMocking: "disabled" }).apiMocking).toBe(false);
    expect(() => parseEnv({ apiMocking: "yes" })).toThrow(/Invalid environment configuration/);
  });

  it("accepts a backend URL and rejects text that is not a URL", () => {
    expect(parseEnv({ apiBaseUrl: "http://localhost:5000" }).apiBaseUrl).toBe(
      "http://localhost:5000",
    );
    expect(() => parseEnv({ apiBaseUrl: "not a url" })).toThrow(
      /Invalid environment configuration/,
    );
  });
});

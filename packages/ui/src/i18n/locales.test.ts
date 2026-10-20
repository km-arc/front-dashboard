import { describe, expect, it } from "vitest";
import { getDirection, getHtmlAttributes, isLocale, isRtl, resolveLocale } from "./locales";

describe("locales", () => {
  it("knows direction per locale", () => {
    expect(getDirection("en")).toBe("ltr");
    expect(getDirection("fa")).toBe("rtl");
    expect(isRtl("fa")).toBe(true);
    expect(isRtl("en")).toBe(false);
  });

  it("builds <html> attributes", () => {
    expect(getHtmlAttributes("fa")).toEqual({ lang: "fa", dir: "rtl" });
  });

  it("type-guards locales", () => {
    expect(isLocale("fa")).toBe(true);
    expect(isLocale("fr")).toBe(false);
    expect(isLocale(undefined)).toBe(false);
  });

  it.each(["fa", "fa-IR", "FA", " fa_IR "])("resolves %s to fa", (input) => {
    expect(resolveLocale(input)).toBe("fa");
  });

  it("resolves English variants and falls back for the rest", () => {
    expect(resolveLocale("en-GB")).toBe("en");
    expect(resolveLocale("de")).toBe("en");
    expect(resolveLocale("de", "fa")).toBe("fa");
    expect(resolveLocale(null)).toBe("en");
    expect(resolveLocale("")).toBe("en");
  });
});

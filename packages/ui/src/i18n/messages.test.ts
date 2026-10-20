import { describe, expect, it } from "vitest";
import { LOCALES } from "./locales";
import { formatMessage, uiMessages } from "./messages";

const placeholders = (s: string) => (s.match(/\{\w+\}/g) ?? []).sort().join(",");

describe("uiMessages", () => {
  it("has the same keys in every locale", () => {
    const base = Object.keys(uiMessages.en).sort();
    for (const locale of LOCALES) {
      expect(Object.keys(uiMessages[locale]).sort().join("|")).toBe(base.join("|"));
    }
  });

  it("has no empty strings and consistent placeholders", () => {
    for (const [key, en] of Object.entries(uiMessages.en)) {
      for (const locale of LOCALES) {
        const value = (uiMessages[locale] as Record<string, string>)[key];
        expect(value, `${locale}:${key}`).toBeDefined();
        expect(value!.trim().length, `${locale}:${key}`).toBeGreaterThanOrEqual(1);
        expect(placeholders(value!), `${locale}:${key}`).toBe(placeholders(en));
      }
    }
  });
});

describe("formatMessage", () => {
  it("replaces placeholders and keeps unknown ones", () => {
    expect(formatMessage("Page {page} of {total}", { page: 2, total: "۵" })).toBe("Page 2 of ۵");
    expect(formatMessage("Hi {name}", {})).toBe("Hi {name}");
    expect(formatMessage("No values")).toBe("No values");
  });
});

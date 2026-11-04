import { describe, expect, it } from "vitest";
import { LOCALES } from "@front-dashboard/ui/locales";
import en from "../../messages/en.json";
import fa from "../../messages/fa.json";
import { routing } from "./routing";

type Tree = { [key: string]: string | Tree };

function flatten(tree: Tree, prefix = ""): Record<string, string> {
  return Object.entries(tree).reduce<Record<string, string>>((all, [key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return typeof value === "string"
      ? { ...all, [path]: value }
      : { ...all, ...flatten(value, path) };
  }, {});
}

const placeholders = (text: string) => [...text.matchAll(/\{(\w+)\}/g)].map((match) => match[1]).sort();

describe("routing", () => {
  it("serves exactly the locales of the design system", () => {
    expect([...routing.locales]).toEqual([...LOCALES]);
  });

  it("always puts the locale in the URL", () => {
    expect(routing.localePrefix).toBe("always");
  });

  it("uses a supported default locale", () => {
    expect(routing.locales).toContain(routing.defaultLocale);
  });
});

describe("app messages", () => {
  const english = flatten(en);
  const persian = flatten(fa);

  it("has the same keys in en and fa", () => {
    expect(Object.keys(persian).sort()).toEqual(Object.keys(english).sort());
  });

  it("has the same placeholders in every message", () => {
    for (const [key, text] of Object.entries(english)) {
      expect(placeholders(persian[key] ?? ""), key).toEqual(placeholders(text));
    }
  });

  it("has no empty messages", () => {
    for (const [key, text] of [...Object.entries(english), ...Object.entries(persian)]) {
      expect(text.trim(), key).not.toBe("");
    }
  });
});

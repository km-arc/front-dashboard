import { describe, expect, it } from "vitest";
import {
  BRAND_ATTRIBUTE,
  BRAND_STYLE_ID,
  BrandValidationError,
  applyBrand,
  brandToCss,
  checkBrandContrast,
  clearBrand,
  isSafeColor,
  validateBrand,
  type BrandDefinition,
} from "./brand";

const valid: BrandDefinition = {
  id: "acme",
  name: "Acme",
  radius: "0.5rem",
  light: { primary: "oklch(0.5 0.2 150)", "primary-foreground": "#ffffff" },
  dark: { primary: "oklch(0.75 0.15 150)" },
};

/** Minimal DOM stand-in so tests need no jsdom. */
function fakeDocument() {
  const attrs = new Map<string, string>();
  let style: { id: string; textContent: string | null; remove: () => void } | null = null;
  const doc = {
    head: {
      appendChild(el: typeof style) {
        style = el;
        return el;
      },
    },
    documentElement: {
      setAttribute: (k: string, v: string) => void attrs.set(k, v),
      removeAttribute: (k: string) => void attrs.delete(k),
    },
    getElementById: (id: string) => (style && style.id === id ? style : null),
    createElement: () => ({
      id: "",
      textContent: null as string | null,
      remove() {
        style = null;
      },
    }),
  };
  return { doc: doc as unknown as Document, attrs, getStyle: () => style };
}

describe("isSafeColor", () => {
  it.each([
    "#fff",
    "#0369a1",
    "#0369a1cc",
    "oklch(0.55 0.15 242)",
    "oklch(55% 0.15 242deg / 0.5)",
    "hsl(200, 50%, 40%)",
    "rgb(1 2 3 / 50%)",
  ])("accepts %s", (value) => expect(isSafeColor(value)).toBe(true));

  it.each([
    "red; } body { display: none",
    "url(https://evil.test/x)",
    "oklch(0.5 0.1 100); color: red",
    "oklch(var(--x) 0 0)",
    "oklch(0.5 0.1 100)}",
    "expression(alert(1))",
    "#ggg",
    "",
    "x".repeat(200),
  ])("rejects %s", (value) => expect(isSafeColor(value)).toBe(false));

  it("rejects non-strings", () => {
    expect(isSafeColor(123)).toBe(false);
    expect(isSafeColor(null)).toBe(false);
  });
});

describe("validateBrand", () => {
  it("accepts a valid brand", () => {
    const result = validateBrand(valid);
    expect(result.ok).toBe(true);
  });

  it("rejects bad id, unknown keys and unknown tokens", () => {
    const result = validateBrand({ id: 'A"]{', hack: 1, light: { nope: "#fff" } });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.issues.join("\n")).toMatch(/id must/);
      expect(result.issues.join("\n")).toMatch(/unknown key "hack"/);
      expect(result.issues.join("\n")).toMatch(/light.nope/);
    }
  });

  it("rejects unsafe values and radius", () => {
    const result = validateBrand({ id: "x", radius: "1rem; }", light: { primary: "url(x)" } });
    expect(result.ok).toBe(false);
  });

  it("rejects non-objects", () => {
    expect(validateBrand(null).ok).toBe(false);
    expect(validateBrand("brand").ok).toBe(false);
    expect(validateBrand([]).ok).toBe(false);
  });
});

describe("brandToCss", () => {
  it("scopes light and dark rules without leaking light overrides into dark mode", () => {
    const css = brandToCss(valid);
    expect(css).toContain(':root[data-brand="acme"] {\n  --radius: 0.5rem;\n}');
    expect(css).toContain(':root[data-brand="acme"]:not(.dark) {');
    expect(css).toContain(':root[data-brand="acme"].dark {');
    expect(css).toContain("--primary: oklch(0.5 0.2 150);");
    expect(css).toContain("--primary: oklch(0.75 0.15 150);");
  });

  it("throws on invalid brand instead of producing CSS", () => {
    const bad: BrandDefinition = { id: "x", light: { primary: "red;}" } };
    expect(() => brandToCss(bad)).toThrow(BrandValidationError);
  });
});

describe("applyBrand / clearBrand", () => {
  it("injects one style element, sets the attribute and is idempotent", () => {
    const { doc, attrs, getStyle } = fakeDocument();
    applyBrand(valid, doc);
    const first = getStyle();
    expect(attrs.get(BRAND_ATTRIBUTE)).toBe("acme");
    expect(first?.id).toBe(BRAND_STYLE_ID);
    expect(first?.textContent).toContain("--primary");

    applyBrand({ ...valid, id: "other" }, doc);
    expect(getStyle()).toBe(first);
    expect(attrs.get(BRAND_ATTRIBUTE)).toBe("other");
  });

  it("clearBrand restores the default", () => {
    const { doc, attrs, getStyle } = fakeDocument();
    applyBrand(valid, doc);
    clearBrand(doc);
    expect(getStyle()).toBeNull();
    expect(attrs.has(BRAND_ATTRIBUTE)).toBe(false);
  });

  it("does not touch the DOM when the brand is invalid", () => {
    const { doc, attrs, getStyle } = fakeDocument();
    expect(() => applyBrand({ id: "BAD ID" }, doc)).toThrow(BrandValidationError);
    expect(getStyle()).toBeNull();
    expect(attrs.size).toBe(0);
  });
});

describe("checkBrandContrast", () => {
  it("flags low-contrast pairs", () => {
    const issues = checkBrandContrast({
      id: "low",
      light: { primary: "#aaccff", "primary-foreground": "#ffffff" },
    });
    expect(issues).toHaveLength(1);
    expect(issues[0]?.surface).toBe("primary");
  });

  it("passes accessible pairs and skips incomplete ones", () => {
    expect(checkBrandContrast(valid)).toHaveLength(0);
  });
});

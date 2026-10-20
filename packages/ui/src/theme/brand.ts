import { COLOR_TOKEN_SET, COLOR_MODES, TEXT_CONTRAST_PAIRS, type ColorToken } from "./tokens";
import { contrastRatio } from "./contrast";

/**
 * Runtime brand theming. A brand is plain data (typically fetched from the backend) that overrides
 * design-token CSS variables. Because it comes from outside the app, it is VALIDATED against a
 * strict whitelist before any CSS is produced: it can never inject arbitrary CSS.
 */

export type BrandColors = Partial<Record<ColorToken, string>>;

export interface BrandDefinition {
  /** Lowercase slug, used as the `data-brand` attribute value. */
  id: string;
  name?: string;
  /** Overrides applied in light mode. Omitted tokens keep the default (light-blue) values. */
  light?: BrandColors;
  /** Overrides applied in dark mode. */
  dark?: BrandColors;
  /** Corner radius, e.g. "0.5rem". */
  radius?: string;
}

export type BrandValidationResult =
  | { ok: true; brand: BrandDefinition }
  | { ok: false; issues: string[] };

export class BrandValidationError extends Error {
  readonly issues: string[];
  constructor(issues: string[]) {
    super(`Invalid brand: ${issues.join("; ")}`);
    this.name = "BrandValidationError";
    this.issues = issues;
  }
}

export const BRAND_ATTRIBUTE = "data-brand";
export const BRAND_STYLE_ID = "fd-brand-style";

const ID_RE = /^[a-z0-9][a-z0-9-]{0,47}$/;
const HEX_RE = /^#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
const FUNC_RE = /^(?:oklch|hsl|rgb)a?\([0-9a-z.+\-%\s,/]+\)$/i;
const FUNC_WORDS = new Set(["deg", "none"]);
const RADIUS_RE = /^\d{1,3}(?:\.\d{1,3})?(?:rem|px)$/;
const BRAND_KEYS = new Set(["id", "name", "light", "dark", "radius"]);
const MAX_COLOR_LENGTH = 64;

/** True for hex, oklch(), hsl() and rgb() values made only of numbers and separators. */
export function isSafeColor(value: unknown): value is string {
  if (typeof value !== "string" || value.length > MAX_COLOR_LENGTH) return false;
  if (HEX_RE.test(value)) return true;
  if (!FUNC_RE.test(value)) return false;
  const inner = value.slice(value.indexOf("(") + 1, -1);
  const words = inner.match(/[a-z]+/gi) ?? [];
  return words.every((w) => FUNC_WORDS.has(w.toLowerCase()));
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function validateColors(mode: string, input: unknown, issues: string[]): BrandColors | undefined {
  if (input === undefined) return undefined;
  if (!isPlainObject(input)) {
    issues.push(`${mode} must be an object`);
    return undefined;
  }
  const out: BrandColors = {};
  for (const [key, value] of Object.entries(input)) {
    if (!COLOR_TOKEN_SET.has(key)) {
      issues.push(`${mode}.${key} is not a known token`);
    } else if (!isSafeColor(value)) {
      issues.push(`${mode}.${key} is not a safe color value`);
    } else {
      out[key as ColorToken] = value;
    }
  }
  return out;
}

/** Validates untrusted input (e.g. a backend response) and returns a normalized brand. */
export function validateBrand(input: unknown): BrandValidationResult {
  const issues: string[] = [];
  if (!isPlainObject(input)) return { ok: false, issues: ["brand must be an object"] };

  for (const key of Object.keys(input)) {
    if (!BRAND_KEYS.has(key)) issues.push(`unknown key "${key}"`);
  }

  const { id, name, radius } = input;
  if (typeof id !== "string" || !ID_RE.test(id)) {
    issues.push("id must be a lowercase slug (a-z, 0-9, '-', max 48 chars)");
  }
  if (name !== undefined && (typeof name !== "string" || name.length === 0 || name.length > 80)) {
    issues.push("name must be a non-empty string up to 80 chars");
  }
  if (radius !== undefined && (typeof radius !== "string" || !RADIUS_RE.test(radius))) {
    issues.push('radius must look like "0.5rem" or "8px"');
  }

  const light = validateColors("light", input.light, issues);
  const dark = validateColors("dark", input.dark, issues);

  if (issues.length > 0) return { ok: false, issues };

  const brand: BrandDefinition = { id: id as string };
  if (name !== undefined) brand.name = name as string;
  if (radius !== undefined) brand.radius = radius as string;
  if (light) brand.light = light;
  if (dark) brand.dark = dark;
  return { ok: true, brand };
}

function declarations(colors: BrandColors): string {
  return Object.entries(colors)
    .map(([token, value]) => `  --${token}: ${value};`)
    .join("\n");
}

/**
 * Produces the CSS for a brand. Safe to inline in a server-rendered `<style>` (avoids a flash of
 * default colors) or to inject on the client with applyBrand().
 * Throws BrandValidationError if the brand is invalid.
 */
export function brandToCss(input: BrandDefinition): string {
  const result = validateBrand(input);
  if (!result.ok) throw new BrandValidationError(result.issues);
  const { id, radius, light, dark } = result.brand;
  const root = `:root[${BRAND_ATTRIBUTE}="${id}"]`;
  const rules: string[] = [];
  if (radius) rules.push(`${root} {\n  --radius: ${radius};\n}`);
  if (light && Object.keys(light).length > 0) {
    rules.push(`${root}:not(.dark) {\n${declarations(light)}\n}`);
  }
  if (dark && Object.keys(dark).length > 0) {
    rules.push(`${root}.dark {\n${declarations(dark)}\n}`);
  }
  return rules.join("\n\n");
}

export interface BrandContrastIssue {
  mode: (typeof COLOR_MODES)[number];
  surface: ColorToken;
  content: ColorToken;
  ratio: number;
}

/**
 * Reports text pairs (both defined by the brand in the same mode) that fall below WCAG AA (4.5:1).
 * Pairs that rely on default tokens or use unsupported color syntaxes are skipped.
 */
export function checkBrandContrast(brand: BrandDefinition): BrandContrastIssue[] {
  const issues: BrandContrastIssue[] = [];
  for (const mode of COLOR_MODES) {
    const colors = brand[mode];
    if (!colors) continue;
    for (const [surface, content] of TEXT_CONTRAST_PAIRS) {
      const a = colors[surface];
      const b = colors[content];
      if (!a || !b) continue;
      const ratio = contrastRatio(a, b);
      if (ratio !== null && ratio < 4.5) issues.push({ mode, surface, content, ratio });
    }
  }
  return issues;
}

/** Applies a brand to the document: injects its CSS and sets `data-brand` on <html>. */
export function applyBrand(brand: BrandDefinition, doc: Document = document): void {
  const css = brandToCss(brand); // validates
  let style = doc.getElementById(BRAND_STYLE_ID);
  if (!style) {
    style = doc.createElement("style");
    style.id = BRAND_STYLE_ID;
    doc.head.appendChild(style);
  }
  style.textContent = css; // textContent, never innerHTML
  doc.documentElement.setAttribute(BRAND_ATTRIBUTE, brand.id);
}

/** Removes the active brand and returns to the built-in default theme. */
export function clearBrand(doc: Document = document): void {
  doc.getElementById(BRAND_STYLE_ID)?.remove();
  doc.documentElement.removeAttribute(BRAND_ATTRIBUTE);
}

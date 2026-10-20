/**
 * Minimal WCAG contrast helpers. Supports hex and oklch() colors (what tokens use).
 * Returns null for unsupported syntaxes so callers can skip instead of guessing.
 */

type Rgb = readonly [number, number, number];

function clamp01(n: number): number {
  return Math.min(1, Math.max(0, n));
}

function srgbToLinear(c: number): number {
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function parseHex(input: string): Rgb | null {
  const m = /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.exec(input.trim());
  const raw = m?.[1];
  if (!raw) return null;
  const full =
    raw.length <= 4
      ? raw
          .split("")
          .map((ch) => ch + ch)
          .join("")
      : raw;
  const channel = (i: number) => srgbToLinear(parseInt(full.slice(i * 2, i * 2 + 2), 16) / 255);
  return [channel(0), channel(1), channel(2)];
}

const OKLCH_RE =
  /^oklch\(\s*([0-9.]+%?)\s+([0-9.]+%?)\s+([0-9.]+)(?:deg)?\s*(?:\/\s*[0-9.]+%?\s*)?\)$/i;

function parseOklch(input: string): Rgb | null {
  const m = OKLCH_RE.exec(input.trim());
  if (!m) return null;
  const [, l, c, h] = m;
  if (l === undefined || c === undefined || h === undefined) return null;
  const L = l.endsWith("%") ? parseFloat(l) / 100 : parseFloat(l);
  const C = c.endsWith("%") ? (parseFloat(c) / 100) * 0.4 : parseFloat(c);
  const hue = (parseFloat(h) * Math.PI) / 180;
  const a = C * Math.cos(hue);
  const b = C * Math.sin(hue);
  const l_ = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m_ = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s_ = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_,
    -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_,
    -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_,
  ];
}

/** Relative luminance (WCAG) of a color string, or null when the syntax is unsupported. */
export function relativeLuminance(color: string): number | null {
  const lin = parseHex(color) ?? parseOklch(color);
  if (!lin) return null;
  const [r, g, b] = lin;
  return 0.2126 * clamp01(r) + 0.7152 * clamp01(g) + 0.0722 * clamp01(b);
}

/** WCAG contrast ratio (1 to 21), or null if either color is unsupported. */
export function contrastRatio(a: string, b: string): number | null {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  if (la === null || lb === null) return null;
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

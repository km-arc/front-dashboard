import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { LOCALES } from "@front-dashboard/ui/locales";
import { APP_COLORS, buildManifest } from "./manifest";

const publicDir = fileURLToPath(new URL("../../public", import.meta.url));

/** Width and height from the PNG header (signature, then the IHDR chunk). */
function pngSize(file: string): { width: number; height: number } {
  const bytes = readFileSync(file);
  expect(bytes.subarray(1, 4).toString("ascii"), file).toBe("PNG");
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
}

describe.each(LOCALES)("manifest (%s)", (locale) => {
  const manifest = buildManifest({ locale, name: "Name", description: "Description" });

  it("is installable: standalone, start page inside the scope", () => {
    expect(manifest.display).toBe("standalone");
    expect(new URL(manifest.start_url ?? "", "https://example.com").pathname).toBe(`/${locale}`);
    expect(`/${locale}`.startsWith(manifest.scope ?? "")).toBe(true);
  });

  it("identifies the locale and its direction", () => {
    expect(manifest.id).toBe(`/${locale}`);
    expect(manifest.lang).toBe(locale);
    expect(manifest.dir).toBe(locale === "fa" ? "rtl" : "ltr");
  });

  it("declares hex colors", () => {
    expect(manifest.theme_color).toMatch(/^#[0-9a-f]{6}$/i);
    expect(manifest.background_color).toMatch(/^#[0-9a-f]{6}$/i);
  });

  it("ships 192 and 512 icons plus a maskable one, and the files match the declared sizes", () => {
    const icons = manifest.icons ?? [];
    const has = (sizes: string, purpose: string) =>
      icons.some((icon) => icon.sizes === sizes && icon.purpose === purpose);
    expect(has("192x192", "any")).toBe(true);
    expect(has("512x512", "any")).toBe(true);
    expect(has("512x512", "maskable")).toBe(true);

    for (const icon of icons) {
      const [width, height] = (icon.sizes ?? "").split("x").map(Number);
      expect(pngSize(`${publicDir}${icon.src}`), icon.src).toEqual({ width, height });
    }
  });
});

describe.each(LOCALES)("manifest screenshots (%s)", (locale) => {
  const manifest = buildManifest({ locale, name: "Name", description: "Description" });
  const shots = manifest.screenshots ?? [];

  it("has a wide and a narrow screenshot (richer install dialog on desktop and phones)", () => {
    expect(shots.some((shot) => shot.form_factor === "wide")).toBe(true);
    expect(shots.some((shot) => shot.form_factor === "narrow")).toBe(true);
  });

  it("matches the declared sizes and the limits Chrome enforces", () => {
    for (const shot of shots) {
      const [width = 0, height = 0] = (shot.sizes ?? "").split("x").map(Number);
      const size = pngSize(`${publicDir}${shot.src}`);
      expect(size, shot.src).toEqual({ width, height });
      expect(Math.min(width, height), shot.src).toBeGreaterThanOrEqual(320);
      expect(Math.max(width, height), shot.src).toBeLessThanOrEqual(3840);
      expect(Math.max(width, height) / Math.min(width, height), shot.src).toBeLessThanOrEqual(2.3);
    }
  });
});

describe("app assets", () => {
  it("has the Apple touch icon (180px) and the vector icon", () => {
    expect(pngSize(`${publicDir}/icons/apple-touch-icon.png`)).toEqual({ width: 180, height: 180 });
    expect(existsSync(`${publicDir}/icons/icon.svg`)).toBe(true);
  });

  it("uses distinct light and dark background colors", () => {
    expect(APP_COLORS.backgroundLight).not.toBe(APP_COLORS.backgroundDark);
  });
});

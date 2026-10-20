import { describe, expect, it } from "vitest";
import { contrastRatio } from "./contrast";

describe("contrastRatio", () => {
  it("gives 21 for black on white", () => {
    expect(contrastRatio("#000", "#fff")).toBeCloseTo(21, 1);
    expect(contrastRatio("oklch(0 0 0)", "oklch(1 0 0)")).toBeCloseTo(21, 1);
  });

  it("is symmetric", () => {
    const a = contrastRatio("#0369a1", "#ffffff");
    const b = contrastRatio("#ffffff", "#0369a1");
    expect(a).toBe(b);
  });

  it("matches a known WCAG value (#767676 on white is ~4.54)", () => {
    expect(contrastRatio("#767676", "#fff")).toBeCloseTo(4.54, 1);
  });

  it("returns null for unsupported syntax", () => {
    expect(contrastRatio("hsl(200 50% 50%)", "#fff")).toBeNull();
    expect(contrastRatio("red", "#fff")).toBeNull();
  });
});

import { describe, expect, it } from "vitest";
import { discountPercent } from "./pricing";

describe("discountPercent", () => {
  it("rounds the saved share to a whole percent", () => {
    expect(discountPercent(75, 100)).toBe(25);
    expect(discountPercent(240000, 290000)).toBe(17);
  });

  it("is null without an old price or when it is not higher", () => {
    expect(discountPercent(100)).toBeNull();
    expect(discountPercent(100, 100)).toBeNull();
    expect(discountPercent(100, 90)).toBeNull();
  });

  it("is null for a saving too small to show and never reaches 100", () => {
    expect(discountPercent(9999, 10000)).toBeNull();
    expect(discountPercent(1, 1000000)).toBe(99);
  });
});

import { describe, expect, it } from "vitest";
import { checkBrandContrast, validateBrand } from "../theme/brand";
import { BRAND_OPTIONS, STORY_BRANDS, getStoryBrand } from "./brands";

describe("story brands", () => {
  it("lists every sample brand in the toolbar options", () => {
    expect([...BRAND_OPTIONS].sort()).toEqual(["default", ...Object.keys(STORY_BRANDS)].sort());
  });

  it("returns null for the default option", () => {
    expect(getStoryBrand("default")).toBeNull();
  });

  describe.each(Object.entries(STORY_BRANDS))("%s", (_name, brand) => {
    it("passes brand validation", () => {
      expect(validateBrand(brand).ok).toBe(true);
    });

    it("meets the contrast requirements", () => {
      expect(checkBrandContrast(brand)).toEqual([]);
    });
  });
});

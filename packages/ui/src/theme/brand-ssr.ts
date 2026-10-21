import { BRAND_ATTRIBUTE, brandToCss, validateBrand, type BrandDefinition } from "./brand";

/**
 * For server rendering: the attributes to put on <html> and the CSS to inline in a <style> in <head>,
 * so the very first paint already uses the brand. Missing or invalid brands yield an empty result.
 */
export function getBrandSsr(brand: BrandDefinition | null | undefined): {
  attributes: Record<string, string>;
  css: string;
} {
  const result = brand ? validateBrand(brand) : null;
  if (!result?.ok) return { attributes: {}, css: "" };
  return { attributes: { [BRAND_ATTRIBUTE]: result.brand.id }, css: brandToCss(result.brand) };
}

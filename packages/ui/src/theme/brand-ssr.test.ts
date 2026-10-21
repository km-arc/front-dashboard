import { describe, expect, it } from "vitest";
import { getBrandSsr } from "./brand-ssr";

describe("getBrandSsr", () => {
  it("returns html attributes and css for a valid brand", () => {
    const ssr = getBrandSsr({ id: "acme", light: { primary: "#0369a1" } });
    expect(ssr.attributes).toEqual({ "data-brand": "acme" });
    expect(ssr.css).toContain("--primary: #0369a1;");
  });

  it("returns nothing for missing or invalid brands", () => {
    expect(getBrandSsr(null)).toEqual({ attributes: {}, css: "" });
    expect(getBrandSsr(undefined)).toEqual({ attributes: {}, css: "" });
    const bad = getBrandSsr({ id: "x", light: { primary: "red;}" } });
    expect(bad).toEqual({ attributes: {}, css: "" });
  });
});

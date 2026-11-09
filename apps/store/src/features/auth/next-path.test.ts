import { describe, expect, it } from "vitest";
import { safeNextPath } from "./next-path";

describe("safeNextPath", () => {
  it("keeps a path on this site, with its query", () => {
    expect(safeNextPath("/dashboard")).toBe("/dashboard");
    expect(safeNextPath("/categories/books?page=2")).toBe("/categories/books?page=2");
  });

  it("falls back when there is nothing or it is not a path on this site", () => {
    const rejected = [undefined, null, "", "dashboard", "https://evil.example", "//evil.example"];
    for (const value of rejected) expect(safeNextPath(value), String(value)).toBe("/dashboard");
  });

  it("refuses backslash and scheme tricks", () => {
    expect(safeNextPath("/\\evil.example")).toBe("/dashboard");
    expect(safeNextPath("/redirect?to=https://evil.example")).toBe("/dashboard");
  });

  it("uses the fallback it is given", () => {
    expect(safeNextPath("https://evil.example", "/")).toBe("/");
  });
});

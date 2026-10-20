import { describe, expect, it } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
  it("joins class names and ignores falsy values", () => {
    expect(cn("a", false, undefined, null, "b")).toBe("a b");
  });

  it("lets the last conflicting Tailwind utility win", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });

  it("keeps logical (RTL-safe) utilities intact", () => {
    expect(cn("ms-2", "me-2")).toBe("ms-2 me-2");
  });
});

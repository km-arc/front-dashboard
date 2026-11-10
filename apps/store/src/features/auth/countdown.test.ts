import { describe, expect, it } from "vitest";
import { secondsLeft } from "./countdown";

describe("secondsLeft", () => {
  it("counts whole seconds, rounding up", () => {
    expect(secondsLeft(60_000, 0)).toBe(60);
    expect(secondsLeft(60_000, 59_001)).toBe(1);
    expect(secondsLeft(60_000, 59_999)).toBe(1);
  });

  it("is 0 when the time has come or passed", () => {
    expect(secondsLeft(60_000, 60_000)).toBe(0);
    expect(secondsLeft(60_000, 90_000)).toBe(0);
  });
});

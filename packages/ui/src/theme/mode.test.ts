import { describe, expect, it } from "vitest";
import {
  applyResolvedMode,
  getThemeInitScript,
  parseThemeMode,
  readStoredMode,
  resolveThemeMode,
  writeStoredMode,
} from "./mode";

describe("mode helpers", () => {
  it("parses only valid modes", () => {
    expect(parseThemeMode("dark")).toBe("dark");
    expect(parseThemeMode("system")).toBe("system");
    expect(parseThemeMode("blue")).toBeNull();
    expect(parseThemeMode(null)).toBeNull();
  });

  it("resolves system against the OS preference", () => {
    expect(resolveThemeMode("system", true)).toBe("dark");
    expect(resolveThemeMode("system", false)).toBe("light");
    expect(resolveThemeMode("light", true)).toBe("light");
    expect(resolveThemeMode("dark", false)).toBe("dark");
  });

  it("reads/writes storage and never throws", () => {
    const data = new Map<string, string>();
    const storage = {
      getItem: (k: string) => data.get(k) ?? null,
      setItem: (k: string, v: string) => void data.set(k, v),
    };
    writeStoredMode(storage, "k", "dark");
    expect(readStoredMode(storage, "k")).toBe("dark");
    expect(readStoredMode(storage, "missing")).toBeNull();
    expect(readStoredMode(null, "k")).toBeNull();

    const broken = {
      getItem: () => {
        throw new Error("blocked");
      },
      setItem: () => {
        throw new Error("blocked");
      },
    };
    expect(readStoredMode(broken, "k")).toBeNull();
    expect(() => writeStoredMode(broken, "k", "light")).not.toThrow();
  });

  it("toggles the dark class", () => {
    const classes = new Set<string>();
    const root = {
      classList: {
        toggle: (c: string, on?: boolean) => (on ? classes.add(c) : classes.delete(c)),
      },
    } as unknown as HTMLElement;
    applyResolvedMode(root, "dark");
    expect(classes.has("dark")).toBe(true);
    applyResolvedMode(root, "light");
    expect(classes.has("dark")).toBe(false);
  });
});

/** Runs the inline script against fakes, like a browser would before first paint. */
function runInitScript(script: string, stored: string | null, systemDark: boolean) {
  const classes = new Set<string>();
  const fakeStorage = { getItem: () => stored };
  const fakeWindow = { matchMedia: () => ({ matches: systemDark }) };
  const fakeDocument = {
    documentElement: {
      classList: { toggle: (c: string, on: boolean) => (on ? classes.add(c) : classes.delete(c)) },
    },
  };
  new Function("localStorage", "window", "document", script)(fakeStorage, fakeWindow, fakeDocument);
  return classes.has("dark");
}

describe("getThemeInitScript", () => {
  const script = getThemeInitScript();

  it("applies the stored mode before paint", () => {
    expect(runInitScript(script, "dark", false)).toBe(true);
    expect(runInitScript(script, "light", true)).toBe(false);
  });

  it("follows the OS for system or unknown values", () => {
    expect(runInitScript(script, "system", true)).toBe(true);
    expect(runInitScript(script, null, true)).toBe(true);
    expect(runInitScript(script, "garbage", false)).toBe(false);
  });

  it("honours defaultMode when nothing is stored", () => {
    expect(runInitScript(getThemeInitScript({ defaultMode: "dark" }), null, false)).toBe(true);
    expect(runInitScript(getThemeInitScript({ defaultMode: "light" }), null, true)).toBe(false);
  });

  it("does not throw if storage is blocked", () => {
    const blocked = new Function(
      "localStorage",
      "window",
      "document",
      script,
    ) as (a: unknown, b: unknown, c: unknown) => void;
    const throwing = {
      getItem: () => {
        throw new Error("blocked");
      },
    };
    expect(() => blocked(throwing, {}, {})).not.toThrow();
  });

  it("rejects unsafe options (no script injection)", () => {
    expect(() => getThemeInitScript({ storageKey: 'x");alert(1);("' })).toThrow();
    expect(() => getThemeInitScript({ defaultMode: "evil" as never })).toThrow();
  });
});

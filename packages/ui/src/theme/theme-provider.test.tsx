// @vitest-environment jsdom
import { act, cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { THEME_STORAGE_KEY } from "./mode";
import { ThemeProvider, useTheme } from "./theme-provider";

type Listener = (event: { matches: boolean }) => void;

/** jsdom has no matchMedia: provide a controllable one. */
function mockSystemTheme(initialDark: boolean) {
  let matches = initialDark;
  const listeners = new Set<Listener>();
  window.matchMedia = ((query: string) => ({
    get matches() {
      return matches;
    },
    media: query,
    addEventListener: (_: string, l: Listener) => listeners.add(l),
    removeEventListener: (_: string, l: Listener) => listeners.delete(l),
  })) as unknown as typeof window.matchMedia;
  return {
    set(next: boolean) {
      matches = next;
      act(() => listeners.forEach((l) => l({ matches })));
    },
  };
}

function Probe() {
  const { mode, resolvedMode, setMode } = useTheme();
  return (
    <div>
      <output data-testid="state">{`${mode}|${resolvedMode}`}</output>
      <button onClick={() => setMode("dark")}>dark</button>
      <button onClick={() => setMode("light")}>light</button>
      <button onClick={() => setMode("system")}>system</button>
    </div>
  );
}

const isDark = () => document.documentElement.classList.contains("dark");
const state = () => screen.getByTestId("state").textContent;

beforeEach(() => {
  localStorage.clear();
  document.documentElement.className = "";
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("ThemeProvider (browser)", () => {
  it("follows the OS when no choice is stored", () => {
    mockSystemTheme(true);
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    );
    expect(state()).toBe("system|dark");
    expect(isDark()).toBe(true);
  });

  it("prefers the stored choice over the OS", () => {
    mockSystemTheme(true);
    localStorage.setItem(THEME_STORAGE_KEY, "light");
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    );
    expect(state()).toBe("light|light");
    expect(isDark()).toBe(false);
  });

  it("setMode applies the class and persists the choice", async () => {
    mockSystemTheme(false);
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    );
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "dark" }));
    expect(isDark()).toBe(true);
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
    await user.click(screen.getByRole("button", { name: "light" }));
    expect(isDark()).toBe(false);
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("light");
  });

  it("reacts to OS changes only while in system mode", async () => {
    const system = mockSystemTheme(false);
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    );
    system.set(true);
    expect(isDark()).toBe(true);
    await userEvent.setup().click(screen.getByRole("button", { name: "light" }));
    system.set(true);
    expect(isDark()).toBe(false);
  });

  it("syncs a change made in another tab", () => {
    mockSystemTheme(false);
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    );
    act(() => {
      window.dispatchEvent(
        new StorageEvent("storage", { key: THEME_STORAGE_KEY, newValue: "dark" }),
      );
    });
    expect(state()).toBe("dark|dark");
    expect(isDark()).toBe(true);
  });

  it("keeps working when localStorage throws", async () => {
    mockSystemTheme(false);
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    );
    await userEvent.setup().click(screen.getByRole("button", { name: "dark" }));
    expect(isDark()).toBe(true);
  });
});

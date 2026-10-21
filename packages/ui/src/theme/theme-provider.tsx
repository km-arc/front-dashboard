"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  THEME_STORAGE_KEY,
  applyResolvedMode,
  parseThemeMode,
  readStoredMode,
  resolveThemeMode,
  writeStoredMode,
  type ResolvedMode,
  type ThemeMode,
} from "./mode";

export interface ThemeContextValue {
  /** The user's choice: light, dark or follow the system. */
  mode: ThemeMode;
  /** What is actually shown. Before hydration "system" resolves to "light"; use CSS (dark:) for styling. */
  resolvedMode: ResolvedMode;
  setMode: (mode: ThemeMode) => void;
}

export interface ThemeProviderProps {
  children: ReactNode;
  defaultMode?: ThemeMode;
  storageKey?: string;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const DARK_QUERY = "(prefers-color-scheme: dark)";

function getStorage(): Storage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

/**
 * Manages light/dark/system mode. Pair it with getThemeInitScript() in <head> so the correct class is
 * present before first paint; the provider then takes over (persisting, following the OS, syncing tabs).
 */
export function ThemeProvider({
  children,
  defaultMode = "system",
  storageKey = THEME_STORAGE_KEY,
}: ThemeProviderProps) {
  const [mode, setModeState] = useState<ThemeMode>(defaultMode);
  const [systemDark, setSystemDark] = useState(false);
  const [ready, setReady] = useState(false);

  // Sync with the browser once after mount (keeps SSR and the first client render identical).
  useEffect(() => {
    const query = window.matchMedia(DARK_QUERY);
    setModeState(readStoredMode(getStorage(), storageKey) ?? defaultMode);
    setSystemDark(query.matches);
    setReady(true);

    const onSystem = (event: MediaQueryListEvent) => setSystemDark(event.matches);
    const onStorage = (event: StorageEvent) => {
      if (event.key === storageKey) setModeState(parseThemeMode(event.newValue) ?? defaultMode);
    };
    query.addEventListener("change", onSystem);
    window.addEventListener("storage", onStorage);
    return () => {
      query.removeEventListener("change", onSystem);
      window.removeEventListener("storage", onStorage);
    };
  }, [storageKey, defaultMode]);

  const resolvedMode = resolveThemeMode(mode, systemDark);

  // Only touch the DOM after syncing, so we never undo what the init script already applied.
  useEffect(() => {
    if (ready) applyResolvedMode(document.documentElement, resolvedMode);
  }, [ready, resolvedMode]);

  const setMode = useCallback(
    (next: ThemeMode) => {
      setModeState(next);
      writeStoredMode(getStorage(), storageKey, next);
    },
    [storageKey],
  );

  const value = useMemo(() => ({ mode, resolvedMode, setMode }), [mode, resolvedMode, setMode]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const value = useContext(ThemeContext);
  if (!value) throw new Error("useTheme must be used inside <ThemeProvider>");
  return value;
}

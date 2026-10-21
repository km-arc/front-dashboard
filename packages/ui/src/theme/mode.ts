/** Light/dark mode logic, free of React so it can run in the pre-hydration script and in tests. */

export const THEME_MODES = ["light", "dark", "system"] as const;
export type ThemeMode = (typeof THEME_MODES)[number];
export type ResolvedMode = "light" | "dark";

export const THEME_STORAGE_KEY = "fd-theme";
export const DARK_CLASS = "dark";

const STORAGE_KEY_RE = /^[A-Za-z0-9_-]{1,64}$/;

export function parseThemeMode(value: unknown): ThemeMode | null {
  return typeof value === "string" && (THEME_MODES as readonly string[]).includes(value)
    ? (value as ThemeMode)
    : null;
}

export function resolveThemeMode(mode: ThemeMode, systemPrefersDark: boolean): ResolvedMode {
  if (mode === "system") return systemPrefersDark ? "dark" : "light";
  return mode;
}

type StorageLike = Pick<Storage, "getItem" | "setItem">;

/** Reads a stored mode; never throws (storage can be blocked or unavailable). */
export function readStoredMode(storage: StorageLike | null, key: string): ThemeMode | null {
  try {
    return parseThemeMode(storage?.getItem(key));
  } catch {
    return null;
  }
}

export function writeStoredMode(storage: StorageLike | null, key: string, mode: ThemeMode): void {
  try {
    storage?.setItem(key, mode);
  } catch {
    // Ignore: the mode still applies for this session.
  }
}

export function applyResolvedMode(root: Pick<HTMLElement, "classList">, mode: ResolvedMode): void {
  root.classList.toggle(DARK_CLASS, mode === "dark");
}

export interface ThemeInitScriptOptions {
  storageKey?: string;
  defaultMode?: ThemeMode;
}

/**
 * JavaScript source for an inline <script> in <head> that sets the `dark` class BEFORE first paint,
 * preventing a flash of the wrong theme. Usage in Next.js:
 *   <html suppressHydrationWarning>
 *     <head><script dangerouslySetInnerHTML={{ __html: getThemeInitScript() }} /></head>
 * Inputs are validated, so the returned source is safe to inline.
 */
export function getThemeInitScript(options: ThemeInitScriptOptions = {}): string {
  const { storageKey = THEME_STORAGE_KEY, defaultMode = "system" } = options;
  if (!STORAGE_KEY_RE.test(storageKey)) throw new Error("Invalid theme storage key");
  if (!parseThemeMode(defaultMode)) throw new Error("Invalid default theme mode");
  return (
    "(function(){try{" +
    `var m=localStorage.getItem(${JSON.stringify(storageKey)});` +
    `if(m!=="light"&&m!=="dark"&&m!=="system")m=${JSON.stringify(defaultMode)};` +
    'var d=m==="dark"||(m==="system"&&window.matchMedia("(prefers-color-scheme: dark)").matches);' +
    `document.documentElement.classList.toggle(${JSON.stringify(DARK_CLASS)},d);` +
    "}catch(e){}})();"
  );
}

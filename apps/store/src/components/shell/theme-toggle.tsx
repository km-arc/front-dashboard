"use client";

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  MoonIcon,
  SunIcon,
  THEME_MODES,
  parseThemeMode,
  useLocale,
  useTheme,
} from "@front-dashboard/ui";

/** Light, dark or follow the system. The choice is remembered by ThemeProvider. */
export function ThemeToggle() {
  const { t } = useLocale();
  const { mode, resolvedMode, setMode } = useTheme();

  function change(next: string) {
    const parsed = parseThemeMode(next);
    if (parsed) setMode(parsed);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={t("theme.toggle")}>
          {resolvedMode === "dark" ? <MoonIcon /> : <SunIcon />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup value={mode} onValueChange={change}>
          {THEME_MODES.map((option) => (
            <DropdownMenuRadioItem key={option} value={option}>
              {t(`theme.${option}`)}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** All color tokens that a theme or brand can define. Keep in sync with styles/tokens.css (tested). */
export const COLOR_TOKENS = [
  "background",
  "foreground",
  "card",
  "card-foreground",
  "popover",
  "popover-foreground",
  "primary",
  "primary-foreground",
  "secondary",
  "secondary-foreground",
  "muted",
  "muted-foreground",
  "accent",
  "accent-foreground",
  "destructive",
  "destructive-foreground",
  "success",
  "success-foreground",
  "warning",
  "warning-foreground",
  "info",
  "info-foreground",
  "border",
  "input",
  "ring",
  "sidebar",
  "sidebar-foreground",
  "sidebar-primary",
  "sidebar-primary-foreground",
  "sidebar-accent",
  "sidebar-accent-foreground",
  "sidebar-border",
  "sidebar-ring",
  "chart-1",
  "chart-2",
  "chart-3",
  "chart-4",
  "chart-5",
] as const;

export type ColorToken = (typeof COLOR_TOKENS)[number];

export const COLOR_TOKEN_SET: ReadonlySet<string> = new Set(COLOR_TOKENS);

/** [surface, content] pairs rendered as text on a surface: must reach WCAG AA (4.5:1). */
export const TEXT_CONTRAST_PAIRS: ReadonlyArray<readonly [ColorToken, ColorToken]> = [
  ["background", "foreground"],
  ["card", "card-foreground"],
  ["popover", "popover-foreground"],
  ["primary", "primary-foreground"],
  ["secondary", "secondary-foreground"],
  ["muted", "muted-foreground"],
  ["accent", "accent-foreground"],
  ["destructive", "destructive-foreground"],
  ["success", "success-foreground"],
  ["warning", "warning-foreground"],
  ["info", "info-foreground"],
  ["sidebar", "sidebar-foreground"],
  ["sidebar-primary", "sidebar-primary-foreground"],
  ["sidebar-accent", "sidebar-accent-foreground"],
  ["background", "muted-foreground"],
  ["card", "muted-foreground"],
];

/** Pairs of UI boundaries / focus indicators: must reach WCAG 1.4.11 (3:1). */
export const NON_TEXT_CONTRAST_PAIRS: ReadonlyArray<readonly [ColorToken, ColorToken]> = [
  ["background", "ring"],
  ["background", "input"],
  ["card", "input"],
];

export const COLOR_MODES = ["light", "dark"] as const;
export type ColorMode = (typeof COLOR_MODES)[number];

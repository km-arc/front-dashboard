import type { BrandDefinition } from "../theme/brand";

/** Sample runtime brands used only by Storybook to review the brand axis. Validated in brands.test.ts. */
export const STORY_BRANDS = {
  emerald: {
    id: "emerald",
    name: "Emerald",
    light: {
      primary: "oklch(0.5 0.12 160)",
      "primary-foreground": "oklch(0.99 0.003 160)",
      ring: "oklch(0.5 0.12 160)",
    },
    dark: {
      primary: "oklch(0.75 0.14 160)",
      "primary-foreground": "oklch(0.2 0.03 160)",
      ring: "oklch(0.75 0.14 160)",
    },
    radius: "0.75rem",
  },
  violet: {
    id: "violet",
    name: "Violet",
    light: {
      primary: "oklch(0.5 0.2 290)",
      "primary-foreground": "oklch(0.99 0.003 290)",
      ring: "oklch(0.5 0.2 290)",
    },
    dark: {
      primary: "oklch(0.75 0.15 290)",
      "primary-foreground": "oklch(0.2 0.04 290)",
      ring: "oklch(0.75 0.15 290)",
    },
    radius: "0.25rem",
  },
} as const satisfies Record<string, BrandDefinition>;

/** Toolbar options: the default (light-blue) theme plus the sample brands. */
export const BRAND_OPTIONS = ["default", "emerald", "violet"] as const;
export type BrandOption = (typeof BRAND_OPTIONS)[number];

export function getStoryBrand(option: string): BrandDefinition | null {
  return option in STORY_BRANDS ? STORY_BRANDS[option as keyof typeof STORY_BRANDS] : null;
}

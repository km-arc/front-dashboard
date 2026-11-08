import type { MetadataRoute } from "next";
import { LOCALE_INFO, type Locale } from "@front-dashboard/ui/locales";

/**
 * Default light-theme colors as hex (a manifest cannot hold oklch). They match --primary and --background in
 * packages/ui/src/styles/tokens.css; a brand loaded at runtime does not change an installed app's colors.
 */
export const APP_COLORS = {
  theme: "#0075bd",
  backgroundLight: "#fafcfe",
  backgroundDark: "#0b1016",
} as const;

export interface ManifestInput {
  locale: Locale;
  name: string;
  description: string;
}

/** One manifest per locale: the app opens in the language it was installed from. */
export function buildManifest({
  locale,
  name,
  description,
}: ManifestInput): MetadataRoute.Manifest {
  return {
    id: `/${locale}`,
    name,
    short_name: name,
    description,
    lang: locale,
    dir: LOCALE_INFO[locale].dir,
    start_url: `/${locale}`,
    // Scope "/" keeps a language switch (/en -> /fa) inside the installed app window.
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: APP_COLORS.backgroundLight,
    theme_color: APP_COLORS.theme,
    categories: ["shopping"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}

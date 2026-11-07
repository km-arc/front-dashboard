"use client";

import { useLocale } from "@front-dashboard/ui";

/** First tab stop: lets keyboard users jump past the header to `<main id="main">`. */
export function SkipLink() {
  const { t } = useLocale();
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-foreground focus:ring-2 focus:ring-ring"
    >
      {t("a11y.skipToContent")}
    </a>
  );
}

import { useTranslations } from "next-intl";

/** Shown when the catalog cannot be read (no API, or it failed); the rest of the store keeps working. */
export function CatalogUnavailable() {
  const t = useTranslations("catalog");

  return (
    <main id="main" className="mx-auto w-full max-w-3xl p-6">
      <p role="status" className="rounded-lg border bg-card p-4 text-muted-foreground">
        {t("unavailable")}
      </p>
    </main>
  );
}

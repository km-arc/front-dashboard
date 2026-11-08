import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { routing } from "../../../i18n/routing";
import { buildManifest } from "../../../lib/manifest";

/** Served at /en/manifest.webmanifest and /fa/manifest.webmanifest (the proxy skips paths with a dot). */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string }> },
) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return new Response("Not found", { status: 404 });

  const t = await getTranslations({ locale, namespace: "app" });
  const manifest = buildManifest({ locale, name: t("name"), description: t("description") });
  return Response.json(manifest, {
    headers: {
      "Content-Type": "application/manifest+json",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

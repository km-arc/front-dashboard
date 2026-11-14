import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CatalogUnavailable } from "../../../components/catalog/unavailable";
import { CatalogUnavailableError, getCategories } from "../../../features/catalog/api";
import { buildTree } from "../../../features/catalog/categories";
import { Link } from "../../../i18n/navigation";
import { routing } from "../../../i18n/routing";

// The category tree changes rarely: rebuild the page at most every five minutes.
export const revalidate = 300;

export default async function CategoriesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations("catalog");

  let tree;
  try {
    tree = buildTree((await getCategories(locale)).items);
  } catch (error) {
    if (error instanceof CatalogUnavailableError) return <CatalogUnavailable />;
    throw error;
  }

  return (
    <main id="main" className="mx-auto w-full max-w-5xl space-y-6 p-4 md:p-6">
      <h1 className="text-2xl font-semibold text-primary">{t("title")}</h1>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tree.map((top) => (
          <li key={top.slug} className="rounded-lg border bg-card p-4">
            <Link
              href={`/categories/${top.slug}`}
              className="block min-h-11 font-semibold hover:text-primary"
            >
              {top.name}
            </Link>
            <p className="text-sm text-muted-foreground">
              {t("productCount", { count: top.productCount })}
            </p>
            <ul className="mt-3 space-y-1">
              {top.children.map((child) => (
                <li key={child.slug}>
                  <Link
                    href={`/categories/${child.slug}`}
                    className="flex min-h-11 items-center justify-between gap-2 text-sm text-muted-foreground hover:text-foreground"
                  >
                    <span>{child.name}</span>
                    <span className="text-xs">
                      {t("productCount", { count: child.productCount })}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </main>
  );
}

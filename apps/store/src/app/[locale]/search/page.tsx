import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageNav } from "../../../components/catalog/page-nav";
import { ProductGrid } from "../../../components/catalog/product-grid";
import { SearchForm } from "../../../components/catalog/search-form";
import { SortSelect } from "../../../components/catalog/sort-select";
import { CatalogUnavailable } from "../../../components/catalog/unavailable";
import {
  CatalogUnavailableError,
  getProducts,
  getStoreCurrency,
} from "../../../features/catalog/api";
import { PAGE_SIZE, parseSearchQuery } from "../../../features/catalog/query";
import { Link } from "../../../i18n/navigation";
import { routing } from "../../../i18n/routing";

type SearchParams = { q?: string | string[]; sort?: string | string[]; page?: string | string[] };

interface SearchPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<SearchParams>;
}

export async function generateMetadata({
  params,
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "search" });
  const { q } = parseSearchQuery(await searchParams);
  // Search results are not worth indexing: they are endless and thin.
  return { title: q ? t("resultsFor", { query: q }) : t("title"), robots: { index: false } };
}

export default async function SearchPage({ params, searchParams }: SearchPageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const query = parseSearchQuery(await searchParams);
  const t = await getTranslations("search");
  const catalog = await getTranslations("catalog");

  let results;
  if (query.q) {
    try {
      const [currency, products] = await Promise.all([
        getStoreCurrency(),
        getProducts({
          locale,
          q: query.q,
          sort: query.sort,
          page: query.page,
          pageSize: PAGE_SIZE,
        }),
      ]);
      results = { currency, products };
    } catch (error) {
      if (error instanceof CatalogUnavailableError) return <CatalogUnavailable />;
      throw error;
    }
    // A page past the last one is not a page.
    if (query.page > 1 && results.products.items.length === 0) notFound();
  }

  return (
    <main id="main" className="mx-auto w-full max-w-5xl space-y-6 p-4 md:p-6">
      <h1 className="text-2xl font-semibold text-primary">{t("title")}</h1>
      <SearchForm key={query.q} initialQuery={query.q} autoFocus={!query.q} />

      {!results ? (
        <p className="text-muted-foreground">{t("prompt")}</p>
      ) : results.products.total === 0 ? (
        <div className="space-y-3 rounded-lg border bg-card p-6 text-center">
          <p>{t("noResults", { query: query.q })}</p>
          <Link
            href="/categories"
            className="inline-flex min-h-11 items-center text-primary underline"
          >
            {t("browse")}
          </Link>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              {t("resultsFor", { query: query.q })}
              {" · "}
              {catalog("productCount", { count: results.products.total })}
            </p>
            <SortSelect value={query.sort} />
          </div>
          <ProductGrid products={results.products.items} currency={results.currency} />
          <PageNav page={results.products.page} pageCount={results.products.totalPages} />
        </>
      )}
    </main>
  );
}

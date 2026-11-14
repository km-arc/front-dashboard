import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Breadcrumb, type BreadcrumbItem } from "../../../../components/catalog/breadcrumb";
import { PageNav } from "../../../../components/catalog/page-nav";
import { ProductCard } from "../../../../components/catalog/product-card";
import { SortSelect } from "../../../../components/catalog/sort-select";
import { CatalogUnavailable } from "../../../../components/catalog/unavailable";
import {
  CatalogUnavailableError,
  getCategories,
  getProducts,
  getStoreCurrency,
} from "../../../../features/catalog/api";
import { childrenOf, pathTo } from "../../../../features/catalog/categories";
import { PAGE_SIZE, parseListQuery } from "../../../../features/catalog/query";
import { Link } from "../../../../i18n/navigation";
import { routing } from "../../../../i18n/routing";

type SearchParams = { sort?: string | string[]; page?: string | string[] };

interface CategoryPageProps {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<SearchParams>;
}

export async function generateMetadata({
  params,
}: Pick<CategoryPageProps, "params">): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  try {
    const { items } = await getCategories(locale);
    const category = items.find((item) => item.slug === slug);
    return category ? { title: category.name } : {};
  } catch {
    return {};
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const query = parseListQuery(await searchParams);
  const t = await getTranslations("catalog");

  let data;
  try {
    const [categories, currency, products] = await Promise.all([
      getCategories(locale),
      getStoreCurrency(),
      getProducts({ locale, category: slug, ...query, pageSize: PAGE_SIZE }),
    ]);
    data = { categories: categories.items, currency, products };
  } catch (error) {
    if (error instanceof CatalogUnavailableError) return <CatalogUnavailable />;
    throw error;
  }

  const path = pathTo(data.categories, slug);
  const category = path[path.length - 1];
  if (!category) notFound();
  // A page past the last one is not a page.
  if (query.page > 1 && data.products.items.length === 0) notFound();

  const crumbs: BreadcrumbItem[] = [
    { label: t("title"), href: "/categories" },
    ...path.map((item, index) => ({
      label: item.name,
      ...(index < path.length - 1 ? { href: `/categories/${item.slug}` } : {}),
    })),
  ];
  const subcategories = childrenOf(data.categories, slug);

  return (
    <main id="main" className="mx-auto w-full max-w-5xl space-y-6 p-4 md:p-6">
      <Breadcrumb items={crumbs} />
      <h1 className="text-2xl font-semibold text-primary">{category.name}</h1>

      {subcategories.length > 0 ? (
        <nav aria-label={t("subcategories")}>
          <ul className="flex flex-wrap gap-2">
            {subcategories.map((child) => (
              <li key={child.slug}>
                <Link
                  href={`/categories/${child.slug}`}
                  className="inline-flex min-h-11 items-center rounded-full border px-4 text-sm hover:border-primary hover:text-primary"
                >
                  {child.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {t("productCount", { count: data.products.total })}
        </p>
        <SortSelect value={query.sort} />
      </div>

      {data.products.items.length > 0 ? (
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
          {data.products.items.map((product) => (
            <ProductCard key={product.id} product={product} currency={data.currency} />
          ))}
        </ul>
      ) : (
        <p className="rounded-lg border bg-card p-6 text-center text-muted-foreground">
          {t("empty")}
        </p>
      )}

      <PageNav page={data.products.page} pageCount={data.products.totalPages} />
    </main>
  );
}

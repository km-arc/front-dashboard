import { useTranslations } from "next-intl";
import type { CategoryNode } from "../../features/catalog/categories";
import { Link } from "../../i18n/navigation";

/**
 * The category tree as an app-style list for phones: a row per top-level category that opens to its sub-categories.
 * Plain `<details>`: it needs no script, works with the keyboard and screen readers, and `name` lets only one row stay open.
 */
export function CategoryAccordion({ tree }: { tree: CategoryNode[] }) {
  const t = useTranslations("catalog");

  return (
    <ul className="divide-y overflow-hidden rounded-lg border bg-card">
      {tree.map((top) => (
        <li key={top.slug}>
          <details name="categories" className="group">
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 px-4 [&::-webkit-details-marker]:hidden">
              <span className="font-medium">{top.name}</span>
              <span className="flex items-center gap-2 text-xs text-muted-foreground">
                {t("productCount", { count: top.productCount })}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="size-4 transition-transform group-open:rotate-180"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </span>
            </summary>
            <ul className="border-t bg-background">
              <li>
                <Link
                  href={`/categories/${top.slug}`}
                  className="flex min-h-11 items-center px-4 text-sm font-semibold text-primary"
                >
                  {t("viewAll", { name: top.name })}
                </Link>
              </li>
              {top.children.map((child) => (
                <li key={child.slug}>
                  <Link
                    href={`/categories/${child.slug}`}
                    className="flex min-h-11 items-center justify-between gap-2 px-4 text-sm text-muted-foreground hover:text-foreground"
                  >
                    <span>{child.name}</span>
                    <span className="text-xs">
                      {t("productCount", { count: child.productCount })}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </details>
        </li>
      ))}
    </ul>
  );
}

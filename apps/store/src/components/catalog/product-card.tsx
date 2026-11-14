import { useLocale, useTranslations } from "next-intl";
import type { components } from "@front-dashboard/api";
import { createFormatters } from "@front-dashboard/ui/format";
import { DEFAULT_LOCALE, isLocale } from "@front-dashboard/ui/locales";
import { PRODUCT_PAGES_AVAILABLE } from "../../features/catalog/config";
import { discountPercent } from "../../features/catalog/pricing";
import { Link } from "../../i18n/navigation";

type Product = components["schemas"]["ProductSummary"];

/**
 * One product in a list: a neutral placeholder where the picture goes, the name, the price from the store currency
 * (with the old price and the saving when discounted), the kind and the stock. A link once product pages exist.
 */
export function ProductCard({ product, currency }: { product: Product; currency: string }) {
  const t = useTranslations("catalog");
  const current = useLocale();
  const { money } = createFormatters(isLocale(current) ? current : DEFAULT_LOCALE);
  const saving = discountPercent(product.price, product.compareAtPrice);
  const initial = Array.from(product.name.trim())[0] ?? "";

  const body = (
    <>
      <div
        aria-hidden="true"
        className="flex aspect-[4/3] items-center justify-center bg-muted text-3xl font-semibold text-muted-foreground"
      >
        {initial}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="line-clamp-2 text-sm font-medium">{product.name}</h3>
        {product.kind !== "physical" ? (
          <p className="text-xs text-muted-foreground">{t(`kind.${product.kind}`)}</p>
        ) : null}
        <div className="mt-auto space-y-1 pt-2">
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="font-semibold">{money(product.price, currency)}</span>
            {saving !== null && product.compareAtPrice !== undefined ? (
              <>
                <s className="text-xs text-muted-foreground">
                  {money(product.compareAtPrice, currency)}
                </s>
                <span className="rounded bg-primary px-1.5 text-xs text-primary-foreground">
                  {t("discount", { percent: saving })}
                </span>
              </>
            ) : null}
          </p>
          {!product.inStock ? <p className="text-xs text-destructive">{t("outOfStock")}</p> : null}
        </div>
      </div>
    </>
  );

  const frame = "flex h-full flex-col overflow-hidden rounded-lg border bg-card";
  return (
    <li>
      {PRODUCT_PAGES_AVAILABLE ? (
        <Link
          href={`/products/${product.slug}`}
          className={`${frame} transition-colors hover:border-primary`}
        >
          {body}
        </Link>
      ) : (
        <div className={frame}>{body}</div>
      )}
    </li>
  );
}

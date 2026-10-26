import { forwardRef, type HTMLAttributes, type SVGProps } from "react";
import { useLocale } from "../../i18n/locale-provider";
import { cn } from "../../lib/utils";
import { Button } from "./button";

export type PageItem = number | "start-ellipsis" | "end-ellipsis";

function range(from: number, to: number): number[] {
  return Array.from({ length: Math.max(0, to - from + 1) }, (_, index) => from + index);
}

/**
 * Page numbers to show: always first and last, the current page with `siblingCount` neighbors, and
 * ellipses in between. The number of slots stays constant (2 * siblingCount + 5) so the bar does not jump.
 */
export function getPageItems(page: number, pageCount: number, siblingCount = 1): PageItem[] {
  const total = Math.max(0, Math.floor(pageCount));
  if (total === 0) return [];
  const siblings = Math.max(0, Math.floor(siblingCount));
  const current = Math.min(Math.max(1, Math.floor(page)), total);

  if (total <= siblings * 2 + 5) return range(1, total);

  const left = Math.max(current - siblings, 1);
  const right = Math.min(current + siblings, total);
  const showLeftDots = left > 2;
  const showRightDots = right < total - 2;
  const edgeCount = 3 + 2 * siblings;

  if (!showLeftDots && showRightDots) return [...range(1, edgeCount), "end-ellipsis", total];
  if (showLeftDots && !showRightDots) {
    return [1, "start-ellipsis", ...range(total - edgeCount + 1, total)];
  }
  return [1, "start-ellipsis", ...range(left, right), "end-ellipsis", total];
}

/** Points toward the end of the line (right in LTR); callers flip it with `rtl:`. */
function ChevronEndIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

export interface PaginationProps extends Omit<HTMLAttributes<HTMLElement>, "onChange"> {
  /** Current page, 1-based. */
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
}

/** Controlled page navigation. Digits follow the locale (Persian digits in fa); arrows flip in RTL. */
export const Pagination = forwardRef<HTMLElement, PaginationProps>(
  ({ page, pageCount, onPageChange, siblingCount = 1, className, ...props }, ref) => {
    const { t, formatters } = useLocale();
    const items = getPageItems(page, pageCount, siblingCount);
    if (items.length === 0) return null;

    const total = Math.floor(pageCount);
    const current = Math.min(Math.max(1, Math.floor(page)), total);

    return (
      <nav
        ref={ref}
        aria-label={t("a11y.pagination")}
        className={cn("flex justify-center", className)}
        {...props}
      >
        <ul className="flex flex-wrap items-center gap-1">
          <li>
            <Button
              variant="ghost"
              size="icon"
              aria-label={t("common.previous")}
              disabled={current <= 1}
              onClick={() => onPageChange(current - 1)}
            >
              <ChevronEndIcon className="-scale-x-100 rtl:scale-x-100" />
            </Button>
          </li>
          {items.map((item) =>
            typeof item === "number" ? (
              <li key={item}>
                <Button
                  variant={item === current ? "default" : "outline"}
                  size="icon"
                  aria-label={t("pagination.page", { page: formatters.number(item) })}
                  aria-current={item === current ? "page" : undefined}
                  onClick={() => onPageChange(item)}
                >
                  {formatters.number(item)}
                </Button>
              </li>
            ) : (
              <li
                key={item}
                className="inline-flex size-11 items-center justify-center text-muted-foreground"
              >
                <span aria-hidden="true">…</span>
                <span className="sr-only">{t("common.more")}</span>
              </li>
            ),
          )}
          <li>
            <Button
              variant="ghost"
              size="icon"
              aria-label={t("common.next")}
              disabled={current >= total}
              onClick={() => onPageChange(current + 1)}
            >
              <ChevronEndIcon className="rtl:-scale-x-100" />
            </Button>
          </li>
        </ul>
      </nav>
    );
  },
);
Pagination.displayName = "Pagination";

import {
  forwardRef,
  type HTMLAttributes,
  type TdHTMLAttributes,
  type ThHTMLAttributes,
} from "react";
import { cn } from "../../lib/utils";

export interface TableProps extends HTMLAttributes<HTMLTableElement> {
  /**
   * Accessible name for the scrolling area. When set, the wrapper becomes a focusable region so
   * keyboard users can scroll wide tables sideways. Set it for tables that can overflow.
   */
  scrollLabel?: string;
  containerClassName?: string;
}

/** Styled native table. The wrapper scrolls horizontally on narrow screens instead of breaking the page. */
export const Table = forwardRef<HTMLTableElement, TableProps>(
  ({ className, containerClassName, scrollLabel, ...props }, ref) => (
    <div
      className={cn("relative w-full overflow-x-auto", containerClassName)}
      {...(scrollLabel ? { role: "region", "aria-label": scrollLabel, tabIndex: 0 } : {})}
    >
      <table ref={ref} className={cn("w-full caption-bottom text-sm", className)} {...props} />
    </div>
  ),
);
Table.displayName = "Table";

export const TableHeader = forwardRef<
  HTMLTableSectionElement,
  HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
));
TableHeader.displayName = "TableHeader";

export const TableBody = forwardRef<
  HTMLTableSectionElement,
  HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn("[&_tr:last-child]:border-0", className)} {...props} />
));
TableBody.displayName = "TableBody";

export const TableFooter = forwardRef<
  HTMLTableSectionElement,
  HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0", className)}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

export const TableRow = forwardRef<HTMLTableRowElement, HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
        className,
      )}
      {...props}
    />
  ),
);
TableRow.displayName = "TableRow";

interface CellLayout {
  /** Aligned to the reading end (the opposite edge from the start), with digits of equal width. */
  numeric?: boolean;
  /** Stays visible at the reading start while the table scrolls sideways (flips in RTL). */
  sticky?: boolean;
}

/** Headers follow the reading direction (`text-start`); align numbers to the end with `text-end`. */
export const TableHead = forwardRef<
  HTMLTableCellElement,
  ThHTMLAttributes<HTMLTableCellElement> & CellLayout
>(({ className, numeric, sticky, scope = "col", ...props }, ref) => (
  <th
    ref={ref}
    scope={scope}
    className={cn(
      "h-11 px-4 text-start align-middle font-medium text-muted-foreground",
      numeric && "text-end tabular-nums",
      sticky && "sticky start-0 z-10 bg-background",
      className,
    )}
    {...props}
  />
));
TableHead.displayName = "TableHead";

export const TableCell = forwardRef<
  HTMLTableCellElement,
  TdHTMLAttributes<HTMLTableCellElement> & CellLayout
>(({ className, numeric, sticky, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "p-4 align-middle",
      numeric && "text-end tabular-nums",
      sticky && "sticky start-0 z-10 bg-background",
      className,
    )}
    {...props}
  />
));
TableCell.displayName = "TableCell";

export const TableCaption = forwardRef<
  HTMLTableCaptionElement,
  HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption ref={ref} className={cn("mt-4 text-sm text-muted-foreground", className)} {...props} />
));
TableCaption.displayName = "TableCaption";

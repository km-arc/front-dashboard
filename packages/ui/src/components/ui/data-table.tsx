"use client";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type Header,
  type RowSelectionState,
  type SortingState,
} from "@tanstack/react-table";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useLocale } from "../../i18n/locale-provider";
import { cn } from "../../lib/utils";
import { Checkbox } from "./checkbox";
import { EmptyState } from "./empty-state";
import { ChevronDownIcon, ChevronUpIcon } from "./icons";
import { Pagination } from "./pagination";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

/** Per-column layout hints, set through `meta` in a column definition. */
export interface DataTableColumnMeta {
  /** Reading-end aligned with equal-width digits (amounts, quantities). */
  numeric?: boolean;
  /** Pinned to the reading start while scrolling sideways (flips in RTL). */
  sticky?: boolean;
}

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  /** Accessible name of the table (read by screen readers, also names the scrolling region). */
  caption: string;
  /** Adds a checkbox column with select-all for the current page. */
  selectable?: boolean;
  /** Called with the selected rows whenever the selection changes. */
  onSelectionChange?: (rows: TData[]) => void;
  /** Text filter across all text/number columns. Keep the input in the page and pass its value. */
  globalFilter?: string;
  pageSize?: number;
  /** Stable id per row, so selection survives sorting and data refreshes. Defaults to the index. */
  getRowId?: (row: TData, index: number) => string;
  /** Replaces the default empty state. */
  emptyState?: ReactNode;
  className?: string;
}

const metaOf = (column: { columnDef: { meta?: unknown } }) =>
  column.columnDef.meta as DataTableColumnMeta | undefined;

function createSelectColumn<TData, TValue>(labels: {
  selectAll: string;
  selectRow: string;
}): ColumnDef<TData, TValue> {
  return {
    id: "select",
    enableSorting: false,
    header: ({ table }) => (
      <Checkbox
        aria-label={labels.selectAll}
        checked={
          table.getIsAllPageRowsSelected()
            ? true
            : table.getIsSomePageRowsSelected()
              ? "indeterminate"
              : false
        }
        onCheckedChange={(value: boolean | "indeterminate") =>
          table.toggleAllPageRowsSelected(value === true)
        }
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        aria-label={labels.selectRow}
        checked={row.getIsSelected()}
        onCheckedChange={(value: boolean | "indeterminate") => row.toggleSelected(value === true)}
      />
    ),
  };
}

function HeaderCell<TData>({ header }: { header: Header<TData, unknown> }) {
  if (header.isPlaceholder) return <TableHead />;
  const meta = metaOf(header.column);
  const content = flexRender(header.column.columnDef.header, header.getContext());

  if (!header.column.getCanSort()) {
    return (
      <TableHead numeric={meta?.numeric} sticky={meta?.sticky}>
        {content}
      </TableHead>
    );
  }

  const sorted = header.column.getIsSorted();
  return (
    <TableHead
      numeric={meta?.numeric}
      sticky={meta?.sticky}
      aria-sort={sorted === "asc" ? "ascending" : sorted === "desc" ? "descending" : "none"}
    >
      <button
        type="button"
        onClick={header.column.getToggleSortingHandler()}
        className="-mx-1 inline-flex min-h-11 items-center gap-1 rounded-sm px-1 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {content}
        {sorted === "asc" ? (
          <ChevronUpIcon className="size-4" />
        ) : (
          <ChevronDownIcon className={cn("size-4", sorted ? "" : "opacity-30")} />
        )}
      </button>
    </TableHead>
  );
}

/**
 * Client-side data table built on TanStack Table: sorting, global filter, row selection and paging.
 * Texts and digits come from the LocaleProvider (like Pagination). For server-side paging/sorting of
 * large admin lists, build on the Table primitives and Pagination instead.
 */
export function DataTable<TData, TValue>({
  columns,
  data,
  caption,
  selectable = false,
  onSelectionChange,
  globalFilter,
  pageSize = 10,
  getRowId,
  emptyState,
  className,
}: DataTableProps<TData, TValue>) {
  const { t, formatters } = useLocale();
  const selectAll = t("table.selectAll");
  const selectRow = t("table.selectRow");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const allColumns = useMemo(
    () =>
      selectable
        ? [createSelectColumn<TData, TValue>({ selectAll, selectRow }), ...columns]
        : columns,
    [selectable, columns, selectAll, selectRow],
  );

  const table = useReactTable({
    data,
    columns: allColumns,
    getRowId,
    state: { sorting, rowSelection, globalFilter },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize } },
  });

  useEffect(() => {
    onSelectionChange?.(table.getSelectedRowModel().rows.map((row) => row.original));
    // Only a selection change should notify the parent, not a new callback identity.
  }, [rowSelection]);

  const rows = table.getRowModel().rows;
  const pageCount = table.getPageCount();
  const selectedCount = table.getSelectedRowModel().rows.length;

  return (
    <div className={cn("grid gap-3", className)}>
      <Table scrollLabel={caption}>
        <TableCaption className="sr-only">{caption}</TableCaption>
        <TableHeader>
          {table.getHeaderGroups().map((group) => (
            <TableRow key={group.id}>
              {group.headers.map((header) => (
                <HeaderCell key={header.id} header={header} />
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {rows.length > 0 ? (
            rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() ? "selected" : undefined}>
                {row.getVisibleCells().map((cell) => {
                  const meta = metaOf(cell.column);
                  return (
                    <TableCell key={cell.id} numeric={meta?.numeric} sticky={meta?.sticky}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          ) : (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={allColumns.length}>
                {emptyState ?? <EmptyState title={t("table.empty")} />}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {selectable || pageCount > 1 ? (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {selectable ? (
            <p aria-live="polite" className="text-sm text-muted-foreground">
              {t("table.selectedCount", {
                count: formatters.number(selectedCount),
                total: formatters.number(table.getFilteredRowModel().rows.length),
              })}
            </p>
          ) : (
            <span />
          )}
          <Pagination
            className="sm:justify-end"
            page={table.getState().pagination.pageIndex + 1}
            pageCount={pageCount}
            onPageChange={(page) => table.setPageIndex(page - 1)}
          />
        </div>
      ) : null}
    </div>
  );
}

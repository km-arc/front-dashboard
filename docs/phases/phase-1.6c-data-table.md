# Step 1.6c – DataTable (TanStack Table)

Status: implemented (patch delivered). Adds the data-driven table that was approved for 1.6 but is not part of
the 1.6a Table/Pagination/EmptyState already in `main`. Step 1.6b (Tabs, Accordion) is unchanged.

## Decisions (owner-approved)
- DataTable is data-driven with **TanStack Table**: sorting, global filter, row selection, client paging.
- Texts and digits come from the **LocaleProvider** (same as the existing `Pagination`).

## Delivered
- `components/ui/data-table.tsx`: `DataTable<TData, TValue>` with props `columns`, `data`, `caption`, `selectable`,
  `onSelectionChange`, `globalFilter`, `pageSize`, `getRowId`, `emptyState`. Sortable headers (`aria-sort`, 44px
  button), select-all-on-page checkbox (indeterminate state), "x of y selected" status, the existing `Pagination`,
  the existing `EmptyState`. Column hints: `meta: { sticky, numeric } satisfies DataTableColumnMeta`.
- `components/ui/table.tsx` (additive, backward compatible): `Table scrollLabel` (named, keyboard-focusable
  scroll region), `TableHead`/`TableCell` props `sticky` (pins to the reading start, `start-0`) and `numeric`
  (`text-end tabular-nums`), `scope="col"` on headers by default. Existing classes are unchanged.
- Messages (via glue script): `table.selectAll`, `table.selectRow`, `table.selectedCount` in en and fa.
- Tests: `data-table.test.tsx`, `table-layout.test.tsx`. Story: `data-table.stories.tsx` (+ `storybook/data-table-text.ts`).
- Docs: this file and `docs/checklists/visual-review-1.6c.md`.

## Apply
```bash
git am step-1.6c-data-table.patch
python3 apply-data-table-glue.py        # messages + barrel export + ROADMAP row 1.6c (idempotent)
pnpm --filter @front-dashboard/ui add @tanstack/react-table
pnpm format && pnpm lint && pnpm typecheck && pnpm test --force
```

## Usage
```tsx
const columns = useMemo<ColumnDef<Order>[]>(() => [
  { accessorKey: "customer", header: t("orders.customer"), meta: { sticky: true } satisfies DataTableColumnMeta },
  { accessorKey: "total", header: t("orders.total"), meta: { numeric: true } satisfies DataTableColumnMeta,
    cell: ({ row }) => formatters.money(row.original.total, "IRT") },
], [t, formatters]);
<DataTable caption={t("orders.title")} columns={columns} data={orders} selectable getRowId={(r) => r.id} />
```
Keep `columns` and `data` referentially stable (`useMemo`). Pass `getRowId` when rows can be re-ordered or
refreshed so the selection survives.

## Not in this step
Server-side paging/sorting/filtering for large admin lists (build on Table + Pagination once the .NET list
endpoints exist), column visibility menu, row expansion, inline editing.

## Hand-off notes
- Verified in the authoring sandbox: strict typecheck against the owner's real Table/Pagination/EmptyState and
  messages (TanStack/Radix/React stubbed), repo convention rules (comments included), glue script (messages
  anchors, barrel, ROADMAP; idempotent).
- **Not executed there** (no TanStack, jsdom, Storybook): DataTable behavior tests and the story. Run
  `pnpm test --force`; if a DataTable test fails send the first FAIL.
- `DataTable` needs a `LocaleProvider` (like `Pagination`); the Storybook decorator provides one.

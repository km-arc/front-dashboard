import type { Meta, StoryObj } from "@storybook/react-vite";
import { useMemo, useState, type ChangeEvent } from "react";
import { type DemoOrder, useDataTableText } from "../../storybook/data-table-text";
import { Button } from "./button";
import { DataTable, type DataTableColumnDef, type DataTableColumnMeta } from "./data-table";
import { EmptyState } from "./empty-state";
import { Input } from "./input";

const meta = {
  title: "Data/DataTable",
  component: DataTable,
  args: { caption: "", columns: [], data: [] },
} satisfies Meta<typeof DataTable>;

export default meta;
type Story = StoryObj<typeof meta>;

function Example({ selectable, filterable }: { selectable?: boolean; filterable?: boolean }) {
  const t = useDataTableText();
  const [filter, setFilter] = useState("");

  const columns = useMemo<DataTableColumnDef<DemoOrder>[]>(
    () => [
      {
        accessorKey: "customer",
        header: t.customer,
        meta: { sticky: true } satisfies DataTableColumnMeta,
      },
      {
        accessorKey: "status",
        header: t.status,
        cell: ({ row }) => t.statusLabel[row.original.status],
      },
      {
        accessorKey: "total",
        header: t.total,
        meta: { numeric: true } satisfies DataTableColumnMeta,
        cell: ({ row }) => t.money(row.original.total),
      },
    ],
    [t],
  );

  return (
    <div className="grid gap-3">
      {filterable ? (
        <Input
          aria-label={t.filter}
          placeholder={t.filter}
          value={filter}
          onChange={(event: ChangeEvent<HTMLInputElement>) => setFilter(event.target.value)}
        />
      ) : null}
      <DataTable
        caption={t.caption}
        columns={columns}
        data={t.orders}
        pageSize={8}
        selectable={selectable}
        globalFilter={filter}
        getRowId={(row) => row.id}
        emptyState={
          <EmptyState
            title={t.emptyTitle}
            description={t.emptyBody}
            action={
              <Button variant="outline" onClick={() => setFilter("")}>
                {t.clear}
              </Button>
            }
          />
        }
      />
    </div>
  );
}

export const Default: Story = { render: () => <Example /> };
export const SelectableRows: Story = { render: () => <Example selectable /> };
/** Type something that matches nothing to see the empty state. */
export const WithFilter: Story = { render: () => <Example filterable selectable /> };

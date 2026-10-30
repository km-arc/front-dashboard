// @vitest-environment jsdom
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactElement } from "react";
import { describe, expect, it, vi } from "vitest";
import { LocaleProvider } from "../../i18n/locale-provider";
import "../../test/polyfills";
import { directions, expectNoA11yViolations, renderWithDir } from "../../test/utils";
import { DataTable, type DataTableColumnDef, type DataTableColumnMeta } from "./data-table";

interface Person {
  id: string;
  name: string;
  amount: number;
}

const names = ["Zoe", "Adam", "Mia", "Bob", "Eve", "Cyd", "Dan", "Fay", "Gus", "Hal", "Ivy", "Jon"];
const people: Person[] = names.map((name, i) => ({ id: `p${i}`, name, amount: (i + 1) * 100 }));

const columns: DataTableColumnDef<Person>[] = [
  { accessorKey: "name", header: "Name", meta: { sticky: true } satisfies DataTableColumnMeta },
  {
    accessorKey: "amount",
    header: "Amount",
    meta: { numeric: true } satisfies DataTableColumnMeta,
  },
];

const getRowId = (row: Person) => row.id;

/** DataTable reads texts from the LocaleProvider (like Pagination), so every test provides one. */
function renderTable(ui: ReactElement, dir: "ltr" | "rtl") {
  return renderWithDir(<LocaleProvider locale="en">{ui}</LocaleProvider>, dir);
}

/** Body rows only (the header row is excluded). */
const bodyRows = () => screen.getAllByRole("row").slice(1);
const firstNames = () => bodyRows().map((r) => within(r).getAllByRole("cell")[0]?.textContent);

describe.each(directions)("DataTable (%s)", (dir) => {
  it("renders a named, scrollable table with the first page", () => {
    renderTable(
      <DataTable
        caption="People"
        columns={columns}
        data={people}
        pageSize={5}
        getRowId={getRowId}
      />,
      dir,
    );
    expect(screen.getByRole("table", { name: "People" })).toBeTruthy();
    expect(screen.getByRole("region", { name: "People" })).toBeTruthy();
    expect(firstNames()).toEqual(["Zoe", "Adam", "Mia", "Bob", "Eve"]);
  });

  it("sorts by a column and reports aria-sort", async () => {
    renderTable(
      <DataTable
        caption="People"
        columns={columns}
        data={people}
        pageSize={5}
        getRowId={getRowId}
      />,
      dir,
    );
    const user = userEvent.setup();
    const head = screen.getByRole("columnheader", { name: "Name" });
    expect(head.getAttribute("aria-sort")).toBe("none");
    await user.click(within(head).getByRole("button"));
    expect(head.getAttribute("aria-sort")).toBe("ascending");
    expect(firstNames()).toEqual(["Adam", "Bob", "Cyd", "Dan", "Eve"]);
    await user.click(within(head).getByRole("button"));
    expect(head.getAttribute("aria-sort")).toBe("descending");
    expect(firstNames()[0]).toBe("Zoe");
  });

  it("filters rows with globalFilter", () => {
    renderTable(
      <DataTable
        caption="People"
        columns={columns}
        data={people}
        globalFilter="y"
        getRowId={getRowId}
      />,
      dir,
    );
    expect(firstNames()).toEqual(["Cyd", "Fay", "Ivy"]);
  });

  it("shows the empty state when nothing matches", () => {
    renderTable(
      <DataTable
        caption="People"
        columns={columns}
        data={people}
        globalFilter="zzz"
        getRowId={getRowId}
      />,
      dir,
    );
    expect(screen.getByText("No data to display")).toBeTruthy();
  });

  it("pages through the data", async () => {
    renderTable(
      <DataTable
        caption="People"
        columns={columns}
        data={people}
        pageSize={5}
        getRowId={getRowId}
      />,
      dir,
    );
    await userEvent.setup().click(screen.getByRole("button", { name: "Next" }));
    expect(firstNames()).toEqual(["Cyd", "Dan", "Fay", "Gus", "Hal"]);
  });

  it("selects rows, selects the whole page, and reports the selection", async () => {
    const onSelectionChange = vi.fn();
    renderTable(
      <DataTable
        selectable
        caption="People"
        columns={columns}
        data={people}
        pageSize={5}
        getRowId={getRowId}
        onSelectionChange={onSelectionChange}
      />,
      dir,
    );
    const user = userEvent.setup();
    const rowBoxes = screen.getAllByRole("checkbox", { name: "Select row" });
    await user.click(rowBoxes[1]!);
    expect(onSelectionChange).toHaveBeenLastCalledWith([people[1]]);
    expect(screen.getByText("1 of 12 selected")).toBeTruthy();

    await user.click(screen.getByRole("checkbox", { name: "Select all rows on this page" }));
    expect(onSelectionChange.mock.lastCall?.[0]).toHaveLength(5);
    expect(screen.getByText("5 of 12 selected")).toBeTruthy();
  });

  it("pins and aligns columns with logical utilities", () => {
    renderTable(
      <DataTable
        caption="People"
        columns={columns}
        data={people}
        pageSize={5}
        getRowId={getRowId}
      />,
      dir,
    );
    const cells = within(bodyRows()[0]!).getAllByRole("cell");
    expect(cells[0]?.className).toContain("start-0");
    expect(cells[1]?.className).toContain("text-end");
  });

  it("has no a11y violations", async () => {
    const { container } = renderTable(
      <DataTable
        selectable
        caption="People"
        columns={columns}
        data={people}
        pageSize={5}
        getRowId={getRowId}
      />,
      dir,
    );
    await expectNoA11yViolations(container);
  });
});

describe("DataTable in Persian", () => {
  it("uses Persian texts and digits from the LocaleProvider", async () => {
    render(
      <div dir="rtl">
        <LocaleProvider locale="fa">
          <DataTable
            selectable
            caption="افراد"
            columns={columns}
            data={people}
            pageSize={5}
            getRowId={getRowId}
          />
        </LocaleProvider>
      </div>,
    );
    const user = userEvent.setup();
    await user.click(screen.getAllByRole("checkbox", { name: "انتخاب ردیف" })[0]!);
    expect(screen.getByText("۱ از ۱۲ انتخاب شده")).toBeTruthy();
  });
});

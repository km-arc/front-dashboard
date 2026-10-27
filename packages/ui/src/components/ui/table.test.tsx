// @vitest-environment jsdom
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { directions, expectNoA11yViolations, renderWithDir } from "../../test/utils";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

function Sample() {
  return (
    <Table>
      <TableCaption>Orders</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Customer</TableHead>
          <TableHead className="text-end">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Ada</TableCell>
          <TableCell className="text-end">10</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Alan</TableCell>
          <TableCell className="text-end">20</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell>Total</TableCell>
          <TableCell className="text-end">30</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}

describe.each(directions)("Table (%s)", (dir) => {
  it("exposes table semantics named by its caption", () => {
    renderWithDir(<Sample />, dir);
    expect(screen.getByRole("table", { name: "Orders" })).toBeTruthy();
    expect(screen.getAllByRole("columnheader")).toHaveLength(2);
    expect(screen.getAllByRole("row")).toHaveLength(4);
    expect(screen.getByRole("cell", { name: "Ada" })).toBeTruthy();
  });

  it("scrolls horizontally inside its own container", () => {
    const { container } = renderWithDir(<Sample />, dir);
    const wrapper = container.querySelector("table")?.parentElement;
    expect(wrapper?.className).toContain("overflow-x-auto");
  });

  it("aligns headers to the reading direction and merges custom classes", () => {
    renderWithDir(<Sample />, dir);
    expect(screen.getByRole("columnheader", { name: "Customer" }).className).toContain(
      "text-start",
    );
    expect(screen.getByRole("columnheader", { name: "Amount" }).className).toContain("text-end");
  });

  it("has no a11y violations", async () => {
    const { container } = renderWithDir(<Sample />, dir);
    await expectNoA11yViolations(container);
  });
});

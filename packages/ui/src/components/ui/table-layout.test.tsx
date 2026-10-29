// @vitest-environment jsdom
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { directions, expectNoA11yViolations, renderWithDir } from "../../test/utils";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

function Example(props: { scrollLabel?: string }) {
  return (
    <Table scrollLabel={props.scrollLabel}>
      <TableCaption>Orders</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead sticky>Customer</TableHead>
          <TableHead numeric>Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell sticky>Sara</TableCell>
          <TableCell numeric>1,200</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

describe.each(directions)("Table layout props (%s)", (dir) => {
  it("is a plain wrapper without scrollLabel", () => {
    renderWithDir(<Example />, dir);
    expect(screen.queryByRole("region")).toBeNull();
  });

  it("becomes a labelled, keyboard-focusable scroll region with scrollLabel", () => {
    renderWithDir(<Example scrollLabel="Orders table" />, dir);
    const region = screen.getByRole("region", { name: "Orders table" });
    expect(region.getAttribute("tabindex")).toBe("0");
  });

  it("gives column headers a scope", () => {
    renderWithDir(<Example />, dir);
    for (const head of screen.getAllByRole("columnheader")) {
      expect(head.getAttribute("scope")).toBe("col");
    }
  });

  it("pins and aligns cells with logical utilities (no left/right)", () => {
    renderWithDir(<Example />, dir);
    const sticky = screen.getByRole("cell", { name: "Sara" });
    expect(sticky.className).toContain("sticky start-0");
    expect(sticky.className).not.toMatch(/(^|\s)(left|right)-/);
    const numeric = screen.getByRole("cell", { name: "1,200" });
    expect(numeric.className).toContain("text-end");
    expect(numeric.className).toContain("tabular-nums");
  });

  it("has no a11y violations", async () => {
    const { container } = renderWithDir(<Example scrollLabel="Orders table" />, dir);
    await expectNoA11yViolations(container);
  });
});

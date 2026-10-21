// @vitest-environment jsdom
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import "../../test/polyfills";
import { directions, expectNoA11yViolations, renderWithDir } from "../../test/utils";
import { Button } from "./button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  sheetVariants,
} from "./sheet";

function Example(props: { side?: "top" | "bottom" | "start" | "end" }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Menu</Button>
      </SheetTrigger>
      <SheetContent side={props.side} closeLabel="Close menu">
        <SheetHeader>
          <SheetTitle>Navigation</SheetTitle>
          <SheetDescription>Pick a page.</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}

describe("sheetVariants (logical edges)", () => {
  it("uses start/end instead of left/right", () => {
    expect(sheetVariants({ side: "start" })).toContain("start-0");
    expect(sheetVariants({ side: "start" })).toContain("border-e");
    expect(sheetVariants({ side: "end" })).toContain("end-0");
    expect(sheetVariants({ side: "end" })).toContain("border-s");
    expect(sheetVariants()).toContain("end-0");
    for (const side of ["top", "bottom", "start", "end"] as const) {
      expect(sheetVariants({ side })).not.toMatch(/(^|\s)(left|right)-0/);
    }
  });
});

describe.each(directions)("Sheet (%s)", (dir) => {
  it("opens from the trigger as a dialog and closes with Escape", async () => {
    renderWithDir(<Example />, dir);
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Menu" }));
    expect(await screen.findByRole("dialog", { name: "Navigation" })).toBeTruthy();
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  });

  it("applies the requested side classes and the provider direction", async () => {
    renderWithDir(<Example side="start" />, dir);
    await userEvent.setup().click(screen.getByRole("button", { name: "Menu" }));
    const dialog = await screen.findByRole("dialog");
    expect(dialog.className).toContain("start-0");
    expect(dialog.getAttribute("dir")).toBe(dir);
  });

  it("has a labelled close button", async () => {
    renderWithDir(<Example />, dir);
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Menu" }));
    await user.click(await screen.findByRole("button", { name: "Close menu" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  });

  it("has no a11y violations when open", async () => {
    renderWithDir(<Example />, dir);
    await userEvent.setup().click(screen.getByRole("button", { name: "Menu" }));
    await screen.findByRole("dialog");
    await expectNoA11yViolations(document.body);
  });
});

// @vitest-environment jsdom
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import "../../test/polyfills";
import { directions, expectNoA11yViolations, renderWithDir } from "../../test/utils";
import { Button } from "./button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";

function Example(props: { onOpenChange?: (open: boolean) => void; closeLabel?: string }) {
  return (
    <Dialog onOpenChange={props.onOpenChange}>
      <DialogTrigger asChild>
        <Button>Edit profile</Button>
      </DialogTrigger>
      <DialogContent closeLabel={props.closeLabel}>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>Change your details.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

describe.each(directions)("Dialog (%s)", (dir) => {
  it("is closed until the trigger is activated", async () => {
    renderWithDir(<Example />, dir);
    expect(screen.queryByRole("dialog")).toBeNull();
    await userEvent.setup().click(screen.getByRole("button", { name: "Edit profile" }));
    const dialog = await screen.findByRole("dialog", { name: "Edit profile" });
    expect(dialog.getAttribute("aria-describedby")).toBeTruthy();
  });

  it("closes with Escape and returns focus to the trigger", async () => {
    const onOpenChange = vi.fn();
    renderWithDir(<Example onOpenChange={onOpenChange} />, dir);
    const user = userEvent.setup();
    const trigger = screen.getByRole("button", { name: "Edit profile" });
    await user.click(trigger);
    await screen.findByRole("dialog");
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    await waitFor(() => expect(document.activeElement).toBe(trigger));
  });

  it("has a labelled close button", async () => {
    renderWithDir(<Example closeLabel="Close dialog" />, dir);
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Edit profile" }));
    await user.click(await screen.findByRole("button", { name: "Close dialog" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  });

  it("follows the provider direction inside the portal", async () => {
    renderWithDir(<Example />, dir);
    await userEvent.setup().click(screen.getByRole("button", { name: "Edit profile" }));
    await screen.findByRole("dialog");
    const overlay = document.querySelector("[data-state=open][dir]");
    expect(overlay?.getAttribute("dir")).toBe(dir);
  });

  it("keeps focus inside while open", async () => {
    renderWithDir(<Example />, dir);
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Edit profile" }));
    const dialog = await screen.findByRole("dialog");
    await user.tab();
    await user.tab();
    await user.tab();
    expect(dialog.contains(document.activeElement)).toBe(true);
  });

  it("has no a11y violations when open", async () => {
    renderWithDir(<Example />, dir);
    await userEvent.setup().click(screen.getByRole("button", { name: "Edit profile" }));
    await screen.findByRole("dialog");
    await expectNoA11yViolations(document.body);
  });
});

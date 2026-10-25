// @vitest-environment jsdom
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import "../../test/polyfills";
import { directions, expectNoA11yViolations, renderWithDir } from "../../test/utils";
import { Button } from "./button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

function Example() {
  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        <Button>Help</Button>
      </TooltipTrigger>
      <TooltipContent>More info</TooltipContent>
    </Tooltip>
  );
}

describe.each(directions)("Tooltip (%s)", (dir) => {
  it("shows on keyboard focus and describes the trigger", async () => {
    renderWithDir(<Example />, dir);
    expect(screen.queryByRole("tooltip")).toBeNull();
    await userEvent.setup().tab();
    const tip = await screen.findByRole("tooltip");
    expect(tip.textContent).toBe("More info");
    const trigger = screen.getByRole("button", { name: "Help" });
    expect(trigger.getAttribute("aria-describedby")).toBe(tip.id);
  });

  it("shows on hover and hides on Escape", async () => {
    renderWithDir(<Example />, dir);
    const user = userEvent.setup();
    await user.hover(screen.getByRole("button", { name: "Help" }));
    await screen.findByRole("tooltip");
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("tooltip")).toBeNull());
  });

  it("renders in the provider direction inside the portal", async () => {
    renderWithDir(<Example />, dir);
    await userEvent.setup().tab();
    await screen.findByRole("tooltip");
    const visible = screen.getAllByText("More info")[0];
    expect(visible?.closest("[dir]")?.getAttribute("dir")).toBe(dir);
  });

  it("has no a11y violations while open", async () => {
    renderWithDir(<Example />, dir);
    await userEvent.setup().tab();
    await screen.findByRole("tooltip");
    await expectNoA11yViolations(document.body);
  });
});

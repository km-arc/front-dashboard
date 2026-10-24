// @vitest-environment jsdom
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import "../../test/polyfills";
import { directions, expectNoA11yViolations, renderWithDir } from "../../test/utils";
import { Checkbox } from "./checkbox";
import { Label } from "./label";

describe.each(directions)("Checkbox (%s)", (dir) => {
  it("toggles with click and Space", async () => {
    const onCheckedChange = vi.fn();
    renderWithDir(<Checkbox aria-label="Accept" onCheckedChange={onCheckedChange} />, dir);
    const box = screen.getByRole("checkbox", { name: "Accept" });
    const user = userEvent.setup();
    await user.click(box);
    expect(box.getAttribute("aria-checked")).toBe("true");
    await user.keyboard(" ");
    expect(box.getAttribute("aria-checked")).toBe("false");
    expect(onCheckedChange).toHaveBeenNthCalledWith(1, true);
    expect(onCheckedChange).toHaveBeenNthCalledWith(2, false);
  });

  it("toggles when its label is clicked", async () => {
    renderWithDir(
      <div>
        <Checkbox id="terms" />
        <Label htmlFor="terms">Terms</Label>
      </div>,
      dir,
    );
    await userEvent.setup().click(screen.getByText("Terms"));
    expect(screen.getByRole("checkbox", { name: "Terms" }).getAttribute("aria-checked")).toBe(
      "true",
    );
  });

  it("supports the indeterminate state", () => {
    renderWithDir(<Checkbox aria-label="All" checked="indeterminate" />, dir);
    const box = screen.getByRole("checkbox", { name: "All" });
    expect(box.getAttribute("aria-checked")).toBe("mixed");
    expect(box.getAttribute("data-state")).toBe("indeterminate");
  });

  it("does not toggle when disabled", async () => {
    renderWithDir(<Checkbox aria-label="Accept" disabled />, dir);
    await userEvent.setup().click(screen.getByRole("checkbox", { name: "Accept" }));
    expect(screen.getByRole("checkbox", { name: "Accept" }).getAttribute("aria-checked")).toBe(
      "false",
    );
  });

  it("submits its value with a form", async () => {
    renderWithDir(
      <form data-testid="form">
        <Checkbox name="terms" aria-label="Accept" />
      </form>,
      dir,
    );
    const form = screen.getByTestId("form") as HTMLFormElement;
    expect(new FormData(form).get("terms")).toBeNull();
    await userEvent.setup().click(screen.getByRole("checkbox", { name: "Accept" }));
    expect(new FormData(form).get("terms")).toBe("on");
  });

  it("has no a11y violations", async () => {
    const { container } = renderWithDir(
      <div>
        <Checkbox id="c" />
        <Label htmlFor="c">Accept</Label>
      </div>,
      dir,
    );
    await expectNoA11yViolations(container);
  });
});

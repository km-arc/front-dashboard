// @vitest-environment jsdom
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import "../../test/polyfills";
import { directions, expectNoA11yViolations, renderWithDir } from "../../test/utils";
import { Label } from "./label";
import { Switch } from "./switch";

describe.each(directions)("Switch (%s)", (dir) => {
  it("toggles with click and keyboard", async () => {
    const onCheckedChange = vi.fn();
    renderWithDir(<Switch aria-label="Notifications" onCheckedChange={onCheckedChange} />, dir);
    const toggle = screen.getByRole("switch", { name: "Notifications" });
    const user = userEvent.setup();
    await user.click(toggle);
    expect(toggle.getAttribute("aria-checked")).toBe("true");
    await user.keyboard("{Enter}");
    expect(toggle.getAttribute("aria-checked")).toBe("false");
    expect(onCheckedChange).toHaveBeenCalledTimes(2);
  });

  it("toggles when its label is clicked", async () => {
    renderWithDir(
      <div>
        <Switch id="n" />
        <Label htmlFor="n">Notifications</Label>
      </div>,
      dir,
    );
    await userEvent.setup().click(screen.getByText("Notifications"));
    expect(screen.getByRole("switch", { name: "Notifications" }).getAttribute("aria-checked")).toBe(
      "true",
    );
  });

  it("uses logical margins on the thumb so it flips in RTL without extra code", () => {
    renderWithDir(<Switch aria-label="x" defaultChecked />, dir);
    const thumb = screen.getByRole("switch", { name: "x" }).firstElementChild;
    expect(thumb?.className).toContain("data-[state=checked]:ms-5");
    expect(thumb?.className).not.toMatch(/translate-x/);
  });

  it("does not toggle when disabled", async () => {
    renderWithDir(<Switch aria-label="x" disabled />, dir);
    await userEvent.setup().click(screen.getByRole("switch", { name: "x" }));
    expect(screen.getByRole("switch", { name: "x" }).getAttribute("aria-checked")).toBe("false");
  });

  it("submits its value with a form", async () => {
    renderWithDir(
      <form data-testid="form">
        <Switch name="alerts" aria-label="Alerts" />
      </form>,
      dir,
    );
    const form = screen.getByTestId("form") as HTMLFormElement;
    await userEvent.setup().click(screen.getByRole("switch", { name: "Alerts" }));
    expect(new FormData(form).get("alerts")).toBe("on");
  });

  it("has no a11y violations", async () => {
    const { container } = renderWithDir(
      <div>
        <Switch id="s" />
        <Label htmlFor="s">Alerts</Label>
      </div>,
      dir,
    );
    await expectNoA11yViolations(container);
  });
});

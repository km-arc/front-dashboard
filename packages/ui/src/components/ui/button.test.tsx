// @vitest-environment jsdom
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { directions, expectNoA11yViolations, renderWithDir } from "../../test/utils";
import { Button } from "./button";

describe.each(directions)("Button (%s)", (dir) => {
  it("calls onClick when clicked", async () => {
    const onClick = vi.fn();
    renderWithDir(<Button onClick={onClick}>Save</Button>, dir);
    await userEvent.setup().click(screen.getByRole("button", { name: "Save" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("is operable with the keyboard (Enter and Space)", async () => {
    const onClick = vi.fn();
    renderWithDir(<Button onClick={onClick}>Save</Button>, dir);
    const user = userEvent.setup();
    await user.tab();
    expect(screen.getByRole("button", { name: "Save" })).toBe(document.activeElement);
    await user.keyboard("{Enter}");
    await user.keyboard(" ");
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it("does not fire when disabled", async () => {
    const onClick = vi.fn();
    renderWithDir(
      <Button disabled onClick={onClick}>
        Save
      </Button>,
      dir,
    );
    await userEvent.setup().click(screen.getByRole("button", { name: "Save" }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("renders the child element with asChild", () => {
    renderWithDir(
      <Button asChild>
        <a href="/orders">Orders</a>
      </Button>,
      dir,
    );
    expect(screen.getByRole("link", { name: "Orders" })).toHaveProperty("tagName", "A");
  });

  it("has no a11y violations", async () => {
    const { container } = renderWithDir(<Button>Save</Button>, dir);
    await expectNoA11yViolations(container);
  });
});

// @vitest-environment jsdom
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { directions, expectNoA11yViolations, renderWithDir } from "../../test/utils";
import { Button } from "./button";
import { EmptyState } from "./empty-state";

describe.each(directions)("EmptyState (%s)", (dir) => {
  it("renders title, description and action", () => {
    renderWithDir(
      <EmptyState
        title="No orders"
        description="Try another filter"
        action={<Button>Retry</Button>}
      />,
      dir,
    );
    expect(screen.getByText("No orders")).toBeTruthy();
    expect(screen.getByText("Try another filter")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Retry" })).toBeTruthy();
  });

  it("hides the icon from assistive technology", () => {
    const { container } = renderWithDir(
      <EmptyState title="No orders" icon={<svg data-testid="icon" />} />,
      dir,
    );
    expect(container.querySelector('[aria-hidden="true"] [data-testid="icon"]')).not.toBeNull();
  });

  it("omits optional parts when they are not given", () => {
    const { container } = renderWithDir(<EmptyState title="No orders" />, dir);
    expect(container.querySelectorAll("p")).toHaveLength(1);
    expect(container.querySelector('[aria-hidden="true"]')).toBeNull();
  });

  it("has no a11y violations", async () => {
    const { container } = renderWithDir(
      <EmptyState
        title="No orders"
        description="Try another filter"
        action={<Button>Retry</Button>}
      />,
      dir,
    );
    await expectNoA11yViolations(container);
  });
});

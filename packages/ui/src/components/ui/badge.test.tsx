// @vitest-environment jsdom
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { directions, expectNoA11yViolations, renderWithDir } from "../../test/utils";
import { Badge } from "./badge";

describe.each(directions)("Badge (%s)", (dir) => {
  it("renders its content and merges custom classes", () => {
    renderWithDir(<Badge className="custom">New</Badge>, dir);
    expect(screen.getByText("New").className).toContain("custom");
  });

  it("applies the variant", () => {
    renderWithDir(<Badge variant="destructive">Failed</Badge>, dir);
    expect(screen.getByText("Failed").className).toContain("bg-destructive");
  });

  it("has no a11y violations", async () => {
    const { container } = renderWithDir(<Badge>New</Badge>, dir);
    await expectNoA11yViolations(container);
  });
});

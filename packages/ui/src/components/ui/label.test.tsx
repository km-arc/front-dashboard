// @vitest-environment jsdom
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { directions, expectNoA11yViolations, renderWithDir } from "../../test/utils";
import { Label } from "./label";

function Field() {
  return (
    <div>
      <Label htmlFor="name">Name</Label>
      <input id="name" />
    </div>
  );
}

describe.each(directions)("Label (%s)", (dir) => {
  it("is associated with its control", () => {
    renderWithDir(<Field />, dir);
    expect(screen.getByLabelText("Name").tagName).toBe("INPUT");
  });

  it("has no a11y violations", async () => {
    const { container } = renderWithDir(<Field />, dir);
    await expectNoA11yViolations(container);
  });
});

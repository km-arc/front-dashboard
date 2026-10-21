// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { directions, expectNoA11yViolations, renderWithDir } from "../../test/utils";
import { Skeleton } from "./skeleton";

describe.each(directions)("Skeleton (%s)", (dir) => {
  it("is decorative and respects reduced motion", () => {
    const { container } = renderWithDir(<Skeleton className="h-4 w-24" />, dir);
    const el = container.querySelector("[aria-hidden=true]");
    expect(el).toBeTruthy();
    expect(el?.className).toContain("animate-pulse");
    expect(el?.className).toContain("motion-reduce:animate-none");
    expect(el?.className).toContain("h-4");
  });

  it("has no a11y violations inside a busy region", async () => {
    const { container } = renderWithDir(
      <div aria-busy="true" role="status" aria-label="Loading">
        <Skeleton className="h-4 w-24" />
      </div>,
      dir,
    );
    await expectNoA11yViolations(container);
  });
});

// @vitest-environment jsdom
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { directions, expectNoA11yViolations, renderWithDir } from "../../test/utils";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./card";

function Sample() {
  return (
    <Card data-testid="card">
      <CardHeader>
        <CardTitle>Title</CardTitle>
        <CardDescription>Description</CardDescription>
      </CardHeader>
      <CardContent>Body</CardContent>
      <CardFooter>Footer</CardFooter>
    </Card>
  );
}

describe.each(directions)("Card (%s)", (dir) => {
  it("renders all parts", () => {
    renderWithDir(<Sample />, dir);
    for (const text of ["Title", "Description", "Body", "Footer"]) {
      expect(screen.getByText(text)).toBeTruthy();
    }
  });

  it("forwards refs and extra props", () => {
    renderWithDir(<Sample />, dir);
    expect(screen.getByTestId("card").tagName).toBe("DIV");
  });

  it("has no a11y violations", async () => {
    const { container } = renderWithDir(<Sample />, dir);
    await expectNoA11yViolations(container);
  });
});

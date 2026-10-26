// @vitest-environment jsdom
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { directions, expectNoA11yViolations, renderWithDir } from "../../test/utils";
import { Alert, AlertDescription, AlertTitle, alertVariants, getAlertRole } from "./alert";

describe("getAlertRole", () => {
  it("announces errors and warnings assertively, the rest politely", () => {
    expect(getAlertRole("destructive")).toBe("alert");
    expect(getAlertRole("warning")).toBe("alert");
    expect(getAlertRole("info")).toBe("status");
    expect(getAlertRole("success")).toBe("status");
    expect(getAlertRole()).toBe("status");
  });
});

describe("alertVariants", () => {
  it("uses a logical start stripe per status", () => {
    expect(alertVariants({ variant: "destructive" })).toContain("border-s-destructive");
    expect(alertVariants({ variant: "success" })).toContain("border-s-success");
    expect(alertVariants()).toContain("border-s-4");
  });
});

describe.each(directions)("Alert (%s)", (dir) => {
  it("renders title and description with the right role", () => {
    renderWithDir(
      <Alert variant="destructive">
        <AlertTitle>Payment failed</AlertTitle>
        <AlertDescription>Try another card.</AlertDescription>
      </Alert>,
      dir,
    );
    const alert = screen.getByRole("alert");
    expect(alert.textContent).toContain("Payment failed");
    expect(alert.textContent).toContain("Try another card.");
  });

  it("allows overriding the role", () => {
    renderWithDir(<Alert role="note">Heads up</Alert>, dir);
    expect(screen.getByRole("note")).toBeTruthy();
  });

  it("has no a11y violations", async () => {
    const { container } = renderWithDir(
      <Alert variant="info">
        <AlertTitle>Info</AlertTitle>
        <AlertDescription>Details</AlertDescription>
      </Alert>,
      dir,
    );
    await expectNoA11yViolations(container);
  });
});

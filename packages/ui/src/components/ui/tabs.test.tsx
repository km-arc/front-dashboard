// @vitest-environment jsdom
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { directions, expectNoA11yViolations, renderWithDir } from "../../test/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

function Demo() {
  return (
    <Tabs defaultValue="a">
      <TabsList aria-label="Sections">
        <TabsTrigger value="a">One</TabsTrigger>
        <TabsTrigger value="b">Two</TabsTrigger>
        <TabsTrigger value="c" disabled>
          Three
        </TabsTrigger>
      </TabsList>
      <TabsContent value="a">Panel one</TabsContent>
      <TabsContent value="b">Panel two</TabsContent>
      <TabsContent value="c">Panel three</TabsContent>
    </Tabs>
  );
}

const isSelected = (name: string) =>
  screen.getByRole("tab", { name }).getAttribute("aria-selected") === "true";

describe.each(directions)("Tabs (%s)", (dir) => {
  it("exposes tablist, tabs and the active panel", () => {
    renderWithDir(<Demo />, dir);
    expect(screen.getByRole("tablist", { name: "Sections" })).toBeTruthy();
    expect(screen.getAllByRole("tab")).toHaveLength(3);
    expect(isSelected("One")).toBe(true);
    expect(screen.getByRole("tabpanel", { name: "One" }).textContent).toBe("Panel one");
  });

  it("switches panels on click", async () => {
    renderWithDir(<Demo />, dir);
    await userEvent.setup().click(screen.getByRole("tab", { name: "Two" }));
    expect(isSelected("Two")).toBe(true);
    expect(screen.getByRole("tabpanel").textContent).toBe("Panel two");
    expect(screen.queryByText("Panel one")).toBeNull();
  });

  it("does not select a disabled tab", async () => {
    renderWithDir(<Demo />, dir);
    await userEvent.setup().click(screen.getByRole("tab", { name: "Three" }));
    expect(isSelected("Three")).toBe(false);
    expect(isSelected("One")).toBe(true);
  });

  it("follows the reading direction with the arrow keys", async () => {
    renderWithDir(<Demo />, dir);
    const user = userEvent.setup();
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole("tab", { name: "One" }));
    const next = dir === "rtl" ? "{ArrowLeft}" : "{ArrowRight}";
    const previous = dir === "rtl" ? "{ArrowRight}" : "{ArrowLeft}";
    await user.keyboard(next);
    await waitFor(() => expect(isSelected("Two")).toBe(true));
    await user.keyboard(previous);
    await waitFor(() => expect(isSelected("One")).toBe(true));
  });

  it("has no a11y violations", async () => {
    const { container } = renderWithDir(<Demo />, dir);
    await expectNoA11yViolations(container);
  });
});

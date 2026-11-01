// @vitest-environment jsdom
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import "../../test/polyfills";
import { directions, expectNoA11yViolations, renderWithDir } from "../../test/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

function Example(props: { onValueChange?: (value: string) => void }) {
  return (
    <Tabs defaultValue="overview" onValueChange={props.onValueChange}>
      <TabsList aria-label="Order sections">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="items">Items</TabsTrigger>
        <TabsTrigger value="archived" disabled>
          Archived
        </TabsTrigger>
        <TabsTrigger value="history">History</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">Overview body</TabsContent>
      <TabsContent value="items">Items body</TabsContent>
      <TabsContent value="archived">Archived body</TabsContent>
      <TabsContent value="history">History body</TabsContent>
    </Tabs>
  );
}

const selected = () =>
  screen.getAllByRole("tab").find((tab) => tab.getAttribute("aria-selected") === "true");

describe.each(directions)("Tabs (%s)", (dir) => {
  it("exposes a named tablist with the default tab selected and only its panel shown", () => {
    renderWithDir(<Example />, dir);
    expect(screen.getByRole("tablist", { name: "Order sections" })).toBeTruthy();
    expect(selected()?.textContent).toBe("Overview");
    expect(screen.getByRole("tabpanel").textContent).toBe("Overview body");
    expect(screen.queryByText("Items body")).toBeNull();
  });

  it("switches panel on click and reports the change", async () => {
    const onValueChange = vi.fn();
    renderWithDir(<Example onValueChange={onValueChange} />, dir);
    await userEvent.setup().click(screen.getByRole("tab", { name: "Items" }));
    expect(selected()?.textContent).toBe("Items");
    expect(screen.getByRole("tabpanel").textContent).toBe("Items body");
    expect(onValueChange).toHaveBeenCalledWith("items");
  });

  it("links each tab to its panel", () => {
    renderWithDir(<Example />, dir);
    const tab = screen.getByRole("tab", { name: "Overview" });
    expect(screen.getByRole("tabpanel").getAttribute("aria-labelledby")).toBe(tab.id);
  });

  it("does not select a disabled tab", async () => {
    renderWithDir(<Example />, dir);
    await userEvent.setup().click(screen.getByRole("tab", { name: "Archived" }));
    expect(selected()?.textContent).toBe("Overview");
  });

  it("lets the tab list scroll sideways and keeps tab labels on one line", () => {
    renderWithDir(<Example />, dir);
    expect(screen.getByRole("tablist").className).toContain("overflow-x-auto");
    for (const tab of screen.getAllByRole("tab")) {
      expect(tab.className).toContain("shrink-0");
      expect(tab.className).toContain("whitespace-nowrap");
      expect(tab.className).toContain("min-h-11");
    }
  });

  it("has no a11y violations", async () => {
    const { container } = renderWithDir(<Example />, dir);
    await expectNoA11yViolations(container);
  });
});

describe("Tabs arrow keys follow the reading direction", () => {
  it("LTR: ArrowRight goes to the next tab, skipping the disabled one", async () => {
    renderWithDir(<Example />, "ltr");
    const user = userEvent.setup();
    await user.tab();
    await user.keyboard("{ArrowRight}");
    expect(selected()?.textContent).toBe("Items");
    await user.keyboard("{ArrowRight}");
    expect(selected()?.textContent).toBe("History");
  });

  it("RTL: ArrowLeft goes to the next tab and ArrowRight to the previous one", async () => {
    renderWithDir(<Example />, "rtl");
    const user = userEvent.setup();
    await user.tab();
    await user.keyboard("{ArrowLeft}");
    expect(selected()?.textContent).toBe("Items");
    await user.keyboard("{ArrowRight}");
    expect(selected()?.textContent).toBe("Overview");
  });
});

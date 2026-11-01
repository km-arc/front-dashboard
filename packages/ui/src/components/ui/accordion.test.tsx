// @vitest-environment jsdom
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import "../../test/polyfills";
import { directions, expectNoA11yViolations, renderWithDir } from "../../test/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  type AccordionProps,
} from "./accordion";

function Example(props: Partial<AccordionProps> & { disabledSecond?: boolean }) {
  const { disabledSecond, ...rest } = props;
  return (
    <Accordion {...(rest as AccordionProps)}>
      <AccordionItem value="shipping">
        <AccordionTrigger>Shipping</AccordionTrigger>
        <AccordionContent>Shipping body</AccordionContent>
      </AccordionItem>
      <AccordionItem value="payment" disabled={disabledSecond}>
        <AccordionTrigger>Payment</AccordionTrigger>
        <AccordionContent>Payment body</AccordionContent>
      </AccordionItem>
      <AccordionItem value="returns">
        <AccordionTrigger>Returns</AccordionTrigger>
        <AccordionContent>Returns body</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

const trigger = (name: string) => screen.getByRole("button", { name });

describe.each(directions)("Accordion (%s)", (dir) => {
  it("is collapsed by default and puts each trigger in a heading", () => {
    renderWithDir(<Example />, dir);
    expect(trigger("Shipping").getAttribute("aria-expanded")).toBe("false");
    expect(screen.queryByText("Shipping body")).toBeNull();
    expect(screen.getByRole("heading", { name: "Shipping" })).toBeTruthy();
  });

  it("defaults to a single open section that can be closed again", async () => {
    renderWithDir(<Example />, dir);
    const user = userEvent.setup();
    await user.click(trigger("Shipping"));
    expect(screen.getByText("Shipping body")).toBeTruthy();
    expect(trigger("Shipping").getAttribute("aria-expanded")).toBe("true");

    await user.click(trigger("Payment"));
    expect(trigger("Shipping").getAttribute("aria-expanded")).toBe("false");
    expect(trigger("Payment").getAttribute("aria-expanded")).toBe("true");
    expect(screen.queryByText("Shipping body")).toBeNull();

    await user.click(trigger("Payment"));
    expect(trigger("Payment").getAttribute("aria-expanded")).toBe("false");
  });

  it("allows several open sections with type multiple", async () => {
    renderWithDir(<Example type="multiple" />, dir);
    const user = userEvent.setup();
    await user.click(trigger("Shipping"));
    await user.click(trigger("Payment"));
    expect(trigger("Shipping").getAttribute("aria-expanded")).toBe("true");
    expect(trigger("Payment").getAttribute("aria-expanded")).toBe("true");
  });

  it("can keep one section always open with collapsible={false}", async () => {
    renderWithDir(<Example collapsible={false} defaultValue="shipping" />, dir);
    await userEvent.setup().click(trigger("Shipping"));
    expect(trigger("Shipping").getAttribute("aria-expanded")).toBe("true");
  });

  it("opens a section by default and reports changes", async () => {
    const onValueChange = vi.fn();
    renderWithDir(<Example defaultValue="returns" onValueChange={onValueChange} />, dir);
    expect(screen.getByText("Returns body")).toBeTruthy();
    await userEvent.setup().click(trigger("Shipping"));
    expect(onValueChange).toHaveBeenLastCalledWith("shipping");
  });

  it("toggles with the keyboard and moves between triggers", async () => {
    renderWithDir(<Example />, dir);
    const user = userEvent.setup();
    await user.tab();
    await user.keyboard("{Enter}");
    expect(trigger("Shipping").getAttribute("aria-expanded")).toBe("true");
    await user.keyboard("{ArrowDown}");
    expect(document.activeElement).toBe(trigger("Payment"));
    await user.keyboard(" ");
    expect(trigger("Payment").getAttribute("aria-expanded")).toBe("true");
  });

  it("does not open a disabled section", async () => {
    renderWithDir(<Example disabledSecond />, dir);
    await userEvent.setup().click(trigger("Payment"));
    expect(trigger("Payment").getAttribute("aria-expanded")).toBe("false");
  });

  it("has a 44px trigger and a chevron that only rotates (never mirrors)", () => {
    renderWithDir(<Example />, dir);
    expect(trigger("Shipping").className).toContain("min-h-11");
    expect(trigger("Shipping").className).toContain("[&[data-state=open]>svg]:rotate-180");
  });

  it("has no a11y violations when a section is open", async () => {
    const { container } = renderWithDir(<Example defaultValue="shipping" />, dir);
    await expectNoA11yViolations(container);
  });
});

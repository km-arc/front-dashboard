// @vitest-environment jsdom
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { directions, expectNoA11yViolations, renderWithDir } from "../../test/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./accordion";

function Items() {
  return (
    <>
      <AccordionItem value="one">
        <AccordionTrigger>Question one</AccordionTrigger>
        <AccordionContent>Answer one</AccordionContent>
      </AccordionItem>
      <AccordionItem value="two">
        <AccordionTrigger>Question two</AccordionTrigger>
        <AccordionContent>Answer two</AccordionContent>
      </AccordionItem>
    </>
  );
}

const trigger = (name: string) => screen.getByRole("button", { name });
const expanded = (name: string) => trigger(name).getAttribute("aria-expanded") === "true";

describe.each(directions)("Accordion (%s)", (dir) => {
  it("starts closed and opens on click, then closes again", async () => {
    renderWithDir(
      <Accordion type="single" collapsible>
        <Items />
      </Accordion>,
      dir,
    );
    const user = userEvent.setup();
    expect(expanded("Question one")).toBe(false);
    expect(screen.queryByText("Answer one")).toBeNull();

    await user.click(trigger("Question one"));
    expect(expanded("Question one")).toBe(true);
    expect(screen.getByRole("region", { name: "Question one" }).textContent).toContain(
      "Answer one",
    );

    await user.click(trigger("Question one"));
    await waitFor(() => expect(screen.queryByText("Answer one")).toBeNull());
  });

  it("keeps one item open in single mode", async () => {
    renderWithDir(
      <Accordion type="single" collapsible defaultValue="one">
        <Items />
      </Accordion>,
      dir,
    );
    await userEvent.setup().click(trigger("Question two"));
    await waitFor(() => expect(expanded("Question one")).toBe(false));
    expect(expanded("Question two")).toBe(true);
  });

  it("allows several open items in multiple mode", async () => {
    renderWithDir(
      <Accordion type="multiple">
        <Items />
      </Accordion>,
      dir,
    );
    const user = userEvent.setup();
    await user.click(trigger("Question one"));
    await user.click(trigger("Question two"));
    expect(expanded("Question one")).toBe(true);
    expect(expanded("Question two")).toBe(true);
  });

  it("works from the keyboard", async () => {
    renderWithDir(
      <Accordion type="single" collapsible>
        <Items />
      </Accordion>,
      dir,
    );
    const user = userEvent.setup();
    await user.tab();
    expect(document.activeElement).toBe(trigger("Question one"));
    await user.keyboard("{Enter}");
    expect(expanded("Question one")).toBe(true);
    await user.keyboard("{ArrowDown}");
    await waitFor(() => expect(document.activeElement).toBe(trigger("Question two")));
  });

  it("has no a11y violations with an item open", async () => {
    const { container } = renderWithDir(
      <Accordion type="single" collapsible defaultValue="one">
        <Items />
      </Accordion>,
      dir,
    );
    await expectNoA11yViolations(container);
  });
});

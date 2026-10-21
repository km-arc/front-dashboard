// @vitest-environment jsdom
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { directions, expectNoA11yViolations, renderWithDir } from "../../test/utils";
import { Input, getInputDir } from "./input";
import { Label } from "./label";

describe("getInputDir", () => {
  it("forces LTR for inherently left-to-right content", () => {
    for (const type of ["email", "tel", "url", "number"]) expect(getInputDir(type)).toBe("ltr");
    for (const mode of ["email", "tel", "url", "numeric", "decimal"]) {
      expect(getInputDir("text", mode)).toBe("ltr");
    }
  });

  it("leaves other inputs to inherit the page direction", () => {
    expect(getInputDir()).toBeUndefined();
    expect(getInputDir("text")).toBeUndefined();
    expect(getInputDir("password")).toBeUndefined();
    expect(getInputDir("search", "search")).toBeUndefined();
  });
});

describe.each(directions)("Input (%s)", (dir) => {
  it("accepts typing and reports changes", async () => {
    const onChange = vi.fn();
    renderWithDir(<Input aria-label="Name" onChange={onChange} />, dir);
    await userEvent.setup().type(screen.getByRole("textbox", { name: "Name" }), "Sara");
    expect(onChange).toHaveBeenCalledTimes(4);
    expect(screen.getByRole("textbox", { name: "Name" })).toHaveProperty("value", "Sara");
  });

  it("keeps emails, phones, urls and numbers LTR, even on RTL pages", () => {
    renderWithDir(
      <>
        <Input aria-label="Email" type="email" />
        <Input aria-label="Phone" type="tel" />
        <Input aria-label="Site" type="url" />
        <Input aria-label="Qty" type="number" />
        <Input aria-label="Code" inputMode="numeric" />
      </>,
      dir,
    );
    for (const name of ["Email", "Phone", "Site", "Code"]) {
      expect(screen.getByLabelText(name).getAttribute("dir")).toBe("ltr");
    }
    expect(screen.getByRole("spinbutton", { name: "Qty" }).getAttribute("dir")).toBe("ltr");
  });

  it("lets plain text inherit the page direction and allows an explicit override", () => {
    renderWithDir(
      <>
        <Input aria-label="Text" />
        <Input aria-label="Forced" dir="rtl" type="email" />
      </>,
      dir,
    );
    expect(screen.getByLabelText("Text").hasAttribute("dir")).toBe(false);
    expect(screen.getByLabelText("Forced").getAttribute("dir")).toBe("rtl");
  });

  it("does not accept input when disabled", async () => {
    renderWithDir(<Input aria-label="Name" disabled />, dir);
    await userEvent.setup().type(screen.getByLabelText("Name"), "x");
    expect(screen.getByLabelText("Name")).toHaveProperty("value", "");
  });

  it("exposes the invalid state to assistive technology", () => {
    renderWithDir(<Input aria-label="Name" aria-invalid="true" />, dir);
    expect(screen.getByLabelText("Name").getAttribute("aria-invalid")).toBe("true");
  });

  it("has no a11y violations", async () => {
    const { container } = renderWithDir(
      <div>
        <Label htmlFor="n">Name</Label>
        <Input id="n" placeholder="Your name" />
      </div>,
      dir,
    );
    await expectNoA11yViolations(container);
  });
});

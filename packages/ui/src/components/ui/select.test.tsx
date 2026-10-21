// @vitest-environment jsdom
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import "../../test/polyfills";
import { directions, expectNoA11yViolations, renderWithDir } from "../../test/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./select";

function Cities(props: { onValueChange?: (v: string) => void; disabled?: boolean }) {
  return (
    <Select onValueChange={props.onValueChange} disabled={props.disabled}>
      <SelectTrigger aria-label="City">
        <SelectValue placeholder="Pick a city" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Cities</SelectLabel>
          <SelectItem value="tehran">Tehran</SelectItem>
          <SelectItem value="shiraz">Shiraz</SelectItem>
          <SelectItem value="tabriz" disabled>
            Tabriz
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

describe.each(directions)("Select (%s)", (dir) => {
  it("shows the placeholder and is exposed as a combobox", () => {
    renderWithDir(<Cities />, dir);
    const trigger = screen.getByRole("combobox", { name: "City" });
    expect(trigger.textContent).toContain("Pick a city");
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
  });

  it("opens from the keyboard and renders the options", async () => {
    renderWithDir(<Cities />, dir);
    const user = userEvent.setup();
    await user.tab();
    await user.keyboard("{Enter}");
    expect(await screen.findByRole("listbox")).toBeTruthy();
    expect(screen.getAllByRole("option").map((o) => o.textContent)).toEqual([
      "Tehran",
      "Shiraz",
      "Tabriz",
    ]);
  });

  it("selects an option and shows it in the trigger", async () => {
    const onValueChange = vi.fn();
    renderWithDir(<Cities onValueChange={onValueChange} />, dir);
    const user = userEvent.setup();
    await user.click(screen.getByRole("combobox", { name: "City" }));
    await user.click(await screen.findByRole("option", { name: "Shiraz" }));
    expect(onValueChange).toHaveBeenCalledWith("shiraz");
    expect(screen.getByRole("combobox", { name: "City" }).textContent).toContain("Shiraz");
  });

  it("selects with the keyboard", async () => {
    const onValueChange = vi.fn();
    renderWithDir(<Cities onValueChange={onValueChange} />, dir);
    const user = userEvent.setup();
    await user.tab();
    await user.keyboard("{Enter}");
    await screen.findByRole("listbox");
    await user.keyboard("{ArrowDown}{Enter}");
    expect(onValueChange).toHaveBeenCalledTimes(1);
  });

  it("renders the list in the page direction, even inside the portal", async () => {
    renderWithDir(<Cities />, dir);
    await userEvent.setup().click(screen.getByRole("combobox", { name: "City" }));
    expect((await screen.findByRole("listbox")).getAttribute("dir")).toBe(dir);
  });

  it("does not open when disabled", async () => {
    renderWithDir(<Cities disabled />, dir);
    await userEvent.setup().click(screen.getByRole("combobox", { name: "City" }));
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("has no a11y violations when closed", async () => {
    const { container } = renderWithDir(<Cities />, dir);
    await expectNoA11yViolations(container);
  });
});

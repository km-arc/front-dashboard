// @vitest-environment jsdom
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import "../../test/polyfills";
import { directions, expectNoA11yViolations, renderWithDir } from "../../test/utils";
import { Label } from "./label";
import { RadioGroup, RadioGroupItem } from "./radio-group";

function Plans(props: { onValueChange?: (v: string) => void; horizontal?: boolean }) {
  return (
    <RadioGroup
      aria-label="Plan"
      defaultValue="free"
      orientation={props.horizontal ? "horizontal" : "vertical"}
      onValueChange={props.onValueChange}
    >
      {["free", "pro", "team"].map((id) => (
        <div key={id}>
          <RadioGroupItem id={id} value={id} />
          <Label htmlFor={id}>{id}</Label>
        </div>
      ))}
    </RadioGroup>
  );
}

const checked = () =>
  screen.getAllByRole("radio").find((r) => r.getAttribute("aria-checked") === "true");

describe.each(directions)("RadioGroup (%s)", (dir) => {
  it("selects an option by click and by its label", async () => {
    const onValueChange = vi.fn();
    renderWithDir(<Plans onValueChange={onValueChange} />, dir);
    const user = userEvent.setup();
    await user.click(screen.getByRole("radio", { name: "pro" }));
    expect(onValueChange).toHaveBeenLastCalledWith("pro");
    await user.click(screen.getByText("team"));
    expect(onValueChange).toHaveBeenLastCalledWith("team");
  });

  it("moves with the vertical arrow keys", async () => {
    renderWithDir(<Plans />, dir);
    const user = userEvent.setup();
    await user.tab();
    await user.keyboard("{ArrowDown}");
    expect(checked()?.id).toBe("pro");
    await user.keyboard("{ArrowUp}");
    expect(checked()?.id).toBe("free");
  });

  it("does not select a disabled option", async () => {
    renderWithDir(
      <RadioGroup aria-label="Plan">
        <RadioGroupItem value="a" aria-label="A" disabled />
      </RadioGroup>,
      dir,
    );
    await userEvent.setup().click(screen.getByRole("radio", { name: "A" }));
    expect(screen.getByRole("radio", { name: "A" }).getAttribute("aria-checked")).toBe("false");
  });

  it("has no a11y violations", async () => {
    const { container } = renderWithDir(<Plans />, dir);
    await expectNoA11yViolations(container);
  });
});

describe("RadioGroup horizontal arrow keys follow the reading direction", () => {
  it("LTR: ArrowRight goes to the next option", async () => {
    renderWithDir(<Plans horizontal />, "ltr");
    const user = userEvent.setup();
    await user.tab();
    await user.keyboard("{ArrowRight}");
    expect(checked()?.id).toBe("pro");
  });

  it("RTL: ArrowLeft goes to the next option", async () => {
    renderWithDir(<Plans horizontal />, "rtl");
    const user = userEvent.setup();
    await user.tab();
    await user.keyboard("{ArrowLeft}");
    expect(checked()?.id).toBe("pro");
    await user.keyboard("{ArrowRight}");
    expect(checked()?.id).toBe("free");
  });
});

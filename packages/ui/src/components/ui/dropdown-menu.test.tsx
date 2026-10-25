// @vitest-environment jsdom
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import "../../test/polyfills";
import { directions, expectNoA11yViolations, renderWithDir } from "../../test/utils";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./dropdown-menu";

function Example(props: { onProfile?: () => void; onEmail?: () => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>Account</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My account</DropdownMenuLabel>
        <DropdownMenuItem onSelect={props.onProfile}>Profile</DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Share</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem onSelect={props.onEmail}>Email</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem>Notifications</DropdownMenuCheckboxItem>
        <DropdownMenuRadioGroup value="fa">
          <DropdownMenuRadioItem value="fa">Persian</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="en">English</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

async function openMenu() {
  const user = userEvent.setup();
  await user.tab();
  await user.keyboard("{Enter}");
  await screen.findByRole("menu");
  return user;
}

describe.each(directions)("DropdownMenu (%s)", (dir) => {
  it("opens from the keyboard and lists the items", async () => {
    renderWithDir(<Example />, dir);
    expect(screen.queryByRole("menu")).toBeNull();
    await openMenu();
    expect(screen.getByRole("menuitem", { name: "Profile" })).toBeTruthy();
    expect(screen.getByRole("menuitemcheckbox", { name: "Notifications" })).toBeTruthy();
    expect(
      screen.getByRole("menuitemradio", { name: "Persian" }).getAttribute("aria-checked"),
    ).toBe("true");
  });

  it("runs the selected item and closes", async () => {
    const onProfile = vi.fn();
    renderWithDir(<Example onProfile={onProfile} />, dir);
    const user = await openMenu();
    await user.click(screen.getByRole("menuitem", { name: "Profile" }));
    expect(onProfile).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
  });

  it("toggles a checkbox item", async () => {
    renderWithDir(<Example />, dir);
    const user = await openMenu();
    await user.click(screen.getByRole("menuitemcheckbox", { name: "Notifications" }));
    await user.keyboard("{Enter}");
    await openMenu();
    expect(
      screen.getByRole("menuitemcheckbox", { name: "Notifications" }).getAttribute("aria-checked"),
    ).toBe("true");
  });

  it("closes with Escape and returns focus to the trigger", async () => {
    renderWithDir(<Example />, dir);
    const user = await openMenu();
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
    await waitFor(() =>
      expect(document.activeElement).toBe(screen.getByRole("button", { name: "Account" })),
    );
  });

  it("renders the menu in the provider direction", async () => {
    renderWithDir(<Example />, dir);
    await openMenu();
    expect(screen.getByRole("menu").getAttribute("dir")).toBe(dir);
  });

  it("has no a11y violations when open", async () => {
    renderWithDir(<Example />, dir);
    await openMenu();
    await expectNoA11yViolations(document.body);
  });
});

const submenuKeys: Array<["ltr" | "rtl", string]> = [
  ["ltr", "{ArrowRight}"],
  ["rtl", "{ArrowLeft}"],
];

describe("DropdownMenu submenu keys follow the reading direction", () => {
  it.each(submenuKeys)("%s: %s opens the submenu", async (dir, key) => {
    const onEmail = vi.fn();
    renderWithDir(<Example onEmail={onEmail} />, dir);
    const user = await openMenu();
    await user.keyboard("{ArrowDown}"); // Profile -> Share (sub trigger)
    await user.keyboard(key);
    const email = await screen.findByRole("menuitem", { name: "Email" });
    await user.click(email);
    expect(onEmail).toHaveBeenCalledTimes(1);
  });
});

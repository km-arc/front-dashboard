// @vitest-environment jsdom
import { act, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { directions, renderWithDir } from "../../test/utils";
import { Toaster, toast } from "./toaster";

beforeEach(() => {
  // jsdom has no matchMedia, which sonner uses for theme="system".
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
  })) as unknown as typeof window.matchMedia;
});

afterEach(() => {
  act(() => {
    toast.dismiss();
  });
});

describe.each(directions)("Toaster (%s)", (dir) => {
  it("shows a toast triggered from anywhere", async () => {
    renderWithDir(<Toaster />, dir);
    act(() => {
      toast("Saved");
    });
    expect(await screen.findByText("Saved")).toBeTruthy();
  });

  it("shows several toasts, including descriptions", async () => {
    renderWithDir(<Toaster />, dir);
    act(() => {
      toast.error("Payment failed", { description: "Try another card." });
      toast.success("Order placed");
    });
    expect(await screen.findByText("Payment failed")).toBeTruthy();
    expect(await screen.findByText("Try another card.")).toBeTruthy();
    expect(await screen.findByText("Order placed")).toBeTruthy();
  });

  it("follows the provider direction", async () => {
    renderWithDir(<Toaster />, dir);
    act(() => {
      toast("Direction check");
    });
    await screen.findByText("Direction check");
    const list = document.querySelector("[data-sonner-toaster]");
    expect(list?.getAttribute("dir")).toBe(dir);
  });
});

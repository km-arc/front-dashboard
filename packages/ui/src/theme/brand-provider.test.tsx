// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { BRAND_ATTRIBUTE, BRAND_STYLE_ID, type BrandDefinition } from "./brand";
import { BrandProvider, useBrand } from "./brand-provider";

const acme: BrandDefinition = { id: "acme", light: { primary: "oklch(0.5 0.2 150)" } };
const other: BrandDefinition = { id: "other", dark: { primary: "oklch(0.75 0.15 30)" } };

function Probe() {
  return <output data-testid="brand">{useBrand().brand?.id ?? "none"}</output>;
}

const attr = () => document.documentElement.getAttribute(BRAND_ATTRIBUTE);
const styles = () => document.head.querySelectorAll(`#${BRAND_STYLE_ID}`);

afterEach(() => {
  cleanup();
  document.documentElement.removeAttribute(BRAND_ATTRIBUTE);
  document.getElementById(BRAND_STYLE_ID)?.remove();
});

describe("BrandProvider (browser)", () => {
  it("applies a valid brand to the document", () => {
    render(
      <BrandProvider brand={acme}>
        <Probe />
      </BrandProvider>,
    );
    expect(attr()).toBe("acme");
    expect(styles()).toHaveLength(1);
    expect(styles()[0]?.textContent).toContain("--primary: oklch(0.5 0.2 150);");
    expect(screen.getByTestId("brand").textContent).toBe("acme");
  });

  it("swaps brands without duplicating the style element", () => {
    const { rerender } = render(<BrandProvider brand={acme}>x</BrandProvider>);
    rerender(<BrandProvider brand={other}>x</BrandProvider>);
    expect(attr()).toBe("other");
    expect(styles()).toHaveLength(1);
    expect(styles()[0]?.textContent).toContain("oklch(0.75 0.15 30)");
  });

  it("returns to the default theme when the brand is removed or unmounted", () => {
    const { rerender, unmount } = render(<BrandProvider brand={acme}>x</BrandProvider>);
    rerender(<BrandProvider brand={null}>x</BrandProvider>);
    expect(attr()).toBeNull();
    expect(styles()).toHaveLength(0);

    rerender(<BrandProvider brand={acme}>x</BrandProvider>);
    unmount();
    expect(attr()).toBeNull();
    expect(styles()).toHaveLength(0);
  });

  it("never applies an invalid brand and reports why", () => {
    const onInvalid = vi.fn();
    render(
      <BrandProvider brand={{ id: "x", light: { primary: "red;}" } }} onInvalid={onInvalid}>
        <Probe />
      </BrandProvider>,
    );
    expect(onInvalid).toHaveBeenCalledTimes(1);
    expect(attr()).toBeNull();
    expect(styles()).toHaveLength(0);
    expect(screen.getByTestId("brand").textContent).toBe("none");
  });

  it("does not re-apply when an equal brand object is passed again", () => {
    const { rerender } = render(<BrandProvider brand={{ ...acme }}>x</BrandProvider>);
    const first = styles()[0];
    rerender(<BrandProvider brand={{ ...acme }}>x</BrandProvider>);
    expect(styles()[0]).toBe(first);
  });
});

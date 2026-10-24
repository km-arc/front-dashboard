import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { BrandProvider, useBrand } from "./brand-provider";
import { ThemeProvider, useTheme } from "./theme-provider";

function Probe() {
  const { mode, resolvedMode } = useTheme();
  const { brand } = useBrand();
  return <p>{[mode, resolvedMode, brand?.id ?? "none"].join("|")}</p>;
}

describe("providers (server render)", () => {
  it("defaults to system mode (resolved light) and no brand", () => {
    const html = renderToString(
      <ThemeProvider>
        <BrandProvider>
          <Probe />
        </BrandProvider>
      </ThemeProvider>,
    );
    expect(html).toContain("system|light|none");
  });

  it("honours defaultMode and exposes a valid brand during SSR", () => {
    const html = renderToString(
      <ThemeProvider defaultMode="dark">
        <BrandProvider brand={{ id: "acme", light: { primary: "#0369a1" } }}>
          <Probe />
        </BrandProvider>
      </ThemeProvider>,
    );
    expect(html).toContain("dark|dark|acme");
  });

  it("ignores an invalid brand", () => {
    const html = renderToString(
      <ThemeProvider>
        <BrandProvider brand={{ id: "BAD ID" }}>
          <Probe />
        </BrandProvider>
      </ThemeProvider>,
    );
    expect(html).toContain("system|light|none");
  });

  it("useTheme throws outside a provider", () => {
    function Bare() {
      useTheme();
      return null;
    }
    expect(() => renderToString(<Bare />)).toThrow();
  });
});

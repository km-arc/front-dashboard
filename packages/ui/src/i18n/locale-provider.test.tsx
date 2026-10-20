import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { LocaleProvider, useLocale } from "./locale-provider";

function Probe() {
  const { locale, dir, t, formatters } = useLocale();
  const parts = [
    locale,
    dir,
    t("common.close"),
    t("pagination.pageOf", { page: 1, total: 3 }),
    formatters.number(12),
  ];
  return <p>{parts.join("|")}</p>;
}

describe("LocaleProvider", () => {
  it("provides English / LTR", () => {
    const html = renderToString(
      <LocaleProvider locale="en">
        <Probe />
      </LocaleProvider>,
    );
    expect(html).toContain("en|ltr|Close|Page 1 of 3|12");
  });

  it("provides Persian / RTL with Persian digits", () => {
    const html = renderToString(
      <LocaleProvider locale="fa">
        <Probe />
      </LocaleProvider>,
    );
    expect(html).toContain("fa|rtl|بستن|صفحه 1 از 3|۱۲");
  });

  it("allows overriding messages", () => {
    const html = renderToString(
      <LocaleProvider locale="en" messages={{ "common.close": "Dismiss" }}>
        <Probe />
      </LocaleProvider>,
    );
    expect(html).toContain("Dismiss");
  });

  it("throws outside a provider", () => {
    expect(() => renderToString(<Probe />)).toThrow();
  });
});

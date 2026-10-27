// @vitest-environment jsdom
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { createFormatters } from "../../i18n/format";
import { uiMessages } from "../../i18n/messages";
import { expectNoA11yViolations } from "../../test/utils";
import { renderLocalized, testLocales } from "../../test/locale-render";
import { Pagination, getPageItems } from "./pagination";

describe("getPageItems", () => {
  it("shows every page when there are few", () => {
    expect(getPageItems(1, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(getPageItems(3, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(getPageItems(1, 1)).toEqual([1]);
  });

  it("collapses with ellipses and keeps a constant number of slots", () => {
    expect(getPageItems(1, 12)).toEqual([1, 2, 3, 4, 5, "end-ellipsis", 12]);
    expect(getPageItems(6, 12)).toEqual([1, "start-ellipsis", 5, 6, 7, "end-ellipsis", 12]);
    expect(getPageItems(12, 12)).toEqual([1, "start-ellipsis", 8, 9, 10, 11, 12]);
  });

  it("supports more siblings", () => {
    expect(getPageItems(6, 20, 2)).toEqual([
      1,
      "start-ellipsis",
      4,
      5,
      6,
      7,
      8,
      "end-ellipsis",
      20,
    ]);
  });

  it("is safe with out-of-range input", () => {
    expect(getPageItems(1, 0)).toEqual([]);
    expect(getPageItems(99, 12)).toEqual(getPageItems(12, 12));
    expect(getPageItems(-3, 12)).toEqual(getPageItems(1, 12));
  });
});

describe.each(testLocales)("Pagination (%s)", (locale) => {
  const formatters = createFormatters(locale);
  const messages = uiMessages[locale];
  const pageButton = (n: number) =>
    screen.getAllByRole("button").find((button) => button.textContent === formatters.number(n));

  it("is a labeled navigation and marks the current page", () => {
    const { container } = renderLocalized(
      <Pagination page={6} pageCount={12} onPageChange={() => {}} />,
      locale,
    );
    expect(screen.getByRole("navigation", { name: messages["a11y.pagination"] })).toBeTruthy();
    const current = container.querySelector('[aria-current="page"]');
    expect(current?.textContent).toBe(formatters.number(6));
  });

  it("announces hidden pages as 'more'", () => {
    renderLocalized(<Pagination page={6} pageCount={12} onPageChange={() => {}} />, locale);
    expect(screen.getAllByText(messages["common.more"])).toHaveLength(2);
  });

  it("calls onPageChange for a page, previous and next", async () => {
    const onPageChange = vi.fn();
    renderLocalized(<Pagination page={6} pageCount={12} onPageChange={onPageChange} />, locale);
    const user = userEvent.setup();
    await user.click(pageButton(7) as HTMLElement);
    await user.click(screen.getByRole("button", { name: messages["common.previous"] }));
    await user.click(screen.getByRole("button", { name: messages["common.next"] }));
    expect(onPageChange.mock.calls.map((call) => call[0])).toEqual([7, 5, 7]);
  });

  it("works from the keyboard", async () => {
    const onPageChange = vi.fn();
    renderLocalized(<Pagination page={6} pageCount={12} onPageChange={onPageChange} />, locale);
    (pageButton(5) as HTMLElement).focus();
    await userEvent.setup().keyboard("{Enter}");
    expect(onPageChange).toHaveBeenCalledWith(5);
  });

  it("disables previous on the first page and next on the last", () => {
    const first = renderLocalized(
      <Pagination page={1} pageCount={3} onPageChange={() => {}} />,
      locale,
    );
    const previous = screen.getByRole("button", { name: messages["common.previous"] });
    expect((previous as HTMLButtonElement).disabled).toBe(true);
    first.unmount();
    renderLocalized(<Pagination page={3} pageCount={3} onPageChange={() => {}} />, locale);
    const next = screen.getByRole("button", { name: messages["common.next"] });
    expect((next as HTMLButtonElement).disabled).toBe(true);
  });

  it("renders nothing without pages", () => {
    const { container } = renderLocalized(
      <Pagination page={1} pageCount={0} onPageChange={() => {}} />,
      locale,
    );
    expect(container.querySelector("nav")).toBeNull();
  });

  it("has no a11y violations", async () => {
    const { container } = renderLocalized(
      <Pagination page={6} pageCount={12} onPageChange={() => {}} />,
      locale,
    );
    await expectNoA11yViolations(container);
  });
});

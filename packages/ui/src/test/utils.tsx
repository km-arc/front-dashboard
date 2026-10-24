import { cleanup, render } from "@testing-library/react";
import { axe } from "jest-axe";
import type { ReactElement } from "react";
import { afterEach, expect } from "vitest";
import { UiProvider, type UiDirection } from "../provider/ui-provider";

afterEach(cleanup);

export const directions: UiDirection[] = ["ltr", "rtl"];

/** Render inside UiProvider with a matching `dir` attribute on a wrapper. */
export function renderWithDir(ui: ReactElement, dir: UiDirection = "ltr") {
  return render(
    <div dir={dir}>
      <UiProvider dir={dir}>{ui}</UiProvider>
    </div>,
  );
}

export async function expectNoA11yViolations(container: Element) {
  const results = await axe(container);
  expect(results.violations).toEqual([]);
}

import { cleanup, render } from "@testing-library/react";
import type { ReactElement } from "react";
import { afterEach } from "vitest";
import { LocaleProvider } from "../i18n/locale-provider";
import { getDirection, type Locale } from "../i18n/locales";
import { UiProvider } from "../provider/ui-provider";

afterEach(cleanup);

export const testLocales: Locale[] = ["en", "fa"];

/** Like renderWithDir, but inside a LocaleProvider (for components that read built-in messages). */
export function renderLocalized(ui: ReactElement, locale: Locale = "en") {
  const dir = getDirection(locale);
  return render(
    <div dir={dir}>
      <LocaleProvider locale={locale}>
        <UiProvider dir={dir}>{ui}</UiProvider>
      </LocaleProvider>
    </div>,
  );
}

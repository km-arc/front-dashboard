"use client";

import type { ReactNode } from "react";
import {
  BrandProvider,
  LocaleProvider,
  ThemeProvider,
  Toaster,
  UiProvider,
  getDirection,
  useTheme,
  type BrandDefinition,
  type Locale,
} from "@front-dashboard/ui";
import { SessionProvider } from "../features/auth/session-context";

export interface ProvidersProps {
  locale: Locale;
  timeZone: string;
  /** Brand loaded from the backend; null = default light-blue theme. */
  brand: BrandDefinition | null;
  children: ReactNode;
}

function ThemedToaster() {
  const { resolvedMode } = useTheme();
  return <Toaster theme={resolvedMode} />;
}

/** Every provider of the design system, in the order documented in docs/phases/phase-2.1-store-shell.md (D4). */
export function Providers({ locale, timeZone, brand, children }: ProvidersProps) {
  return (
    <LocaleProvider locale={locale} timeZone={timeZone}>
      <ThemeProvider>
        <BrandProvider brand={brand}>
          <UiProvider dir={getDirection(locale)}>
            <SessionProvider>{children}</SessionProvider>
            <ThemedToaster />
          </UiProvider>
        </BrandProvider>
      </ThemeProvider>
    </LocaleProvider>
  );
}

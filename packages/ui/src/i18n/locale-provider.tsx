"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { createFormatters, type Formatters, type FormatterOptions } from "./format";
import { getDirection, type Direction, type Locale } from "./locales";
import {
  formatMessage,
  uiMessages,
  type MessageKey,
  type MessageValues,
  type Messages,
} from "./messages";

export interface LocaleContextValue {
  locale: Locale;
  dir: Direction;
  formatters: Formatters;
  messages: Messages;
  /** Translate a built-in UI message, with optional `{placeholder}` values. */
  t: (key: MessageKey, values?: MessageValues) => string;
}

export interface LocaleProviderProps extends FormatterOptions {
  locale: Locale;
  /** Overrides for built-in messages. Memoize it (or define it outside render) to avoid recomputation. */
  messages?: Partial<Messages>;
  children: ReactNode;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

/**
 * Provides locale, direction, formatters and built-in messages to ui components.
 * It renders no DOM: the app sets `<html lang dir>` (see getHtmlAttributes).
 */
export function LocaleProvider({
  locale,
  messages,
  calendar,
  numberingSystem,
  timeZone,
  children,
}: LocaleProviderProps) {
  const value = useMemo<LocaleContextValue>(() => {
    const merged: Messages = { ...uiMessages[locale], ...messages };
    return {
      locale,
      dir: getDirection(locale),
      formatters: createFormatters(locale, { calendar, numberingSystem, timeZone }),
      messages: merged,
      t: (key, values) => formatMessage(merged[key], values),
    };
  }, [locale, messages, calendar, numberingSystem, timeZone]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const value = useContext(LocaleContext);
  if (!value) throw new Error("useLocale must be used inside <LocaleProvider>");
  return value;
}

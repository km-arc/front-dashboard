# Step 1.2 – i18n, direction, formatting

Status: implemented (patch delivered).

## Decisions
- Formatting is built only on `Intl` (no date/number library). Jalali via `fa-IR-u-ca-persian`.
- `packages/ui` is i18n-library-agnostic; apps pick their library (proposal: next-intl).
- Toman is represented by the pseudo-code `IRT` (Open Question 11 confirms currency policy).

## Delivered
- `i18n/locales.ts`: locales, direction, `resolveLocale`, `getHtmlAttributes`
- `i18n/format.ts`: `createFormatters` (number, compact, percent, money, date, dateTime, time, relativeTime, list),
  `getCalendarDate` (Jalali/Gregorian parts for pickers), cached Intl instances
- `i18n/messages.ts`: typed en/fa UI messages, `formatMessage`
- `i18n/locale-provider.tsx`: `LocaleProvider`, `useLocale` (`"use client"`, React peer dependency)
- Tests: locale resolution, formatters (Jalali date = 28 Mehr 1405 for 2026-10-20, time zones, digits, Toman,
  relative time), message parity/placeholders, provider SSR render
- Docs: `I18N.md`, ADR-0003 update

## Not in this step
Jalali date **picker** widget (Step 1.7, built on `getCalendarDate`), Radix `DirectionProvider` (1.3),
app-level message library and `[locale]` routing (2.1).

## Acceptance
All tests green; `packages/ui` has no `next/*` imports; fa shows Jalali + Persian digits by default.

## Hand-off notes
- Exact-string assertions are limited to stable CLDR output; percent/currency in fa are asserted loosely
  because ICU versions differ across Node releases.
- React became a peer dependency of `packages/ui` (tsconfig `jsx: react-jsx`).

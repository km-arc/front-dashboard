# Architecture

```
┌────────────┐   ┌────────────┐
│ apps/store │   │ apps/admin │      Next.js (App Router)
└─────┬──────┘   └─────┬──────┘
      └────────┬───────┘
        ┌──────▼───────┐
        │ packages/ui  │   shadcn + Tailwind, tokens, i18n helpers
        └──────────────┘
        generated API client  ──HTTP/OpenAPI──▶  .NET backend ──▶ MongoDB
```

## Principles
- `packages/ui` is framework-light: React only, no Next imports; data via props.
- Apps own routing, data fetching, auth and page composition.
- The frontend depends on an **OpenAPI contract**, not on backend internals. A typed client is generated;
  until the backend is ready, MSW (or equivalent) mocks follow the same contract.
- Feature code is organized by domain module (orders, catalog, courses…) inside each app.

## Theming
Two independent axes set on `<html>`:
- mode: `class="dark"` (or none for light)
- brand: `data-brand="<name>"`
Components consume only semantic CSS variables (`--background`, `--primary`, …). A brand overrides the variables
for both light and dark. See ADR-0004.

## i18n and direction
- Locales: `en` (ltr), `fa` (rtl). `<html lang dir>` set from the locale.
- Logical CSS properties only. Jalali calendar and Persian digits for `fa` through `Intl` and a date adapter.
- Messages live in per-locale JSON; no strings in components.

## Auth and roles (to be detailed in Phase 2/3 plans)
Role-based navigation and route guards in the apps; the backend is the authority for permissions.

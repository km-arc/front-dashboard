# Phase 1 – Design system (`packages/ui`)

Status: **draft – awaiting owner approval**

## Goal
A reusable, accessible, mobile-first component library with mode × brand theming and en/fa (LTR/RTL),
usable from plain React and Next.js. Everything else depends on it.

## Steps (see ROADMAP for dependencies)
| Step | Content | Key decisions to confirm |
|------|---------|--------------------------|
| 1.1 | Tokens as CSS variables (color, radius, spacing, typography, shadow); light/dark; 1–2 sample brands; Tailwind preset consuming tokens | Brand source and mechanism (OQ 1, 2); fonts (OQ 3) |
| 1.2 | `en`/`fa` message setup, `DirectionProvider`, locale-aware formatters (numbers, currency, Jalali dates, relative time) | i18n lib (proposal: next-intl in apps; ui stays lib-agnostic via props/`Intl`) |
| 1.3 | shadcn config, `cn()`, `ThemeProvider`/`BrandProvider` (framework-agnostic), RTL-safe Tailwind setup | Provider API |
| 1.4–1.7 | Component batches (see ROADMAP), each RTL-audited (shadcn defaults often use `left/right`; we convert to logical) | – |
| 1.8 | Storybook toolbar: mode, brand, locale, direction; a11y addon; visual check at 360/768/1280 | Visual regression tool (optional) |

## Out of scope
Pages, data fetching, API client, business logic.

## Risks
- shadcn components ship with physical-direction classes → each must be reviewed and converted.
- Brand mechanism undecided → blocks 1.1 until OQ 1–2 answered.
- Jalali date picker: needs a dedicated library or adapter decision (plan in 1.2).

## Acceptance
Each component passes `docs/DEFINITION_OF_DONE.md`; Storybook shows all combinations of mode × brand × dir.

## Hand-off notes
(to be filled)

# Conventions

## Mobile-first
Base styles target 360px. Add `sm:` (≥640) `md:` (≥768) `lg:` (≥1024) only to enhance. Touch targets ≥ 44px.
Tables must have a mobile strategy (card list or horizontal scroll with sticky first column).

## RTL / logical properties
| Avoid | Use |
|-------|-----|
| `ml-* mr-*` | `ms-* me-*` |
| `pl-* pr-*` | `ps-* pe-*` |
| `left-* right-*` | `start-* end-*` |
| `text-left/right` | `text-start/end` |
| `border-l/r`, `rounded-l/r` | `border-s/e`, `rounded-s/e` |
Flip directional icons with `rtl:rotate-180` (or `rtl:-scale-x-100`). Do not hard-code `dir` in components.
Numbers/dates are formatted through shared helpers, not manually.

## Theming
Full guide: `docs/THEMING.md`. No raw hex/rgb or Tailwind palette colors (`bg-blue-500`) in components. Use semantic tokens (`bg-background`,
`text-foreground`, `bg-primary`…). Every component must be checked in light, dark and one brand theme.

## i18n
Message keys are namespaced (`orders.status.pending`). Use ICU plurals. No string concatenation for sentences.

## Components (`packages/ui`)
- One folder per component: `component.tsx`, `component.stories.tsx`, `component.test.tsx`.
- Props typed and documented; forward refs; accept `className`; no data fetching.
- Controlled and uncontrolled support for form controls.

## Code
TypeScript strict; no `any`; prefer named exports; conventional commits (`feat(ui): add Button`).

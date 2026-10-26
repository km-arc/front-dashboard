# Step 1.6a – Data display (1/2): Table, Pagination, EmptyState / نمایش داده (۱ از ۲)

Depends on / وابسته به: 1.4a, 1.5 · Budget / بودجه: ≤ 12 files, ≤ 700 lines
(1.6 is split: **1.6a** here, **1.6b** = Tabs, Accordion. / گام 1.6 به دو بخش تقسیم شد.)

## Scope / محدوده
- `Table`: styled native table inside a horizontally scrolling wrapper; headers use `text-start`, numbers use `text-end`. No TanStack Table yet (admin panel, phase 3).
- `Pagination`: controlled, `getPageItems` keeps a constant number of slots; digits come from `formatters.number` (Persian digits in fa); arrows flip with `rtl:`; `aria-current="page"`; ellipses announced as "more".
- `EmptyState`: icon (decorative), title, description, action; all text via props.
- New built-in messages `a11y.pagination` and `pagination.page` (en and fa), added with a script.

## Automated checks / ارزیابی خودکار
Table semantics and scroll wrapper; Pagination (pure function cases, labeled navigation, current page, previous/next, keyboard, disabled ends, en and fa); EmptyState; jest-axe in LTR and RTL; conventions guard; "every primitive has a story" guard.
`pnpm lint && pnpm typecheck && pnpm test`, `pnpm build-storybook`.

## Owner review / بازبینی مالک
`docs/checklists/visual-review-1.6a-data-display.md`.

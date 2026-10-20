# ADR: shadcn base lives in `packages/ui` / پایهٔ shadcn در `packages/ui`

**Status:** accepted (step 1.3) · **وضعیت:** پذیرفته‌شده

## Context / زمینه
Components must serve both `apps/store` and `apps/admin`, and work in plain React and Next.js (AGENTS.md rule 6).
کامپوننت‌ها باید هم در فروشگاه و هم در ادمین، و هم در React ساده و Next.js کار کنند.

## Decision / تصمیم
- shadcn is configured inside `packages/ui` with `rsc: false` and no `tailwind.config` (Tailwind v4, CSS-first).
- `cn` = `clsx` + `tailwind-merge`, the only class-merging helper.
- `UiProvider` only wires Radix direction; theme and i18n keep their own providers (1.1, 1.2) to avoid duplication.
- shadcn پایه در `packages/ui` با `rsc: false` و بدون `tailwind.config` پیکربندی می‌شود؛ `UiProvider` فقط جهت Radix را تنظیم می‌کند و تم و i18n در Providerهای خودشان می‌مانند.

## Consequences / پیامدها
- shadcn CLI needs the `@/*` → `src/*` path alias in `packages/ui/tsconfig.json` (to be added in 1.4 with the first component).
- Tokens file path in `components.json` (`src/styles/globals.css`) must match the real tokens CSS from step 1.1.

# Step 1.3 – shadcn base in `packages/ui` / پایهٔ shadcn در `packages/ui`

Depends on / وابسته به: 1.1, 1.2 · Budget / بودجه: ≤ 15 files, ≤ 400 lines

## Goal / هدف
Infrastructure for shadcn components with no visual components yet (those start in 1.4).
زیرساخت shadcn بدون کامپوننت نمایشی (کامپوننت‌ها از 1.4 شروع می‌شوند).

## Scope / محدوده
- `packages/ui/components.json` (Tailwind v4, `rsc: false`)
- `cn` helper + tests
- `UiProvider` (Radix direction)
- ADR `docs/decisions/shadcn-base-in-packages-ui.md`
- ROADMAP status update

## Out of scope / خارج از محدوده
Any component (1.4+), Storybook (1.8), anything in `apps/`.

## Automated checks / ارزیابی خودکار
- `cn` unit tests (merge, conflicts, logical utilities)
- config test: `rsc: false`, empty `tailwind.config`, aliases under `src/`
- guard test: no `next/*` imports in `packages/ui/src`
- `pnpm lint && pnpm typecheck && pnpm test && pnpm build`

## Hand-off notes / یادداشت تحویل
- New deps: `clsx`, `tailwind-merge`, `@radix-ui/react-direction`.
- TODO(1.4): add `@/*` path alias to `packages/ui/tsconfig.json`; confirm `tailwind.css` path in `components.json` matches step 1.1 tokens file.
- TODO: export `cn` and `UiProvider` from the package entry (`src/index.ts`).

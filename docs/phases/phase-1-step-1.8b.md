# Step 1.8b – Brand toolbar and stories for 1.4b primitives / نوار ابزار brand و story کامپوننت‌های 1.4b

Depends on / وابسته به: 1.8a, 1.4b · Budget / بودجه: ≤ 14 files, ≤ 600 lines

## Goal / هدف
Finish the Storybook matrix (mode × brand × locale/direction) and review it, so the `done*` markers
of steps 1.1 to 1.4b can be cleared by the owner.
تکمیل ماتریس Storybook و بازبینی آن تا ستارهٔ گام‌های 1.1 تا 1.4b توسط مالک برداشته شود.

## Scope / محدوده
- Toolbar `brand` (default, emerald, violet) wired through the real `BrandProvider`.
- Sample brands validated by `brands.test.ts` (`validateBrand`, `checkBrandContrast`).
- Stories: Input, Checkbox, RadioGroup, Switch, Select, Icons (en/fa sample text).
- The "every primitive has a story" guard no longer has a pending list.
- Visual review checklist: `docs/checklists/visual-review-1.8.md`.

## Out of scope / خارج از محدوده
Visual-regression tooling, publishing Storybook, overlays (1.5).

## Automated checks / ارزیابی خودکار
`pnpm lint && pnpm typecheck && pnpm test` and `pnpm build-storybook` (in `packages/ui`).

## Owner review / بازبینی مالک
Work through the checklist; when finished, run the sign-off script so ROADMAP drops the `*` markers.

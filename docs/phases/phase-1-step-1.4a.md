# Step 1.4a – Primitives (1/2) / اجزای پایه (۱ از ۲)

Depends on / وابسته به: 1.3 · Budget / بودجه: ≤ 16 files, ≤ 500 lines

## Goal / هدف
Button, Badge, Card, Label plus the test infrastructure that 1.4b and later steps reuse.
چهار کامپوننت و زیرساخت تست که گام‌های بعدی از آن استفاده می‌کنند.

## Roadmap change / تغییر ROADMAP
Step 1.4 is split: **1.4a** (this step) and **1.4b** (Input, Checkbox, Radio, Switch, Select).
1.5, 1.6 and 1.8 depend on 1.4a; 1.7 (forms) depends on 1.4b. Approved by the owner.
گام 1.4 به 1.4a و 1.4b تقسیم شد؛ تأیید مالک.

## Conventions applied / قواعد اعمال‌شده
- Semantic tokens only; logical utilities only; no hard-coded strings (all text via props).
- 44px touch targets below `md` (mobile-first, 360px).
- Visible focus ring; keyboard operable; Radix `Slot` for `asChild`.
- Relative imports inside `packages/ui` (the `@/*` alias for the shadcn CLI arrives with 1.4b).

## Automated checks / ارزیابی خودکار
- Per component: render, interaction (keyboard where relevant), a11y (`jest-axe`) in `ltr` and `rtl`.
- `conventions.test.ts` scans `src/components` for color literals, palette colors and physical utilities.
- `pnpm lint && pnpm typecheck && pnpm test && pnpm build`.
- Visual verification across mode × brand × dir: Step 1.8 (Storybook).

## Dependencies / وابستگی‌ها
`class-variance-authority`, `@radix-ui/react-slot`, `@radix-ui/react-label`;
dev: `jsdom`, `@testing-library/react`, `@testing-library/user-event`, `jest-axe`.

## Assumptions to verify / فرض‌هایی که باید بررسی شوند
Semantic token names used by the classes (`primary`, `secondary`, `destructive`, `accent`, `muted`,
`card`, `input`, `ring`, `background`, `foreground` and their `-foreground` pairs) exist in the
step 1.1 tokens. Any missing name must be added to the tokens, not replaced by a raw color.

## Hand-off notes / یادداشت تحویل
- TODO(1.4b): add `@/*` → `src/*` path alias in `packages/ui/tsconfig.json`.

# Step 1.8a – Storybook infrastructure / زیرساخت Storybook

Depends on / وابسته به: 1.4a, 1.3b · Budget / بودجه: ≤ 16 files, ≤ 450 lines

## Goal / هدف
Run every primitive in the real providers and switch mode and locale (direction) from a toolbar,
so the visual debt behind the `done*` steps can be reviewed. Brand switching and the 1.4b stories follow in 1.8b.
اجرای کامپوننت‌ها با Providerهای واقعی و تعویض mode و locale (جهت) از نوار ابزار. تعویض brand و story کامپوننت‌های 1.4b در 1.8b می‌آید.

## Scope / محدوده
- Storybook 10 (`react-vite`) in `packages/ui/.storybook`, Tailwind v4 via `@tailwindcss/vite`.
- Decorator `withProviders` (ThemeProvider, LocaleProvider, UiProvider) + toolbar (mode, locale).
- `@storybook/addon-a11y`.
- Stories: Button, Badge, Card, Label, with Persian and English sample text.
- Guard test: every primitive has a story (1.4b components are listed as pending until 1.8b).
- Node: `.nvmrc` 24, `engines` >= 20.19 (Storybook 10 and Vite 7 need Node >= 20.19 or >= 22.12).

## Out of scope / خارج از محدوده
Brand toolbar, 1.4b stories, visual-regression tooling, CI deploy of Storybook.

## Automated checks / ارزیابی خودکار
- `pnpm lint && pnpm typecheck && pnpm test`
- `pnpm build-storybook` (in `packages/ui`) succeeds
- `stories.test.ts` and the existing `conventions.test.ts` (which also scans stories)

## Owner review / بازبینی مالک
Run `pnpm storybook` in `packages/ui`; for Button, Badge, Card and Label check light/dark/system and en/fa:
contrast, focus ring, RTL layout, 44px touch targets. Also check the Accessibility panel.

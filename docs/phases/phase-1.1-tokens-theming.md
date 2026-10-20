# Step 1.1 – Design tokens and theming

Status: implemented (patch delivered). Visual verification in Storybook comes with Step 1.8.

## Goal
Semantic design tokens, light/dark, a light-blue default brand, runtime brand loading, fonts hooks, Tailwind v4 mapping.

## Decisions (owner-approved)
- Brand loaded from the backend at runtime; start with a light-blue default.
- Fonts: Inter (en) + Vazirmatn (fa), self-hosted by the apps.

## Delivered
- `styles/tokens.css` (light `:root`, dark `:root.dark`), `theme.css` (`@theme inline`), `base.css`, `index.css`
- `theme/tokens.ts` (token names, contrast pair lists), `theme/contrast.ts` (WCAG ratio, hex/oklch)
- `theme/brand.ts` (`validateBrand`, `brandToCss`, `applyBrand`, `clearBrand`, `checkBrandContrast`)
- Tests: contrast helpers, tokens completeness + WCAG AA/3:1 checks per mode, brand validation/injection/apply
- Docs: `THEMING.md`, ADR-0006, ADR-0004 update

## Not in this step
ThemeProvider / no-flash script / system preference (1.3), i18n and direction (1.2), components (1.4+),
Storybook (1.8).

## Acceptance
`pnpm test` green (contrast and completeness); `applyBrand` rejects any non-whitelisted input; light-blue default
passes AA in both modes (primary on white 4.75:1 light; 7.7:1 dark).

## Hand-off notes
- Backend must expose a brand endpoint matching the JSON in `THEMING.md` (Open Question 9).
- Step 1.3 builds `ThemeProvider` and `BrandProvider` on top of `applyBrand`/`clearBrand`.
- `checkBrandContrast` only checks pairs the brand fully defines per mode; defaults cover the rest.
- Run `pnpm format` once after install if Prettier reports differences, then commit.

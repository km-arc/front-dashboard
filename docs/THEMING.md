# Theming guide

Theme = **mode** (light | dark) × **brand** (runtime, from the backend). Default brand: light blue.

## Using it in an app (Tailwind v4)
```css
/* app/globals.css */
@import "tailwindcss";
@import "@front-dashboard/ui/styles.css";
@source "../../../packages/ui/src"; /* adjust relative path */
```
Components then use semantic utilities only: `bg-background text-foreground`, `bg-primary text-primary-foreground`,
`border-border`, `ring-ring`, `rounded-lg`. Never raw colors.

## Mode
`class="dark"` on `<html>` enables dark tokens (`dark:` variant follows the same class).
The ThemeProvider (with no-flash script and system preference) is built in Step 1.3.

## Brand (runtime)
```ts
import { validateBrand, applyBrand, brandToCss, checkBrandContrast } from "@front-dashboard/ui";

const result = validateBrand(await fetchBrandFromBackend());
if (result.ok) {
  checkBrandContrast(result.brand); // warn/log: pairs below WCAG AA
  applyBrand(result.brand); // client: injects <style> and sets <html data-brand>
}
// SSR (no flash): render brandToCss(brand) inside a <style> in <head> and set data-brand on <html>.
```
Backend JSON contract (all keys optional except `id`; unspecified tokens keep the default light-blue values):
```json
{
  "id": "acme",
  "name": "Acme",
  "radius": "0.5rem",
  "light": { "primary": "oklch(0.5 0.2 150)", "primary-foreground": "#ffffff" },
  "dark": { "primary": "oklch(0.75 0.15 150)", "primary-foreground": "oklch(0.18 0.03 255)" }
}
```
- Allowed values: hex, `oklch()`, `hsl()`, `rgb()` with numbers only. Everything else is rejected (no CSS injection).
- Allowed tokens: see `COLOR_TOKENS` in `packages/ui/src/theme/tokens.ts`.
- Define a **surface and its foreground together** (e.g. `primary` + `primary-foreground`) in each mode you override,
  otherwise contrast cannot be guaranteed. `checkBrandContrast` verifies pairs that are fully provided.
- If the app uses a strict CSP, give the injected `<style>` a nonce (SSR path) or allow it explicitly.

## Fonts
Tokens expose `--font-latin` (default Inter) and `--font-persian` (default Vazirmatn).
Apps load fonts (e.g. `next/font`, self-hosted) and map them:
```css
:root { --font-latin: var(--font-inter); --font-persian: var(--font-vazirmatn); }
```
`<html lang="fa">` automatically switches the sans stack to Persian-first.

## Adding or changing a token
1. Add it to `COLOR_TOKENS` and to both blocks in `styles/tokens.css` and to `styles/theme.css`.
2. If it is a text pair, add it to `TEXT_CONTRAST_PAIRS`.
3. `pnpm test` must pass (contrast and completeness tests).

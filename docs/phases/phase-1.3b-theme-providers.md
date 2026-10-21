# Step 1.3b – ThemeProvider and BrandProvider

Status: implemented (patch delivered). Planned in Step 1.3's scope, delivered separately because the
owner's Step 1.3 shipped `UiProvider` (direction) only.

## Decisions (owner-approved)
- Delivered **before** Step 1.4b so Select/Switch etc. can be verified in dark mode and with a brand.
- Brand comes from the backend; the app fetches it and passes it down (the library does not fetch).

## Delivered (new files only, `packages/ui/src/theme/`)
- `mode.ts`: `ThemeMode`, `resolveThemeMode`, safe storage helpers, `getThemeInitScript()` (no-flash inline script)
- `theme-provider.tsx`: `ThemeProvider`, `useTheme()` → `{ mode, resolvedMode, setMode }`
  (light | dark | system, persisted in `localStorage` key `fd-theme`, follows the OS, syncs across tabs)
- `brand-provider.tsx`: `BrandProvider`, `useBrand()` (validates, applies and cleans up the runtime brand)
- `brand-ssr.ts`: `getBrandSsr(brand)` → `{ attributes, css }` for server-rendered first paint
- Tests: mode logic and init script (executed against fakes), SSR rendering, and jsdom behaviour tests
  (OS changes, persistence, other-tab sync, blocked storage, brand apply/swap/cleanup/invalid)

## Wiring (one-time)
Add to `packages/ui/src/index.ts`:
```ts
export * from "./theme/mode";
export * from "./theme/theme-provider";
export * from "./theme/brand-provider";
export * from "./theme/brand-ssr";
```

## Usage in a Next.js app (App Router)
```tsx
// app/[locale]/layout.tsx
import { LocaleProvider, ThemeProvider, BrandProvider, UiProvider } from "@front-dashboard/ui";
import { getThemeInitScript, getBrandSsr, getHtmlAttributes, getDirection } from "@front-dashboard/ui";

const brand = await fetchBrand(); // from the .NET backend, cached/revalidated by the app
const ssr = getBrandSsr(brand);

return (
  <html {...getHtmlAttributes(locale)} {...ssr.attributes} suppressHydrationWarning>
    <head>
      <script dangerouslySetInnerHTML={{ __html: getThemeInitScript() }} />
      {ssr.css && <style id="fd-brand-style" dangerouslySetInnerHTML={{ __html: ssr.css }} />}
    </head>
    <body>
      <LocaleProvider locale={locale}>
        <UiProvider dir={getDirection(locale)}>
          <ThemeProvider>
            <BrandProvider brand={brand}>{children}</BrandProvider>
          </ThemeProvider>
        </UiProvider>
      </LocaleProvider>
    </body>
  </html>
);
```
Notes:
- The init script sets the `dark` class before first paint; `ThemeProvider` takes over after hydration and
  never touches the DOM before it has read the stored choice, so it cannot undo the script's result.
- `resolvedMode` is `"light"` on the server and first client render when mode is `system`. Style with the
  `dark:` variant (CSS), not with `resolvedMode`, to avoid flicker. Use `useTheme()` for switcher UIs only.
- The SSR `<style id="fd-brand-style">` is reused by `BrandProvider` (same id) when the brand changes at runtime.
- Under a strict CSP give the inline script and style a nonce.
- Memoizing the `brand` prop is unnecessary: it is compared by content.

## Not in this step
A theme switcher component (needs Button/DropdownMenu; comes with the shell in Step 2.1) and the backend brand
endpoint (Open Question 9).

## Hand-off notes
- jsdom behaviour tests (`theme-provider.test.tsx`, `brand-provider.test.tsx`) require the testing deps added in
  Step 1.4a (`jsdom`, `@testing-library/react`, `@testing-library/user-event`). They were written but could not be
  executed in the authoring sandbox; the logic tests and SSR tests were run there. Run `pnpm test` and report failures.

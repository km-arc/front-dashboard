# Visual review: Step 2.1c (store layout, bottom tab bar)

Run `pnpm --filter @front-dashboard/store dev`, then open `/en` and `/fa`.
Check each combination: Mode (light, dark) x Locale (en = LTR, fa = RTL) at 360px, 768px and desktop width.
Interactive behaviour is checked here by hand until the Playwright smoke test exists.

Phone (360px): tab bar
- [ ] A bar is fixed to the bottom with five tabs in order: Home, Categories, Search, Cart, Dashboard (mirrored in fa)
- [ ] Icon above a label; every tab is at least 44px; nothing wraps or is cut off; no horizontal page scroll
- [ ] Home is marked as the current page (primary color, stronger text); the other four look disabled and are not clickable
- [ ] The bar stays on screen while the page scrolls and never hides page content (scroll to the very end)
- [ ] On a phone with a home indicator or notch, the bar sits above it (device or simulator; skip if unavailable)

Phone (360px): top bar and drawer
- [ ] The top bar has only the menu button and the brand; no icons from the old header
- [ ] The drawer opens from the reading start (left in en, right in fa) and closes with the close button, Escape and the overlay
- [ ] Focus moves into the drawer and returns to the menu button when it closes
- [ ] The drawer lists Contact us (disabled for now), and language and theme at the bottom; their menus open above the drawer

Desktop
- [ ] The tab bar is hidden; the header shows brand, Home, Categories, Contact us, the three tool icons, language and theme
- [ ] Home is marked as current; the others look disabled; the footer shows the copyright line and the links

Language and theme
- [ ] Switching language keeps the same page, flips `dir`, and shows the Vazirmatn font in fa
- [ ] Light, dark and system work; the choice survives a reload without a flash
- [ ] The theme icon shows a sun in light and a moon in dark

Other
- [ ] Tab: the first stop is "Skip to main content"; Enter moves focus to the page content
- [ ] `/en/nope` and `/fa/nope` show the localized "Page not found" page with the header, footer and tab bar
- [ ] Text is readable in light and dark; the Storybook icon gallery (Primitives/Icons) shows the new icons

Sign-off: Reviewer ____________  Date ____________
After sign-off set step 2.1c to `done` in docs/ROADMAP.md.

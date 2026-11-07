# Visual review: Step 2.1c (store layout)

Run `pnpm --filter @front-dashboard/store dev`, then open `/en` and `/fa`.
Check each combination: Mode (light, dark) x Locale (en = LTR, fa = RTL) at 360px, 768px and desktop width.
Interactive behaviour is checked here by hand until the Playwright smoke test (2.1f) exists.

Header (360px)
- [ ] One row, in order: menu button, brand, search, cart, account; nothing wraps or overflows; no horizontal page scroll
- [ ] Every target is at least 44px; the focus ring is visible
- [ ] Search, cart and account are disabled (announced "coming soon"), not clickable, no 404

Header (desktop)
- [ ] Brand, then Home, Categories, Contact us; the tools; then language and theme at the reading end
- [ ] The menu button is hidden; Home is marked as the current page; Categories and Contact us look disabled

Drawer
- [ ] Opens from the reading start (left in en, right in fa); closes with the close button, Escape and the overlay
- [ ] Focus moves into the drawer and returns to the menu button when it closes
- [ ] Language and theme controls at the bottom work inside the drawer (their menus open above it)

Language and theme
- [ ] Switching language keeps the same page, flips `dir`, and shows the Vazirmatn font in fa
- [ ] Light, dark and system work; the choice survives a reload without a flash
- [ ] The theme icon shows a sun in light and a moon in dark

Other
- [ ] Tab: the first stop is "Skip to main content"; Enter moves focus to the page content
- [ ] The footer shows the copyright line and the links; the page grows so the footer sits at the bottom
- [ ] `/en/nope` and `/fa/nope` show the localized "Page not found" page with the header and footer
- [ ] Text is readable in light and dark; the Storybook icon gallery (Primitives/Icons) shows the new icons

Sign-off: Reviewer ____________  Date ____________
After sign-off set step 2.1c to `done` in docs/ROADMAP.md.

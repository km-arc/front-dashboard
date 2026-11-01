# Visual review: Step 1.6b (Tabs, Accordion)

Run `pnpm --filter @front-dashboard/ui storybook`, groups **Disclosure/Tabs** and **Disclosure/Accordion**.
Check each toolbar combination: Mode (light, dark) x Brand (default + each brand) x Locale (en = LTR, fa = RTL),
at 360px and at desktop width.

Tabs
- [ ] The active tab is clearly marked (underline in the primary color, stronger text); inactive tabs are readable
- [ ] Tabs start at the reading start: left in en, right in fa
- [ ] ManyTabsScroll at 360px: the list scrolls sideways, labels never wrap, no page-level horizontal scroll
- [ ] The active tab scrolls into view when selected with the keyboard
- [ ] Arrow keys move between tabs: ArrowRight in en, ArrowLeft in fa (mirrored); the disabled tab is skipped
- [ ] Tabs look >= 44px high; the focus ring is visible

Accordion
- [ ] Section titles align to the reading start; the chevron sits at the reading end and rotates when open
- [ ] Single: opening another section closes the first one; clicking the open section closes it
- [ ] Multiple: several sections can stay open
- [ ] Titles are comfortably tappable (>= 44px) and the focus ring is visible
- [ ] Text readable in light, dark and with a brand; borders between sections visible but subtle

Sign-off: Reviewer ____________  Date ____________
After sign-off set step 1.6b to `done` in docs/ROADMAP.md and clear its `*` marker.

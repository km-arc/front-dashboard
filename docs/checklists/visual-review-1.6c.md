# Visual review: Step 1.6c (DataTable)

Run `pnpm --filter @front-dashboard/ui storybook`, story group **Data/DataTable**. Check each toolbar combination:
Mode (light, dark) x Brand (default + each brand) x Locale (en = LTR, fa = RTL), at 360px and at desktop width.

- [ ] Text and borders readable in light, dark and with a brand; selected rows are clearly highlighted
- [ ] No horizontal page scroll at 360px (only the table area scrolls); the pinned first column has an opaque background
- [ ] Pinned column sits at the reading start (left in en, right in fa) while scrolling sideways
- [ ] Total column aligns to the reading end; digits have equal width; Persian digits in fa
- [ ] Sort arrows: up = ascending, down = descending, faint = unsorted; header button looks >= 44px
- [ ] SelectableRows: header checkbox shows the indeterminate dash when only some rows are selected
- [ ] "x of y selected" at the reading start and pagination at the reading end (stacked on phones)
- [ ] WithFilter: a non-matching filter shows the empty state; "Clear filter" restores the rows
- [ ] Focus ring visible on header buttons, checkboxes and pagination buttons

Sign-off: Reviewer ____________  Date ____________
After sign-off set step 1.6c to `done` in docs/ROADMAP.md and clear its `*` marker.

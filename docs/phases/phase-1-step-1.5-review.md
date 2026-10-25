# Step 1.5 (1.5a + 1.5b) – stories, strict guard and review / استوری‌ها، تست سخت‌گیر و بازبینی

The overlay components (Dialog, Sheet, Alert, Skeleton, DropdownMenu, Tooltip, Toaster) were already in
`step/1.5-overlays` with tests passing. This change adds what was missing before the step can be called done:
- Storybook stories for all seven components (en/fa sample text, `OpenByDefault` stories).
- `stories.test.ts` is strict again (empty pending list): every primitive in `components/ui` needs a story.
  The internal `overlay-parts` moved to `components/internal` (it is not a public primitive).
- `docs/checklists/visual-review-1.5-overlays.md` for the owner's visual and RTL review.
- Roadmap: 1.5 split into 1.5a (Dialog, Sheet, Alert, Skeleton) and 1.5b (DropdownMenu, Tooltip, Toaster).

محتوای گام قبلاً در برنج بود و تست‌ها سبز بودند؛ این تغییر story، تست سخت‌گیر و چک‌لیست بازبینی را اضافه می‌کند.

## Known follow-up / پیگیری
`DialogContent` and `SheetContent` default `closeLabel` to English "Close". Every caller must pass the translated
text (`t("common.close")`); the stories do. Decide later whether the prop should become required.

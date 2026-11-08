# Visual review: Step 2.1d (brand from the sample API)

Put `NEXT_PUBLIC_API_MOCKING=enabled` in `apps/store/.env.local`, restart `pnpm --filter @front-dashboard/store dev`.
Check `/en` and `/fa`, light and dark.

With the sample API on
- [ ] The store uses the green sample brand: the active tab, the buttons and the focus ring are green, not blue
- [ ] Dark mode uses the dark green variant; text on green surfaces stays readable
- [ ] No flash of blue on a hard reload (the brand is in the first paint)
- [ ] The corners are a little rounder than the default (radius 0.75rem)

With the sample API off (remove the line, restart)
- [ ] The store is back to the default blue, with no error in the browser or the server log

With a backend that is down (`API_BASE_URL=http://localhost:9` and mocking off)
- [ ] The store still loads with the default blue theme; the server log shows one "Brand unavailable" warning

Sign-off: Reviewer ____________  Date ____________
After sign-off set step 2.1d-2 to `done` in docs/ROADMAP.md.

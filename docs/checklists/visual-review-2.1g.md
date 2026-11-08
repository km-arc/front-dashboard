# Visual review: Step 2.1g (installable app)

Needs HTTPS to install on a phone (a deployed preview, or a tunnel to the dev server); `localhost` works on desktop.
Run a production build (`pnpm build`, then `pnpm --filter @front-dashboard/store start`) for the install checks.

Manifest (desktop Chrome, DevTools, Application, Manifest) at `/en` and `/fa`
- [ ] No errors or warnings; name, start URL (`/en` or `/fa`), display "standalone" and three icons are listed
- [ ] The Installability section reports no problems
- [ ] `/en/manifest.webmanifest` shows `lang: en`, `dir: ltr`; `/fa/manifest.webmanifest` shows the Persian name, `lang: fa`, `dir: rtl`
- [ ] The icons render correctly in the Manifest panel, including the maskable one in the safe-zone preview

Install
- [ ] Desktop Chrome: the install icon appears in the address bar; the installed window opens without an address bar on the right language
- [ ] Switching language inside the installed window stays in the same window
- [ ] Android Chrome: "Install app" or "Add to Home screen"; the icon looks right inside the phone's mask (circle or rounded square)
- [ ] The installed app opens full screen; the status bar color matches the header in light and dark system theme
- [ ] The bottom tab bar sits above the home indicator and the header clears the notch
- [ ] iPhone Safari: Share, Add to Home Screen shows the 180px icon and the name; the app opens full screen

Feel
- [ ] No grey tap flash on links and buttons; no double-tap zoom on the tab bar
- [ ] Browser tab (not installed): the tab shows the vector icon; the address bar color follows the system theme

Sign-off: Reviewer ____________  Date ____________
After sign-off set step 2.1g to `done` in docs/ROADMAP.md.

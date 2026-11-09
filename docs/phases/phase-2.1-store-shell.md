# Step 2.1 – `apps/store` shell / پوستهٔ فروشگاه (`apps/store`)

Status: **approved by owner (2026-11-04)**. 2.1a and 2.1b done (merged, PR #18, CI green); 2.1c done (owner visual review passed 2026-11-08); 2.1g (installable app) merged (PR #22); 2.1d-1 (`packages/api`) done (merged, PR #23); 2.1d-2 (brand from the sample API) done; 2.1e-1 (auth contract) done (merged, PR #25); 2.1e-2 (session and route guard) delivered as a patch; 2.1e-3 not started.
Owner request: prefer configuration over hard-coded choices where it is cheap (applied to the fallback locale and time zone in 2.1b).

Depends on / وابسته به: Phase 1 · Split into 2.1a–2.1e; each sub-step is one PR, budget ≤ 20 files and
≤ 600 lines (lockfile and generated API types excluded) / هر زیرگام یک PR با بودجهٔ ≤ 20 فایل و ≤ 600 خط.

## Goal / هدف

A running, mobile-first storefront shell that proves the whole stack end to end: locale routing (`/en`, `/fa`),
theme (mode × runtime brand), layout and navigation, a contract-first API layer with mocks, and an auth stub.
Product pages (2.2) and cart (2.3) plug into it without changing its structure.

## Audit of the repo (local copy, 2026-11-04) / یافته‌های بررسی

These facts shape the design:

1. **Theme providers are not public.** `packages/ui/src/index.ts` exports tokens, brand helpers, i18n, `UiProvider`
   and components, but not `ThemeProvider`, `useTheme`, `BrandProvider`, `useBrand`, `getThemeInitScript`,
   `getBrandSsr`. `package.json` exposes only `.` and `./styles.css`, so an app cannot import them today.
   Fix in 2.1b: additive re-exports in `index.ts` (1 file, no behaviour change).
2. **`ui` ships TypeScript source** (`"exports": "./src/index.ts"`). The app needs
   `transpilePackages: ["@front-dashboard/ui"]` in `next.config`.
3. **Tailwind v4 needs `@source`.** Storybook already does it (`@import "tailwindcss"; @import ".../index.css";
   @source "../src";`). The app CSS does the same, pointing at the ui sources.
4. **Phase 1 sign-off.** ROADMAP shows 1.6c as `done*` and the 1.6b / 1.6c visual-review checklists are unsigned
   in this copy. Gate G1 below.
5. **No contract, auth mechanism or brand endpoint yet** (OPEN_QUESTIONS 4, 5, 9). The design isolates them behind
   interfaces so the answers change one module, not the app.
6. Icons: `ui` has only a few inline icons (check, minus, chevron…). The header needs menu, close, cart and globe.

## Gates / پیش‌نیازها

- **G1** – before 2.1b starts: the owner signs off `docs/checklists/visual-review-1.6b.md` and `…-1.6c.md`
  (or explicitly waives them), then ROADMAP 1.6c becomes `done`.
- **G2** – this plan approved, and OPEN_QUESTIONS 4, 5, 9, 12, 13, 14, 15 answered or the proposed value accepted.
  Questions that stay open only affect 2.1d/2.1e and use the stub defaults below.

## Scope / Out of scope

In: the five sub-steps below. Out: product, cart and order pages (2.2+), admin app (3.1), real authentication,
real payments, SEO beyond basic metadata, analytics.

## Design decisions (proposed; each becomes an ADR when approved) / تصمیم‌های پیشنهادی

| # | Decision | Why |
|---|----------|-----|
| D1 | Next.js App Router (latest stable at 2.1b, version pinned), TypeScript strict extending `tsconfig.base.json`, `src/` layout. Next 16 names the request-hook file `proxy.ts` (earlier versions `middleware.ts`); use whichever the installed version expects | ADR-0002 |
| D2 | URLs always carry the locale: `/en/...`, `/fa/...`. `/` redirects using cookie, then `Accept-Language`, then the fallback locale (OQ 15) | OQ 13; SEO and shareable links |
| D3 | App messages with **next-intl** (`apps/store/messages/{en,fa}.json`); built-in ui strings stay in `LocaleProvider`. No key lives in both catalogs. Parity test between en and fa | ADR-0003, `docs/I18N.md` |
| D4 | Provider order in `app/[locale]/layout.tsx`: `<html {...getHtmlAttributes(locale)}>`; `<head>` gets `getThemeInitScript()` and the brand `<style>` from `getBrandSsr()`; body wraps `LocaleProvider` → `ThemeProvider` → `BrandProvider` → `UiProvider` → next-intl provider → `Toaster`, in one client `Providers` component | Matches ui docs; no flash of wrong theme |
| D5 | Brand is fetched on the server per request with a short cache; any failure falls back to the default light-blue theme and never blocks rendering. Brand JSON is validated by the existing `validateBrand` | OQ 2, 9, 10 |
| D6 | New workspace package `packages/api` (`@front-dashboard/api`): `openapi/openapi.yaml` (the contract, owned here until the backend publishes one), generated types via `openapi-typescript` (committed, and a test fails when they drift from the contract), a typed client via `openapi-fetch`, and a sample API. Reused by `apps/admin` in 3.1 | ADR-0005; avoids a second client later |
| D7 | While the backend does not exist, the **sample API** answers the contract in memory: a `fetch` that serves routes with no network, no service worker and no extra dependency (owner decision 2026-11-08, replacing MSW). It is switched on by `NEXT_PUBLIC_API_MOCKING=enabled` (dev and tests only) and lives in the `@front-dashboard/api/mock` entry so production bundles do not include it. Without the switch the client talks to `API_BASE_URL` | Frontend works without the backend; one setting moves to the real API |
| D8 | Auth stub behind an interface `SessionService { getSession, signIn, signOut }` in `apps/store/src/features/auth`. The stub talks to mock endpoints. Route protection is checked on the server in layouts or pages; `proxy.ts` only does an optimistic redirect | OQ 4 unknown; defence in depth |
| D9 | Folders: `src/app` (routing only), `src/features/<module>`, `src/components` (shell pieces), `src/lib`. Env values are read through one zod-validated `src/env.ts`; `.env.example` lists them | AGENTS.md, ARCHITECTURE.md |
| D10 | Tests: Vitest + Testing Library for logic and components, contract tests for handlers; Playwright e2e smoke is proposed as a later optional step 2.1f | NFR-7 |

## Sub-steps and automated evaluation / زیرگام‌ها و ارزیابی خودکار

All sub-steps must keep `pnpm lint && pnpm typecheck && pnpm test && pnpm build` green. Extra checks per step:

| Step | Content | Automated evaluation |
|------|---------|----------------------|
| 2.1a | This plan, OPEN_QUESTIONS proposals, ROADMAP split. **Docs only, no code** | `pnpm format:check`, markdown links reviewed by owner |
| 2.1b | `apps/store` scaffold: Next config (`transpilePackages`), Tailwind v4 + ui styles, `[locale]` routing, `proxy.ts`, providers, env, `.env.example`; additive theme exports in `packages/ui/src/index.ts`; empty home page; turbo tasks | tests: routing/locale resolution, en/fa message parity, `<html lang dir>` for both locales, no physical-direction classes (existing ESLint rule), env validation; `pnpm build` produces `/en` and `/fa` |
| 2.1c | Shell layout: skip link, header (logo slot, nav, locale switcher, theme toggle, cart link placeholder), mobile menu in a `Sheet`, footer, `loading`, `error`, `not-found`; 3–4 additive icons in `packages/ui` | unit tests for the navigation config and message parity; menu, switchers and focus are checked by `docs/checklists/visual-review-2.1c.md` now and by Playwright in 2.1f (Radix menus need a real browser); ui story for the new icons |
| 2.1d-1 | `packages/api`: contract for `GET /brand` and the error model, generated types, client factory, `unwrap`/`ApiError`, sample API (in-memory fetch) | tests: sample API answers the contract, `unwrap` and errors, network failures are not hidden; `generate:check` fails when the committed types differ from the contract |
| 2.1d-2 | `apps/store`: `getBrand()` (cache of a few minutes, checked with `validateBrand`, any failure means the default theme), `API_BASE_URL` and the mock switch in `env.ts`, brand wired into the root layout | tests: sample brand passes `validateBrand`, brand fallback when the API is down, env validation |
| 2.1e-1 | Auth contract (`POST /auth/otp/request`, `/auth/otp/verify`, `/auth/login`, `GET /auth/session`, `POST /auth/logout`), sample accounts, mobile and code normalization | sample API tests (code, password, session, sign-out), normalization tests, `generate:check` |
| 2.1e-2 | `SessionService` (httpOnly cookie, server only), sign-in and sign-out server actions, server-side route guard, protected `/dashboard` page | tests for the service and the guard with the sample API |
| 2.1e-3 | Login page with the code and password methods, resend timer, localized errors, dashboard tab on, sign-out | visual review checklist; form validation tests |
| 2.1g | Installable app (PWA, owner-approved 2026-11-07): web app manifest (name, colors, `display: standalone`), app icons (192, 512, maskable), theme color per mode, safe areas already in place from 2.1c | manifest validity test, icon files exist with the declared sizes, `pnpm build` serves `/manifest.webmanifest`; install check by hand on a phone |
| 2.1f (optional) | Playwright smoke: 360 and 1280 px × en/fa × light/dark, axe scan, no horizontal scroll | runs in CI; owner decides whether it is worth the CI time |

## UI inventory and states / فهرست رابط کاربری

Header, mobile menu, footer, skip link, locale switcher, theme toggle (light, dark, system), cart link placeholder,
login form. States: loading (`Skeleton`), error (`Alert` + retry), not found, signed out vs signed in, invalid brand
(silent fallback, logged).

## Responsive plan / طرح واکنش‌گرا

360 px first. Header is a single row; navigation lives in a `Sheet` below `md`, inline from `md`. Touch targets ≥ 44 px.
Content sits in a centred container that grows with `sm: md: lg:`. No horizontal page scroll at any width.

## Theme, i18n, RTL / تم، زبان، راست‌به‌چپ

Logical utilities only (the root ESLint rule already applies to `apps/*`). Direction-bearing icons flip with
`rtl:rotate-180`. No raw colours or hard-coded strings in the app. Dates and money go through
`useLocale().formatters`; time zone `Asia/Tehran` unless OQ 12 says otherwise.

## Accessibility / دسترس‌پذیری

Skip link first in the tab order, landmarks (`header`, `nav`, `main`, `footer`), visible focus, menu and sheet traps
and returns focus, language switcher announces the current language, form errors linked with `aria-describedby`.

## Risks and open questions / ریسک‌ها و پرسش‌ها

- Auth mechanism (OQ 4) may force a BFF pattern (httpOnly cookie set by the Next server) instead of the stub design;
  the `SessionService` interface keeps that change local.
- If the backend contract (OQ 5) differs from the one authored here, only `packages/api` changes.
- Pinning Next.js, next-intl, MSW, `openapi-typescript`, `openapi-fetch` versions happens in 2.1b/2.1d against the
  versions available then; this plan deliberately does not fix numbers.
- Extra CI time if 2.1f is accepted.

## Acceptance criteria / معیار پذیرش

`pnpm dev` serves `/en` and `/fa` with correct `lang`/`dir`; theme and brand switch without flash; header and menu work
at 360 px and desktop; login and logout work against mocks; everything above passes
`docs/DEFINITION_OF_DONE.md`; ROADMAP and this file's hand-off notes are updated.

## Hand-off notes / یادداشت تحویل

### 2.1b – `apps/store` scaffold (done: merged in PR #18)

Delivered (20 source/config files, about 450 lines):
- `packages/ui`: public exports for `ThemeProvider`, `useTheme`, `BrandProvider`, `useBrand`, theme mode helpers and
  `getBrandSsr`; two subpath entries in `package.json` so server code does not load the whole component library:
  `@front-dashboard/ui/locales` (pure locale helpers) and `@front-dashboard/ui/theme-ssr`
  (`getThemeInitScript`, `getBrandSsr`, `BRAND_STYLE_ID`, new file `src/theme/ssr.ts`).
- `apps/store`: Next.js 16 App Router, `src/proxy.ts` (next-intl), `[locale]` layout with `<html lang dir>`,
  theme init script, brand style slot (null until 2.1d), fonts (Inter and Vazirmatn through `next/font`, mapped onto the
  ui font tokens), `Providers` (D4 order, Toaster follows the resolved mode), placeholder home page, en/fa messages,
  `src/env.ts` (zod; `NEXT_PUBLIC_DEFAULT_LOCALE`, `NEXT_PUBLIC_TIME_ZONE`) and `.env.example`.
- Tests: `env.test.ts` (defaults, blanks, invalid values), `i18n/i18n.test.ts` (routing matches ui locales, always-prefix,
  en/fa key and placeholder parity, no empty messages).
- `.gitignore`: `next-env.d.ts` (generated by `next typegen`).

Decisions taken while implementing:
- The fallback locale and the time zone are configurable through env (owner request); defaults `en` and `Asia/Tehran`.
- The server layout imports only the two pure subpath entries; the barrel (`@front-dashboard/ui`) is imported only from
  the client `Providers`, which avoids evaluating every component module in the server layer.
- Not added yet (by design): locale switcher and `navigation.ts` (2.1c), brand fetch (2.1d), `not-found`/`error` pages (2.1c).

**Local verification result (2026-11-04) and fixes (patch `2.1b-verification`):**
- `next/font/google` failed at build (the build machine cannot reach fonts.googleapis.com). Fonts are now self-hosted
  through `@fontsource-variable/inter` and `@fontsource-variable/vazirmatn`, imported in the root layout; no network is
  needed at build or run time. (This replaces the `next/font` decision above.)
- `@radix-ui/react-accordion` was imported by `packages/ui` (step 1.6b) but missing from its `package.json` and the
  lockfile, so ui typecheck and the accordion test failed on `main` before this step. Added to `packages/ui/package.json`.
- Prettier flagged two files in `apps/store`; formatted.

Before the fixes, lint and the 11 store tests passed.

**Not executed in the authoring sandbox** (no network, so no `pnpm install`): lint, typecheck, tests and build.
Gate G1 (visual sign-off of the 1.6b and 1.6c checklists) is still open and must be closed before this merges.
Still unverified: the `@import "@front-dashboard/ui/styles.css"`
resolution in Tailwind v4 (fallback: a relative path to `../../../../packages/ui/src/styles/index.css`);
`next typegen` in the `typecheck` script; the `defineRouting` locale typing.

### 2.1c – store layout (done)

Navigation approved by the owner (2026-11-07); the owner then asked for an app-like phone experience with its own
navigation, approved as a bottom tab bar. Six destinations, configured in `apps/store/src/config/navigation.ts`
(destinations, availability and the order of each surface; labels in `messages/*.json` under `shell.nav`):
- Phones (below `md`): a fixed bottom tab bar with Home, Categories, Search, Cart, Dashboard (at most five tabs);
  the top bar has only the menu button and the brand; the drawer holds Contact us, language and theme.
- Desktop: header with brand, Home, Categories, Contact us, the three tool icons, language and theme; footer with links.
- Only Home is available now; the others render disabled ("coming soon") instead of linking to a 404. Each later
  step switches its destination on with `available: true` (Categories and Search in 2.2, Cart in 2.3, Dashboard in 2.1e).
- The shell is safe-area aware (`viewportFit: "cover"`, insets on the header and the tab bar).

Delivered (about 30 files in two patches): `packages/ui` icons (menu, close, search, cart, user, sun, moon, home, grid),
exported from the barrel, with the icon story updated; `BottomNav`; `apps/store` header, drawer (`Sheet`), footer, skip link, locale switcher, theme toggle,
`NavLink`, `loading`, `error`, localized `not-found` plus the catch-all route that triggers it, `src/i18n/navigation.ts`,
navigation config and tests, en/fa messages, and the visual review checklist.

Decisions taken while implementing:
- Server components (`loading`, `not-found`, header, footer) import no ui components, only client components do, to
  keep the ui barrel out of the server layer; `loading` and `not-found` therefore use plain classes.
- Built-in ui strings (open/close menu, language, theme, skip link, error, retry) are reused from the ui catalog; only
  shop-specific text is in the app catalog.
- The cart badge is not built yet: there is no cart until 2.3.
- Switching language is a full page load that keeps the path, the query string and the hash. A client navigation re-renders the
  root layout in place, which unmounts the `<style>` of the brand that `BrandProvider` also manages, and throws `removeChild`
  errors (found in 2.1d-2, when the brand first had CSS).

**Not executed in the authoring sandbox** (no network): lint, typecheck, tests, build and the visual checklist.

### 2.1g – installable app (patch delivered, awaiting local verification)

Owner-approved on 2026-11-07, with the default choices (app name from the app messages, theme color from the default
theme, placeholder icon):
- `src/lib/manifest.ts` builds one manifest per locale, served by `src/app/[locale]/manifest.webmanifest/route.ts` at
  `/en/manifest.webmanifest` and `/fa/manifest.webmanifest`: name, `lang`, `dir`, `display: standalone`, portrait,
  colors, icons (192, 512, maskable 512). Scope is `/` so a language switch stays inside the installed window.
- `public/icons`: placeholder icons (a shopping bag on the default primary color): `icon-192.png`, `icon-512.png`,
  `icon-maskable-512.png`, `apple-touch-icon.png` (180) and `icon.svg`.
- The locale layout links the manifest, the icons and the Apple web-app tags, and sets `themeColor` for light and dark.
- `public/screenshots`: one wide (1280x720) and one narrow (720x1280) screenshot declared in the manifest, which Chrome
  needs for the richer install dialog (DevTools otherwise warns). They are schematic placeholders of the home page
  (no text, so they fit both languages); replace them with real captures once there are real pages, keeping the
  `form_factor`, the sizes (320 to 3840 px) and an aspect ratio of at most 2.3. The test checks all of that.
- `globals.css`: no tap highlight and `touch-action: manipulation` on links and buttons.
- Tests: manifest fields per locale, hex colors, scope contains the start page, and the icon files exist with exactly
  the sizes the manifest declares (read from the PNG header).

Known limits, on purpose:
- The icons and screenshots are placeholders. To use the real logo, replace the four PNGs and the SVG with the same sizes; the test
  fails if a size does not match what the manifest declares.
- Colors in the manifest and the status bar are static hex values of the default theme. A runtime brand (2.1d) and the
  in-app light/dark toggle do not change them (the status bar follows the system theme).
- There is no service worker, so no offline mode and no push. Installing does not need one in current Chrome.

**Not executed in the authoring sandbox** (no network): lint, typecheck, tests, build and the install checks.

### 2.1d-1 – `packages/api` (done: merged in PR #23)

Owner decision (2026-11-08): while the backend does not exist, the server side is served by a **sample API**.
That is implemented as an in-memory `fetch` instead of MSW, which keeps the dependency list short and works the same on
the server, in tests and later in the browser (no service worker). The auth endpoints move to 2.1e, because their shape
depends on the sign-in method (mobile number with a one-time code, or email and password), which is not decided yet.

- `packages/api/openapi/openapi.yaml`: `GET /brand` (the JSON of `docs/THEMING.md`) and the RFC 9457 `Problem` error body.
- `src/schema.d.ts`: types generated by `pnpm --filter @front-dashboard/api generate` (committed; ignored by Prettier and
  ESLint). The first version in the patch was written by hand in the generator's format, so **run `generate` once and
  commit any difference**; afterwards `generate:check` (part of `pnpm test` in this package) keeps it in sync.
- `src/client.ts`: `createApiClient({ baseUrl, fetch? })` (openapi-fetch), `unwrap()` and `ApiError` with the problem details.
- `src/mock.ts` (entry `@front-dashboard/api/mock`): `createMockFetch(routes)`, `createSampleApiClient()`, `SAMPLE_BRAND`
  (a green brand, so it is obvious when the sample answers). Unknown routes answer a 404 problem.
- New dependencies: `openapi-fetch`, `openapi-typescript`; the lockfile changes.

**Not executed in the authoring sandbox** (no network): install, generate, lint, typecheck and tests.

### 2.1d-2 – brand from the sample API in `apps/store` (done)

- `src/env.ts`: `API_BASE_URL` (server side, optional URL) and `NEXT_PUBLIC_API_MOCKING` (`enabled` turns the sample API on;
  anything else is rejected at startup). `.env.example` documents both.
- `src/lib/api.ts`: `getApiClient()` returns the sample API client when mocking is on, a client for `API_BASE_URL`
  otherwise (answers are reused for 5 minutes through Next's fetch cache), or `null` when neither is set.
  The sample API is imported only when mocking is on.
- `src/lib/brand.ts`: `loadBrand(client)` calls `GET /brand`, checks the answer with `validateBrand` and returns the brand,
  or `null` (the default theme) when there is no API, the call fails, or the brand has unsafe values. It never throws and
  logs one warning. `getBrand()` is wired into the root layout in place of the former `null`.
- `packages/ui`: the server-safe entry `@front-dashboard/ui/theme-ssr` also exports `validateBrand` and `BrandDefinition`,
  so server code can validate without loading the component library.
- Tests: the sample brand passes the real validator; no API, API error, network failure and an unsafe brand all fall back
  to the default theme; env parsing of the two new settings.
- Dependency: `@front-dashboard/api` (workspace link); the lockfile changes.
- Dev server on the network: `ALLOWED_DEV_ORIGINS` (comma separated hosts) feeds Next's `allowedDevOrigins`; without it a phone or
  another computer opening the dev server gets a page that never becomes interactive (Next blocks `/_next/hmr` for other hosts).

Try it: with `NEXT_PUBLIC_API_MOCKING=enabled` in `apps/store/.env.local` the accents turn green (the sample brand, light and
dark): the page title and the active navigation item use the primary color; without it they keep the default blue. The PWA manifest colors stay on the default theme (known limit of 2.1g).

**Not executed in the authoring sandbox** (no network): install, lint, typecheck, tests, build and the visual check.

### 2.1e-1 – auth contract and sample accounts (done)

Owner decisions (2026-11-08): sign in with a mobile number and a one-time code, or with a verified mobile number and a
password; email sign-in comes later. A first sign-in is always by code (a mobile number with no account gets one); setting
a password is a later step in the profile and is not part of 2.1e. Mobile numbers are Iranian (`09...`) for now.

- `openapi.yaml`: `POST /auth/otp/request` (answers `retryAfterSeconds` and `codeLength`), `POST /auth/otp/verify`,
  `POST /auth/login`, `GET /auth/session` and `POST /auth/logout` (Bearer token). Request bodies carry `kind: "mobile"` and an
  `identifier`, so email can be added as another `kind` without a new endpoint. The password login gives the same answer for
  a wrong password and for an account without one, so it does not reveal which accounts exist.
- Sample API (`@front-dashboard/api/mock`, `createSampleRoutes`): every valid mobile number signs in with the code
  `123456`; the account `09120000000` also has the password `Sample#2026`; the token is `sample.<mobile>` and lasts 7 days.
- `expectOk()` in the client, for answers with no body (sign-out).
- `apps/store/src/lib/identity.ts`: `normalizeIranMobile` (Persian and Arabic digits; `+98`, `0098`, `98` and a missing 0)
  and `normalizeOtpCode`, with tests.
- `src/schema.d.ts` was written by hand in the generator's format: **run `pnpm --filter @front-dashboard/api generate` once and
  commit any difference**.

**Not executed in the authoring sandbox** (no network): install, generate, lint, typecheck and tests (only the logic of the
identity helpers was run with plain Node).

### 2.1e-2 – session, cookie and route guard (patch delivered, awaiting local verification)

- `src/features/auth/service.ts` (no Next imports, so it is unit-tested with the sample API): the `SessionService` interface
  (`requestCode`, `signInWithCode`, `signInWithPassword`, `getSession`, `signOut`), `createSessionService`, the `TokenStore`
  interface and `AuthError` with four codes the interface can explain: `invalid_mobile`, `invalid_code`,
  `invalid_credentials` (a 401 means a wrong code or a wrong password depending on the call) and `unavailable`
  (network or 5xx). The real backend replaces only this implementation.
- `token-store.ts`: the token lives in the **httpOnly** cookie `fd_session` (`SameSite=Lax`, `Secure` in production,
  expires when the server says), so browser scripts can never read it. It is server only (uses `next/headers`).
- `server.ts`: `getSessionService()`, `getSession()` (asked from the API once per request) and
  `requireSession(locale, next)`, the guard: call it on the server at the top of a protected page; without a sign-in it
  redirects to `/login?next=...`. The check is on the server in the page itself, not only in `proxy.ts`
  (an optimistic redirect in the proxy was left out on purpose to keep the next-intl proxy unchanged).
- `actions.ts` (server actions): `requestCodeAction`, `signInWithCodeAction`, `signInWithPasswordAction` and `signOutAction`.
  They normalize and re-check the mobile number and the code on the server, and answer `{ ok, data }` or
  `{ ok: false, error }` instead of throwing. `getSession()` says `unavailable` when the API fails (it does not pretend
  nobody is signed in), and `signOut` forgets the token even if the API cannot be reached.
- `next-path.ts`: `safeNextPath()` accepts only a path on this site for the `?next=` return address (no open redirect).
- `/dashboard`: a protected placeholder page with the user's name or mobile number and a sign-out button.
- `/dashboard` is `force-dynamic` (never prerendered), and a visitor with no session cookie is signed out without calling the API. Found by CI:
  the build ran without `.env.local`, so no API was configured and the prerender of `/en/dashboard` threw. `pnpm build:ci` and the
  pre-push hook now build the same way, so the difference between a developer machine and CI shows up before pushing.
- No new dependency; the lockfile does not change. The dashboard tab stays off until the login page exists (2.1e-3), so
  the guard's redirect target `/login` shows the not-found page until then.

Try the guard by hand (no login page yet): open `/fa/dashboard`; it should redirect to `/fa/login?next=%2Fdashboard`
(the not-found page for now). Then in DevTools, Application, Cookies, add a cookie `fd_session` with the value
`sample.09120000000` (path `/`) and open `/fa/dashboard` again: it shows the sample user. The sign-out button removes it.

**Not executed in the authoring sandbox** (no network): install, lint, typecheck, tests and the manual checks.

---

## خلاصهٔ فارسی

گام ۲.۱ به پنج زیرگام کوچک تقسیم شده است: **۲.۱a** همین سند (فقط مستندات)، **۲.۱b** اسکلت اپ Next.js با مسیریابی
`/en` و `/fa` و Providerها، **۲.۱c** چیدمان (هدر، منوی موبایل، فوتر، تعویض زبان و تم)، **۲.۱d** بستهٔ `packages/api`
(قرارداد OpenAPI، کلاینت تایپ‌شده، Mock)، **۲.۱e** auth stub پشت یک اینترفیس. زیرگام ۲.۱f (Playwright) اختیاری است.

یافتهٔ مهم بررسی: Providerهای تم و برند هنوز از API عمومی `@front-dashboard/ui` خروجی گرفته نمی‌شوند؛ این مورد
در ۲.۱b با یک تغییر افزایشی و کوچک در `index.ts` رفع می‌شود. پیش از شروع ۲.۱b باید چک‌لیست بازبینی بصری ۱.۶b و ۱.۶c
امضا شود (یا مالک معافیت بدهد) و پرسش‌های ۴، ۵، ۹، ۱۲، ۱۳، ۱۴ و ۱۵ در `OPEN_QUESTIONS.md` پاسخ داده شوند یا مقدار پیشنهادی
تأیید شود. هیچ کدی پیش از تأیید شما نوشته نمی‌شود.

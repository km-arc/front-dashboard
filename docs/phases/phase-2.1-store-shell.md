# Step 2.1 – `apps/store` shell / پوستهٔ فروشگاه (`apps/store`)

Status: **draft, awaiting owner approval** (nothing in this document is implemented)

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
| D6 | New workspace package `packages/api` (`@front-dashboard/api`): `openapi/openapi.yaml` (the contract, owned here until the backend publishes one), generated types via `openapi-typescript`, a typed client via `openapi-fetch`, and MSW handlers typed by the same contract. Generated output is committed and CI checks it is up to date. Reused by `apps/admin` in 3.1 | ADR-0005; avoids a second client later |
| D7 | Mocks are enabled by `NEXT_PUBLIC_API_MOCKING=enabled` (dev and tests only; never in production builds). Without it the client talks to `API_BASE_URL` | Frontend works without the backend |
| D8 | Auth stub behind an interface `SessionService { getSession, signIn, signOut }` in `apps/store/src/features/auth`. The stub talks to mock endpoints. Route protection is checked on the server in layouts or pages; `proxy.ts` only does an optimistic redirect | OQ 4 unknown; defence in depth |
| D9 | Folders: `src/app` (routing only), `src/features/<module>`, `src/components` (shell pieces), `src/lib`. Env values are read through one zod-validated `src/env.ts`; `.env.example` lists them | AGENTS.md, ARCHITECTURE.md |
| D10 | Tests: Vitest + Testing Library for logic and components, contract tests for handlers; Playwright e2e smoke is proposed as a later optional step 2.1f | NFR-7 |

## Sub-steps and automated evaluation / زیرگام‌ها و ارزیابی خودکار

All sub-steps must keep `pnpm lint && pnpm typecheck && pnpm test && pnpm build` green. Extra checks per step:

| Step | Content | Automated evaluation |
|------|---------|----------------------|
| 2.1a | This plan, OPEN_QUESTIONS proposals, ROADMAP split. **Docs only, no code** | `pnpm format:check`, markdown links reviewed by owner |
| 2.1b | `apps/store` scaffold: Next config (`transpilePackages`), Tailwind v4 + ui styles, `[locale]` routing, `proxy.ts`, providers, env, `.env.example`; additive theme exports in `packages/ui/src/index.ts`; empty home page; turbo tasks | tests: routing/locale resolution, en/fa message parity, `<html lang dir>` for both locales, no physical-direction classes (existing ESLint rule), env validation; `pnpm build` produces `/en` and `/fa` |
| 2.1c | Shell layout: skip link, header (logo slot, nav, locale switcher, theme toggle, cart link placeholder), mobile menu in a `Sheet`, footer, `loading`, `error`, `not-found`; 3–4 additive icons in `packages/ui` | component tests (nav opens/closes, switchers change locale and mode, focus returns to trigger); axe via `jest-axe`; ui stories for any new ui icon |
| 2.1d | `packages/api`: contract for `GET /brand`, `POST /auth/login`, `GET /auth/session`, `POST /auth/logout`; generated types; client factory; MSW handlers; brand wired into the root layout | contract tests (each handler's response validates against the contract), generated files up to date check, brand fallback test (endpoint down → default theme) |
| 2.1e | Auth stub: `SessionService`, login page using ui `Form` (react-hook-form + zod), logout, protected `/account` placeholder, server-side guard | tests: login success/failure/validation messages in en and fa, guard redirects when signed out, session survives reload (mock) |
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

(to be filled per sub-step)

---

## خلاصهٔ فارسی

گام ۲.۱ به پنج زیرگام کوچک تقسیم شده است: **۲.۱a** همین سند (فقط مستندات)، **۲.۱b** اسکلت اپ Next.js با مسیریابی
`/en` و `/fa` و Providerها، **۲.۱c** چیدمان (هدر، منوی موبایل، فوتر، تعویض زبان و تم)، **۲.۱d** بستهٔ `packages/api`
(قرارداد OpenAPI، کلاینت تایپ‌شده، Mock)، **۲.۱e** auth stub پشت یک اینترفیس. زیرگام ۲.۱f (Playwright) اختیاری است.

یافتهٔ مهم بررسی: Providerهای تم و برند هنوز از API عمومی `@front-dashboard/ui` خروجی گرفته نمی‌شوند؛ این مورد
در ۲.۱b با یک تغییر افزایشی و کوچک در `index.ts` رفع می‌شود. پیش از شروع ۲.۱b باید چک‌لیست بازبینی بصری ۱.۶b و ۱.۶c
امضا شود (یا مالک معافیت بدهد) و پرسش‌های ۴، ۵، ۹، ۱۲، ۱۳، ۱۴ و ۱۵ در `OPEN_QUESTIONS.md` پاسخ داده شوند یا مقدار پیشنهادی
تأیید شود. هیچ کدی پیش از تأیید شما نوشته نمی‌شود.

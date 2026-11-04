# Open questions for the owner

| # | Question | Needed by | Answer |
|---|----------|-----------|--------|
| 1 | Brand themes: initial list and token source | 1.1 | Brand comes from the backend; start with a light-blue default |
| 2 | Brand mechanism: build-time or runtime? | 1.1 | Runtime, loaded from the backend |
| 3 | Persian and English fonts | 1.1 | Agent's proposal accepted: Vazirmatn (fa) + Inter (en) |
| 4 | Auth mechanism of the .NET backend (JWT, cookies, OIDC)? | 2.1 | **Approved by owner (2026-11-04):** build against the `SessionService` interface with a mock-backed stub; pick JWT-in-httpOnly-cookie via a Next BFF or a backend-set cookie once the .NET side is known |
| 5 | Is an OpenAPI spec available or will it be produced alongside the backend? | 2.1 | **Approved by owner (2026-11-04):** the frontend authors `packages/api/openapi/openapi.yaml` for now; replace it when the backend publishes its spec |
| 6 | Roles list (admin, instructor, support, student, customer…) | 3.1 | |
| 7 | Notification channels (in-app, SMS, email, push, …) and real-time needs | 8 | |
| 8 | Video hosting / player for course activities | 5 | |
| 9 | Backend brand endpoint: URL, auth, caching, and does it follow the JSON in THEMING.md? | 2.1 | **Approved by owner (2026-11-04):** `GET /brand` (public, short cache), returning the JSON from THEMING.md; failure falls back to the default theme |
| 10 | Who guarantees brand contrast (backend validation or frontend warn-only)? | 2.1 | |
| 11 | Store currency: Toman or Rial for display? Stored in which unit by the backend? | 2.2 | |
| 12 | Default time zone for dates (proposal: Asia/Tehran)? | 2.1 | **Approved by owner (2026-11-04):** Asia/Tehran |
| 13 | Confirm next-intl for app-level messages and `[locale]` URL routing (e.g. /fa, /en)? | 2.1 | **Approved by owner (2026-11-04):** yes, next-intl with `/en` and `/fa` URL prefixes |
| 14 | Where do the OpenAPI contract and generated client live: a shared `packages/api` used by store and admin? | 2.1d | **Approved by owner (2026-11-04):** yes, `packages/api` |
| 15 | Which locale does `/` use when there is no cookie or Accept-Language signal: `en` (current `DEFAULT_LOCALE`) or `fa`? | 2.1b | **Owner (2026-11-04):** make it configurable. Implemented as `NEXT_PUBLIC_DEFAULT_LOCALE` (`en` or `fa`, falls back to the ui `DEFAULT_LOCALE`, i.e. `en`) |

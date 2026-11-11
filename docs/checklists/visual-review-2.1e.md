# Visual review: Step 2.1e (sign-in)

Needs `NEXT_PUBLIC_API_MOCKING=enabled` in `apps/store/.env.local` (sample API). Sample sign-in data:
every valid mobile number signs in with the code `123456`; the account `09120000000` also has the password `Sample#2026`.

2.1e-2: session and guard (no login page yet)
- [ ] `/fa/dashboard` and `/en/dashboard` without a cookie redirect to `/<locale>/login?next=%2Fdashboard` (the not-found page until 2.1e-3)
- [ ] After adding the cookie `fd_session` = `sample.09120000000` (DevTools, Application, Cookies, path `/`), `/fa/dashboard` shows the title and "Sample user"
- [ ] With the cookie `fd_session` = `sample.09123456789` the page shows the mobile number instead of a name
- [ ] With a wrong value (`fd_session` = `garbage`) the page redirects to the login address again
- [ ] The Sign out button returns to the home page of the same language and removes the cookie
- [ ] In the Console, `document.cookie` does not list `fd_session` once the server has set it (it is httpOnly)

2.1e-3: login page (`/fa/login`, `/en/login`, 360px and desktop, light and dark)
- [ ] The dashboard tab and the header icon are on; signed out they open `/login?next=%2Fdashboard`
- [ ] One-time code: a mobile number in Persian digits (`۰۹۱۲۳۴۵۶۷۸۹`) is accepted; `12345` shows the invalid-number message without leaving the page
- [ ] After "Send code" the number is shown left to right, the code field is focused, and "Send again in N s" counts down to an enabled "Send again"
- [ ] The code `123456` (also typed with Persian digits) signs in and goes to the dashboard; `000000` shows the wrong-code message
- [ ] "Change number" returns to the number step; switching to the Password tab keeps the typed number
- [ ] Password: `09120000000` with `Sample#2026` signs in; another number or password shows the wrong-credentials message
- [ ] A signed-in visitor opening `/fa/login` is sent to the dashboard (or to `next`)
- [ ] `/fa/login?next=https://evil.example` signs in and lands on the dashboard, not on the other site
- [ ] With the sample API off (no `NEXT_PUBLIC_API_MOCKING`), signing in shows the "not available" message
- [ ] The error message is announced (screen reader or a visible alert) and no console errors appear
- [ ] The number, code and password fields have 44px height and the 16px text does not zoom on iOS

Sign-off: Reviewer ____________  Date ____________
After sign-off set the step to `done` in docs/ROADMAP.md.

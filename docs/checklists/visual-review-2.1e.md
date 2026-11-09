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

2.1e-3: login page (added with that step)

Sign-off: Reviewer ____________  Date ____________
After sign-off set the step to `done` in docs/ROADMAP.md.

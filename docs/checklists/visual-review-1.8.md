# Visual review: mode × brand × direction / بازبینی بصری

Run `pnpm storybook` in `packages/ui`. For each combination below, open every story and tick the checks.
Use the viewport toolbar at 360px for the touch-target check.

Combinations / ترکیب‌ها: mode (light, dark, system) × brand (default, emerald, violet) × locale (en, fa) = 18.
Tip: review light + default + en first, then change one axis at a time.

## Checks per component / بررسی برای هر کامپوننت
- [ ] Text and borders are readable (contrast) in light and dark / متن و حاشیه‌ها خوانا هستند
- [ ] Keyboard Tab shows a visible focus ring in the brand color / حلقهٔ focus دیده می‌شود
- [ ] RTL (fa): layout mirrors correctly; label side, switch thumb, chevron and select popup / چیدمان آینه می‌شود
- [ ] Email and number inputs stay left-to-right in RTL / ایمیل و عدد چپ‌به‌راست می‌مانند
- [ ] Disabled states are clearly distinguishable / حالت غیرفعال مشخص است
- [ ] Interactive targets are at least 44px at 360px width / هدف لمسی حداقل ۴۴px
- [ ] Accessibility panel reports no violations / پنل Accessibility خطایی ندارد
- [ ] Brand change affects primary color, focus ring and radius only where expected / برند فقط جاهای مورد انتظار را تغییر می‌دهد

## Components / کامپوننت‌ها
Button · Badge · Card · Label · Input · Checkbox · RadioGroup · Switch · Select · Icons

## Sign-off / تأیید
Reviewer: ______  Date: ______  Result: ☐ approved ☐ needs fixes (list below)

Findings / یافته‌ها:

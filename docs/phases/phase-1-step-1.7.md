# Step 1.7 – Forms (react-hook-form + zod) / فرم‌ها

Depends on / وابسته به: 1.4b, 1.8b · Budget / بودجه: ≤ 12 files, ≤ 550 lines

## Goal / هدف
Accessible form building blocks that work with the existing controls (Input, Select, Checkbox, Switch, RadioGroup) in LTR and RTL.
اجزای فرم دسترس‌پذیر که با کنترل‌های موجود در LTR و RTL کار می‌کنند.

## Decisions / تصمیم‌ها
- Components live in `components/ui/form.tsx`: `Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormDescription`, `FormMessage`, `useFormField`.
- `react-hook-form` (^7) is a **peer** dependency (one shared context with the app); `zod` (^4) and `@hookform/resolvers` (^5.4.2) are **dev** dependencies used by tests and stories only. Apps choose their resolver; `standardSchemaResolver` keeps the package schema-agnostic.
- Validation messages are not translated here: the app sets the zod locale (`z.config(z.locales.fa())`) or writes messages in its schemas. `FormMessage` renders the error text as is.
- `FormControl` sets `id`, `aria-describedby` (description only when one is rendered, plus the message on error) and `aria-invalid`. Group controls (RadioGroup) use `aria-labelledby={formLabelId}` from `useFormField()`.

## Out of scope / خارج از محدوده
Composite fields (`FormTextField`...), mapping zod issues to `uiMessages`, `useFieldArray`, wizards.

## Automated checks / ارزیابی خودکار
`form.test.tsx` in LTR and RTL: label association, description, accessible errors after an empty submit, error cleared after a fix, submitted values, jest-axe (with errors shown).
Also the conventions guard and the "every primitive has a story" guard. `pnpm lint && pnpm typecheck && pnpm test` and `pnpm build-storybook`.

## Owner review / بازبینی مالک
`docs/checklists/visual-review-1.7-forms.md` (Storybook: Primitives/Form → Signup, WithErrors).

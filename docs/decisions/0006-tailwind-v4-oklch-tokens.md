# ADR-0006: Tailwind v4, OKLCH tokens, CSS-first theme
Status: accepted

Tailwind v4 with `@theme inline` maps semantic CSS variables to utilities; shadcn/ui supports this setup.
Colors are OKLCH for perceptual uniformity (predictable light/dark and brand derivation).
Token names follow shadcn's semantic set plus `success`, `warning`, `info`, `chart-1..5` and `sidebar-*` (admin).
WCAG AA contrast of every text pair is enforced by unit tests, so theme changes cannot silently regress accessibility.

# ADR-0004: Theming = mode × brand
Status: accepted

Light/dark is `class="dark"` on `<html>`. Customer brand is `data-brand="…"`. Components use semantic CSS variables only;
a brand overrides variables for both modes. Mechanism details (static presets vs runtime) are in Open Question 2.

## Update (Step 1.1)
Brand is **loaded at runtime from the backend** (owner decision). The default brand is light blue.
Brand input is untrusted: it is validated against a token/value whitelist before any CSS is generated
(`validateBrand`, `brandToCss`). See `docs/THEMING.md`.

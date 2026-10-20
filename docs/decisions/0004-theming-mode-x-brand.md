# ADR-0004: Theming = mode × brand
Status: accepted

Light/dark is `class="dark"` on `<html>`. Customer brand is `data-brand="…"`. Components use semantic CSS variables only;
a brand overrides variables for both modes. Mechanism details (static presets vs runtime) are in Open Question 2.

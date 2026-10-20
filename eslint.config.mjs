import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["**/node_modules/**", "**/.next/**", "**/dist/**", "**/coverage/**"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      // RTL rule: physical direction utilities are forbidden in source (see docs/CONVENTIONS.md).
      "no-restricted-syntax": [
        "error",
        {
          selector:
            "Literal[value=/(^|[\\s\"'`:])(ml|mr|pl|pr|left|right|text-left|text-right|border-l|border-r|rounded-l|rounded-r)-/]",
          message:
            "Use logical utilities (ms-*, me-*, ps-*, pe-*, start-*, end-*, text-start, text-end, border-s, border-e, rounded-s, rounded-e) so RTL works.",
        },
      ],
    },
  },
);

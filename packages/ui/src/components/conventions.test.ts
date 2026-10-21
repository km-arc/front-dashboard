import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const root = fileURLToPath(new URL(".", import.meta.url));

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(full);
    return /\.tsx?$/.test(entry.name) && !/\.test\.tsx?$/.test(entry.name) ? [full] : [];
  });
}

const PALETTE =
  "red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|slate|gray|zinc|neutral|stone|black|white";

const rules: Record<string, RegExp> = {
  "hard-coded color literal": /#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|hsla?|oklch|oklab|lab|lch)\(/,
  "Tailwind palette color (use semantic tokens)": new RegExp(
    `(?<![\\w-])(?:bg|text|border|ring|fill|stroke|outline|from|to|via|divide|shadow)-(?:${PALETTE})(?:-\\d{2,3})?(?![\\w-])`,
  ),
  "physical spacing/position utility (use logical)": /(?<![\w-])-?(?:ml|mr|pl|pr|left|right)-\S/,
  "physical text alignment (use text-start/end)": /(?<![\w-])text-(?:left|right)(?![\w-])/,
  "physical border/radius (use -s/-e)": /(?<![\w-])(?:rounded|border)-(?:l|r|tl|tr|bl|br)(?![a-zA-Z])/,
};

describe("component conventions (AGENTS.md rules 4 and 5)", () => {
  const files = sourceFiles(root);

  it("finds component sources to check", () => {
    expect(files.length).toBeGreaterThan(0);
  });

  for (const [name, pattern] of Object.entries(rules)) {
    it(`has no ${name}`, () => {
      const offenders = files.flatMap((file) =>
        readFileSync(file, "utf8")
          .split("\n")
          .flatMap((line, index) => (pattern.test(line) ? [`${file}:${index + 1}`] : [])),
      );
      expect(offenders).toEqual([]);
    });
  }
});

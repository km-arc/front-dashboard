import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { contrastRatio } from "./contrast";
import {
  COLOR_TOKENS,
  NON_TEXT_CONTRAST_PAIRS,
  TEXT_CONTRAST_PAIRS,
  type ColorToken,
} from "./tokens";

const css = readFileSync(fileURLToPath(new URL("../styles/tokens.css", import.meta.url)), "utf8");

function parseBlock(selector: RegExp): Record<string, string> {
  const match = selector.exec(css);
  if (!match?.[1]) throw new Error(`block not found: ${selector}`);
  const out: Record<string, string> = {};
  for (const m of match[1].matchAll(/--([a-z0-9-]+):\s*([^;]+);/g)) {
    const [, name, value] = m;
    if (name && value) out[name] = value.trim();
  }
  return out;
}

const modes = {
  light: parseBlock(/(?:^|\n):root\s*\{([^}]*)\}/),
  dark: parseBlock(/(?:^|\n):root\.dark\s*\{([^}]*)\}/),
};

describe.each(Object.entries(modes))("tokens.css (%s)", (_mode, tokens) => {
  it("defines every color token", () => {
    for (const name of COLOR_TOKENS) {
      expect(tokens[name], `missing --${name}`).toBeDefined();
    }
  });

  it("defines no color token outside COLOR_TOKENS", () => {
    const known = new Set<string>(COLOR_TOKENS);
    const extra = Object.keys(tokens).filter((k) => k.startsWith("chart-") || known.has(k));
    for (const name of extra) expect(known.has(name), `unlisted --${name}`).toBe(true);
  });

  it("meets WCAG AA (4.5:1) for text pairs", () => {
    for (const [surface, content] of TEXT_CONTRAST_PAIRS) {
      const ratio = contrastRatio(tokens[surface as ColorToken]!, tokens[content as ColorToken]!);
      expect(ratio, `${surface}/${content}`).not.toBeNull();
      expect(ratio!, `${surface}/${content}`).toBeGreaterThanOrEqual(4.5);
    }
  });

  it("meets 3:1 for non-text boundaries and focus ring", () => {
    for (const [surface, content] of NON_TEXT_CONTRAST_PAIRS) {
      const ratio = contrastRatio(tokens[surface as ColorToken]!, tokens[content as ColorToken]!);
      expect(ratio!, `${surface}/${content}`).toBeGreaterThanOrEqual(3);
    }
  });
});

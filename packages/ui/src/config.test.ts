import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const pkgRoot = fileURLToPath(new URL("..", import.meta.url));
const srcRoot = join(pkgRoot, "src");

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(full);
    return /\.(ts|tsx)$/.test(entry.name) && !/\.test\.tsx?$/.test(entry.name) ? [full] : [];
  });
}

describe("packages/ui configuration", () => {
  const config = JSON.parse(readFileSync(join(pkgRoot, "components.json"), "utf8"));

  it("targets Tailwind v4 and a non-RSC setup", () => {
    expect(config.rsc).toBe(false);
    expect(config.tailwind.config).toBe("");
    expect(config.tailwind.cssVariables).toBe(true);
  });

  it("resolves aliases under src/", () => {
    for (const value of Object.values<string>(config.aliases)) {
      expect(value.startsWith("@/")).toBe(true);
    }
  });

  it("does not import from next/* (must work in plain React)", () => {
    const offenders = sourceFiles(srcRoot).filter((file) =>
      /from\s+["']next(\/|["'])/.test(readFileSync(file, "utf8")),
    );
    expect(offenders).toEqual([]);
  });
});

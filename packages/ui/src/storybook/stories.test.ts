import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const uiDir = fileURLToPath(new URL("../components/ui/", import.meta.url));

<<<<<<< HEAD
const PENDING = new Set<string>();
=======
// TODO(1.8b): these primitives get their stories in step 1.8b; empty this list then.
const PENDING = new Set(["checkbox", "input", "radio-group", "select", "switch", "icons"]);
>>>>>>> step/1.8a-storybook

const components = readdirSync(uiDir)
  .filter((file) => /^[a-z-]+\.tsx$/.test(file))
  .map((file) => file.replace(/\.tsx$/, ""));

const hasStory = (name: string) => existsSync(join(uiDir, `${name}.stories.tsx`));

describe("every primitive has a story", () => {
  it("finds components to check", () => {
    expect(components.length).toBeGreaterThan(0);
  });

  for (const name of components.filter((component) => !PENDING.has(component))) {
    it(`${name} has ${name}.stories.tsx`, () => {
      expect(hasStory(name)).toBe(true);
    });
  }

  it("PENDING only lists components that still lack a story", () => {
    const stale = [...PENDING].filter((name) => hasStory(name));
    expect(stale).toEqual([]);
  });
});

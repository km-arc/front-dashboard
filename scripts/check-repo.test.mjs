import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { afterEach, describe, it } from "node:test";
import {
  checkRoadmap,
  findConflictMarkers,
  findDuplicateBarrelLines,
  findUndeclaredImports,
  packageNameOf,
} from "./check-repo.mjs";

const roots = [];

function makeRepo(files) {
  const root = mkdtempSync(join(tmpdir(), "check-repo-"));
  roots.push(root);
  for (const [path, content] of Object.entries(files)) {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), content);
  }
  return root;
}

afterEach(() => {
  while (roots.length > 0) rmSync(roots.pop(), { recursive: true, force: true });
});

const manifest = (extra = {}) =>
  JSON.stringify({ name: "@x/ui", dependencies: { react: "^19.0.0" }, ...extra });

describe("findConflictMarkers", () => {
  it("flags conflict markers with their line number", () => {
    const root = makeRepo({ "a.ts": "ok\n<<<<<<< HEAD\nx\n=======\ny\n>>>>>>> branch\n" });
    const problems = findConflictMarkers(root);
    assert.equal(problems.length, 2);
    assert.match(problems[0], /a\.ts:2/);
  });

  it("ignores Markdown heading underlines and node_modules", () => {
    const root = makeRepo({
      "doc.md": "Title\n=======\n",
      "node_modules/p/x.js": "<<<<<<< HEAD\n",
    });
    assert.deepEqual(findConflictMarkers(root), []);
  });
});

describe("packageNameOf", () => {
  it("maps specifiers to package names", () => {
    assert.equal(packageNameOf("react"), "react");
    assert.equal(packageNameOf("next/font/google"), "next");
    assert.equal(packageNameOf("@radix-ui/react-tabs/sub"), "@radix-ui/react-tabs");
  });

  it("ignores relative paths and built-in modules", () => {
    for (const specifier of ["./a", "../b", "node:fs", "fs/promises", "path"]) {
      assert.equal(packageNameOf(specifier), null);
    }
  });
});

describe("findUndeclaredImports", () => {
  it("flags an import that package.json does not declare", () => {
    const root = makeRepo({
      "packages/ui/package.json": manifest(),
      "packages/ui/src/a.tsx": 'import * as P from "@radix-ui/react-accordion";\n',
    });
    const problems = findUndeclaredImports(root);
    assert.equal(problems.length, 1);
    assert.match(problems[0], /@radix-ui\/react-accordion/);
  });

  it("accepts declared, relative, built-in and type imports", () => {
    const root = makeRepo({
      "packages/ui/package.json": manifest({ devDependencies: { vitest: "^2.0.0" } }),
      "packages/ui/src/a.tsx": [
        'import { useState } from "react";',
        'import type { ReactNode } from "react";',
        'import { it } from "vitest";',
        'import { readFileSync } from "node:fs";',
        'export * from "./b";',
        "",
      ].join("\n"),
    });
    assert.deepEqual(findUndeclaredImports(root), []);
  });
});

describe("findDuplicateBarrelLines", () => {
  it("flags a duplicated export line in an index.ts", () => {
    const root = makeRepo({
      "packages/ui/package.json": manifest(),
      "packages/ui/src/index.ts": 'export * from "./a";\nexport * from "./a";\n',
    });
    assert.equal(findDuplicateBarrelLines(root).length, 1);
  });
});

describe("checkRoadmap", () => {
  const head = "| Phase | Step | Title | Depends on | Status |\n| --- | --- | --- | --- | --- |\n";
  const row = (id, status = "done") => `| 1 | ${id} | Title | – | ${status} |\n`;

  it("accepts a well-formed table", () => {
    assert.deepEqual(
      checkRoadmap(`# R\n\n${head}${row("1.1")}${row("1.2", "done\\*")}\ntext\n`),
      [],
    );
  });

  it("flags a table interrupted by a blank line", () => {
    const problems = checkRoadmap(`${head}${row("1.1")}\n${row("1.2")}`);
    assert.equal(problems.length, 1);
    assert.match(problems[0], /interrupted/);
  });

  it("flags duplicate steps, short rows and unknown statuses", () => {
    const text = `${head}${row("1.1")}${row("1.1")}| 1 | 1.3 | Title |\n${row("1.4", "finished")}`;
    assert.equal(checkRoadmap(text).length, 3);
  });
});

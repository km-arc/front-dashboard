#!/usr/bin/env node
// Repo guard: cheap checks for mistakes this repo has already made once.
//  1. merge-conflict markers committed into files
//  2. imports that are not declared in the package.json of the package that uses them
//  3. a damaged table in docs/ROADMAP.md
//  4. duplicated lines in barrel files (index.ts)
// No dependencies. Runs in `pnpm verify`, in the pre-push hook and in CI.
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { builtinModules } from "node:module";
import { extname, join, relative, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const SKIP_DIRS = new Set([
  ".git",
  ".next",
  ".turbo",
  "coverage",
  "dist",
  "node_modules",
  "storybook-static",
]);
const SKIP_FILES = new Set(["pnpm-lock.yaml"]);
const BINARY_EXT = new Set([".png", ".jpg", ".jpeg", ".gif", ".webp", ".ico", ".woff", ".woff2"]);
const SOURCE_EXT = new Set([".ts", ".tsx", ".mts", ".cts", ".js", ".jsx", ".mjs", ".cjs"]);
const SOURCE_DIRS = ["src", ".storybook"];
const ROADMAP_STATUSES = new Set([
  "planned",
  "plan-approved",
  "in-progress",
  "done",
  "done\\*",
  "blocked",
]);
const DEP_FIELDS = ["dependencies", "devDependencies", "peerDependencies", "optionalDependencies"];

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return SKIP_DIRS.has(entry.name) ? [] : walk(full);
    return [full];
  });
}

const readText = (file) => readFileSync(file, "utf8");

/** A real conflict has `<<<<<<<` and `>>>>>>>` lines; `=======` alone is also a Markdown heading underline. */
export function findConflictMarkers(root) {
  const problems = [];
  for (const file of walk(root)) {
    const name = file.split("/").pop();
    if (SKIP_FILES.has(name) || BINARY_EXT.has(extname(file).toLowerCase())) continue;
    readText(file)
      .split("\n")
      .forEach((line, index) => {
        if (/^(<{7}|>{7})( |$)/.test(line)) {
          problems.push(`${relative(root, file)}:${index + 1}: merge-conflict marker`);
        }
      });
  }
  return problems;
}

const IMPORT_RE = /(?:\bfrom\s*|\bimport\s*\(?\s*|\brequire\s*\(\s*)(["'])([^"'\n]+)\1/g;

/** "@scope/pkg/sub" -> "@scope/pkg", "next/font/google" -> "next", relative and built-in -> null. */
export function packageNameOf(specifier) {
  if (/^(\.|\/|#|node:)/.test(specifier)) return null;
  const parts = specifier.split("/");
  const name = specifier.startsWith("@") ? parts.slice(0, 2).join("/") : parts[0];
  return builtinModules.includes(name) ? null : name;
}

function workspacePackages(root) {
  return ["apps", "packages"].flatMap((group) => {
    const base = join(root, group);
    if (!existsSync(base)) return [];
    return readdirSync(base, { withFileTypes: true })
      .map((entry) => join(base, entry.name))
      .filter((dir) => existsSync(join(dir, "package.json")));
  });
}

export function findUndeclaredImports(root) {
  const problems = [];
  for (const dir of workspacePackages(root)) {
    const manifest = JSON.parse(readText(join(dir, "package.json")));
    const declared = new Set([manifest.name]);
    for (const field of DEP_FIELDS) {
      for (const dependency of Object.keys(manifest[field] ?? {})) declared.add(dependency);
    }

    for (const sub of SOURCE_DIRS) {
      const sourceDir = join(dir, sub);
      if (!existsSync(sourceDir)) continue;
      for (const file of walk(sourceDir)) {
        if (!SOURCE_EXT.has(extname(file))) continue;
        for (const match of readText(file).matchAll(IMPORT_RE)) {
          const name = packageNameOf(match[2]);
          if (name && !declared.has(name)) {
            problems.push(
              `${relative(root, file)}: imports "${name}" but ${relative(root, dir)}/package.json does not declare it`,
            );
          }
        }
      }
    }
  }
  return [...new Set(problems)];
}

export function findDuplicateBarrelLines(root) {
  const problems = [];
  for (const dir of workspacePackages(root)) {
    const sourceDir = join(dir, "src");
    if (!existsSync(sourceDir)) continue;
    for (const file of walk(sourceDir).filter((f) => f.endsWith("/index.ts"))) {
      const seen = new Set();
      readText(file)
        .split("\n")
        .forEach((line, index) => {
          const text = line.trim();
          if (!text || text.startsWith("//")) return;
          if (seen.has(text)) {
            problems.push(`${relative(root, file)}:${index + 1}: duplicated line`);
          }
          seen.add(text);
        });
    }
  }
  return problems;
}

export function checkRoadmap(text) {
  const lines = text.split("\n");
  const rows = lines.flatMap((line, index) => (line.startsWith("|") ? [index] : []));
  if (rows.length === 0) return ["docs/ROADMAP.md: no table found"];

  const problems = [];
  const ids = new Set();
  for (let index = rows[0]; index <= rows[rows.length - 1]; index++) {
    const line = lines[index];
    const where = `docs/ROADMAP.md:${index + 1}`;
    if (!line.startsWith("|")) {
      problems.push(`${where}: the table is interrupted by a non-table line`);
      continue;
    }
    if (index === rows[0] || index === rows[0] + 1) continue; // header and separator
    const cells = line
      .trim()
      .slice(1, -1)
      .split("|")
      .map((cell) => cell.trim());
    if (cells.length !== 5) {
      problems.push(`${where}: expected 5 columns, found ${cells.length}`);
      continue;
    }
    const [, id, , , status] = cells;
    if (!ROADMAP_STATUSES.has(status)) problems.push(`${where}: unknown status "${status}"`);
    if (id !== "–" && ids.has(id)) problems.push(`${where}: duplicate step "${id}"`);
    ids.add(id);
  }
  return problems;
}

export function runChecks(root) {
  const roadmap = join(root, "docs", "ROADMAP.md");
  return [
    ...findConflictMarkers(root),
    ...findUndeclaredImports(root),
    ...findDuplicateBarrelLines(root),
    ...(existsSync(roadmap) ? checkRoadmap(readText(roadmap)) : []),
  ];
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
  const problems = runChecks(root);
  if (problems.length > 0) {
    console.error(`check-repo: ${problems.length} problem(s)\n`);
    for (const problem of problems) console.error(`  ✗ ${problem}`);
    process.exit(1);
  }
  console.log("check-repo: ok");
}

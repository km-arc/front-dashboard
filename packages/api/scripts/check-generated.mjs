// Fails when src/schema.d.ts is not what the generator produces from openapi/openapi.yaml,
// so a stale copy of the contract cannot reach main. Fix with: pnpm --filter @front-dashboard/api generate
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const dir = mkdtempSync(join(tmpdir(), "api-generated-"));
try {
  const output = join(dir, "schema.d.ts");
  execFileSync("pnpm", ["exec", "openapi-typescript", "openapi/openapi.yaml", "-o", output], {
    stdio: "pipe",
  });
  if (readFileSync(output, "utf8") === readFileSync("src/schema.d.ts", "utf8")) {
    console.log("generate:check: ok");
  } else {
    console.error(
      "src/schema.d.ts is out of date. Run: pnpm --filter @front-dashboard/api generate",
    );
    process.exitCode = 1;
  }
} finally {
  rmSync(dir, { recursive: true, force: true });
}

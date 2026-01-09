import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const packageRoot = process.cwd();
const repoRoot = path.resolve(packageRoot, "..", "..");
const src = path.join(repoRoot, "LICENSE");
const dest = path.join(packageRoot, "LICENSE");

const result = spawnSync("npm", ["run", "build"], {
  cwd: packageRoot,
  stdio: "inherit",
  shell: true,
});

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

fs.copyFileSync(src, dest);

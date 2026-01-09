import fs from "node:fs";
import path from "node:path";

const packageRoot = process.cwd();
const dest = path.join(packageRoot, "LICENSE");

if (fs.existsSync(dest)) {
  fs.rmSync(dest);
}

import { defineConfig } from "tsdown";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import fs from "node:fs";

const require = createRequire(import.meta.url);

function resolveKaspaPkgRoot() {
  try {
    return dirname(require.resolve("@kluster/kaspa-wasm-node/package.json"));
  } catch {
    // ejected standalone fallback: user downloads the asset into ./vendor/@kluster/kaspa-wasm-node
    const fallback = join(
      process.cwd(),
      "vendor",
      "@kluster",
      "kaspa-wasm-node",
      "package.json",
    );
    if (fs.existsSync(fallback)) return dirname(fallback);

    throw new Error(
      "Cannot locate @kluster/kaspa-wasm-node. " +
        "Either install/link it (monorepo) or put it in ./vendor/@kluster/kaspa-wasm-node",
    );
  }
}

const kaspaPkgRoot = resolveKaspaPkgRoot();

console.log({ kaspaPkgRoot });

export default defineConfig({
  entry: ["src/index.ts"],
  outDir: "dist",
  platform: "node",
  format: ["cjs"],
  sourcemap: true,
  clean: true,
  minify: false,

  // not bundle the wasm-bindgen package
  external: [/^@kluster\/kaspa-wasm-node(?:\/|$)/],

  // copy the whole package folder (JS glue + wasm + package.json) into dist/node_modules
  copy: [
    {
      from: kaspaPkgRoot,
      to: "dist/node_modules/@kluster/kaspa-wasm-node",
    },
  ],
});

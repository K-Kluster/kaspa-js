import path from "node:path";
import { fileURLToPath } from "node:url";
import TerserPlugin from "terser-webpack-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",

  // SWC is the default minifier in Next.js; disable it so we can control names.
  swcMinify: false,

  async headers() {
    return [
      {
        source: "/:all*(.wasm)",
        headers: [{ key: "Content-Type", value: "application/wasm" }],
      },
    ];
  },

  webpack: (config, { dev }) => {
    // Enable WASM the same as you already do
    config.experiments = {
      ...(config.experiments || {}),
      asyncWebAssembly: true,
      topLevelAwait: true,
    };

    // Let webpack emit .wasm files as assets
    config.module.rules.push({
      test: /\.wasm$/,
      type: "asset/resource",
    });

    // In production, use Terser with keep names
    if (!dev) {
      config.optimization.minimize = true;
      config.optimization.minimizer = [
        new TerserPlugin({
          terserOptions: {
            // keep both class and function names (like esbuild keepNames)
            keep_classnames: true,
            keep_fnames: true,
            compress: {
              keep_classnames: true,
              keep_fnames: true,
            },
            mangle: {
              keep_classnames: true,
              keep_fnames: true,
            },
          },
          // Optional: do not minify the wasm wrapper JS files at all
          // Adjust paths to where your shims actually live in this repo
          exclude: [/app[\\/](kaspa)/],
        }),
      ];
    }

    // (Optional) mark the wasm wrapper JS as "external" so it isn’t bundled/minified
    // If you prefer this route, ensure the runtime can resolve these paths.
    // config.externals = config.externals || [];
    // config.externals.push(({ request }, cb) => {
    //   if (request && (request.endsWith("kaspa.js") || request.endsWith("cipher.js"))) {
    //     return cb(null, "commonjs " + request);
    //   }
    //   cb();
    // });

    // Your eager parser rule is fine; scope it to the exact folder containing the wrappers
    config.module.rules.push({
      test: /\.js$/,
      include: [path.resolve(__dirname, "./app/kaspa")],
      sideEffects: false,
      parser: { javascript: { dynamicImportMode: "eager" } },
    });

    return config;
  },
};

export default nextConfig;

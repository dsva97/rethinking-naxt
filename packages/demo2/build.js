const cssModulesPlugin = require("esbuild-css-modules-plugin");
const { build } = require("esbuild");

process.env.CSS_TRANSFORMER_WASM = 0;

build({
  entryPoints: ["src/index.ts"],
  plugins: [
    cssModulesPlugin({
      inject: false,
    }),
  ],
  define: {
    "process.env.CSS_TRANSFORMER_WASM": 0,
  },
  external: ["esbuild"],
  platform: "node",
  bundle: true,
  // splitting: true,
  outdir: "dist",
  // format: "esm",
}).then(console.log);

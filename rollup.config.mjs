import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";

const dev = process.env.ROLLUP_WATCH;

// The card is served by the integration, so the bundle lands inside custom_components.
export default {
  input: "src/stock-pulse-card.ts",
  output: {
    file: "custom_components/stock_pulse/frontend/stock-pulse-card.js",
    format: "es",
    inlineDynamicImports: true,
    sourcemap: false,
  },
  plugins: [
    resolve({ browser: true }),
    typescript({ tsconfig: "./tsconfig.json", outDir: undefined, declaration: false }),
    !dev && terser({ format: { comments: false } }),
  ].filter(Boolean),
};

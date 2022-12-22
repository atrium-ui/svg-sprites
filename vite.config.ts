import path from "node:path";
import { defineConfig } from "vite";
import svgSprite from "./src/vite-svg-sprite";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: "es2020",
    outDir: "dist",
    lib: {
      entry: "vite-svg-sprite.ts",
      formats: ["cjs"],
    },
    emptyOutDir: true,
    rollupOptions: {
      input: [
        path.resolve(__dirname, "src/components/Icon.ts"),
        path.resolve(__dirname, "src/vite-svg-sprite.ts"),
      ],
      output: {
        assetFileNames: `[name].[ext]`,
        entryFileNames: () => "[name].[format].js",
      },
      external: ["fs", "lit", "lit-html", "fast-glob", "svg-sprite", "svg-sprite:sheet"],
    },
  },
  // plugins: [svgSprite({ dir: "assets/icons/*.svg" })],
});

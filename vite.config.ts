import { defineConfig } from "vite";
import svgSprite from "./vite-svg-sprite";

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
      external: ["node:crypto"],
    },
  },
  plugins: [svgSprite({ dir: "assets/icons/*.svg" })],
});

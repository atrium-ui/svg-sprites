import { defineConfig } from "vite";
import svgSprite from "./src/vite-svg-sprite";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: "es2020",
    outDir: "dist",
    lib: {
      entry: "src/vite-svg-sprite.ts",
      formats: ["cjs"],
      fileName: "vite-svg-sprite",
    },
    emptyOutDir: false,
    rollupOptions: {
      external: ["fs", "lit", "fast-glob", "svg-sprite", "svg-sprite:sheet"],
    },
  },
  plugins: [svgSprite({ dir: "assets/icons/*.svg" })],
});

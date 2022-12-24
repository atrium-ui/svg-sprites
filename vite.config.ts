import { defineConfig, UserConfig } from "vite";
import svgSprite from "./src/vite-svg-sprite";

const config1: UserConfig = {
  build: {
    target: "es2020",
    outDir: "dist",
    lib: {
      entry: "src/vite-svg-sprite.ts",
      formats: ["cjs", "es"],
      fileName: "vite-svg-sprite",
    },
    emptyOutDir: true,
    rollupOptions: {
      external: ["fs", "lit", "fast-glob", "svg-sprite", "svg:sheet"],
    },
  },
  plugins: [svgSprite({ dir: "assets/icons/*.svg" })],
};

const config2: UserConfig = {
  build: {
    target: "es2020",
    outDir: "component",
    lib: {
      entry: "src/Icon.ts",
      formats: ["cjs", "es"],
      fileName: "Icon",
    },
    emptyOutDir: true,
    rollupOptions: {
      external: ["fs", "lit", "fast-glob", "svg-sprite", "svg:sheet"],
    },
  },
  plugins: [svgSprite({ dir: "assets/icons/*.svg" })],
};

// https://vitejs.dev/config/
export default defineConfig(process.argv.indexOf("--icon") !== -1 ? config1 : config2);

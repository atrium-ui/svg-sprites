import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: "esnext",
    minify: false,
    outDir: "lib",
    lib: {
      entry: "vite-svg-sprite.ts",
      formats: ["cjs"],
    },
    emptyOutDir: true,
    rollupOptions: {
      external: ["node:crypto"],
    },
  },
});

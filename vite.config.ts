import { defineConfig, UserConfig } from "vite";
import dts from "vite-plugin-dts";

const external = ["fs", "fast-glob", "svg-sprite", "webpack"];

const common = {
  target: "ES2020",
  emptyOutDir: true,
  rollupOptions: {
    external,
  },
};

const commontDts = {
  rollupTypes: true,
  copyDtsFiles: false,
};

const webpackPlugin: UserConfig = {
  build: {
    ...common,
    outDir: "loader",
    lib: {
      entry: "src/webpack-loader.ts",
      formats: ["cjs", "es"],
      fileName: "index",
    },
  },
  plugins: [dts(commontDts)],
};

const vitePlugin: UserConfig = {
  build: {
    ...common,
    outDir: "plugin/vite",
    lib: {
      entry: "src/vite-plugin.ts",
      formats: ["cjs", "es"],
      fileName: "index",
    },
  },
  plugins: [dts(commontDts)],
};

const component: UserConfig = {
  build: {
    ...common,
    outDir: "component",
    lib: {
      entry: "src/component/Icon.ts",
      formats: ["cjs", "es"],
      fileName: "index",
    },
  },
  plugins: [dts(commontDts)],
};

let config = component;
if (process.argv.indexOf("--vite") !== -1) {
  config = vitePlugin;
}
if (process.argv.indexOf("--wp") !== -1) {
  config = webpackPlugin;
}

export default defineConfig(config);

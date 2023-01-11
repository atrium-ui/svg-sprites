import { defineConfig, UserConfig } from "vite";
import typescript from "@rollup/plugin-typescript";

const external = ["fs", "fast-glob", "svg-sprite", "webpack"];

function createBuildConfig(
  name: string,
  src: string,
  root: string,
  out: string
): UserConfig {
  return {
    build: {
      lib: {
        entry: src,
        formats: ["cjs", "es"],
        name: name,
        fileName: name,
      },
      emptyOutDir: true,
      rollupOptions: {
        external,
        output: {
          dir: out,
        },
        plugins: [
          typescript({
            rootDir: root,
            outDir: out,
          }),
        ],
      },
    },
  };
}

const webpackPlugin: UserConfig = createBuildConfig(
  "webpack-loader",
  "src/loader/webpack-loader.ts",
  "src/loader",
  "loader"
);

const vitePlugin = createBuildConfig(
  "vite-plugin",
  "src/plugin/vite-plugin.ts",
  "src/plugin",
  "plugin"
);

const component = createBuildConfig(
  "Icon",
  "src/component/Icon.ts",
  "src/component",
  "component"
);

let config = component;
if (process.argv.indexOf("--vite") !== -1) {
  config = vitePlugin;
}
if (process.argv.indexOf("--wp") !== -1) {
  config = webpackPlugin;
}

export default defineConfig(config);

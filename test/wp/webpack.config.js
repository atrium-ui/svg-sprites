import path from "path";

export default {
  mode: "development",
  entry: path.resolve("./test/wp/main.js"),
  module: {
    rules: [
      {
        use: [
          {
            loader: "@atrium-ui/vite-svg-sprite/loader",
            options: {
              dir: "./test/assets/icons/*.svg",
            },
          },
        ],
      },
    ],
  },
  output: {
    filename: "main.bundle.js",
    path: path.resolve("./test/wp/dist"),
  },
};

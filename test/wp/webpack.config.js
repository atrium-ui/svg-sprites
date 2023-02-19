import path from "path";

const dir = path.resolve("./test/assets/icons/**/*.svg");

export default {
  mode: "development",
  entry: path.resolve("./test/wp/main.js"),
  module: {
    rules: [
      {
        use: [
          {
            loader: "svg-sprites/loader",
            options: {
              dir,
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

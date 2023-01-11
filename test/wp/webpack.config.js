const path = require("path");

module.exports = {
  mode: "development",
  entry: path.resolve(__dirname, "./main.js"),
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
    path: path.resolve(__dirname, "dist"),
  },
};

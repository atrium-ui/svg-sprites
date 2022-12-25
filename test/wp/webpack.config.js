const path = require("path");
const svgSprite = require("@atrium-ui/vite-svg-sprite/plugin/webpack");

module.exports = {
  entry: "./main.js",
  output: {
    filename: "main.bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [new ],
};

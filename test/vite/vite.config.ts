import path from "path";
import svgSprite from "svg-sprites/vite";

const dir1 = path.resolve("./test/assets/icons/**/*.svg");
const dir2 = path.resolve("./test/assets/icons2/*.svg");

export default {
  base: "",
  plugins: [svgSprite({ dir: [dir1, dir2] })],
};

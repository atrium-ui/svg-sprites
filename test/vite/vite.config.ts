import path from "path";
import svgSprite from "../../plugin/vite";

const dir = path.resolve("./test/assets/icons/*.svg");

export default {
  base: "",
  plugins: [svgSprite({ dir })],
};

import path from "path";
import svgSprite from "@atrium-ui/vite-svg-sprite/vite";

const dir = path.resolve("./test/assets/icons/**/*.svg");

export default {
  base: "",
  plugins: [svgSprite({ dir })],
};

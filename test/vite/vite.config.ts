import svgSprite from "vite-svg-sprite/plugin/vite";

export default {
  base: "",
  plugins: [svgSprite({ dir: "test/assets/icons/*.svg" })],
};

import "@atrium-ui/vite-svg-sprite/svg-icon";
import { src, svg, blob } from "@atrium-ui/vite-svg-sprite/sheet";

window.addEventListener("DOMContentLoaded", () => {
  console.log(svg());
  console.log(blob());
  console.log(src());
});

import "@atrium-ui/vite-svg-sprite/component";
import { src } from "@atrium-ui/vite-svg-sprite/sprite-sheet";

window.addEventListener("DOMContentLoaded", () => {
  console.log(src);
  document.querySelector("svg-icon")?.constructor.src();
});

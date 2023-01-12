import "@atrium-ui/vite-svg-sprite/svg-icon";
import { src } from "@atrium-ui/vite-svg-sprite/sheet";

window.addEventListener("DOMContentLoaded", () => {
  console.log(src);
  document.querySelector("svg-icon")?.constructor.src();
});

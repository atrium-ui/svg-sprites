import "@atrium-ui/vite-svg-sprite/svg-icon";
import { src } from "../../sprite-sheet.js";

window.addEventListener("DOMContentLoaded", () => {
  console.log(src);
  document.querySelector("svg-icon")?.constructor.src();
});

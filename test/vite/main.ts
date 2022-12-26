import "@atrium-ui/vite-svg-sprite/component";
import src from "~svg-sprite";

window.addEventListener("DOMContentLoaded", () => {
  console.log(src);
  document.querySelector("svg-icon")?.constructor.src();
});

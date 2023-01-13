import "@atrium-ui/vite-svg-sprite/svg-icon";
import { src, blob } from "@atrium-ui/vite-svg-sprite/sheet";

window.addEventListener("DOMContentLoaded", () => {
  console.log(blob());

  const img = new Image();
  img.src = src() + "#placeholder";
});

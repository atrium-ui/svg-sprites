import { SvgIcon } from "./src/component/Icon";

declare module "~svg-sprite" {
  const sheetURL: string;
}

interface HTMLElementTagNameMap {
  "svg-icon": SvgIcon;
}

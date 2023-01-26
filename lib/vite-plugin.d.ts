import { PluginOption } from 'vite';
import { SVGSpriteOptions } from '../sheet.js';

declare function svgSprite(options?: SVGSpriteOptions): PluginOption;

export { svgSprite as default };

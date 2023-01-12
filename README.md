# vite-svg-sprite

Compile svgs in a directory to a spritesheet and make it available as inlined blob url.
Includes a CustomElement that makes it easy to use any icon.

Not just Icons. Use src for any SVG content.

```html
<svg-icon icon="speaker" />
```

## Install

`npm install @atrium-ui/vite-svg-sprite`

## Vite configuration

```typescript
import svgSprite from "@atrium-ui/vite-svg-sprite/plugin/vite";

export default {
  plugins: [
    svgSprite({ dir: "src/assets/icons/*.svg" }),
  ],
};
```


## Next / Webpack configuration

```javascript
/** @type {import('next').NextConfig} */
module.exports = {
  webpack(config, options) {
    config.module.rules.push({
      use: [
        {
          loader: "@atrium-ui/vite-svg-sprite/loader",
          options: {
            dir: "./assets/icons/*.svg",
          },
        },
      ],
    });

    return config;
  },
};
```

## Component Usage

Place your SVG files in a directory of choice, by default `/assets/icons/*.svg`.


```typescript
// import component
import "@atrium-ui/vite-svg-sprite/component";

// ...
```

```html
// use in html
<body>
  <svg-icon icon="speaker" />
</body>
```
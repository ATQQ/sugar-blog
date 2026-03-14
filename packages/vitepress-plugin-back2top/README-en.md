# vitepress-plugin-back2top

English | [简体中文](https://github.com/ATQQ/sugar-blog/blob/master/packages/vitepress-plugin-back2top/README.md)

VitePress Back to Top Plugin, adds a back to top button to the page.

![Example](https://github.com/ATQQ/sugar-blog/blob/master/packages/vitepress-plugin-back2top/image.png?raw=true)

## Install

```bash
pnpm add vitepress-plugin-back2top
```

## Usage

Import the plugin in `.vitepress/config.ts`:

```ts
import { defineConfig } from 'vitepress'
import { back2topPlugin } from 'vitepress-plugin-back2top'

export default defineConfig({
  vite: {
    plugins: [
      back2topPlugin({
        // ...options
      })
    ]
  }
})
```

## Frontmatter Config

You can also dynamically override or disable back to top config in a single article's `frontmatter`:

```yaml
---
# disable back to top
backToTop: false
---

---
# override back to top config
backToTop:
  top: 100
  icon: <svg>...</svg>
---
```

## Options

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| top | Distance from top to show the button | `number` | `450` |
| icon | Custom SVG icon code | `string` | - |

## Type Definitions

```ts
export interface BackToTopPluginOptions {
  /**
   * Distance from top to show the button
   * @default 450
   */
  top?: number

  /**
   * Custom SVG icon code
   * @recommend https://iconbuddy.app/search?q=fire
   */
  icon?: string
}
```

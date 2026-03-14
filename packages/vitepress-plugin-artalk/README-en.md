# vitepress-plugin-artalk

English | [简体中文](https://github.com/ATQQ/sugar-blog/blob/master/packages/vitepress-plugin-artalk/README.md)

VitePress Comment Plugin, integrates the [Artalk](https://artalk.js.org/) comment system, and includes a floating comment jump button (with mobile adaptation).

![Example](https://github.com/ATQQ/sugar-blog/blob/master/packages/vitepress-plugin-artalk/image.png?raw=true)

## Install

```bash
pnpm add vitepress-plugin-artalk artalk
```

## Usage

Import the plugin in `.vitepress/config.ts`:

```ts
import { defineConfig } from 'vitepress'
import { artalkPlugin } from 'vitepress-plugin-artalk'

export default defineConfig({
  vite: {
    plugins: [
      artalkPlugin({
        site: 'site-name',
        server: 'https://your-artalk-server.com',
        // ...other artalk options
      })
    ]
  }
})
```

## Frontmatter Config

You can also dynamically override or disable comment config in a single article's `frontmatter`:

```yaml
---
# disable comments
comment: false
---

---
# override comment config
comment:
  label: Discuss
  mobileMinify: false
---
```

## Options

Inherits configuration from Artalk, while containing the following plugin-specific configurations:

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| site | Site name | `string` | **Required** |
| server | Artalk server address | `string` | **Required** |
| showCommentBtn | Whether to show the floating comment jump button in the bottom right corner | `boolean` | `true` |
| label | Text prompt next to the floating button | `string` | `'评论'` |
| mobileMinify | Whether to hide the text prompt and only show the icon on mobile | `boolean` | `true` |
| icon | Custom SVG icon code | `string` | - |

## Type Definitions

```ts
export interface ArtalkPluginOptions {
  site: string
  server: string
  mobileMinify?: boolean
  label?: string
  icon?: string
  showCommentBtn?: boolean
  [key: string]: any
}
```

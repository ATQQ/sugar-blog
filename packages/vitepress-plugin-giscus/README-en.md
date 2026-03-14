# vitepress-plugin-giscus

English | [简体中文](https://github.com/ATQQ/sugar-blog/blob/master/packages/vitepress-plugin-giscus/README.md)

VitePress Comment Plugin, integrates the [Giscus](https://giscus.app/en) comment system, and includes a floating comment jump button (with mobile adaptation).

![示例](https://github.com/ATQQ/sugar-blog/blob/master/packages/vitepress-plugin-giscus/image.png?raw=true)

## Install

```bash
pnpm add vitepress-plugin-giscus @giscus/vue
```

## Usage

Import the plugin in `.vitepress/config.ts`:

```ts
import { defineConfig } from 'vitepress'
import { giscusPlugin } from 'vitepress-plugin-giscus'

export default defineConfig({
  vite: {
    plugins: [
      giscusPlugin({
        repo: 'your-github-username/your-repo-name',
        repoId: 'your-repo-id',
        category: 'Announcements',
        categoryId: 'your-category-id',
        mapping: 'pathname',
        // ...other giscus options
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

Inherits configuration from Giscus, while containing the following plugin-specific configurations:

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| repo | GitHub repository name (format: `user/repo`) | `string` | **Required** |
| repoId | Repository ID | `string` | **Required** |
| category | Discussion category name | `string` | - |
| categoryId | Category ID | `string` | - |
| mapping | Page mapping method | `string` | `'pathname'` |
| inputPosition | Input box position | `'top' \| 'bottom'` | `'top'` |
| lang | Language | `string` | `'zh-CN'` |
| loading | Loading method | `'lazy' \| 'eager'` | `'eager'` |
| showCommentBtn | Whether to show the floating comment jump button in the bottom right corner | `boolean` | `true` |
| label | Text prompt next to the floating button | `string` | `'评论'` |
| mobileMinify | Whether to hide the text prompt and only show the icon on mobile | `boolean` | `true` |
| icon | Custom SVG icon code | `string` | - |

## Type Definitions

```ts
export interface GiscusPluginOptions {
  repo: string
  repoId: string
  category?: string
  categoryId?: string
  mapping?: string
  inputPosition?: 'top' | 'bottom'
  lang?: string
  loading?: 'lazy' | 'eager'
  mobileMinify?: boolean
  label?: string
  icon?: string
  showCommentBtn?: boolean
  [key: string]: any
}
```

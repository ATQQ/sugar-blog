# vitepress-plugin-giscus

[English](https://github.com/ATQQ/sugar-blog/blob/master/packages/vitepress-plugin-giscus/README-en.md) | 简体中文

VitePress 评论组件插件，集成了 [Giscus](https://giscus.app/zh-CN) 评论系统，并包含了一个悬浮的评论跳转按钮（带移动端适配）。

![示例](https://github.com/ATQQ/sugar-blog/blob/master/packages/vitepress-plugin-giscus/image.png?raw=true)
## 安装

```bash
pnpm add vitepress-plugin-giscus @giscus/vue
```

## 使用

在 `.vitepress/config.ts` 中引入插件：

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
        // ...其他 giscus 配置
      })
    ]
  }
})
```

## Frontmatter 配置

你也可以在单篇文章的 `frontmatter` 中动态覆盖或关闭评论配置：

```yaml
---
# 关闭评论
comment: false
---

---
# 覆盖评论配置
comment:
  label: 交流
  mobileMinify: false
---
```

## 选项

继承自 Giscus 的配置，同时包含以下插件独有配置：

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| repo | GitHub 仓库名 (格式: `user/repo`) | `string` | **必填** |
| repoId | 仓库 ID | `string` | **必填** |
| category | 讨论分类名 | `string` | - |
| categoryId | 分类 ID | `string` | - |
| mapping | 页面映射方式 | `string` | `'pathname'` |
| inputPosition | 输入框位置 | `'top' \| 'bottom'` | `'top'` |
| lang | 语言 | `string` | `'zh-CN'` |
| loading | 加载方式 | `'lazy' \| 'eager'` | `'eager'` |
| showCommentBtn | 是否显示右下角悬浮评论跳转按钮 | `boolean` | `true` |
| label | 悬浮按钮旁边的文字提示 | `string` | `'评论'` |
| mobileMinify | 移动端下是否隐藏文字提示仅显示图标 | `boolean` | `true` |
| icon | 自定义 SVG 图标代码 | `string` | - |

## 类型定义

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

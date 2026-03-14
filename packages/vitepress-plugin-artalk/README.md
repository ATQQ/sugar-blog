# vitepress-plugin-artalk

[English](https://github.com/ATQQ/sugar-blog/blob/master/packages/vitepress-plugin-artalk/README-en.md) | 简体中文

VitePress 评论组件插件，集成了 [Artalk](https://artalk.js.org/) 评论系统，并包含了一个悬浮的评论跳转按钮（带移动端适配）。

![示例](https://github.com/ATQQ/sugar-blog/blob/master/packages/vitepress-plugin-artalk/image.png?raw=true)

## 安装

```bash
pnpm add vitepress-plugin-artalk artalk
```

## 使用

在 `.vitepress/config.ts` 中引入插件：

```ts
import { defineConfig } from 'vitepress'
import { artalkPlugin } from 'vitepress-plugin-artalk'

export default defineConfig({
  vite: {
    plugins: [
      artalkPlugin({
        site: 'site-name',
        server: 'https://your-artalk-server.com',
        // ...其他配置
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
  label: 热评
  mobileMinify: false
---
```

## 选项

继承自 Artalk 的配置，同时包含以下插件独有配置：

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| site | 站点名称 | `string` | **必填** |
| server | Artalk 服务器地址 | `string` | **必填** |
| showCommentBtn | 是否显示右下角悬浮评论跳转按钮 | `boolean` | `true` |
| label | 悬浮按钮旁边的文字提示 | `string` | `'评论'` |
| mobileMinify | 移动端下是否隐藏文字提示仅显示图标 | `boolean` | `true` |
| icon | 自定义 SVG 图标代码 | `string` | - |

## 类型定义

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

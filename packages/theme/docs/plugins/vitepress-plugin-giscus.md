---
description: 开发了一个适用于 VitePress 的 Giscus 评论插件 vitepress-plugin-giscus，支持评论区和悬浮评论按钮
---

# VitePress 集成 Giscus 评论插件

## 前言

笔者维护的 [VitePress 博客主题](https://theme.sugarat.top/) 已经集成了非常多的功能，为便于在主题之外复用，因此有计划将其一部分功能分离出来，形成独立的插件。

分离的 [Giscus 评论插件](https://www.npmjs.com/package/vitepress-plugin-giscus)，效果如下：

![](https://github.com/ATQQ/sugar-blog/blob/master/packages/vitepress-plugin-giscus/image.png?raw=true)

不仅集成了 Giscus 评论系统，还包含了一个悬浮的评论跳转按钮（带移动端适配）。

接下来先简单介绍一下用法，再快速讲解核心原理。

插件开发基于之前创建的一个通用模板，[vitepress-plugin-slot-inject-template](https://github.com/ATQQ/sugar-blog/tree/master/template/vitepress-plugin-slot-inject-template)，在模板的基础上，**插件95%的代码由 Gemini 3.0 生成。**

## 关于 Giscus

[Giscus](https://giscus.app/zh-CN) 是一个基于 GitHub Discussions 的评论系统。它开源、免费、无广告、无跟踪，并且支持多种语言。

**配置参数获取方式：**

1. 访问 [Giscus 官网](https://giscus.app/zh-CN)。
2. 按照页面提示配置你的仓库信息（确保仓库是公开的，并且安装了 Giscus App，且开启了 Discussions 功能）。
3. 在页面底部的“启用 giscus”部分，你会看到生成的一段 `<script>` 代码。
4. 将代码中的 `data-repo`、`data-repo-id`、`data-category`、`data-category-id` 等属性值对应填入插件配置即可。

## 如何使用

*只需要 2 步：*

1. 安装插件

```bash
pnpm add vitepress-plugin-giscus @giscus/vue
```

2. 配置插件

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

## 插件模板介绍

在开发插件的过程中，笔者把此类基于 slot 位置注入的插件分离了一个模板 [vitepress-plugin-slot-inject-template](https://github.com/ATQQ/sugar-blog/tree/master/template/vitepress-plugin-slot-inject-template)

有相关诉求的朋友，可以基于此模板，配合 AI 快速的开发各种基于插槽就可以实现的组件能力。

## 最后

插件完整源码 [vitepress-plugin-giscus](https://github.com/ATQQ/sugar-blog/tree/master/packages/vitepress-plugin-giscus)

*欢迎评论区交流&指导。*

---
description: 开发了一个适用于 VitePress 的 Artalk 评论插件 vitepress-plugin-artalk，支持评论区和悬浮评论按钮
---

# VitePress 集成 Artalk 评论插件

## 前言

笔者维护的 [VitePress 博客主题](https://theme.sugarat.top/) 已经集成了非常多的功能，为便于在主题之外复用，因此有计划将其一部分功能分离出来，形成独立的插件。

分离的 [Artalk 评论插件](https://www.npmjs.com/package/vitepress-plugin-artalk)，效果如下：

![](https://github.com/ATQQ/sugar-blog/blob/master/packages/vitepress-plugin-artalk/image.png?raw=true)

不仅集成了 Artalk 评论系统，还包含了一个悬浮的评论跳转按钮（带移动端适配）。

接下简单介绍一下插件的使用方法。

## 关于 Artalk

[Artalk](https://artalk.js.org/) 是一款简洁的自托管评论系统，后端采用 Golang 开发，前端使用 TypeScript (Vanilla JS) 编写。它轻量、安全、功能丰富，支持 Markdown 语法、表情包、多站点、邮件通知等功能。

**配置参数获取方式：**

1. 参考 [Artalk 官方文档](https://artalk.js.org/guide/deploy.html) 部署 Artalk 后端服务。
2. 在 Artalk 后台管理界面创建一个新的站点（Site）。
3. 获取站点的 `Site Name`（站点名称）和部署的 `Server URL`（服务器地址）。
4. 将这些信息填入插件配置的 `site` 和 `server` 字段中。
5. 同时在可信域名里将你的站点地址添加到 Artalk 后台管理界面的“可信域名”列表中，避免跨域问题。

## 如何使用

*只需要 2 步：*

1. 安装插件

```bash
pnpm add vitepress-plugin-artalk artalk
```

2. 配置插件

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

## 插件模板介绍

在开发插件的过程中，笔者把此类基于 slot 位置注入的插件分离了一个模板 [vitepress-plugin-slot-inject-template](https://github.com/ATQQ/sugar-blog/tree/master/template/vitepress-plugin-slot-inject-template)

有相关诉求的朋友，可以基于此模板，配合 AI 快速的开发各种基于插槽就可以实现的组件能力。

## 最后

插件完整源码 [vitepress-plugin-artalk](https://github.com/ATQQ/sugar-blog/tree/master/packages/vitepress-plugin-artalk)

*欢迎评论区交流&指导。*

---
description: 开发了一个适用于 VitePress 的 Back2Top 插件 vitepress-plugin-back2top，支持自定义图标和出现位置
---

# VitePress 集成 Back2Top 插件

## 前言

笔者维护的 [VitePress 博客主题](https://theme.sugarat.top/) 已经集成了非常多的功能，为便于在主题之外复用，因此有计划将其一部分功能分离出来，形成独立的插件。

分离的 [Back2Top 插件](https://www.npmjs.com/package/vitepress-plugin-back2top)，效果如下：

<!-- ![](https://github.com/ATQQ/sugar-blog/blob/master/packages/vitepress-plugin-back2top/image.png?raw=true) -->

为页面添加一个回到顶部的按钮（带移动端适配）。

接下简单介绍一下插件的使用方法。

## 如何使用

*只需要 2 步：*

1. 安装插件

```bash
pnpm add vitepress-plugin-back2top
```

2. 配置插件

在 `.vitepress/config.ts` 中引入插件：

```ts
import { defineConfig } from 'vitepress'
import { back2topPlugin } from 'vitepress-plugin-back2top'

export default defineConfig({
  vite: {
    plugins: [
      back2topPlugin({
        // ...配置项
      })
    ]
  }
})
```

## Frontmatter 配置

你也可以在单篇文章的 `frontmatter` 中动态覆盖或关闭回到顶部配置：

```yaml
---
# 关闭回到顶部
backToTop: false
---

---
# 覆盖回到顶部配置
backToTop:
  top: 100
  icon: <svg>...</svg>
---
```

## 选项

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| top | 距离顶部多少距离出现 | `number` | `450` |
| icon | 自定义 SVG 图标代码 | `string` | - |

## 插件模板介绍

在开发插件的过程中，笔者把此类基于 slot 位置注入的插件分离了一个模板 [vitepress-plugin-slot-inject-template](https://github.com/ATQQ/sugar-blog/tree/master/template/vitepress-plugin-slot-inject-template)

有相关诉求的朋友，可以基于此模板，配合 AI 快速的开发各种基于插槽就可以实现的组件能力。

## 最后

插件完整源码 [vitepress-plugin-back2top](https://github.com/ATQQ/sugar-blog/tree/master/packages/vitepress-plugin-back2top)

*欢迎评论区交流&指导。*

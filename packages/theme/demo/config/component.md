---
description: 详细介绍主题提供的组件能力
title: 🔧 主题配置 - 组件能力
recommend: 5
top: 5
tag:
 - 配置
---

# 组件配置

## tabs
* Type: `boolean`

支持局部的`tabs`面板

效果如下

:::=tabs
::tab1
一些内容

一些内容

一些内容

::tab2
一些内容 。。。
:::

:::warning 一点说明

基于 [vitepress-plugin-tabs](https://www.npmjs.com/package/vitepress-plugin-tabs) 重新打包实现

由于原包是esm产物，部分项目 无法直接使用，固主题进行内置进行了重新打包
:::

开启方式如下
:::code-group
```sh [① 安装依赖]
pnpm add vitepress-plugin-tabs
```

```ts [② 引入组件]
// .vitepress/theme/index.ts
import BlogTheme from '@sugarat/theme'
import { enhanceAppWithTabs } from 'vitepress-plugin-tabs/client'

export default {
  ...BlogTheme,
  enhanceApp(ctx:any) {
    enhanceAppWithTabs(ctx.app)
  }
}
```

```ts [③ 开启支持]
// .vitepress/config.ts
const blogTheme = getThemeConfig({
  tabs: true
})
```

```ts [④ 预构建排除依赖]
// .vitepress/config.ts
const blogTheme = getThemeConfig({
  tabs: true
})

export default defineConfig({
  extends: blogTheme,
  vite: {
    optimizeDeps: {
      exclude: ['vitepress-plugin-tabs']
    }
  }
})
```
:::


简答的使用方式如下

```md
:::=tabs
::tab1
一些内容

一些内容

一些内容

::tab2
一些内容 。。。
:::
```

共享状态的使用方式如下

```md
:::=tabs=ab
::a
a content

::b
b content
:::

:::=tabs=ab
::a
a content 2

::b
b content 2
:::
```


:::=tabs=ab
::a
a content

::b
b content
:::

:::=tabs=ab
::a
a content 2

::b
b content 2
:::
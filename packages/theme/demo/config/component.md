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

简单的使用方式如下

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

## UserWorksPage
* Type: `UserWorks`

用于作品列表展示

效果如下，详见 [个人作品展示](./../work.md)

![](https://img.cdn.sugarat.top/mdImg/MTY4NzA4ODczMzkwNg==687088733906)

新建一个`works.md`文件，放入以下内容
  
```md
---
layout: page
title: 个人作品展示
sidebar: false
outline: [2,3]
sticky: 1
---
<UserWorksPage />
```

内容配置方式如下

::: code-group

```ts [default]
const blogTheme = getThemeConfig({
  works: {
    title: '个人项目/线上作品',
    description: '记录开发的点点滴滴',
    topTitle: '举些🌰',
    list: [
      {
        title: '博客主题 @sugarat/theme',
        description: '基于 vitepress 实现的博客主题',
        time: {
          start: '2023/01/29'
        },
        github: {
          owner: 'ATQQ',
          repo: 'sugar-blog',
          branch: 'master',
          path: 'packages/theme'
        },
        status: {
          text: '自定义badge'
        },
        url: 'https://theme.sugarat.top',
        cover:
          'https://img.cdn.sugarat.top/mdImg/MTY3MzE3MDUxOTMwMw==673170519303',
        tags: ['Vitepress', 'Vue'],
        links: [
          {
            title: '一个简约风的VitePress博客主题',
            url: 'https://juejin.cn/post/7196517835380293693'
          }
        ]
      }
    ]
  }
})
```

```ts [type]
interface UserWorks {
  title: string
  description?: string
  topTitle?: string
  list: UserWork[]
}
interface UserWork {
  title: string
  description: string
  time:
    | string
    | {
        start: string
        end?: string
        lastupdate?: string
      }
  status?: {
    text: string
    type?: 'tip' | 'warning' | 'danger'
  }
  url?: string
  github?:
    | string
    | {
        owner: string
        repo: string
        branch?: string
        path?: string
      }
  cover?:
    | string
    | string[]
    | {
        urls: string[]
        layout?: 'swiper' | 'list'
      }
  links?: {
    title: string
    url: string
  }[]
  tags?: string[]
  top?: number
}
```

:::

# vitepress-plugin-rss

[English](./README.md) | 简体中文

## 使用
通过 `pnpm/npm/yarn` 安装插件
```sh
pnpm add vitepress-plugin-rss
```

在 `.vitepress/config.ts` 配置文件中添加配置使用

下面是最基础的使用配置
```ts
import { RSSOptions, RssPlugin } from 'vitepress-plugin-rss'

const baseUrl = 'https://sugarat.top'
const RSS: RSSOptions = {
  title: '粥里有勺糖',
  baseUrl,
  copyright: 'Copyright (c) 2018-present, 粥里有勺糖',
}

export default defineConfig({
  vite: {
    // ↓↓↓↓↓
    plugins: [RssPlugin(RSS)]
    // ↑↑↑↑↑
  }
})
```

然后运行 build 命令，你可以看到在`rendering pages...`后打印了生成 `feed.rss` 日志...

```sh
pnpm run build
```

![](https://img.cdn.sugarat.top/mdImg/MTY5MjQ1NTAzMzcwMg==692455033702)

同时会在导航栏的 socialLinks 中添加 rss 图标链接

![](https://img.cdn.sugarat.top/mdImg/MTY5MjQ1NTQ4MDYxMg==692455480612)

## frontmatter

RSS 插件会读取文章 frontmatter 中的以下字段来生成对应的 RSS 项信息：

### title
文章标题。如果未提供，会从正文首个标题自动提取。
```md
---
title: 我的第一篇文章
---
```

### date
发布日期。如果未指定，使用文件最后修改时间。
```md
---
date: 2024-01-15
---
```

### description
文章摘要。若未提供，将依次尝试：调用 `renderExpect` 生成；如未配置/无结果，使用 [gray-matter](https://www.npmjs.com/package/gray-matter#optionsexcerpt) 提取摘要；仍为空则截取正文前 100 字。
```md
---
description: 这是一篇关于 RSS 的介绍文章
---
```

### author
文章作者。支持单个名称（`string` 类型）或作者对象数组（每个作者对象可选 `name`、`email`、`link`、`avatar` 字段）；未填写时沿用全局 `author`。

若提供了全局 `authors` 列表且 `frontmatter.author` 为字符串，会按名称匹配该列表，并自动补全作者的其他信息。当 `frontmatter.author` 为数组时，如果某个作者对象只提供了 `name` 字段，也会按名称匹配全局 `authors` 列表，并自动补全其他信息。
```md
---
author: 张三
---
```

```md
---
author:
  - name: 小王
    email: xiaowang@example.com
    link: https://example.com/xiaowang
  - name: 小明   # 如果只提供 name，会尝试从全局 authors 配置补全其他信息
---
```

### category
文章分类列表，支持多个分类。每个分类对象可选 `name`、`domain`、`scheme`、`term` 字段。
```md
---
category:
  - name: 技术
    domain: https://example.com
  - name: 前端开发
---
```

### cover
文章封面。可以手动指定，或自动从文中首张图片提取。
```md
---
cover: /images/cover.png
---
```

### layout
如果值为 `home`，文章会被过滤。（可通过 `ignoreHome` 选项控制）
```md
---
layout: home
---
```

### publish
包含 `publish: false` 的文章将不会出现在最终的 rss 文件中，可以用来忽略目标文章。（可通过 `ignorePublish` 选项控制）
```md
---
publish: false
---
```

## 高级用法
### 自定义静态资源基础地址
>https://vitepress.dev/zh/guide/asset-handling#referencing-static-assets
>根据 VitePress 文档可知，所有引用的资源，包括那些使用绝对路径的，都会在生产构建过程中被复制到输出目录，并使用哈希文件名


如果你的文章中包含了相对路径图片资源，那么在生成 rss 文件时，图片资源的路径将将会自动修正为 `${assetsBaseUrl}${buildAssetsPath}`。

`assetsBaseUrl` 配置项默认值为 `baseUrl`，你可以根据实际情况进行配置。

自动修正后的值事例: `https://theme.sugarat.top/assets/image.Dqt2QH0u.png`

### 配置示例
```ts
const RSS: RSSOptions = {
  // necessary（必选参数）
  title: '粥里有勺糖',
  baseUrl,
  copyright: 'Copyright (c) 2018-present, 粥里有勺糖',

  // optional（可选参数）
  description: '大前端相关技术分享',
  language: 'zh-cn',
  author: { // Feed 的全局作者信息；文章的默认作者信息
    name: '粥里有勺糖',
    email: 'engineerzjl@foxmail.com',
    link: 'https://sugarat.top'
  },
  icon: true,
  authors: [ // 作者信息列表，文章可按 name 匹配自动补全其他信息
    {
      name: '粥里有勺糖',
      email: 'engineerzjl@foxmail.com',
      link: 'https://sugarat.top'
    },
    {
      name: 'sugar',
      email: '',
      link: 'https://github.com/atqq'
    }
  ],
  filename: 'feed.rss', // 包含全部文章
  log: true,
  ignoreHome: true,
  ignorePublish: false,
  filter: (post, idx) => {
    return true
  },
  locales: {
    en: {
      // 若缺少 baseUrl，则沿用全局 baseUrl
      filename: 'feed.en.rss', // 仅包含 en 语言目录下的文章
    },
    root: {
      filename: 'feed.zh-hans.rss', // root 作为默认源，排除上面声明的其它 locales 文章
    },
  }
}
```
### 所有配置项
支持所有 [feed Options](https://www.npmjs.com/package/feed)

同时插件还额外定义了一些配置项

下面是类型的定义
```ts
import type { Author, FeedOptions } from 'feed'

export type RSSOptions = Omit<FeedOptions, 'id'> & {
  id?: string
  /**
   * 过滤目标文章
   * @param post 文章相关信息
   */
  filter?: (value: PostInfo, index: number, array: PostInfo[]) => boolean
  /**
   * 你的站点地址
   * @example 'https://sugarat.top'
   */
  baseUrl: string
  /**
   * 相对路径静态资源的基础地址（图片）
   * @example 'https://sugarat.top'
   * @default baseUrl
   */
  assetsBaseUrl?: string
  /**
   * 线上访问的RSS地址
   * @default
   * ```ts
   * `${baseUrl + VPConfig.site.base + (filename || 'feed.rss'}`
   * ```
   */
  url?: string
  /**
   * 输出的RSS文件名
   * @default 'feed.rss'
   */
  filename?: string
  /**
   * RSS的图标展示（你也可以传入一个svg字符串进行自定义，SVG 图标可访问 https://www.xicons.org/# 获取）
   * @default true
   */
  icon?: boolean | string
  /**
   * 是否打印过程提示
   * @default true
   */
  log?: boolean
  /**
   * 是否过滤 layout:home
   * @default true
   */
  ignoreHome?: boolean
  /**
   * 是否忽略 frontmatter publish 控制
   * @default false
   */
  ignorePublish?: boolean
  /**
   * Feed 的全局作者信息；文章默认作者信息；同时也作为 feed Options 的 author 传入
   */
  author?: Author
  /**
   * 博客站点内容涉及的作者列表
   */
  authors?: Author[]
  /**
   * 自定义文章摘要生成逻辑
   */
  renderExpect?: (
    fileContent: string,
    frontmatter: Record<string, any>
  ) => string | Promise<string>
  /**
   * 限制输出文件包含的文章数量
   * @default 0
   * @description (0 不限制；> 1 会按照日期排序对输出内容进行调整)
   */
  limit?: number
  /**
   * 手动控制生成 HTML的逻辑，或不是用 vitepress 内置的 HTML 渲染逻辑
   * @default true
   */
  renderHTML?: ((filecontent: string) => string | Promise<string>) | boolean
  /**
   * 国际化支持
   */
  locales?: Record<string, Omit<RSSOptions, 'locales'>>
}
```

## FAQ
### 网页访问RSS文件乱码问题
以 Nginx 为例，可以添加如下配置
```
location ~ \.rss$ {
  charset utf-8;
}
```

![](https://cdn.upyun.sugarat.top/mdImg/sugar/3eca61766967c6a6be97f73f74f39b14)

或者，你可以在构建配置中将输出文件名修改为 `.xml` 后缀：
```ts
const RSS: RSSOptions = {
  // ...
  filename: 'rss.xml',
}
```

这样既符合 RSS 文件的标准格式（RSS 本质上是 XML），也能避免某些服务器对 `.rss` 文件的编码处理问题。


## Thanks
* [jpmonette/feed](https://www.npmjs.com/package/feed)
* [vuejs/blog](https://github.com/vuejs/blog/tree/main)
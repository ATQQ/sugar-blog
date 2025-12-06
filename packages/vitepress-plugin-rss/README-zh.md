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
文章标题。如果未提供，会从正文首个标题自动提取
```md
---
title: 我的第一篇文章
---
```

### date
发布日期。如果未指定，使用文件最后修改时间
```md
---
date: 2024-01-15
---
```

### description
文章摘要。如果未提供，会尝试使用 `renderExpect` 配置或文章摘录，最后降级为截取前 100 字
```md
---
description: 这是一篇关于 RSS 的介绍文章
---
```

### author
文章作者名称。如果未指定，会使用配置中的 `author.name`
```md
---
author: 张三
---
```

### cover
文章封面。可以手动指定，或自动从文中首张图片提取
```md
---
cover: /images/cover.png
---
```

### layout
如果值为 `home`，文章会被过滤（可通过 `ignoreHome` 选项控制）
```md
---
layout: home
---
```

### publish
包含 `publish: false` 的文章将不会出现在最终的 rss 文件中，可以用来忽略目标文章（可通过 `ignorePublish` 选项控制）
```md
---
publish: false
---
```

## 高级用法

### 使用示例1
```ts
const RSS: RSSOptions = {
  // necessary（必选参数）
  title: '粥里有勺糖',
  baseUrl,
  copyright: 'Copyright (c) 2018-present, 粥里有勺糖',

  // optional（可选参数）
  // 启用缓存 (默认: true)
  cache: true,

  // 自定义 Markdown 配置
  markdownOptions: {
    // 关闭行号（RSS 样式会渲染异常）
    lineNumbers: false
  },
  description: '大前端相关技术分享',
  language: 'zh-cn',
  author: {
    name: '粥里有勺糖',
    email: 'engineerzjl@foxmail.com',
    link: 'https://sugarat.top'
  },
  icon: true,
  authors: [
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
  filename: 'feed.rss',
  log: true,
  ignoreHome: true,
  ignorePublish: false,
  filter: (post, idx) => {
    return true
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
  /**
   * 是否缓存文档渲染结果
   * @default true
   */
  cache?: boolean
  /**
   * 重载 vitepress 的 Markdown 配置
   */
  markdownOptions?: Omit<MarkdownOptions, 'config'> & {
    style?: string
    svg2img?: boolean | 'base64' | 'png'
  }
}
```

### svg转图片资源
部分 RSS 阅读器不支持直接展示 svg 图片，你可以通过 `svg2img` 配置项来指定转换方式：

```ts
const RSS: RSSOptions = {
  // ...
  markdownOptions: {
    svg2img: 'base64' // 默认 base64
  }
}
```

如果需要转化为 png 图片，需要安装 [sharp](https://github.com/lovell/sharp) 依赖

```bash
npm install sharp
```

然后配置 `svg2img` 为 `png`

```ts
const RSS: RSSOptions = {
  // ...
  markdownOptions: {
    svg2img: 'png'
  }
}
```

### 自定义静态资源基础地址
>https://vitepress.dev/zh/guide/asset-handling#referencing-static-assets
>根据 VitePress 文档可知，所有引用的资源，包括那些使用绝对路径的，都会在生产构建过程中被复制到输出目录，并使用哈希文件名

如果你的文章中包含了相对路径图片资源，那么在生成 rss 文件时，图片资源的路径将将会自动修正为 `${assetsBaseUrl}${buildAssetsPath}`。

`assetsBaseUrl` 配置项默认值复用 配置的`baseUrl`，你可以根据实际情况进行配置。

自动修正后的值示例: 

`https://theme.sugarat.top/assets/image.Dqt2QH0u.png`

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
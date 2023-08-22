---
outline: [2,3]
description: 使用 VitePress 作为个人博客的站点越来越多，RSS支持也是博客上的一个功能点，方便读者订阅，本文将介绍如何通过Vite 插件为 VitePress 站点一键添加RSS支持
---
# 实现自动为 VitePress 网站添加 RSS 订阅的插件

省流：使用 [vitepress-plugin-rss](https://www.npmjs.com/package/vitepress-plugin-rss) 这个插件

## 前言
在看许多个人博客站点的时候，右上角总会有个RSS订阅的标志

![](https://img.cdn.sugarat.top/mdImg/MTY5MjYyNTQwOTU1Mw==692625409553)

恰好[我的博客](https://sugarat.top/)也是基于 [VitePress](https://vitepress.dev/) 搭建的，就想看看能不能也实现这个功能呢？

动手前先搜了一下，先是看到了[vitepress-blog-zaun](https://github.com/clark-cui/vitepress-blog-zaun)上有这个RSS的实现支持，再搜了一下发现Vue的官方博客 [vuejs/blog](https://github.com/vuejs/blog/tree/main) 也是用的这样的实现

大概就是自定义 VitePress 的 [buildEnd](https://vitepress.dev/reference/site-config#buildend) 钩子，在里面实现逻辑获取 `md` 文件列表，然后通过 [feed](https://www.npmjs.com/package/feed) 生成 RSS 文件，[整个逻辑就 50+ 行代码](https://github.com/vuejs/blog/blob/main/.vitepress/genFeed.ts)

由于我的博客还分离了独立的主题包 [@sugarat/theme](https://theme.sugarat.top/)，我想把这个功能加到我的主题包里，这样使用这个主题的就可以简单的配置一下就能使用了，当然也为了方便广大 VitePress 用户更加简便的使用，我将这段逻辑单独分离封装到了 [vitepress-plugin-rss](https://www.npmjs.com/package/vitepress-plugin-rss) 这个插件里。


**接下来我将会先介绍一下如何食用这个插件，再介绍它的核心实现原理**

## 插件使用
通过 `pnpm/npm/yarn` 安装插件
```sh
pnpm add vitepress-plugin-rss
```

在 `.vitepress/config.ts` 配置文件中添加配置使用

下面是最基础的使用配置
```ts
import { RssPlugin, RSSOptions } from 'vitepress-plugin-rss'
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

使用是不是非常简单，只需要 10 行代码。

如果你对插件的实现原理感兴趣，请接着往下看 🎉 🎉 🎉。

## 核心实现原理解析
VitePress 的拓展在官方文档 [Use Cases](https://vitepress.dev/guide/what-is-vitepress#use-cases) 部分有提到 

![](https://img.cdn.sugarat.top/mdImg/MTY5MjYyNzE4MDA4MA==692627180080)

其是基于 Vite 的，因此可以使用 Vite 的插件机制来实现主题内容的拓展。

### buildEnd 修改

从官方的demo种可以看到，RSS 的生成逻辑是放在 buildEnd 中的，因此咱们插件也需要实现间接修改 buildEnd 方法

这个非常的简单，利用 Vite 的插件提供的 [configResolved](https://vitejs.dev/guide/api-plugin.html#configresolved) 钩子就行

下面是简单的demo
```ts
import { SiteConfig } from 'vitepress'

let resolveConfig: any = null

function configResolved(config: any) {
  // 避免多次执行
  if (resolveConfig) {
    return
  }
  resolveConfig = config

  const VPConfig: SiteConfig = config.vitepress
  if (!VPConfig) {
    return
  }
  const selfBuildEnd = VPConfig.buildEnd
  // 自定义 buildEnd 方法，添加 rss 生成支持
  VPConfig.buildEnd = async (siteConfig: any) => {
    // 调用自己的
    await selfBuildEnd?.(siteConfig)
    console.log('buildEnd', '生成 rss 文件');
  }
}
```
通过`config.vitepress`即可拿到vitepress的配置，然后重新定义 `buildEnd` 方法即可

这里可以直接快速的验证一下

![](https://img.cdn.sugarat.top/mdImg/MTY5MjYyODA0OTEzMA==692628049130)

运行后可以看到打印了 `buildEnd 生成 rss 文件`，说明我们的插件的修改已经生效了

![](https://img.cdn.sugarat.top/mdImg/MTY5MjYyODE0MzUyNw==692628143527)

### icon 添加
这个也非常的简单，VitePress 在官方文档里有介绍 [socialLinks](https://vitepress.dev/reference/default-theme-config#sociallinks)

![](https://img.cdn.sugarat.top/mdImg/MTY5MjYyODMxNTQyMA==692628315420)

我们只需要在配置修改中添加一个 `socialLinks` 的配置即可

接着上述的demo，添加如下代码
```ts
VPConfig.site.themeConfig.socialLinks = [
  {
    icon: {
      svg: 'svg icon'
    },
    link: 'rss url'
  },
  ...VPConfig.site.themeConfig.socialLinks
]
```
svg的图标可以通过 [xicons](https://www.xicons.org/#/zh-CN) 这个网站查找

比如我这里找了一个 sun 的图标配上

![](https://img.cdn.sugarat.top/mdImg/MTY5MjYyODc2MjI2MQ==692628762261)

启动博客后就能看见右上角这个小太阳了

![](https://img.cdn.sugarat.top/mdImg/MTY5MjYyODY2MDQ3OQ==692628660479)

### MD文件获取与解析
这个是最核心的逻辑了，① 需要获取所有的 `md` 文件，② 解析里面的 frontmatter ③ 渲染HTML

这个在 `vuejs/blog` 中可以看到使用的是 VitePress 内置的 [createContentLoader](https://vitepress.dev/guide/data-loading#createcontentloader) 方法（里面包含了上述3部分逻辑）

这里把其核心实现拆出来，方便大家理解和更好的自定义（笔者在插件里也没直接使用 `createContentLoader` 这个方法）

**① 通过 fast-glob 获取所有的 md 文件**

```ts
import glob from 'fast-glob'

const files = glob.sync(`${srcDir}/**/*.md`, { ignore: ['node_modules'] })
```

其中 `srcDir` 即文章所在的目录，可以通过如下方式获取到相对路径
```ts
// config 即 SiteConfig
const srcDir =
    config.srcDir.replace(config.root, '').replace(/^\//, '') ||
    process.argv.slice(2)?.[1] ||
    '.'
```

**② 通过 gray-matter 解析 frontmatter**

这里`frontmatter`就是文章开头里两个`---`之间的内容

例如
```md
---
title: 示例标题
description: 文章介绍
---
```
利用 gray-matter 解析
```ts
import matter from 'gray-matter'
import fs from 'fs'

for (const file of files) {
  const fileContent = fs.readFileSync(file, 'utf-8')
  const { data: frontmatter, excerpt } = matter(fileContent, {
    excerpt: true
  })
}
```

其中 `excerpt` 即为文章的摘要信息(description)

**③ MD 渲染为 HTML**

这个使用 VitePress 提供的 `createMarkdownRenderer` 即可

```ts
// 由于插件里最后构建成 CJS/ESM 两种格式，VitePress 最新的版本支持 ESM，因此需要动态引入
const { createMarkdownRenderer } = await import('vitepress')

const mdRender = await createMarkdownRenderer(
  config.srcDir,
  config.markdown,
  config.site.base,
  config.logger
)
for (const file of files) {
  const fileContent = fs.readFileSync(file, 'utf-8')
  // 生成html
  const html = mdRender.render(fileContent)
}
```

### RSS文件生成

通过上面的 markdown 文件的解析，我们已经拿到了所有的文章信息，接下来就是通过 [feed](https://www.npmjs.com/package/feed) 这个库生成 RSS 文件了

```ts
import { Feed } from 'feed'
const feedOptions = {
  // ...
}
const feed = new Feed(feedOptions)

for (const file of files){
  // 通过前面解析的信息，生成 feed item 
  feed.addItem({
    title,
    id: link,
    link,
    description,
    content: html,
    author: [
      {
        name: author,
        ...authorInfo
      }
    ],
    image: frontmatter?.cover,
    date: new Date(date)
  })
}

const RSSFilename = 'feed.rss'
const RSSFilepath = path.join(config.outDir, RSSFilename)

// 生成 rss 文件
writeFileSync(RSSFilepath, feed.rss2())
```
## 最后
插件的完整源码见 [GitHub](https://github.com/ATQQ/sugar-blog/tree/master/packages/vitepress-plugin-rss)，欢迎大家试用和反馈

## 参考
* [jpmonette/feed](https://www.npmjs.com/package/feed)
* [vuejs/blog](https://github.com/vuejs/blog/tree/main)
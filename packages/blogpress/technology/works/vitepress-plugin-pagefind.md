---
cover: https://img.cdn.sugarat.top/mdImg/MTY3OTgzOTgxMjU3NQ==679839812575
description: Pagefind是基于Rust实现的离线搜索库，检索生成后的HTML页面内容，然后自动构建索引文件，提供搜索使用的API和组件
---

# 使用Pagefind为VitePress文档添加离线全文搜索能力

## 前言
[VitePress](https://vitepress.dev/) 相信大家都或多或少听说过或者用过了

默认 UI相比 [VuePress2.x](https://v2.vuepress.vuejs.org/) 好看，启动速度也快（由Vite驱动，当然VuePress也可以切换构建引擎至Vite）

做内容定制也相对简单，笔者的很多静态文档站点（使用VuePress1.x），文章内容多的时候启动非常的慢，于是就从之前的 VuePress 迁移到了 VitePress，并做了一个博客主题 [@sugarat/theme](https://theme.sugarat.top/) => 之前也有过介绍[一个简约风的VitePress博客主题](https://juejin.cn/post/7196517835380293693)

但是 VitePress 官方目前还没有内置开箱即用的搜索能力

![](https://img.cdn.sugarat.top/mdImg/MTY3OTgzNzk5NDg2MA==679837994860)

文档里首推使用 [Algolia DocSearch](https://docsearch.algolia.com/docs/what-is-docsearch), 这个需要申请，流程相对较慢，公司内网文档也无法接入使用。

推荐的另一个方案是使用 [vitepress-plugin-search](https://github.com/emersonbottero/vitepress-plugin-search) 基于 [flexsearch](https://github.com/nextapps-de/flexsearch) 实现，但是默认的UI较丑（与 Algolia 的UI差距较大），对中文没有提供开箱即用的支持，需要[进行一定的配置](https://github.com/emersonbottero/vitepress-plugin-search/issues/11)

![](https://img.cdn.sugarat.top/mdImg/MTY3OTgzODY5MzUxNQ==679838693515)

目前常用的除了 `flexsearch`，还有 [MiniSearch](https://github.com/lucaong/minisearch)

笔者之前在逛GitHub的时候还发现了一个 [Pagefind](https://github.com/cloudcannon/pagefind)（基于Rust实现，检索生成后的HTML页面内容，然后自动构建索引文件）

感觉挺有意思的，就研究使用了一番，然后将其做成了一个可直接使用的 VItePress 插件（也就是本文将介绍的）

本文主要演示下 接入步骤和效果，再简单介绍`Pagefind`，过两天再单独发个详解插件实现原理的文章

## 接入效果
只需要2步即可完成接入

① 安装 [vitepress-plugin-pagefind](https://github.com/ATQQ/sugar-blog/tree/master/packages/vitepress-plugin-pagefind)
```sh
npm i vitepress-plugin-pagefind
# or
yarn add vitepress-plugin-pagefind
# or
pnpm add vitepress-plugin-pagefind
```

② 在`.vitepress/config.ts`引入使用
```ts
import { defineConfig } from 'vitepress'
import { pagefindPlugin } from 'vitepress-plugin-pagefind'
export default defineConfig({
  vite:{
    plugins:[pagefindPlugin()],
  }
})
```

UI如下（power by [vue-command-palette](https://github.com/xiaoluoboding/vue-command-palette)）

|                                搜索按钮                                 |                                 搜索框                                  |
| :---------------------------------------------------------------------: | :---------------------------------------------------------------------: |
| ![](https://img.cdn.sugarat.top/mdImg/MTY3OTgxOTEzNjUwMw==679819136503) | ![](https://img.cdn.sugarat.top/mdImg/MTY3OTgxOTE1MDQ0OA==679819150448) |

## Pagefind介绍
>`Pagefind`是一个完全静态的搜索库，旨在在大型网站上表现良好，同时尽可能地减少用户带宽的使用，且不需要进行任何基础设施托管。

>`Pagefind`在Hugo，Eleventy，Jekyll，Next，Astro，SvelteKit或任何其他SSG之后运行。安装过程始终相同：`Pagefind`仅需要一个包含构建的静态文件的文件夹，因此在大多数情况下，无需进行配置即可开始使用。

>索引后，`Pagefind`会向您的构建文件添加静态搜索包，该包公开了可以在站点任何位置使用的`JavaScript`搜索API。`Pagefind`还提供了一个可无需配置即可使用的预构建UI（您可以在此页面顶部查看预构建UI）。

总结：框架无关，直接解析静态站点的产物，然后生成索引文件，提供开箱即用的API和组件


<!-- ## 插件实现原理解析

这部分主要介绍 vitepress-plugin-pagefind 的关键实现部分（细节可看[源码](https://github.com/ATQQ/sugar-blog/tree/master/packages/vitepress-plugin-pagefind)，如读者有更好的实现思路可以评论区交流）

### pagefind的使用
可直接通过npx调用，指定构建后的产物目录即可

以 vitepress 默认产物目录为例
```sh
npx pagefind --source docs/.vitepress/dist
``` -->
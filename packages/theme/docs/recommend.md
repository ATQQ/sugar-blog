---
sticky: 997
description: VitePress相关的主题，博客，插件汇总推荐
sidebar: false
top: 2
outline: [2,4]
---
# 【🔥持续更新】 VitePress资源推荐

:::tip
先用markdown记录一下，后续整理成独立卡片组件

欢迎大家贡献 🎉🎉🎉！！！
:::
## 博客主题

### [@sugarat/theme](https://theme.sugarat.top/)

笔者自己的博客主题，详细就不展开了。

![](https://img.cdn.sugarat.top/mdImg/sugar/7b3d73034370602b1eef82fdd7c13a99)

支持 npm 一键创建模板。

```sh
npm create @sugarat/theme@latest
```
### [查尔斯的知识库](https://blog.charles7c.top/)
基于 VitePress 打造的知识库。

|                                   常规首页                                    |                                    标签页                                     |
| :---------------------------------------------------------------------------: | :---------------------------------------------------------------------------: |
| ![](https://img.cdn.sugarat.top/mdImg/sugar/29d59c77d786eda38488938aad99ac46) | ![](https://img.cdn.sugarat.top/mdImg/sugar/fadf62e1224f1c93da8740aca2430255) |

直接在 VitePress 项目里拓展的配置，没有分离，但项目已经内置了许多功能和功能页。

通过 clone 仓库二次修改即可。

```sh
git clone https://github.com/Charles7c/charles7c.github.io.git
```

### [vitepress-blog-zaun](https://visionary-sunflower-dc7ae3.netlify.app/)
基于 VitePress 打造的博客项目，UI还是很漂亮的。

![](https://img.cdn.sugarat.top/mdImg/sugar/79bb82ad7850f4a022afe2060cfb10e6)

可通过拉取仓库模板创建。
```sh
npx degit clark-cui/vitepress-blog-zaun my-vitepress-blog
```
### [Vue 博客](https://blog.vuejs.org/)

Vue 官方博客。

![](https://img.cdn.sugarat.top/mdImg/sugar/c645f6aa11114c3dd0a74f07fb310ffe)

完全自定义了主题，非常简洁。

直接 clone 二次修改即可。
```sh
git clone https://github.com/vuejs/blog.git
```

### [Vue3 文档](https://cn.vuejs.org/)
Vue3 官方文档也是基于 VitePress 构建的。
![](https://img.cdn.sugarat.top/mdImg/sugar/da3d6554e818a85eebe17236acd266b5)

其独立主题包为 [@vue/theme](https://github.com/vuejs/theme/blob/main/package.json)

### [vitepress-blog-pure](https://ti.bi/)
一个非常简洁美观的博客项目。

![](https://img.cdn.sugarat.top/mdImg/sugar/5cdeb81777695ef0a6d48ec106e586d7)

自定义了首页，文章页等样式，同时提供独立时间线和标签页。

克隆仓库食用。
```sh
git clone https://github.com/airene/vitepress-blog-pure.git
```

### [harlanzw.com-vitepress](https://harlanzw.com/)
很漂亮的博客，简洁美观，有设计感。

![](https://img.cdn.sugarat.top/mdImg/sugar/e99824409d88017a33c767b6392050a7)

*但博客用的 vitepress 版本是 0.x 和最新的相比API变化较大。*

```sh
git clone https://github.com/harlan-zw/harlanzw.com-vitepress.git
```

## VitePress插件
### 拓展功能
#### [vitepress-plugin-mermaid](https://github.com/emersonbottero/vitepress-plugin-mermaid)

基于 [mermaid](https://mermaid.js.org/) 实现的 md 流程图插件。

```ts
// .vitepress/config.js
import { withMermaid } from 'vitepress-plugin-mermaid'

export default withMermaid({
  // your existing vitepress config...
  mermaid: {
    // mermaidConfig !theme here works for ligth mode since dark theme is forced in dark mode
  },
})
```

![](https://img.cdn.sugarat.top/mdImg/sugar/9238f8f2ddebc56daba7c45819b88974)

#### [vitepress-plugin-rss](https://github.com/ATQQ/sugar-blog/tree/master/packages/vitepress-plugin-rss)

给 vitepress 提供 RSS 订阅源链接生成支持。

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

![](https://img.cdn.sugarat.top/mdImg/MTY5MjQ1NTQ4MDYxMg==692455480612)

### 搜索
#### [vitepress-plugin-search](https://github.com/emersonbottero/vitepress-plugin-search)

基于 [flexsearch](https://github.com/nextapps-de/flexsearch) 实现的离线全文搜索插件。

```ts
import { SearchPlugin } from 'vitepress-plugin-search'
import { defineConfig } from 'vitepress'

// default options
const options = {
  ...flexSearchIndexOptions,
  previewLength: 62,
  buttonLabel: 'Search',
  placeholder: 'Search docs',
  allow: [],
  ignore: [],
}

export default defineConfig({
  vite: { plugins: [SearchPlugin(options)] }
})
```
#### [vitepress-plugin-pagefind](https://github.com/ATQQ/sugar-blog/tree/master/packages/vitepress-plugin-pagefind)

基于 [pagefind](https://github.com/cloudcannon/pagefind) 实现的离线全文搜索插件。

```ts
import { defineConfig } from 'vitepress'
import { pagefindPlugin } from 'vitepress-plugin-pagefind'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  vite: {
    plugins: [pagefindPlugin()],
  }
})
```

![](https://img.cdn.sugarat.top/mdImg/MTY3OTgxOTE1MDQ0OA==679819150448)

### 易用性提升
#### [vitepress-plugin-autobar](https://github.com/luciozhang/vitepress-plugin-autobar)

根据目录结构自动生成 sidebar 信息。
```ts
import { getSideBar } from 'vitepress-plugin-autobar'

module.exports = {
  // ...
  themeConfig: {
    // ...
    sidebar: getSideBar('./docs'),
  },
}
```

TODO：wait a moment

## markdown-it 插件

TODO：wait a moment

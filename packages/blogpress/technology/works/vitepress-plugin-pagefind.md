---
cover: https://img.cdn.sugarat.top/mdImg/MTY3OTgzOTgxMjU3NQ==679839812575
description: Pagefind是基于Rust实现的离线搜索库，检索生成后的HTML页面内容，然后自动构建索引文件，提供搜索使用的API和组件
outline: [2,3]
---

# 使用Pagefind为VitePress文档添加离线全文搜索能力

## 前言
[VitePress](https://vitepress.dev/) 相信大家都或多或少听说过或者用过了

默认 UI相比 [VuePress2.x](https://v2.vuepress.vuejs.org/) 好看，启动速度也快（由Vite驱动，当然VuePress也可以切换构建引擎至Vite）

做内容定制也相对简单，笔者的很多静态文档站点（使用VuePress1.x），文章内容多的时候启动非常的慢，于是就从之前的 VuePress 迁移到了 VitePress，并做了一个博客主题 [@sugarat/theme](https://theme.sugarat.top/) => 之前也有过介绍[一个简约风的VitePress博客主题](https://juejin.cn/post/7196517835380293693)

但是 VitePress 官方目前还没有内置开箱即用的搜索能力（[相关PR](https://github.com/vuejs/vitepress/pull/2110)还在施工中）

![](https://img.cdn.sugarat.top/mdImg/MTY3OTgzNzk5NDg2MA==679837994860)

文档里首推使用 [Algolia DocSearch](https://docsearch.algolia.com/docs/what-is-docsearch), 这个需要申请，流程相对较慢，公司内网文档也无法接入使用。

推荐的另一个方案是使用 [vitepress-plugin-search](https://github.com/emersonbottero/vitepress-plugin-search) 基于 [flexsearch](https://github.com/nextapps-de/flexsearch) 实现，但是默认的UI较丑（与 Algolia 的UI差距较大），对中文没有提供开箱即用的支持，需要[进行一定的配置](https://github.com/emersonbottero/vitepress-plugin-search/issues/11)

![](https://img.cdn.sugarat.top/mdImg/MTY3OTgzODY5MzUxNQ==679838693515)

目前常用的除了 `flexsearch`，还有 [MiniSearch](https://github.com/lucaong/minisearch)

笔者之前在逛GitHub的时候还发现了一个 [Pagefind](https://github.com/cloudcannon/pagefind)（基于Rust实现，检索生成后的HTML页面内容，然后自动构建索引文件）

感觉挺有意思的，就研究使用了一番，然后将其做成了一个可直接使用的 VItePress 插件（也就是本文将介绍的）

本文主要演示下 接入步骤和效果，再简单介绍`Pagefind`，最后讲解一下插件原理

## 接入后效果
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

>索引后，`Pagefind`会向您的构建文件添加静态搜索包，该包公开了可以在站点任何位置使用的`JavaScript`搜索API。`Pagefind`还提供了一个可无需配置即可使用的预构建UI

总结：框架无关，直接解析静态站点的产物，然后生成索引文件，**提供开箱即用的API和组件**，支持开箱即用的多语言站点，零配置

### 生成内容索引
可直接通过npx调用，指定构建后的产物目录即可

以 vitepress 默认产物目录为例
```sh
npx pagefind --source docs/.vitepress/dist
```
一般毫秒级就完成了页面内容的分析与pagefind需要的资源转换

![](https://img.cdn.sugarat.top/mdImg/MTY4MDQwNzk5NzYxNw==680407997617)

默认会自动扫描指定目录下所有的`html`资源，将带有`data-pagefind-body`属性的元素作为索引的位置，否则的话使用`<body>`作为索引位置

会自动识别 `html` 中的 `lang` 属性，使用对应的分词策略处理，目前已经[内置多种语言支持](https://pagefind.app/docs/multilingual/#language-support)

生成的相关文件默认在`_pagefind`目录中，内容如下

![](https://img.cdn.sugarat.top/mdImg/MTY4MDQyMjc2NjQ3NQ==680422766475)

### 使用内置搜索UI
在生成索引的过程中，pagefind也会把内置的搜索框UI相关资源放入其中

在页面中只需要导入相应的`js/css`资源即可
```html
<link href="/_pagefind/pagefind-ui.css" rel="stylesheet">
<script src="/_pagefind/pagefind-ui.js" type="text/javascript"></script>

<div id="search"></div>
<script>
    window.addEventListener('DOMContentLoaded', (event) => {
        new PagefindUI({ element: "#search" });
    });
</script>
```
搜索框样式如下

![](https://img.cdn.sugarat.top/mdImg/MTY4MDQyMzM0OTQ2NA==680423349464)

### 使用JS API
默认的搜索框样式不满足的话可以，自定义搜索框逻辑，通过JS API调用搜索能力

```ts
// 1. Initializing Pagefind
const pagefind = await import("/_pagefind/pagefind.js");
// 2. search docs
const search = await pagefind.search("hello");
// 3. Loading a result
const oneResult = await search.results[0].data();
```

搜索结果格式如下

![](https://img.cdn.sugarat.top/mdImg/MTY4MDQyMzg0NzMxMg==680423847312)
```ts
interface SearchResult {
  url: string;
  excerpt: string;
  filters: Record<string,any>;
  meta: Record<string,any>;
  content: string;
  word_count: number;
}
```

### 一些不足
* 仅针对构建后的产物进行索引，开发环境下无法工作
* 对中文和日语等支持相对英语会差一点（区别见下截图）
![](https://img.cdn.sugarat.top/mdImg/MTY4MDQyNDMyMjk1MA==680424322950)
* 不支跳转至标题

## 插件实现原理解析

这部分主要介绍 `vitepress-plugin-pagefind` 的关键实现部分（细节可看[源码](https://github.com/ATQQ/sugar-blog/tree/master/packages/vitepress-plugin-pagefind)，如读者有更好的实现思路可以评论区交流）

几个关键步骤:
1. 替换默认搜索组件
2. 目标元素上插入检索的标识`data-pagefind-body`
3. 插入运行时的`script`脚本

### 替换默认搜索组件

通过查看默认布局组件`Layout.vue`源码其中搜索组件是被`VPNavBarSearch.vue`引入

咱只需要通过插件添加一个 `alias` 规则,将其指向自定义的组件即可

这个使用插件的 `config` 钩子即可
```ts
export function pagefindPlugin() {
  return {
    name: 'vitepress-plugin-pagefind',
    enforce: 'pre',
    config: () => ({
      resolve: {
        alias: {
          './VPNavBarSearch.vue': 'vitepress-plugin-pagefind/Search.vue'
        }
      }
    }),
  }
}
```

### 添加索引标识
由于vitepress的默认 `body`元素中包含 navBar，footer，sidebar等等等内容

默认情况下每个页面的代码中都会包含这些公共内容，因此会导致检索出的内容有很多重复信息

理论上只需要检索用户编写的 markdown内容生成的部分

也就是`VPContent.vue`组件渲染的内容（当然里面包含了3种情况`VPHome`，`VPPage`，`VPDoc`这里可以不做区分）

这个通过插件的`transform`钩子处理一下，构建时替换源码中`VPContent`的内容

```ts
export function pagefindPlugin() {
  return {
    // ... other code
    transform(code, id) {
      if (id.endsWith('theme-default/Layout.vue')) {
        return code.replace('<VPContent>', '<VPContent data-pagefind-body>')
      }
      return code
    }    
  }
}
```

### 运行时的脚本注入
因为相关资源是在Build之后才会生成，所以直接在源码中 `import` 会提示 `module not found` 导致构建失败

咱可以在搜索组件里写一段脚本，在页面运行后`append`到页面中，这段逻辑可以写到`onBeforeMount`周期函数中

```ts
import { onBeforeMount } from 'vue'

const addInlineScript = () => {
  const scriptText = `import('/_pagefind/pagefind.js')
        .then((module) => {
          window.__pagefind__ = module
        })
        .catch(() => {
          console.log('not load /_pagefind/pagefind.js')
        })`
  const inlineScript = document.createElement('script')
  inlineScript.innerHTML = scriptText
  document.head.appendChild(inlineScript)
}

onBeforeMount(() => {
  addInlineScript()
})
```

`pagefind`我这里采用`import(source)`动态导入，组件搜索直接使用`window.__pagefind__`来进行API的调用

## 最后
目前这一版插件主要是将pagefind做了一个简单的内置，没有对搜索结果进行优化，也不支持多级标题的跳转

后续是准备优化一下插件的本身实现和功能

* 插件内部的hack实现替换为 VitePress 的 [Build Hooks](https://vitepress.dev/reference/site-config#build-hooks)
* 搜索内容的输入输出支持自定义的转换
* 跳转支持标题
* ...

欢迎各位在评论区交流想法
---
description: 详细介绍主题提供的全局能力
title: 🔧 主题配置 - 全局
readingTime: false
tag:
 - 配置
top: 2
recommend: 2
outline: [2,3]
---

# 全局配置
全局配置通常是 添加到 `.vitepress/config.ts`文件中

默认配置如下
```ts
import { getThemeConfig, defineConfig } from '@sugarat/theme/node'

const blogTheme = getThemeConfig()

export default defineConfig({
  extends: blogTheme
  // ...other config
})
```
:::details 我启动时遇到配置方式过期提示？
![](https://img.cdn.sugarat.top/mdImg/MTY3OTIxNDY5MjE3NQ==679214692175)

只需动动手指将配置按照如上最新的方式做个替换即可
* 将 `...blogTheme` 改成通过 `extends` 的方式引入

```ts
// .vitepress/config.ts
import { getThemeConfig, defineConfig } from '@sugarat/theme/node'
const blogTheme = getThemeConfig()

export default defineConfig({
  extends: blogTheme // [!code ++]
  themeConfig: {
    ...blogTheme // [!code --]
  }
})
```
:::

:::tip
主题继承[默认主题配置](https://vitepress.dev/reference/site-config)，即原主题配置依然生效

官方内置的👉🏻 [markdown 能力](https://vitepress.vuejs.org/guide/markdown) 👈🏻
:::

本主题的拓展配置都在导出的`getThemeConfig`方法中

下面是简单示例 **关闭主题自带搜索**
```ts
import { getThemeConfig, defineConfig } from '@sugarat/theme/node'

const blogTheme = getThemeConfig({ // [!code focus]
  search: false // [!code focus]
}) // [!code focus]

export default defineConfig({
  extends: blogTheme
  // ...other config
})
```
![](https://img.cdn.sugarat.top/mdImg/MTY3OTEyMjg5Nzc1Mg==679122897752)

下面开始详细介绍 [Theme.BlogConfig](https://github.com/ATQQ/sugar-blog/blob/255c4b1e6a85a529be3a72c88e365077e067ecba/packages/theme/src/composables/config/index.ts#L69-L137)

## author
* Type: `string`

设置文章默认的作者名字，优先级低于[单独在文章中设置](./frontmatter.md#author)的情况

```ts
const blogTheme = getThemeConfig({
  author: '真不戳'
})
```

![图片](https://img.cdn.sugarat.top/mdImg/MTY3NDkxMzUxNzQxMg==674913517412)

## hotArticle
用于控制首页右侧的精选文章内容，其中精选的文章由 [frontmatter: sticky](./frontmatter.md#sticky) 进行控制

::: code-group

```ts [default]
const blogTheme = getThemeConfig({
  hotArticle:{
    title: '🔥 精选文章',
    nextText: '换一组',
    pageSize: 9,
    empty: '暂无精选内容'
  }
})
```

```ts [example]
const blogTheme = getThemeConfig({
  hotArticle: {
    title: '🔥 自定义标题',
    nextText: '下一页',
    pageSize: 1,
    // empty: false // false 时无精选文章不展示此模块
  }
})
```

```ts [type]
interface HotArticle{
  title?: string
  pageSize?: number
  nextText?: string
  empty?: string | boolean
}
```

```md [sticky]
---
# 用于设置在首页展示的 精选文章，值越大展示越靠前
sticky: 1
---
```

:::

![图片](https://img.cdn.sugarat.top/mdImg/MTY3NDkxNzkzMjY5Nw==674917932697)

## home
用于设置首页的自定义内容
::: code-group

```ts [default]
const blogTheme = getThemeConfig({
  home: {
    name: '',
    motto: '',
    inspiring: '',
    pageSize: 6
  }
})
```

```ts [example]
const blogTheme = getThemeConfig({
  home: {
    name: '@sugarat/theme',
    motto: '粥里有勺糖的博客主题',
    inspiring: '基于 Vitepress 定制的主题🎨',
    pageSize: 2
  }
})
```

```ts [type]
interface HomeBlog {
  name?: string
  motto?: string
  inspiring?: string
  pageSize?: number
}
```

:::

![图片](https://img.cdn.sugarat.top/mdImg/MTY3MzE4MDczMzQ2OQ==673180733469)

![图片](https://img.cdn.sugarat.top/mdImg/MTY3NDkyMDIwMzE5MQ==674920203192)

## search
* Type: `boolean | 'pagefind' | Object`
* Default: `true`

控制是否启用主题自带的搜索功能
:::code-group
```ts [关闭搜索]
const blogTheme = getThemeConfig({
  search: false
})
```
```ts [修改搜索文案]
const blogTheme = getThemeConfig({
  search: {
    btnPlaceholder: 'Search',
    placeholder: 'Search Docs',
    emptyText: 'No results found',
    heading: 'Total: {{searchResult}} search results.'
  }
})
```
```ts [type]
type SearchConfig =
    | boolean
    | 'pagefind'
    | {
        btnPlaceholder?: string
        placeholder?: string
        emptyText?: string
        /**
         * @example
         * 'Total: {{searchResult}} search results.'
         */
        heading?: string
        mode?: boolean | 'pagefind'
      }
```
:::


![](https://img.cdn.sugarat.top/mdImg/MTY3OTEyMjg5Nzc1Mg==679122897752)

![](https://img.cdn.sugarat.top/mdImg/MTY3OTEyMjk2MTg5Mg==679122961892)

![](https://img.cdn.sugarat.top/mdImg/MTY3OTgxNTk5NTQyMw==679815995423)

### 全文搜索 - minisearch

官方`VitePress`内置的离线全文搜索实现，使用方法如下

```ts
import { defineConfig } from 'vitepress'

export default defineConfig({
  themeConfig: {
    search: {
      provider: 'local'
    }
  }
})
```

效果如下

![](https://img.cdn.sugarat.top/mdImg/MTY4MjE3NDYxOTczMA==682174619730)

### 全文搜索 - pagefind
开启全文搜索（基于 [pagefind](https://pagefind.app/) 实现）

:::code-group
```ts [demo1]
const blogTheme = getThemeConfig({
  search: 'pagefind'
})
```

```ts [demo2]
const blogTheme = getThemeConfig({
  search: {
    mode: 'pagefind',
    btnPlaceholder: 'Search',
    placeholder: 'Search Docs',
    emptyText: 'No results found',
    heading: 'Total: {{searchResult}} search results.'
  }
})
```
:::

:::tip
构建后才会生效，其原理是分析生成的html文件内容

原理见 => [Pagefind indexes your site after it builds](https://pagefind.app/docs/)
:::
:::details 构建示例
![](https://img.cdn.sugarat.top/mdImg/MTY3OTEyMzM1ODQxNQ==679123358415)
:::

![](https://img.cdn.sugarat.top/mdImg/MTY3OTEyMzQ0NDAwOA==679123444008)


如果需要自定义更多的内容可以使用独立的插件 [vitepress-plugin-pagefind](https://github.com/ATQQ/sugar-blog/blob/master/packages/vitepress-plugin-pagefind/README-zh.md)

:::code-group

```sh [①: 安装插件]
pnpm add vitepress-plugin-pagefind
```

```ts [②: 引入插件]
// 在 `.vitepress/config.ts` 引入
import { defineConfig } from 'vitepress'
import { chineseSearchOptimize, pagefindPlugin } from 'vitepress-plugin-pagefind'

const blogTheme = getThemeConfig({
  // 关闭主题内置
  search: false
})

export default defineConfig({
  extends: blogTheme,
  lang: 'zh-cn',
  vite: {
    // 使用插件加载
    plugins: [pagefindPlugin({
      customSearchQuery: chineseSearchOptimize,
      btnPlaceholder: '搜索',
      placeholder: '搜索文档',
      emptyText: '空空如也',
      heading: '共: {{searchResult}} 条结果'
    })],
  },
})
```
:::

### 全文搜索 - algolia
当然也推荐大家接入[algolia](https://vitepress.vuejs.org/guide/theme-search)使用，申请教程可以参考 [博客优化之开启 Algolia 全文搜索](https://github.com/mqyqingfeng/Blog/issues/267)

```ts
export default defineConfig({
  themeConfig: {
    search: {
      provider: 'algolia',
      options: {
        appId: '',
        apiKey: '',
        indexName: '',
        placeholder: '请输入要搜索的内容...'
      }
    }
  }
})
```

![](https://img.cdn.sugarat.top/mdImg/MTY3NzE2MjEzMjcyNQ==677162132725)

### 全文搜索 - flexsearch

其它搜索方案：可以使用官方文档推荐的一个插件 [vitepress-plugin-search](https://github.com/emersonbottero/vitepress-plugin-search)，基于 [flexsearch](https://github.com/nextapps-de/flexsearch#options)实现

如下接入步骤

::: code-group
```sh [① 安装必要依赖]
pnpm add vitepress-plugin-search markdown-it flexsearch -D
```

```ts [② .vitepress/config 加入配置]
import { defineConfig } from '@sugarat/theme/node'
import { SearchPlugin } from 'vitepress-plugin-search'
export default defineConfig({
  vite: {
    plugins: [SearchPlugin()]
  }
})
```
:::

## comment
配置文章的评论，使用 [giscus](https://giscus.app/zh-CN)（由 GitHub Discussions 驱动的评论系统）

访问 https://giscus.app/zh-CN 获取下述的参数

::: code-group

```ts [example]
const blogTheme = getThemeConfig({
  comment: {
    repo: 'ATQQ/sugar-blog',
    repoId: 'MDEwOlJlcG9zaXRvcnkyNDEyNDUyOTk',
    category: 'Announcements',
    categoryId: 'DIC_kwDODmEcc84COVc6'
  }
})
```

```ts [type]
interface GiscusConfig {
  repo: string
  repoId: string
  category: string
  categoryId: string
  mapping?: string
  inputPosition?: 'top' | 'bottom'
  lang?: string
  loading?: 'lazy' | ''
}
```

:::

![图片](https://img.cdn.sugarat.top/mdImg/MTY3NDkyMDc2MDIxMw==674920760213)

## recommend
* Type: `false | RecommendArticle`

用于控制推荐文章的展示卡片
::: code-group

```ts [default]
const blogTheme = getThemeConfig({
  recommend: {
    title: '🔍 相关文章',
    nextText: '换一组',
    pageSize: 9,
    empty: '暂无相关文章',
    style: 'sidebar'
  }
})
```

```ts [example]
const blogTheme = getThemeConfig({
  recommend: {
    title: '🔍 推荐文章',
    nextText: '下一页',
    pageSize: 1,
    style: 'card'
    // empty: false // false时无推荐文章不展示此模块
  }
})
```

```ts [type]
interface RecommendArticle {
  title?: string
  pageSize?: number
  nextText?: string
  /**
   * 是否展示当前正在浏览的文章在左侧
   * @default true
   */
  showSelf?: boolean
  filter?: (page: Theme.PageData) => boolean
  empty?: string | boolean
  /**
   * 设置推荐文章的展示风格
   * @default 'sidebar'
   */
  style?: 'card' | 'sidebar'
}
```

:::

![图片](https://img.cdn.sugarat.top/mdImg/MTY3NDkyMTI2MDQyNQ==674921260425)

设置为 false 时，不展示
```ts
const blogTheme = getThemeConfig({
  recommend: false
})
```

style: `'sidebar'` 时，展示类似默认主题的侧边栏

```ts
const blogTheme = getThemeConfig({
  recommend: {
    style: 'sidebar'
  }
})
```
![](https://img.cdn.sugarat.top/mdImg/MTY5MTIxODc4NDYzNw==691218784637)

## article
设置文章全局相关能力
::: code-group

```ts [default]
const blogTheme = getThemeConfig({
  article: {
    /**
     * 是否展示文章的预计阅读时间
     */
    readingTime: true
    /**
     * 是否隐藏文章页的封面展示
     */
    hiddenCover: false
  }
})
```

```ts [type]
interface ArticleConfig {
  readingTime?: boolean
  hiddenCover?: boolean
}
```

:::

![图片](https://img.cdn.sugarat.top/mdImg/MTY3NDkyMjAzNDEzOA==674922034138)

![](https://img.cdn.sugarat.top/mdImg/MTY4MjE3NDAzNzMxMw==682174037313)

## srcDir
* Type: `string`
* Default: `.`

相对于项目根目录，文章所在位置，同 [App Configs #srcdir](https://vitepress.vuejs.org/config/app-configs#srcdir)

**通常情况下无需设置**，默认从 CLI 指令取值 

例如 `vitepress dev docs`，取值即为`docs`

等价于
```ts
const blogTheme = getThemeConfig({
  srcDir: './docs'
})
```

## alert
设置一个全局的提示弹窗 (由 [el-alert](https://element-plus.gitee.io/zh-CN/component/alert.html) 驱动)

::: code-group

```ts [example ①]
const blogTheme = getThemeConfig({
  alert: {
    type: 'success',
    title: 'xx功能上新啦🎉',
    duration: 3000
  }
})
```

```ts [example ②]
const blogTheme = getThemeConfig({
  alert: {
    type: 'success',
    title: '标配内容，这是一个不会自动关闭的弹窗',
    duration: 0,
    description: '每次打开都会展示，可通过 html 属性自定义这块内容',
    showIcon: true
  }
})
```

```ts [type]
interface Alert {
  type: 'success' | 'warning' | 'info' | 'error'
  /**
   * 细粒度的时间控制
   * 默认展示时间，-1 只展示1次，其它数字为每次都展示，一定时间后自动消失，0为不自动消失
   * 配置改变时，会重新触发展示
   */
  duration: number

  title?: string
  description?: string
  closable?: boolean
  center?: boolean
  closeText?: string
  showIcon?: boolean
  html?: string
}
```
:::

![图片](https://img.cdn.sugarat.top/mdImg/MTY3NDk5MzQwNTQwOA==674993405408)

![图片](https://img.cdn.sugarat.top/mdImg/MTY3NDk5MzcyNzU2MA==674993727560)

## popover

设置一个全局的公告弹窗，支持设置图片，文字，按钮（[el-button](https://element-plus.gitee.io/zh-CN/component/button.html)）跳链

![图片](https://img.cdn.sugarat.top/mdImg/MTY3NDk5NDY3Nzc5NQ==674994677795)


::: code-group

```ts [example]
const blogTheme = getThemeConfig({
  popover: {
    title: '📢 广而周知 📢',
    duration: -1,
    body: [
      {
        type: 'title',
        content: '小标题',
        style: 'color:red'
      },
      { type: 'text', content: '👇公众号👇---👇 微信 👇' },
      {
        type: 'image',
        src: 'https://img.cdn.sugarat.top/mdImg/MTYxNTAxODc2NTIxMA==615018765210'
      }
    ],
    footer: [
      {
        type: 'text',
        content: 'footer 与 body 结构一致'
      },
      {
        type: 'button',
        link: 'https://sugarat.top',
        content: '作者博客',
        props: {
          round: true
        }
      }
    ]
  },
})
```

```ts [type]
interface Popover {
  title: string
  /**
   * 细粒度的时间控制
   * 默认展示时间，-1 只展示1次，其它数字为每次都展示，一定时间后自动消失，0为不自动消失
   * 配置改变时，会重新触发展示
   */
  duration: number
  body?: BlogPopover.Value[]
  footer?: BlogPopover.Value[]
  /**
   * 手动重新打开
   */
  reopen?: boolean
}

export namespace BlogPopover {
  export interface Title {
    type: 'title'
    content: string
    style?: string
  }

  export interface Text {
    type: 'text'
    content: string
    style?: string
  }

  export interface Image {
    type: 'image'
    src: string
    style?: string
  }

  export interface Button {
    type: 'button'
    link: string
    content: string
    style?: string
    props?: InstanceType<typeof ElButton>['$props']
  }

  export type Value = Title | Text | Image | Button
}
```
:::

## friend
用于设置首页展示的友链信息

![](https://img.cdn.sugarat.top/mdImg/MTY5MzMxODIxNDY0Mg==693318214642)


::: code-group

```ts [example]
const blogTheme = getThemeConfig({
  friend: [
    {
      nickname: '粥里有勺糖',
      des: '你的指尖用于改变世界的力量',
      avatar:
        'https://img.cdn.sugarat.top/mdImg/MTY3NDk5NTE2NzAzMA==674995167030',
      url: 'https://sugarat.top'
    },
    {
      nickname: 'Vitepress',
      des: 'Vite & Vue Powered Static Site Generator',
      avatar:
        'https://img.cdn.sugarat.top/mdImg/MTY3NDk5NTI2NzY1Ng==674995267656',
      url: 'https://vitepress.vuejs.org/'
    }
  ]
})
```

```ts [type]
type ThemeableImage =
  | string
  | { src: string; alt?: string }
  | { light: string; dark: string; alt?: string }

interface FriendLink {
  nickname: string
  des: string
  url: string
  avatar: ThemeableImage
}
```
:::

同时也支持设置logo `alt` 信息（默认取 nickname）

```ts
const blogTheme = getThemeConfig({
  friend: [
    {
      // 省略其他配置项 
      avatar: {
        // 单独设置 alt
        alt: '粥里有勺糖23',
        src:
          'https://img.cdn.sugarat.top/mdImg/MTY3NDk5NTI2NzY1Ng==674995267656'
      }
    },
    {
      // 省略其他配置项 
      avatar: {
        // 暗黑模式下使用不一样的logo
        dark:
          'https://img.cdn.sugarat.top/mdImg/MTY3NDk5NTI2NzY1Ng==674995267656',
        light:
          'https://img.cdn.sugarat.top/mdImg/MTY3NDk5NTI2NzY1Ng==674995267656'
      }
    }
  ]
})

```
## authorList
用于设置文章页作者信息跳转相关信息，默认情况下`author`仅做展示

设置这个列表后，作者信息如果匹配上，即可跳转

![](https://img.cdn.sugarat.top/mdImg/MTY4MjE3NTA0MDc1NA==682175040754)

::: code-group

```ts [example]
const blogTheme = getThemeConfig({
  authorList: [
    {
      nickname: '粥里有勺糖',
      url: 'https://sugarat.top/aboutme.html',
      des: '你的指尖,拥有改变世界的力量'
    }
  ]
})
```

```ts [type]
interface AuthorInfo {
  nickname: string
  des: string
  url: string
}
```
:::


## blog
* Type: `boolean`
* Default: `true`

是否设置为博客模式，默认为博客模式

如果设置为`false`，就可以使用 Vitepress 默认的首页主题样式，如下示例

```ts
const blogTheme = getThemeConfig({
  blog: false
})
```

```md
---
layout: home

hero:
  name: VitePress
  text: Vite & Vue powered static site generator.
  tagline: Lorem ipsum...
  image:
    src: /logo.png
    alt: VitePress
  actions:
    - theme: brand
      text: Get Started
      link: /guide/what-is-vitepress
    - theme: alt
      text: View on GitHub
      link: https://github.com/vuejs/vitepress
---
```

![](https://img.cdn.sugarat.top/mdImg/MTY3NzE2Mjk1NzczNw==677162957737)

## RSS
* Type：`RSSOptions`

开启 RSS 支持，自动生成 `feed.rss` 文件

:::tip
参考 [Vue.js blog](https://github.com/vuejs/blog/tree/main) 基于 [jpmonette/feed](https://www.npmjs.com/package/feed) 实现
:::

::: code-group

```ts [example 基础配置]
import type { Theme } from '@sugarat/theme'

const baseUrl = 'https://theme.sugarat.top'
const RSS: Theme.RSSOptions = {
  title: '@sugarat/theme',
  baseUrl,
  copyright: 'Copyright (c) 2023-present, 粥里有勺糖',
}

const blogTheme = getThemeConfig({
  RSS
})
```
```ts [example2 复杂配置]
import type { Theme } from '@sugarat/theme'

const baseUrl = 'https://theme.sugarat.top'
const RSS: Theme.RSSOptions = {
  title: '@sugarat/theme',
  baseUrl,
  description: '简约风的 Vitepress 博客主题',
  language: 'zh-cn',
  image: 'https://img.cdn.sugarat.top/mdImg/MTY3NDk5NTE2NzAzMA==674995167030',
  favicon: 'https://theme.sugarat.top/favicon.ico',
  copyright: 'Copyright (c) 2023-present, 粥里有勺糖',
  url: `${baseUrl}/feed.rss`
}

const blogTheme = getThemeConfig({
  RSS
})
```

```ts [type 完整配置项]
type RSSOptions = Omit<FeedOptions, 'id'> & {
  id?: string
  /**
   * 你的站点地址
   * @example 'https://sugarat.top'
   */
  baseUrl: string
  /**
   * 线上访问的RSS地址
   * @default
   * @example https://sugarat.top/feed.rss
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
   * RSS的图标展示
   * @default true
   */
  icon?: boolean
  /**
   * 限制输出文件包含的文章数量
   * @default 0
   * @description (0 不限制；> 1 会按照日期排序对输出内容进行调整)
   */
  limit?: number
}

interface FeedOptions {
  id: string;
  title: string;
  updated?: Date;
  generator?: string;
  language?: string;
  ttl?: number;
  feed?: string;
  feedLinks?: any;
  hub?: string;
  docs?: string;
  author?: Author;
  link?: string;
  description?: string;
  image?: string;
  favicon?: string;
  copyright: string;
}
```

![](https://img.cdn.sugarat.top/mdImg/MTY5MTkyODAxMDEwMQ==691928010101)

:::warning 特别提示
你也可以使用单独的插件 [vitepress-plugin-rss](https://www.npmjs.com/package/vitepress-plugin-rss) 来添加同样的能力，其支持更加丰富的定制

实现原理见文章：[如何快速为 VitePress 添加 RSS 订阅支持 - 掘金](https://juejin.cn/post/7270046196642005049)
:::

## themeColor
* Type: `ThemeColor`

用于设置博客整体的主题色，内置了多套（从 `VP` 和 `Element` 移植的主题色）

::: code-group
```ts [default]
const blogTheme = getThemeConfig({
  themeColor: 'vp-default'
})
```

```ts [example]
const blogTheme = getThemeConfig({
  themeColor: 'el-blue'
})
```

```ts [type]
type ThemeColor = 'vp-default' | 'vp-green' | 'vp-yellow' | 'vp-red' | 'el-blue' | 'el-yellow' | 'el-green' | 'el-red';
```
:::

|                               vp-default                                |                                vp-green                                 |                                 el-blue                                 |
| :---------------------------------------------------------------------: | :---------------------------------------------------------------------: | :---------------------------------------------------------------------: |
| ![](https://img.cdn.sugarat.top/mdImg/MTY5NDM1NTU5Nzg4MA==694355597880) | ![](https://img.cdn.sugarat.top/mdImg/MTY5NDM1NTYxOTE4OQ==694355619189) | ![](https://img.cdn.sugarat.top/mdImg/MTY5NDM1NTY5MTk0Nw==694355691947) |

<ChangeThemeDemo />
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
import { defineConfig, getThemeConfig } from '@sugarat/theme/node'

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
import { defineConfig, getThemeConfig } from '@sugarat/theme/node'

const blogTheme = getThemeConfig()

export default defineConfig({
  extends: blogTheme, // [!code ++]
  themeConfig: {
    ...blogTheme // [!code --]
  }
})
```

:::

:::tip
主题继承[默认主题配置](https://vitepress.dev/reference/site-config)，即原主题配置依然生效

官方内置的👉🏻 [markdown 能力](https://vitepress.dev/guide/markdown) 👈🏻
:::

本主题的拓展配置都在导出的`getThemeConfig`方法中

下面是简单示例 **关闭主题自带搜索**

```ts
import { defineConfig, getThemeConfig } from '@sugarat/theme/node'

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
  hotArticle: {
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
interface HotArticle {
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
  author?: string | boolean
  logo?: string | boolean
  /**
   * @default 'card'
   */
  avatarMode?: 'card' | 'split'
}
```

:::

![图片](https://img.cdn.sugarat.top/mdImg/MTY3MzE4MDczMzQ2OQ==673180733469)

![图片](https://img.cdn.sugarat.top/mdImg/MTY3NDkyMDIwMzE5MQ==674920203192)

![](https://img.cdn.sugarat.top/mdImg/MTY5NjE1NTk3MjkxMQ==696155972911)

## search

* Type: `boolean | 'pagefind' | Object`
* Default: `true`

控制是否启用主题自带的搜索功能（简化版的[pagefind](https://pagefind.app/)）
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
import { getThemeConfig } from '@sugarat/theme/node'

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

当然也推荐大家接入[algolia](https://vitepress.dev/guide/theme-search)使用，申请教程可以参考 [博客优化之开启 Algolia 全文搜索](https://github.com/mqyqingfeng/Blog/issues/267)

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

访问 <https://giscus.app/zh-CN> 获取下述的参数

::: code-group

```ts [配置示例]
const blogTheme = getThemeConfig({
  comment: {
    repo: 'ATQQ/sugar-blog',
    repoId: 'MDEwOlJlcG9zaXRvcnkyNDEyNDUyOTk',
    category: 'Announcements',
    categoryId: 'DIC_kwDODmEcc84COVc6',
  }
})
```

```ts [自定义图标&文案]
const blogTheme = getThemeConfig({
  comment: {
    repo: 'ATQQ/sugar-blog',
    repoId: 'MDEwOlJlcG9zaXRvcnkyNDEyNDUyOTk',
    category: 'Announcements',
    categoryId: 'DIC_kwDODmEcc84COVc6',

    // 自定义展示内容
    label: '发表意见',
    icon: `<svg width="512" height="512" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <path fill="#fbbf67" d="M63.962 31.979c0 17.665-14.318 31.979-31.981 31.979C14.319 63.958 0 49.644 0 31.979C0 14.315 14.319 0 31.981 0c17.663 0 31.981 14.315 31.981 31.979"/>
        <path fill="#633d19" d="M39.512 47.925c-.624-1.461-1.959-2.202-3.97-2.202c-1.568 0-3.271.45-4.515.78l-.727.185c-.32.079-1.979 1.012-1.868 1.914l.193.727h.671c.111 0 .229-.016.37-.049l.602-.152c1.361-.342 2.643-.666 3.983-.666c.788 0 1.46.305 2 .905c.442.487.371.773.348.868c-.118.494-.889 1.085-1.916 1.476c0 0-1.594.658-1.663 1.574l.052.622l.415.237c2.326 1.333 2.278 2.194 1.979 2.796c-.332.664-1.275.805-2.01.805c-1.019 0-2.121-.273-2.765-.542l-.427-.083c-.806 0-2.105.97-2.248 1.673l-.071.716l.573.238a8.03 8.03 0 0 0 3.128.628h.004c1.896 0 3.831-.663 5.442-1.866c1.431-1.066 1.713-2.18 1.699-2.929c-.02-.938-.506-1.882-1.391-2.728c2.23-1.332 2.939-2.986 2.112-4.927"/>
        <ellipse cx="11.242" cy="42.42" fill="#ed307c" opacity=".48" rx="7.928" ry="6.462"/>
        <path fill="#ed307c" d="M60.65 43.24c0 3.571-3.549 6.462-7.927 6.462c-4.379 0-7.93-2.891-7.93-6.462c0-3.572 3.551-6.466 7.93-6.466c4.378 0 7.927 2.894 7.927 6.466" opacity=".48"/>
        <path fill="#633d19" d="M25.23 12.968c-5.951-.411-11.346 2.028-15.08 6.66c-1.622 2.01 1.223 4.89 2.86 2.86c3.134-3.887 7.215-5.822 12.221-5.475c2.605.179 2.588-3.867 0-4.045m14.079 0c5.95-.411 11.346 2.028 15.08 6.66c1.621 2.01-1.223 4.89-2.86 2.86c-3.134-3.887-7.215-5.822-12.221-5.475c-2.605.179-2.587-3.867 0-4.045M28.886 32.33c-.225 0-4.333-1.576-8.48-1.576c-3.705 0-7.442 1.576-8.481 1.576c-.9 0-1.236-1.043-.691-1.667c4.961-5.728 13.378-5.728 18.344 0c.541.624.205 1.667-.692 1.667m25.019 0c-.226 0-4.333-1.576-8.48-1.576c-3.705 0-7.441 1.576-8.48 1.576c-.9 0-1.236-1.043-.691-1.667c4.961-5.728 13.379-5.728 18.344 0c.54.624.204 1.667-.693 1.667"/>
    </svg>`,
    mobileMinify: false
  }
})
```

```ts [type]
interface CommentConfig extends GiscusConfig {
  /**
   * @default '评论'
   */
  label?: string
  /**
   * 自定义图标，SVG 格式
   * @recommend https://iconbuddy.app/search?q=fire
   */
  icon?: string
  /**
   * 移动端最小化按钮
   * @default true
   */
  mobileMinify?: boolean
}

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

![](https://img.cdn.sugarat.top/mdImg/sugar/4f5883d87e53fbea63b9231beed0d52f)

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
    style: 'sidebar',
    sort: 'date'
  }
})
```

```ts [example]
const blogTheme = getThemeConfig({
  recommend: {
    title: '🔍 推荐文章',
    nextText: '下一页',
    pageSize: 1,
    style: 'card',
    sort: 'filename' // 文件名排序
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
  /**
   * 自定义文章过滤
   */
  filter?: (page: Theme.PageData) => boolean
  /**
   * 自定义排序
   * @default 'date'
   */
  sort?: 'date' | 'filename' | ((a: Theme.PageData, b: Theme.PageData) => number)
  /**
   * 当没有推荐文章时的提示，设置为 false 则不展示
   * @default '暂无相关文章'
   */
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

通过 `sort` 属性可以自定义排序规则，默认按照时间排序`date`，例如按照文件名排序

:::code-group

```ts [文件名]
const blogTheme = getThemeConfig({
  recommend: {
    sort: 'filename'
  }
})
```

```ts [自定义排序]
const blogTheme = getThemeConfig({
  recommend: {
    sort(a, b) {
      return +new Date(b.meta.date) - +new Date(a.meta.date)
    },
  }
})
```

:::

## article

设置文章全局相关能力
::: code-group

```ts [default]
// 内置默认配置如下
const blogTheme = getThemeConfig({
  article: {
    /**
     * 是否展示文章的预计阅读时间
     */
    readingTime: true,
    /**
     * 是否隐藏文章页的封面展示
     */
    hiddenCover: false,
    /**
     * 阅读时间分析展示位置
     */
    readingTimePosition: 'inline'
  }
})
```

```ts [type]
interface ArticleConfig {
  readingTime?: boolean
  /**
   * 阅读时间分析展示位置
   * @default 'inline'
   */
  readingTimePosition?: 'inline' | 'newLine' | 'top'
  hiddenCover?: boolean
}
```

:::

![图片](https://img.cdn.sugarat.top/mdImg/MTY3NDkyMjAzNDEzOA==674922034138)

![](https://img.cdn.sugarat.top/mdImg/MTY4MjE3NDAzNzMxMw==682174037313)

不同配置效果
| top                                                                           | inline                                                                        | newLine                                                                       |
| ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| ![](https://img.cdn.sugarat.top/mdImg/sugar/21aa2571b60f76e7401b66af851009bb) | ![](https://img.cdn.sugarat.top/mdImg/sugar/5da6e5e56bde48265e706bc004e2ad41) | ![](https://img.cdn.sugarat.top/mdImg/sugar/50e9ec84b37af64f723c3b477b99283a) |

## srcDir

* Type: `string`
* Default: `.`

相对于项目根目录，文章所在位置，同 [App Configs #srcdir](https://vitepress.dev/config/app-configs#srcdir)

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

![](https://img.cdn.sugarat.top/mdImg/MTY3NDk5NDY3Nzc5NQ==674994677795)

::: code-group

```ts [example]
const blogTheme = getThemeConfig({
  popover: {
    title: '📢 广而周知 📢',
    duration: -1,
    mobileMinify: false,
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
  /**
   * 移动端自动最小化
   * @default false
   */
  mobileMinify?: boolean
  body?: BlogPopover.Value[]
  footer?: BlogPopover.Value[]
  /**
   * 手动重新打开
   */
  reopen?: boolean
  /**
   * 设置展示图标，svg
   * @recommend https://iconbuddy.app/search?q=fire
   */
  icon?: string
  /**
   * 设置关闭图标，svg
   * @recommend https://iconbuddy.app/search?q=fire
   */
  closeIcon?: string
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

公告图标也可使用 `icon`, `closeIcon` 进行自定义

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
      url: 'https://vitepress.dev/'
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

interface FriendConfig {
  list: FriendLink[]
  /**
   * 是否随机展示
   * @default false
   */
  random?: boolean
  /**
   * 是否限制展示数量（超出自动切换）
   */
  limit?: number
  /**
   * 滚动速度(ms)，设置为 0 不滚动直接截取
   * @default "动态计算"
   */
  scrollSpeed?: number
}
interface BlogConfig {
  friend?: FriendLink[] | FriendConfig
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

支持设置列表`展示数量`，`自动滚动`，`随机顺序`

![](https://img.cdn.sugarat.top/mdImg/MTcwMTc4NjIxMjY2MA==701786212660)

```ts
const blogTheme = getThemeConfig({
  friend: {
    list: [
      // 省略设置的友链
    ],
    // 开启顺序随机
    random: true,
    // 限制列表只展示 3 个
    limit: 3,
    // 自定义滚动速度（可选）
    // scrollSpeed: 10000
  },
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
参考 [Vue.js blog](https://github.com/vuejs/blog/tree/main) 基于 [jpmonette/feed](https://www.npmjs.com/package/feed) 实现，通过内置 [vitepress-plugin-rss](https://www.npmjs.com/package/vitepress-plugin-rss) 插件，支持灵活的配置
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
  renderExpect?: (fileContent: string, frontmatter: Record<string, any>) => string | Promise<string>
  /**
   * 限制输出文件包含的文章数量
   * @default 0
   * @description (0 不限制；> 1 会按照日期排序对输出内容进行调整)
   */
  limit?: number
  ariaLabel?: string
}

interface FeedOptions {
  id: string
  title: string
  updated?: Date
  generator?: string
  language?: string
  ttl?: number
  feed?: string
  feedLinks?: any
  hub?: string
  docs?: string
  author?: Author
  link?: string
  description?: string
  image?: string
  favicon?: string
  copyright: string
}
```

![](https://img.cdn.sugarat.top/mdImg/MTY5MTkyODAxMDEwMQ==691928010101)

:::warning 特别提示
你也可以使用单独的插件 [vitepress-plugin-rss](https://www.npmjs.com/package/vitepress-plugin-rss) 来添加同样的能力，其支持更加丰富的定制。

如果需要同时生成多个 RSS 订阅配置文件，也可多次重复配置这个插件。

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
type ThemeColor = 'vp-default' | 'vp-green' | 'vp-yellow' | 'vp-red' | 'el-blue' | 'el-yellow' | 'el-green' | 'el-red'
```

:::

|                               vp-default                                |                                vp-green                                 |                                 el-blue                                 |
| :---------------------------------------------------------------------: | :---------------------------------------------------------------------: | :---------------------------------------------------------------------: |
| ![](https://img.cdn.sugarat.top/mdImg/MTY5NDM1NTU5Nzg4MA==694355597880) | ![](https://img.cdn.sugarat.top/mdImg/MTY5NDM1NTYxOTE4OQ==694355619189) | ![](https://img.cdn.sugarat.top/mdImg/MTY5NDM1NTY5MTk0Nw==694355691947) |

<ChangeThemeDemo />

## footer

* Type: `Footer | Footer[]`

设置首页页脚的内容（可用于设置版权，备案信息，自定义内容等）

![](https://img.cdn.sugarat.top/mdImg/MTY5NTU0NTUxMTUxNA==695545511514)

::: code-group

```ts [example]
const blogTheme = getThemeConfig({
  footer: {
    version: true,
    copyright: 'MIT License | 粥里有勺糖'
  }
})
```

```ts [type]
interface Footer {
  /**
   * 自定义补充信息（支持配置为HTML）
   */
  message?: string | string[]
  /**
   * 是否展示主题版本信息
   */
  version?: boolean
  /**
   * copyright
   */
  copyright?: string | {
    message: string
    link: string
    icon?: boolean | string
  }
  /**
   * ICP 备案信息
   */
  icpRecord?: {
    name: string
    link: string
    icon?: boolean | string
  }
  /**
   * 公安备案信息
   */
  securityRecord?: {
    name: string
    link: string
    icon?: boolean | string
  }
}
```

:::

下面是一个较完整例子

![](https://img.cdn.sugarat.top/mdImg/MTY5NTU0NTkwMTk1OA==695545901958)

```ts
const blogTheme = getThemeConfig({
  footer: {
    message: '下面 的内容和图标都是可以修改的噢（当然本条内容也是可以隐藏的，也可以配置为HTML）',
    copyright: 'MIT License | 粥里有勺糖',
    icpRecord: {
      name: '蜀ICP备19011724号',
      link: 'https://beian.miit.gov.cn/'
    },
    securityRecord: {
      name: '公网安备xxxxx',
      link: 'https://www.beian.gov.cn/portal/index.do'
    },
  }
})
```

不想显示主题版本也可主动关闭(不过还是希望大家展示 😄)

```ts
const blogTheme = getThemeConfig({
  footer: {
    version: false
  }
})
```

自定义 icon 也是可以的

![](https://img.cdn.sugarat.top/mdImg/MTY5NTU0NjQwNDE2MQ==695546404161)

```ts
const blogTheme = getThemeConfig({
  footer: {
    copyright: {
      message: '自定义SVG图标',
      icon: `<svg width="128" height="128" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <g fill="none">
          <path fill="#FF822D" d="M13.638 3.202a2.936 2.936 0 0 1 4.724 0a2.936 2.936 0 0 0 3.25 1.055a2.936 2.936 0 0 1 3.822 2.778a2.936 2.936 0 0 0 2.008 2.763a2.936 2.936 0 0 1 1.46 4.494a2.936 2.936 0 0 0 0 3.416a2.936 2.936 0 0 1-1.46 4.494a2.936 2.936 0 0 0-2.008 2.763a2.936 2.936 0 0 1-3.823 2.778a2.936 2.936 0 0 0-3.249 1.055a2.936 2.936 0 0 1-4.724 0a2.936 2.936 0 0 0-3.25-1.055a2.936 2.936 0 0 1-3.822-2.778a2.936 2.936 0 0 0-2.008-2.763a2.936 2.936 0 0 1-1.46-4.494a2.936 2.936 0 0 0 0-3.416a2.936 2.936 0 0 1 1.46-4.494a2.936 2.936 0 0 0 2.008-2.763a2.936 2.936 0 0 1 3.823-2.778a2.936 2.936 0 0 0 3.249-1.055Z"/>
          <path fill="#FCD53F" d="M25.062 21.232c-2.89 5.005-9.29 6.72-14.294 3.83c-5.005-2.89-6.72-9.29-3.83-14.294c2.89-5.005 9.29-6.72 14.294-3.83c5.005 2.89 6.72 9.29 3.83 14.294Z"/>
      </g>
  </svg>`
    },
    icpRecord: {
      name: '自定义 img 图标',
      icon: '<img src="/logo.png"/>',
      link: 'https://beian.miit.gov.cn/'
    },
  }
})
```

footer（ message 字段也支持） 支持配置为数组，可以用于灵活设置底部信息的布局

```ts
const blogTheme = getThemeConfig({
  footer: [{
    message: '下面 的内容和图标都是可以修改的噢（当然本条内容也是可以隐藏的）',
    copyright: 'MIT License | 粥里有勺糖',
  }, {
    message: ['自定义多条内容', '自定义多条内容'],
    copyright: 'MIT License | 粥里有勺糖',
    version: true
  }, {
    version: false,
    icpRecord: {
      name: '蜀ICP备19011724号',
      link: 'https://beian.miit.gov.cn/'
    },
    securityRecord: {
      name: '公网安备xxxxx',
      link: 'https://www.beian.gov.cn/portal/index.do'
    },
  }]
})
```

![](https://img.cdn.sugarat.top/mdImg/MTY5NjE1NDYyMjI3NQ==696154622275)

## docMetaInsert

主要是指

* `docMetaInsertSelector`：可配配置 CSS 选择器 (`querySelector` 可解析即可)
  * type: `string`
  * default: `'h1'`
* `docMetaInsertPosition`
  * type: `'before' | 'after'`
  * default: `'after'`

两者配合设置 `作者，标签，时间等` 信息区块的展示位置

![](https://img.cdn.sugarat.top/mdImg/MTcwNDI5MTUyMTAwMg==704291521002)

::: code-group

```ts [默认值]
const blogTheme = getThemeConfig({
  docMetaInsertSelector: 'h1',
  docMetaInsertPosition: 'after'
})
```

:::

同样可以在文章的 forntmatter 里设置，优先级高于全局的配置

```md
---
docMetaInsertSelector: 'h1'
docMetaInsertPosition: 'after'
---
```

修改示例：插入到文章最前面

```ts
const blogTheme = getThemeConfig({
  docMetaInsertSelector: 'div.content-container',
  docMetaInsertPosition: 'before'
})
```

![](https://img.cdn.sugarat.top/mdImg/MTcwNDM0NjAxNjg3NQ==704346016875)

## backToTop

设置回到顶部，默认开启

* type: `boolean|BackToTop`
* default: `true`

![](https://img.cdn.sugarat.top/mdImg/sugar/258187044dcf166044e722f879317e14)

:::code-group

```ts [example]
const blogTheme = getThemeConfig({
  backToTop: true
})

const blogTheme = getThemeConfig({
  backToTop: {
    // 自定义触发高度
    top: 450,
    // 自定义图标
    icon: ''
  }
})
```

```ts [type]
interface BackToTop {
  /**
   * 距离顶部多少距离出现
   * @default 450
   */
  top?: number

  /**
   * 设置展示图标，svg
   * @recommend https://iconbuddy.app/search?q=fire
   */
  icon?: string
}
```

:::

---
description: 详细介绍主题提供的全局能力
title: 🔧 主题配置 - 全局
readingTime: false
---

# 全局配置
全局配置通常是 添加到 `.vitepress/config.ts`文件中

默认配置如下
```ts
import { getThemeConfig, defineConfig } from '@sugarat/theme/node'

const blogTheme = getThemeConfig()

export default defineConfig({
  themeConfig: {
    ...blogTheme
  }
})
```

本主题的拓展配置都在`getThemeConfig`方法中

下面是简单示例 **关闭主题自带搜索**
```ts
import { getThemeConfig, defineConfig } from '@sugarat/theme/node'

const blogTheme = getThemeConfig({ // [!code focus]
  search: false // [!code focus]
}) // [!code focus]

export default defineConfig({
  themeConfig: {
    ...blogTheme
  }
})
```
![](https://img.cdn.sugarat.top/mdImg/MTY3NDkyMDQ0OTg1Ng==674920449856)

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
    pageSize: 1
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
* Type: `boolean`
* Default: `true`

控制是否启用主题自带的搜索功能
```ts
const blogTheme = getThemeConfig({
  search: false
})
```

![图片](https://img.cdn.sugarat.top/mdImg/MTY3NDkyMDQ0OTg1Ng==674920449856)

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
* Type: `RecommendArticle`
* Default
```ts
const blogTheme = getThemeConfig({
  recommend: {
    title: '🔍 相关文章',
    nextText: '换一组',
    pageSize: 9,
    empty: '暂无推荐文章'
  }
})
```
用于控制推荐文章的展示卡片
```ts
const blogTheme = getThemeConfig({
  recommend: {
    title: '🔍 推荐文章',
    nextText: '下一页',
    pageSize: 1
  }
})
```
![图片](https://img.cdn.sugarat.top/mdImg/MTY3NDkyMTI2MDQyNQ==674921260425)

```ts
interface RecommendArticle {
  title?: string
  pageSize?: number
  nextText?: string
  empty?: string | boolean
}
```
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
  }
})
```

```ts [type]
interface ArticleConfig {
  readingTime?: boolean
}
```

:::

![图片](https://img.cdn.sugarat.top/mdImg/MTY3NDkyMjAzNDEzOA==674922034138)

## srcDir
* Type: `string`
* Default: `.`

相对于项目根目录，文章所在位置，同 [App Configs #srcdir](https://vitepress.vuejs.org/config/app-configs#srcdir)

**通常情况下无需设置**，默认从 CLI 指令取值 `vitepress dev docs`

等价于
```ts
const blogTheme = getThemeConfig({
  srcDir: './docs'
})
```


---
description: 详细介绍首页&文章相关的各个配置项
title: 🔧 主题配置 - 首页&文章
readingTime: false
outline: [2,3]
tag:
 - 配置
top: 3
recommend: 1
---

# 主题配置
这里将配置分成了2块 
* `home`：首页的独立配置
* `Article`：单篇文章独立配置

:::tip
主题继承[默认主题配置](https://vitepress.dev/reference/site-config)，即原主题配置依然生效

官方内置的👉🏻 [markdown 能力](https://vitepress.dev/guide/markdown) 👈🏻
:::

:::details 主题相关的 `frontmatter` 汇总
```ts
const frontmatter = ['layout', 'blog', 'title', 'description', 'descriptionHTML', 'cover', 'hiddenCover', 'hidden', 'author', 'readingTime', 'comment', 'date', 'tag', 'tags', 'categories', 'sticky', 'top', 'recommend', 'publish', 'buttonAfterArticle']
```

对照表
|        属性        |         描述         |
| :----------------: | :------------------: |
|       layout       |         布局         |
|        blog        |       博客首页       |
|       title        |         标题         |
|    description     |         描述         |
|  descriptionHTML   |       描述HTML       |
|       cover        |         封面         |
|    hiddenCover     |       隐藏封面       |
|       hidden       |     隐藏首页展示     |
|       author       |         作者         |
|    readingTime     |       阅读时间       |
|      comment       |         评论         |
|        date        |         日期         |
|        tag         |         标签         |
|        tags        |        同标签        |
|     categories     |        同标签        |
|       sticky       |       精选置顶       |
|        top         |       首页置顶       |
|     recommend      |     推荐列表控制     |
|      publish       |       是否发布       |
| buttonAfterArticle | 文章底部引导操作按钮 |
:::
## Home
### layout
主要针对主页的部分内容调整

首先需要指定`layout`为`home`，通常会对 入口的`/index.md` 进行配置
```md
---
layout: home
---
```
配完这个之后，首页样式就有了，如下图所示

![图片](https://img.cdn.sugarat.top/mdImg/MTY3MzE4MDM5ODQ3MQ==673180398471)


### blog
设置首页的博客样式文案
::: code-group

```md [Frontmatter]
---
layout: home
blog:
 # 设置首页的 banner 信息
 name: '@sugarat/theme'
 motto: 粥里有勺糖的博客主题
 inspiring: 基于 Vitepress 定制的主题🎨
 # 设置首页列表每页展示数量
 pageSize: 2

 # 设置头像分离展示模式
 # avatarMode: split

 # 移动端隐藏头部头像展示
 # minScreenAvatar: false
---
```

```ts [type]
interface HomeBlog {
  name?: string
  motto?: string
  inspiring?: string | string[]
  inspiringTimeout?: number
  pageSize?: number
  author?: string
  logo?: string
  /**
   * @default 'card'
   */
  avatarMode?: 'card' | 'split'
  /**
   * @default true
   */
  minScreenAvatar?: boolean
  /**
   * 首页数据分析卡片
   */
  analysis?: HomeAnalysis
}
interface HomeAnalysis {
  articles?: {
    title?: string[]
  }
}
```

:::

对应效果如下

![图片](https://img.cdn.sugarat.top/mdImg/MTY3MzE4MDczMzQ2OQ==673180733469)

![图片](https://img.cdn.sugarat.top/mdImg/MTY3NDkyMDIwMzE5MQ==674920203192)

![](https://img.cdn.sugarat.top/mdImg/MTY5NTQ3MTc4NjYzMA==695471786630)

其中`inspiring`可以是一个数组，点击的时候就会按照设定顺序切换

```md
---
# 省略其它配置
blog:
 name: '@sugarat/theme'
 motto: 粥里有勺糖的博客主题
 inspiring:
  - 基于 Vitepress 定制的主题🎨
  - 千万不要因为走得太久，而忘记了我们为什么出发
  - 人生就像一场修行，你不可能一开始就修成正果
---
```

![](https://img.cdn.sugarat.top/mdImg/MTY4OTQ5NjEyMDIxMg==689496120212)

也可以设置`inspiringTimeout`，实现自动切换

```md
---
blog:
 # 省略其它配置
 inspiringTimeout: 1000
---
```

![](https://img.cdn.sugarat.top/mdImg/MTY4OTQ5NjQxNDA3Nw==689496414077)

通过设置 `author` 和 `logo` 可以重载（最高优先级）右侧的作者名和头像信息

:::code-group
```md [配置示例]
---
blog:
 # 设置作者信息
 author: Sugar
 logo: /logo.png
---
```

```ts [生效优先级]
const author = computed(() =>
  frontmatter.value.author
  ?? frontmatter.value?.blog?.author
  ?? home?.author
  ?? site.value.themeConfig?.blog?.author
)
const logo = computed(() =>
  frontmatter.value.logo
  ?? frontmatter.value?.blog?.logo
  ?? home?.logo
  ?? site.value.themeConfig.logo
)
```
:::

设置展示风格`avatarMode`
```md
---
blog:
 avatarMode: split
---
```
|                               card(默认)                                |                                    split                                    |
| :---------------------------------------------------------------------: | :-------------------------------------------------------------------------: |
| ![](https://img.cdn.sugarat.top/mdImg/MTY5NjE1NTk3MjkxMQ==696155972911) | ![](https://img.cdn.sugarat.top/mdImg/MTY5NTUyMjY1MjA1Nw==theme-avatar.gif) |

移动端隐藏头部头像展示`minScreenAvatar`
```md
---
blog:
 minScreenAvatar: true
---
```
|                      minScreenAvatar: true (默认)                       |                         minScreenAvatar: false                          |
| :---------------------------------------------------------------------: | :---------------------------------------------------------------------: |
| ![](https://img.cdn.sugarat.top/mdImg/MTY5NjE2MjE0MTI5Mw==696162141293) | ![](https://img.cdn.sugarat.top/mdImg/MTY5NjE2MjE4NjM3MQ==696162186371) |

文章数据卡片标题修改
```md
---
layout: home
blog:
 # 文章数据分析卡片标题定义
 analysis: 
  articles: 
    title: ['博客文章', '月更新', '周更新']
---
```

![](https://cdn.upyun.sugarat.top/mdImg/sugar/8128001649cb35413a0575b2749b8099)

## Article
### title
用于设置文章在首页卡片列表里展示的 `标题`

例如`changelog.md`有如下内容
```md
---
title: 更新日志
---

# Changelog
```
在首页就会有如下展示

![图片](https://img.cdn.sugarat.top/mdImg/MTY3MzE4MTE0MDEyNg==673181140126)

不设置情况下默认取一级标题 `# 一级标题`

### description

用于设置文章在首页卡片列表里展示的 `描述信息`

例如`about.md`有如下内容

```md
---
description: 简单介绍主题的由来和实现原理
---

# 关于主题

基于 [vitepress](https://vitepress.dev/) 的自定义主题实现
```

在首页就会有如下展示

![图片](https://img.cdn.sugarat.top/mdImg/MTY3MzE4MTQ1NDA2NA==673181454064)

不设置的情况下，默认取文章内容的前100个字符

![图片](https://img.cdn.sugarat.top/mdImg/MTY3MzE4MTUyMTExOQ==673181521119)

### descriptionHTML

使用自定义的HTML内容设置文章在首页卡片列表里展示的 `描述信息`

```md
---
descriptionHTML: '
<span style="color:var(--description-font-color);">1分钟内完成自己的博客创建</span>
<pre style="background-color: #292b30; padding: 15px; border-radius: 10px;" class="shiki material-theme-palenight"><code>
    <span class="line"><span style="color:#FFCB6B;">npm</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">create</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">@sugarat/theme@latest</span></span>
</code>
</pre>'
---
```

![](https://img.cdn.sugarat.top/mdImg/MTY4OTQzMTQyMzE1MA==689431423150)

### cover
* Type: `string|false`

用于设置文章在首页卡片列表里展示的 `封面信息`
::: code-group
```md [① 设置封面]
---
cover: https://img.cdn.sugarat.top/mdImg/MTY3MzE0Njg5NDY4OQ==673146894689
---
```

```md [② 不展示封面]
---
cover: false
---
```
:::

![图片](https://img.cdn.sugarat.top/mdImg/MTY3MzE4NTk3MDM3OQ==673185970379)

未指定时，默认取文章中出现的第一张图片

同时如果手动设置了，封面将同时在文章页展示

![](https://img.cdn.sugarat.top/mdImg/MTY4MjE3NDAzNzMxMw==682174037313)

可以通过下面的 `hiddenCover` 隐藏文章页的展示

### hiddenCover
`hiddenCover` 控制是否展示当前文章的封面，全局配置开关见 [article.hiddenCover](./global.md#article)
```md
---
hiddenCover: true 
cover: url
---
```

如果`hiddenCover`为 true 则不会在文章页展示上述的封面

### hidden

用于设置文章是否出现在首页的列表里

```md
---
hidden: true
---
```
比如设置在`changelog.md`里，首页将不会展示此项

![图片](https://img.cdn.sugarat.top/mdImg/MTY3MzE4MTcwMDU4MQ==673181700581)

### author

用于单独设置文章的作者信息

```md
---
author: 粥里有勺糖
---
```

在首页的展示样式

![图片](https://img.cdn.sugarat.top/mdImg/MTY3MzE4MjAxOTgxNg==673182019816)

在文章顶部展示的样式

![图片](https://img.cdn.sugarat.top/mdImg/MTY3MzE4MjA0ODcxMA==673182048710)

如果没有单独设置则会默认使用全局的 `author` 配置，这个在 [全局配置: author](./global.md#author) 有介绍

### readingTime
单独设置是否展示文章的预计阅读时间，全局配置开关见 [article.readingTime](./global.md#article)

```md
---
readingTime: true
---
```

![图片](https://img.cdn.sugarat.top/mdImg/MTY3NDkyMjAzNDEzOA==674922034138)

### comment
单独为某篇文章设置是否开启评论

```md
---
# 关闭评论
comment: false
---
```

### date
* type：`string | false`

单独设置文章的发布时间，不设置的情况下默认会通过`Git`取文件最后修改时间，设置为 `false` 则不会在文章页展示

```md
---
date: 2023-01-04
---
```

![图片](https://img.cdn.sugarat.top/mdImg/MTY3MzE4MjMxNjc5Ng==673182316796)

```md
---
date: 2023-01-08 20:00:00
---
```

![图片](https://img.cdn.sugarat.top/mdImg/MTY3MzE4MzIxNzEwOQ==673183217109)

展示规则，实现代码见：[packages/theme/src/utils/index.ts](https://github.com/ATQQ/sugar-blog/blob/1758bffebd8529dbec860f531de126410a422795/packages/theme/src/utils/index.ts#L41-L64)
* 小于1分钟：xx秒前
* 小于1小时：xx分钟前
* 小于1天：xx小时前
* 小于1周：xx天前
* 其它：按照实际时间展示 `yyyy-MM-dd`

```md
---
date: false
---
```

![](https://img.cdn.sugarat.top/mdImg/MTY4MjE3NTQwODI4MA==682175408280)

### tag
用于按标签给文章分类，同时，在文章页标签可点击跳转

```md
---
tag:
 - 日志
tags:
 - 信息
categories:
 - 测试分类
---
```

![图片](https://img.cdn.sugarat.top/mdImg/MTY3MzE4NTY0MTI2Nw==673185641267)

![](https://img.cdn.sugarat.top/mdImg/MTY4MjE3NTE3NjgyNg==682175176826)
### tags
效果同上
### categories
效果同上

### sticky
用于设置在首页展示的 `精选文章`，值越大展示越靠前

```md
---
sticky: 1
---
```

![图片](https://img.cdn.sugarat.top/mdImg/MTY3NDkxMDA0NzU5MQ==674910047591)

### top
* type: `number`

用于设置在首页置顶展示的文章，从 1 开始，值越小越靠前

```md
---
top: 1
---
```

![](https://img.cdn.sugarat.top/mdImg/MTY3NzA3ODA4MDM5NA==677078080394)

### recommend
* type: `number | false | string | string[] | [...string[], number]`

可用于配置左侧推荐列表数据表现，默认只展示同级目录下的文章
* 文章左侧展示的 `推荐文章` 顺序（越小越靠前）
* 在推荐列表中隐藏掉不展示
* 手动关联不同目录的文章进行展现

:::code-group
```md [① 只调整顺序]
---
recommend: 1
---
```

```md [② 在列表中隐藏]
---
recommend: false
---
```

```md [③ 关联不同目录的文章]
---
# 直接设置文章的关键词
recommend: 'Node.js'
# 设置多个关键词
recommend: ['Node.js', 'css', 'html']
# 设置关键词并设置顺序
recommend: ['Node.js', 'css', 'html', 1]
---
```
:::

| 手动设置顺序                                                            | 隐藏                                                                    | 自定义关联                                                                    |
| ----------------------------------------------------------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| ![](https://img.cdn.sugarat.top/mdImg/MTY3NzI0NTYyNDEyOA==677245624128) | ![](https://img.cdn.sugarat.top/mdImg/MTY3NzI0NjQ2NzIyNA==677246467224) | ![](https://img.cdn.sugarat.top/mdImg/sugar/21db9f87e7b64958dad2c24ed94e40d3) |


### publish
* type: `false`

表明文章是否发布，用于设置文章是否出现在首页和侧边栏里

```md
---
publish: false
---
```
等价于
```md
---
hidden: true
recommend: false
---
```


比如设置在`changelog.md`里，首页将不会展示此项

![图片](https://img.cdn.sugarat.top/mdImg/MTY3MzE4MTcwMDU4MQ==673181700581)

同时，左侧边栏也不会展示

### buttonAfterArticle
* Type: `false | ButtonAfterArticleConfig`

用于单独控制某篇文章底部按钮，点击按钮会在按钮下方渲染一个自定义的html内容，例如可以用来做赞赏按钮，内置了 `wechatPay` 和 `aliPay` 两个图标，也可自定义图标(svg)。

```yaml
---
buttonAfterArticle:
  openTitle: 投币
  closeTitle: 下次一定
  content: '<img src="https://img.cdn.sugarat.top/mdImg/MTY0Nzc1NTYyOTE5Mw==647755629193">'
  icon: aliPay
  # size: small
  # expand: true
---
```

![](https://img.cdn.sugarat.top/mdImg/sugar/4d429bea65b8840f5cfda875fac50926)

也支持在全局设置，对所有页面都生效。
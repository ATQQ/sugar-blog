---
description: 详细介绍首页&文章相关的各个配置项
title: 🔧 主题配置 - 首页&文章
---

# 主题配置
这里将配置分成了2类 
* `home`：首页的独立配置
* `article`：单篇文章独立配置

## layout <Badge type="tip" text="home" />
主要针对主页的部分内容调整

首先需要指定`layout`为`home`，通常会对 入口的`/index.md` 进行配置
```md
---
layout: home
---
```
配完这个之后，首页样式就有了，如下图所示

![图片](https://img.cdn.sugarat.top/mdImg/MTY3MzE4MDM5ODQ3MQ==673180398471)


## blog <Badge type="tip" text="home" />
设置首页的 banner 信息

```md
---
blog:
 name: '@sugarat/theme'
 motto: 粥里有勺糖的博客主题
 inspiring: 基于 Vitepress 定制的主题🎨
---
```

对应效果如下

![图片](https://img.cdn.sugarat.top/mdImg/MTY3MzE4MDczMzQ2OQ==673180733469)

## title <Badge type="warning" text="article" />
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

## description <Badge type="warning" text="article" />

用于设置文章在首页卡片列表里展示的 `描述信息`

例如`about.md`有如下内容

```md
---
description: 简单介绍主题的由来和实现原理
---

# 关于主题

基于 [vitepress](https://vitepress.vuejs.org/) 的自定义主题实现
```

在首页就会有如下展示

![图片](https://img.cdn.sugarat.top/mdImg/MTY3MzE4MTQ1NDA2NA==673181454064)

不设置的情况下，默认取文章内容的前100个字符

![图片](https://img.cdn.sugarat.top/mdImg/MTY3MzE4MTUyMTExOQ==673181521119)

## cover <Badge type="warning" text="article" />
用于设置文章在首页卡片列表里展示的 `封面信息`
```md
---
cover: https://img.cdn.sugarat.top/mdImg/MTY3MzE0Njg5NDY4OQ==673146894689
---
```

![图片](https://img.cdn.sugarat.top/mdImg/MTY3MzE4NTk3MDM3OQ==673185970379)

未指定时，默认取文章中出现的第一张图片

## hidden <Badge type="warning" text="article" />

用于设置文章是否出现在首页的列表里

```md
---
hidden: true
---
```
比如设置在`changelog.md`里，首页将不会展示此项

![图片](https://img.cdn.sugarat.top/mdImg/MTY3MzE4MTcwMDU4MQ==673181700581)

## author <Badge type="warning" text="article" />

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

如果没有单独设置则会默认使用全局的 `author` 配置，这个在后面会有介绍

## date <Badge type="warning" text="article" />
单独设置文章的发布时间，不设置的情况下默认会通过`Git`取记录的文件最后修改时间

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

## tag <Badge type="warning" text="article" />
用于按标签给文章分类

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

## tags <Badge type="warning" text="article" />
效果同上
## categories <Badge type="warning" text="article" />
效果同上
---
top: 2
sidebar: false
description: 主题在近1年多的时间里集成了非常的多功能了，接下来计划将这些能力拆分成组件，以便于更方便的与其它主题集成。 
---

# 🚀 VitePress 插件开发计划

## 前言

主题在近1年多的时间里集成了非常的多功能了，如 通知消息，公告，评论，图片预览，阅读时间分析 等等基础功能，有许多的用户反馈说能不能把这些能力独立成插件，以便于集成进现有的文档站中。

当然我自己也一直有这个想法，于是便有了这个文章来记录一下这个过程，同时抛出&探讨一些问题。

## 现有的一些问题

1. 生态缺少一个官方维护的 [awesome-vitepress](https://github.com/logicspark/awesome-vitepress-v1?tab=readme-ov-file) 来聚合 VitePress 相关的周边。
2. VitePress 本身并不提供插件机制去拓展各个部分，提供的是一套[主题方案](https://vitepress.dev/zh/guide/custom-theme)（重写布局+通用插槽），编写插件需按 Vite 的插件机制去实现。
3. 主题有部分功能 和 element-ui 绑定在一起，拆分的时候部分需要考虑再手写一遍。

## 计划
3 步走：

1. 摸索出 VitePress 在 Vite 的插件机制下提供的上下文，看看哪些口子可以用来做拓展。
2. 以全局公告/文章评论/图片预览3个场景的插件的开发入手，整理出较通用的 VitePress 插件开发实践方案。
3. 逐步拆分博客主题中的通用能力为独立插件。

## 已拆分插件
### [vitepress-plugin-pagefind](https://www.npmjs.com/package/vitepress-plugin-pagefind)
* 基于 [pagefind](https://www.npmjs.com/package/pagefind) 提供离线化的全文搜索功能。

### [vitepress-plugin-rss](https://www.npmjs.com/package/vitepress-plugin-rss)
* 基于 [feed](https://www.npmjs.com/package/feed) 提供 RSS 订阅链接生成功能。

### [vitepress-plugin-51la](https://www.npmjs.com/package/vitepress-plugin-51la)
* 提供一键接入 [51.LA](https://v6.51.la/) 网站数据统计分析的功能。

## 规划中的插件
* 公告
* 评论
* 图片预览
* 标签页
* 文章时间轴
* 代码块折叠
* OhMyLive2D
* 回到顶部
* 文章底部投币
* 短链
* 文章右下二维码分享
* ...

## 最后

如果读者有其它建议或者想法可以私信或评论区交流。
---
sticky: 1
date: 2023-02-5 14:00:00
sidebar: false
---
# 关于主题

简约风的 Vitepress 博客主题，基于 [vitepress](https://vitepress.dev/) 的自定义主题实现

## 为什么做了这个
笔者的博客之前是使用 [VuePress](https://vuepress.vuejs.org/) + [reco主题](https://vuepress-theme-reco.recoluan.com/)

随着博客文章数量越来越多（md文件已经300+了），博客本地启动和构建越来越来慢了emmm

当然使用频率最高的就是本地启动，构建是个相对比较低频的动作。

恰好此时 [VitePress](https://vitepress.dev/) 也比较成熟了（alpha），相比 VuePress 更加的简洁，可玩性强，上手成本也低。

按照官方的给的定位，VitePress 主打是主题（个人感觉就像[Hexo](https://hexo.io/zh-cn/)丰富多彩的主题一样），不提供插件系统

![](https://img.cdn.sugarat.top/mdImg/MTY3NTU3MjY0MjgzNQ==675572642835)

在笔者进行博客迁移的时候，将主题分离了出来，可供单独使用

新旧对比

![新旧博客对比](https://img.cdn.sugarat.top/mdImg/MTY3NTU3NDk0OTI2Ng==675574949266)

风格借鉴了 [reco](https://vuepress-theme-reco.recoluan.com/) ，[掘金](https://juejin.cn/)，[surmon](https://surmon.me/)等等，组件部分用了 [element-plus](https://element-plus.gitee.io/zh-CN/)


## 已支持功能
介绍一下主要的，非所有

* 博客首页
* 文章列表
* 精选文章
* 友链
* 标签分类
* 图片预览
* 搜索（基于[pagefind](https://github.com/cloudcannon/pagefind)支持离线全文搜索）
* [giscus](https://giscus.app/zh-CN)驱动的评论系统
* 推荐文章（类似文章目录）
* 阅读时间计算
* 全局的提示弹窗 (由 el-alert 驱动)
* 全局的公告弹窗，支持设置图片，文字，按钮
* 作品聚合页（为个人作品提供一个展示）
* tabs（[vitepress-plugin-tabs](https://vitepress-plugins.sapphi.red/tabs/)）
* 流程图（[vitepress-plugin-mermaid](https://github.com/emersonbottero/vitepress-plugin-mermaid#readme)）
* RSS
* 主题色统一
* 更多可定制的主题样式

## 规划中功能

转到 [🥔 TODO](./todo.md) 列表

## 参考项目
或多或少借鉴&使用了如下的一下开源项目，博客，网站的能力或者UI样式

* [reco](https://vuepress-theme-reco.recoluan.com/)
* [掘金](https://juejin.cn/)
* [surmon](https://surmon.me/) 
* [@vue/theme](https://github.com/vuejs/theme)
* [vitest](https://vitest.dev/)
* [element-plus](https://element-plus.gitee.io/zh-CN/)
* [charles7c.github.io](https://github.com/Charles7c/charles7c.github.io)
* [vitepress-blog-zaun](https://github.com/clark-cui/vitepress-blog-zaun)
* [vuejs/blog](https://github.com/vuejs/blog/tree/main)
* [列表无限滚动轮播效果](https://code.juejin.cn/pen/7145007064350195748)

## 贡献者们

感谢所有贡献过代码的 [开发者](https://github.com/ATQQ/sugar-blog/graphs/contributors)。

<a target="_blank" href="https://github.com/atqq/sugar-blog/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=atqq/sugar-blog" />
</a>

## 主题相关资源
* 主题地址：https://theme.sugarat.top/
* 主题包：[@sugarat/theme](https://www.npmjs.com/package/@sugarat/theme)
* 项目地址：https://github.com/ATQQ/sugar-blog/tree/master/packages/theme
* 作者博客地址：https://sugarat.top


## 最后
如果你有建议的 功能&想法 欢迎 私信&评论区 交流

如果你觉得主题不错，欢迎分享与使用，可以在评论区留下你的网站地址

笔者后续会单独开个板块展示大家优秀的博客，感谢大家的支持
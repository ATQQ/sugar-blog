---
tags:
  - 个人作品
  - VitePress
categories:
  - 技术笔记
description: 把 Vibe 作品收进一个站点：基于 VitePress 的作品集模板。
---

# 做了一个Vibe作品集网站模板

之前做的东西散落在博客、GitHub 和一些独立介绍站点，现在 VibeCoding 越来越频多，工具啥的造得越来越多。

索性弄一个作品集站点，把散落的作品全部收在一块，部分纯静态工具的也可以直接内置，管理起来方便一些，不用频繁的新开二级域名挂载。

线上站点：<https://vibework.sugarat.top>

![](https://vibework.sugarat.top/covers/vibe-works.png)

## 特点

- 基于 VitePress 的模板，扩展方便（使用 Vue），不强依赖后端，SSG 访问速度快
- 新增作品只需要新增 Markdown 即可
- 深色模式、移动端适配、使用 Naive UI

## 用起来

```bash
pnpm create @sugarat/vibework-theme my-site
cd my-site
pnpm install
pnpm dev
```

新增作品只要在 `works/` 下加一份 Markdown。

## 链接

- 线上站点：<https://vibework.sugarat.top>
- 项目仓库：<https://github.com/ATQQ/vibe-works>
- 主题包：[@sugarat/vitepress-theme-vibework](https://www.npmjs.com/package/@sugarat/vitepress-theme-vibework)
- 脚手架：[@sugarat/create-vibework-theme](https://www.npmjs.com/package/@sugarat/create-vibework-theme)

---
sticky: 999
description: 1分钟内完成自己的博客创建
tag:
 - SOP
top: 2
sidebar: false
---

# 快速上手
1分钟内完成自己的博客创建

## 初始化项目 
① 拉取 Github 模板
```sh
npx degit ATQQ/sugar-blog/packages/template my-blog-demo
```
```sh
cd my-blog-demo
```

:::tip 执行 degit, 可能会遇到的问题
* `zlib: unexpected end of file:` clearing the cache folder (rm -rf ~/.degit)
:::

② 安装依赖
::: code-group

```sh [pnpm]
pnpm install
```

```sh [安装 PNPM]
# 如果你没有 PNPM 请先安装
npm i -g pnpm
```
:::

③ 开发启动
```sh
pnpm dev
```

你就会得到一个这样的页面

![](https://img.cdn.sugarat.top/mdImg/MTY3Njk4OTk2Mjc0Nw==676989962747)

④ 构建产物
```sh
pnpm build
```

⑤ 预览构建产物
```sh
pnpm serve
```

## 升级

如果主题更新了，升级主题，原项目只需执行如下指令即可
```sh
pnpm up @sugarat/theme
```

## 更多
* [主题配置：首页&文章](./../config/frontmatter.md) - 主题提供的一些 `frontmatter`
* [主题配置：全局](./../config/global.md) - 主题提供的额外能力
* [主题配置：样式](./../config/style.md) - 自定义博客样式介绍
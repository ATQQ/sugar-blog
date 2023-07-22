---
sticky: 999
description: 1分钟内完成自己的博客创建
descriptionHTML: '
<span style="color:var(--description-font-color);">1分钟内完成自己的博客创建</span>
<pre style="background-color: #292b30; padding: 15px; border-radius: 10px;" class="shiki material-theme-palenight"><code>
    <span class="line"><span style="color:#FFCB6B;">npm</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">create</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">@sugarat/theme@latest</span></span>
</code>
</pre>'
tag:
 - SOP
top: 1
sidebar: false
---

# 快速上手
1分钟内完成自己的博客创建

## 快速创建项目 
使用 [@sugarat/create-theme](https://github.com/ATQQ/sugar-blog/tree/master/packages/create-theme) 快速创建模板项目

:::code-group
```sh [npm]
npm create @sugarat/theme@latest
```
```sh [yarn]
yarn create @sugarat/theme
```
```sh [pnpm]
pnpm create @sugarat/theme
```
:::

当然你也可以自定义项目名创建
:::code-group
```sh [npm]
npm create @sugarat/theme@latest my-first-blog
```
```sh [yarn]
yarn create @sugarat/theme my-first-blog
```
```sh [pnpm]
pnpm create @sugarat/theme my-first-blog
```
:::

接下来按照 [操作指引](https://app.warp.dev/block/lZAFeRnRFgOcsRSUOU5ApV) 进行操作即可

![](https://img.cdn.sugarat.top/mdImg/MTY4OTQyMDE1NTcxMA==689420155710)

① 切换到项目的目录
```sh
cd my-blog
```

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
* [主题配置：首页&文章](https://theme.sugarat.top/config/frontmatter.html) - 主题提供的一些 `frontmatter`
* [主题配置：全局](https://theme.sugarat.top/config/global.html) - 主题提供的额外能力
* [主题配置：样式](https://theme.sugarat.top/config/style.html) - 自定义博客样式介绍
* [主题配置：组件能力](https://theme.sugarat.top/config/component.html) - 自定义博客样式介绍
<h1 align="center"> 粥里有勺糖 </h1>
<p align="center">你的指尖,拥有改变世界的力量</p>
<p align="center">博客主题：<a href="https://theme.sugarat.top/" target="_blank">@sugarat/theme</a></p>

[![code style](https://antfu.me/badge-code-style.svg)](https://github.com/antfu/eslint-config)

## 仓库介绍

这是一个 monorepo 仓库，包含如下内容
* [blogpress](./packages/blogpress/)：博客内容本身
* [@sugarat/theme](./packages/theme/)：博客分离出的通用 `VitePress` 主题
* [@sugarat/theme-shared](./packages/shared/)：`VitePress` 主题相关的工具方法
* [@sugarat/create-theme](./packages/create-theme/)：用于快速创建和作者一样风格的博客
* VitePress 插件相关：
  * [vitepress-plugin-pagefind](./packages/vitepress-plugin-pagefind/)：基于 pagefind 实现的 `VitePress` 离线全文搜索支持插件
  * [vitepress-plugin-rss](./packages/vitepress-plugin-rss/)：基于 feed 实现的 `VitePress` RSS 支持插件
  * [vitepress-plugin-51la](./packages/vitepress-plugin-51la/)：为 `VitePress` 站点引入 [51.la](https://v6.51.la/) 的网站数据统计能力。
  * [vitepress-plugin-announcement](./packages/vitepress-plugin-announcement/)：为 `VitePress` 创建一个全局公告窗口。
  * [vitepress-plugin-slot-inject-template](./template/vitepress-plugin-slot-inject-template/)：`VitePress` 插件开发模板。

## 快速创建博客模板
支持多种包管理工具
```sh
# With PNPM:
pnpm create @sugarat/theme

# With NPM:
npm create @sugarat/theme@latest

# With Yarn:
yarn create @sugarat/theme

# With Bun
bun create @sugarat/theme
```
## 运行本项目
这是一个 monorepo 仓库，博客基于[vitepress](https://vitepress.dev/)搭建，运行前需先安装依赖，构建主题包

① 先安装 `pnpm`
```sh
npm i -g pnpm
# 安装依赖
pnpm install
```

② 构建依赖包的npm包
```sh
pnpm buildlib
```

③ 运行
```sh
# 运行博客
pnpm dev

# 运行主题包文档
pnpm dev:theme
```

## :pencil:关于内容
大前端开发相关知识，包含但不限于前端

记录面试中所遇的问题，并整理相关知识点，分模块进行了梳理

## :speak_no_evil:[关于笔者](./docs/aboutme.md)
21年毕业，目前就职于美团，热爱大前端开发技术

热爱开源，乐于分享

![图片](https://img.cdn.sugarat.top/mdImg/MTYwNDcyMTQ4NTMyOA==604721485328)

## :link:个人相关链接

* [粥里有勺糖●博客园](https://www.cnblogs.com/roseAT/)
* [ATQQ●GitHub](https://github.com/ATQQ)
* [ES6笔记●GITBOOK](https://sugar-js.gitbook.io/-1/)
* [blog●GitBook](https://sugar-at.gitbook.io/blog-article/)
* [掘金](https://juejin.im/user/1028798615918983)

## :phone:联系我
如对博客内容，知识，排版等有疑问或者建议，欢迎邮件和我联系

**邮箱:engineerzjl@foxmail.com**

![公众号](packages/blogpress/public/mp-code.png)

## :coffee:赞赏
|                                  微信                                   |                                微信赞赏                                 |                                 支付宝                                  |
| :---------------------------------------------------------------------: | :---------------------------------------------------------------------: | :---------------------------------------------------------------------: |
| ![](https://img.cdn.sugarat.top/mdImg/MTY1MTU0NzQ0MjMzNA==651547442334) | ![](https://img.cdn.sugarat.top/mdImg/MTY0Nzc1NTYyOTE5Mw==647755629193) | ![](https://img.cdn.sugarat.top/mdImg/MTY1MTU0NzQyOTg0OA==651547429848) |

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=atqq/sugar-blog&type=Date)](https://star-history.com/#atqq/sugar-blog&Date)

## Stargazers over time
[![Stargazers over time](https://starchart.cc/ATQQ/sugar-blog.svg?variant=adaptive)](https://starchart.cc/ATQQ/sugar-blog)

## Project Status

![status](https://repobeats.axiom.co/api/embed/49625195d138fdaccc82ef70c9645d9a85afda5f.svg "Repobeats analytics image")

## Contributors

Thanks to all the contributors!

<a href="https://github.com/atqq/sugar-blog/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=atqq/sugar-blog" />
</a>

Made with [contrib.rocks](https://contrib.rocks).
<h1 align="center"> 粥里有勺糖 </h1>
<p align="center">你的指尖,拥有改变世界的力量</p>
<p align="center">博客主题：<a href="https://theme.sugarat.top/" target="_blank">@sugarat/theme</a></p>


## 仓库介绍

这是一个 monorepo 仓库，目前有如下四个部分
* [blogpress](./packages/blogpress/)：博客内容本身
* [@sugarat/theme](./packages/theme/)：博客分离出的通用VitePress主题
* [创建主题模板项目CLI](./packages/create-theme/)：用于快速创建和作者一样风格的博客
* [vitepress-plugin-pagefind](./packages/vitepress-plugin-pagefind/)：基于pagefind实现的VitePress离线全文搜索支持插件

## 运行本项目
博客基于[vitepress](https://vitepress.vuejs.org/)构建

① 先安装 `pnpm`
```sh
npm i -g pnpm
# 安装依赖
pnpm install
```

② 构建主题包
```sh
pnpm build:theme-only
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
21年毕业，目前就职于美团（到店餐饮B端），热爱大前端开发技术

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

## :fire: 巨佬博客 - 记得三连
* [Linbudu](https://github.com/linbudu599/FE-Basics)
* [kweku](http://kweku.top/)
* [炽翎](https://juejin.im/user/3122268753634541/posts)
* [冴羽](https://github.com/mqyqingfeng/Blog)
* [神三元](http://47.98.159.95/my_blog/)
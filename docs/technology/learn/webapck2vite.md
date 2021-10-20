---
title: webpack项目接入Vite的通用方案介绍
date: 2021-10-19
tags:
 - 技术笔记
 - 技术教程
categories:
 - 技术笔记
---
# webpack项目接入Vite的通用方案介绍

TODO：敬请期待，正在输出中，[仓库地址](https://github.com/ATQQ/webpack-vite-serve)

## 愿景
希望通过本文，能给读者提供一个存/增量项目接入Vite的点子，起抛转引玉的作用，减少这方面能力的建设成本

在阐述过程中同时也会逐渐完善[webpack-vite-serve](https://github.com/ATQQ/webpack-vite-serve)这个工具

读者可直接fork这个工具仓库，针对个人/公司项目场景进行定制化的二次开发

## 背景
在当下的业务开发中处处可见[webpack](https://webpack.docschina.org/concepts/)的身影，大部分的业务项目采用的构建工具也都是它。

随着时间的推移，存量老项目体积越来越大，开发启动(dev)/构建(build) 需要的时间越来越长。针对webpack的优化手段越来越有限。

于是乎某些场景出现了用其它语言写的工具，帮助构建/开发提效。如[SWC（Rust）](https://github.com/swc-project/swc),[esbuild（Go）](https://github.com/evanw/esbuild)

当然上述工具并不是一个完整的构建工具，不能取代webpack直接使用，只是通过plugin，为webpack工作提效

当下另一种火热的方案是`bundleless`，利用浏览器原生支持`ES Module`的特性，让浏览器接管"`打包`"工作，工具只负责对浏览器请求的资源进行相应的转换，从而极大的减少服务的启动时间，提升开发体验与开发幸福感

比较出名的两个产品就是[snowpack](https://github.com/snowpackjs/snowpack)与[Vite](https://github.com/vitejs/vite)

本文的主角也是`Vite`：**下一代前端开发与构建工具**

由于`Vite`的周边还处于建设期，要完全替代webpack，还需要一定时日，为了保证**存量**线上项目的稳定性，固`Vite`主要作为一个**开发时可选的能力**接入。

```sh
# webpack devServer
npm run dev

# Vite devServer
npm run vite
```
## 目标

**为webpack项目开发环境提供最简单的Vite接入方案**

待接入项目只需要做极小的变动就能享受到`Vite`带来的开发乐趣

## 方案
1. 做一个CLI工具，封装Vite启动项目的能力
2. 将Vite相关的配置全部收敛于插件内，自动将webpack配置转化为Vite配置
3. 对外提供一些可选参数，用于手动指定配置文件的位置

## 实现
### 1. 初始化工程

### 2. 收敛Vite启动

### 3. html模板处理

### 4. 指定entry入口

### 5. 其它杂项
* Sass/Less
* .Vue
* 组件库按需引入
* process.env
* window.xx undefined
* ...
## 总结

<comment/>
<tongji/>
---
title: ESCheck工具原理解析及增强实现
date: 2022-09-19
tags:
 - 技术笔记
 - 个人作品
categories:
 - 技术笔记
---
# ESCheck工具原理解析及增强实现

<!-- TODO：掘金标语 -->

## 前言

2022了，大家做的面向C端的产品，还是避不开兼容性的话题（即使IE已官宣停止支持）

但就目前看来这个停止维护还是避免不了大家做开发还是要考虑兼容低端机，甚至`IE11`

针对js目前通常的手段都是通过工具对js进行语法降级至 ES5，同时引入对应的 polyfill（垫片）

工具首选还是老牌 [Babel](https://babeljs.io/)，当然现在还有 [SWC](https://swc.rs/) 这个冉冉升起的新星

经过一顿操作为项目配置 Babel 之后，为了保证产物不出现 ES5 之外的语法，通常都会搭配一个 Check 工具去检测产物是否符合要求

本文将阐述市面上已有工具的`实现原理`，`功能对比`，最后`实现增强型的es-check`（支持HTML中的js检测，产物直接进行语法降级），提供 CLI 和 Lib 两种使用方式

## 最终效果对比

| Name              | JS  | HTML | Friendly |
| ----------------- | --- | ---- | -------- |
| es-check          | ✅   | ❌    | ❌        |
| @mpxjs/es-check   | ✅   | ❌    | ✅        |
| @sugarat/es-check | ✅   | ✅    | ✅        |

## 最后
## 参考
* [es-check](https://github.com/yowainwright/es-check)：社区出品
<comment/>
* [mpx-es-check](https://github.com/mpx-ecology/mpx-es-check)：滴滴出品 [MPX](https://mpxjs.cn/) 框架的配套工具
---
isTimeLine: true
title: 与传统移动web的异同
date: 2020-04-14
tags:
 - 面试
 - 小程序
categories:
 - 面试
---
# 与传统移动web的异同
## 相似
* 主要开发语言都是JavaScript

## 相异
* 网页开发渲染线程和js脚本线程是互斥的:长时间的脚本运行可能会导致页面失去响应
* 小程序的逻辑层和渲染层是分开的
* 因为逻辑层运行在 JSCore 中,并没有完整的浏览器对象,所以没有DOM API与BOM API
* JSCore 的环境同 NodeJS 环境也是不尽相同,所以一些 NPM 的包在小程序中也是无法运行的
* 网页面向的是各种浏览器
  * PC:chrome,IE,firefox等等
  * 移动端:Safari,chrome,webview
* 小程序面向
  * 两大移动端操作系统,IOS/Android的微信客户端

:::tip 参考
[微信小程序官方文档](https://developers.weixin.qq.com/miniprogram/dev/framework/quickstart/#%E5%B0%8F%E7%A8%8B%E5%BA%8F%E4%B8%8E%E6%99%AE%E9%80%9A%E7%BD%91%E9%A1%B5%E5%BC%80%E5%8F%91%E7%9A%84%E5%8C%BA%E5%88%AB)<br>
[微信小程序框架文档](https://developers.weixin.qq.com/miniprogram/dev/framework/MINA.html)<br>
[博客园:小程序工作原理浅析](https://www.cnblogs.com/SophiaLees/p/11409339.html)
:::


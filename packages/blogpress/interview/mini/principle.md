---
isTimeLine: true
title: 小程序的原理?
date: 2020-04-14
tags:
 - 面试
 - 小程序
categories:
 - 面试
---
# 小程序的原理?
**微信小程序为例**

## 运行环境
### 渲染层
* WXML与WXSS工作在渲染层
* 界面使用WebView 进行渲染
* 一个小程序存在多个界面，所以渲染层存在多个WebView线程

### 逻辑层
* JS脚本工作在逻辑层
* 采用JsCore线程运行JS脚本
* 逻辑层发送网络请求也经由微信客户端转发

**总结**
* 渲染层和逻辑层分别由2个线程管理
* 两个线程的通信会经由微信客户端做中转
* 逻辑层将数据进行处理后发送给视图层，同时接受视图层的事件反馈
* 逻辑层并非运行在浏览器中,即JavaScript 在 web 中一些能力都无法使用

**微信小程序通信模型**
![图片](https://img.cdn.sugarat.top/mdImg/MTU4NjMyMjQ4MzQ5Mg==586322483492)

**小程序框架图**
![图片](https://img.cdn.sugarat.top/mdImg/MTU4NjMyMzEzNjU0OQ==586323136549)

* native层就是小程序的框架,这个框架里封装了ui层组件和逻辑层组件,组件可以通过微信app提供的接口调用操作系统的一些API
* 视图层和逻辑层的交互的数据经由native层处理
* 视图层和逻辑层都可以调用native框架里封装好的组件和方法
:::tip 参考
[微信小程序官方文档](https://developers.weixin.qq.com/miniprogram/dev/framework/quickstart/#%E5%B0%8F%E7%A8%8B%E5%BA%8F%E4%B8%8E%E6%99%AE%E9%80%9A%E7%BD%91%E9%A1%B5%E5%BC%80%E5%8F%91%E7%9A%84%E5%8C%BA%E5%88%AB)<br>
[微信小程序框架文档](https://developers.weixin.qq.com/miniprogram/dev/framework/MINA.html)<br>
[博客园:小程序工作原理浅析](https://www.cnblogs.com/SophiaLees/p/11409339.html)
:::


---
sidebar:
 title: 路由原理
 step: 1
isTimeLine: true
title: 路由原理
date: 2020-05-03
tags:
 - 大前端
 - vue
categories:
 - 大前端
---
# 路由原理
* hash模式
* history模式

## hash
浏览器URL中会显示`#`，`#`以及`#`后面的字符称之为hash，可以用window.location.hash读取

监听hash模式用的是hashchange
**特点**

* hash虽然在URL中，但不被包括在HTTP请求中
* hash不会重加载页面


## history
history采用HTML5的新特性,且提供了两个新方法:`pushState()`,`replaceState()`,可以对浏览器历史记录栈进行修改,只是当它们执行修改时，虽然改变了当前的 URL，但浏览器不会立即向后端发送请求

监听history模式用的是popstate

前端的 URL 必须和实际向后端发起请求的 URL 一致

:::tip 参考
[简书:vue路由的实现原理](https://www.jianshu.com/p/f660804d8592)<br>
[简书:vue路由的两种模式，hash与history原理](https://www.jianshu.com/p/e8bffc26293f)
:::


---
isTimeLine: true
title: async及await的特点，它们的优点和缺点分别是什么？await原理是什么？
date: 2020-04-14
tags:
 - 面试
 - javascript
categories:
 - 面试
---
# async 及 await 的特点，它们的优点和缺点分别是什么？await 原理是什么？

## 特点
* 一个函数如果加上async 那么其返回值是Promise,async 就是将函数返回值使用 Promise.resolve() 进行包裹,和then处理返回值一样
* await只能配合async使用 不能单独使用
## 优点
* 相比于Promise来说优势在于能够写出更加清晰的调用链,并且也能优雅的解决回调地狱的问题
## 缺点
* 因为await将异步代码变成了同步代码,如果多个异步之间没有关系,会导致性能降低
## 原理
* await 就是 generator 加上 Promise 的语法糖，且内部实现了自动执行 generator


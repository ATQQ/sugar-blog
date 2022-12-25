---
isTimeLine: true
title: Promise的特点是什么，分别有什么优缺点？什么是Promise链？Promise构造函数执行和then函数执行有什么区别？
date: 2020-03-08
tags:
 - 面试
 - javascript
categories:
 - 面试
---
# Promise 的特点是什么，分别有什么优缺点？什么是 Promise 链？Promise 构造函数执行和 then 函数执行有什么区别？

## 特点
* 三种状态
  * pending:等待
  * resolved:完成
  * rejectde:拒绝
* 一旦从等待状态变成为其他状态就永远不能更改状态

## 优点
* 很好的解决了回调地狱的问题

## 缺点
* 无法取消
* 错误需要通过回调函数捕获catch

## Promise链
* 每次调用 then 之后返回的都是一个全新的Promise,因此又可以接着使用then方法,由此形成promise链
* 在 then 中 使用了 return，那么 return 的值会被 Promise.resolve() 包装


## Promise 构造函数执行和 then 函数执行有什么区别
* 构造 Promise 的时候，构造函数内部的代码是立即执行的
* then函数在promise.resolve()执行后执行


---
sidebar:
 title: 简单-实现call
 step: 2
isTimeLine: true
title: 实现call
date: 2020-09-01
tags:
 - 手撕代码
 - javascript
categories:
 - 手撕代码
---
# 实现call

面试中所遇频率极高的手写题之一

## call简介
* 改变this指向,然后执行函数返回结果
* 第一个参数为新的this，不设置则默认globalThis
* 第二个及之后的参数作为其参数传入

## 使用
```js
function print(a, b) {
    console.log(this.name, a + b);
}
print(1, 2) // undefined 3

print.call({ name: 'print' }, 6, 5) // print 11
```

## 简单实现
不考虑各种边界情况
```js
Function.prototype.mycall = function (thisArg) {
    thisArg = thisArg || window
    thisArg.fn = this
    const argvs = [...arguments].slice(1)
    const res = thisArg.fn(...argvs)
    delete thisArg.fn
    return res
}

function print(a, b) {
    console.log(this.name, a + b);
}
print(1, 2) // undefined 3

print.mycall({ name: 'print' }, 6, 5) // print 11
```

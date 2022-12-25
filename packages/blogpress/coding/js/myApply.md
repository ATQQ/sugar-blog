---
sidebar:
 title: 简单-实现apply
 step: 3
isTimeLine: true
title: 实现apply
date: 2020-09-01
tags:
 - 手撕代码
 - javascript
categories:
 - 手撕代码
---
# 实现apply

面试中所遇频率极高的手写题之一

## apply简介
* 改变this指向,然后执行函数返回结果
* 第一个参数为新的this，不设置则默认globalThis
* 第二个参数为一个数组，作为函数参数传入

## 使用
```js
function print(a, b) {
    console.log(this.name, a + b);
}
print(1, 2) // undefined 3

print.apply({ name: 'print' }, [ 6, 5]) // print 11
```

## 简单实现
不考虑各种边界情况
```js
Function.prototype.myapply = function (thisArg){
    thisArg = thisArg || global
    thisArg.fn = this
    let res = undefined
    if (arguments[1]) {
        res = thisArg.fn(...arguments[1])
    } else {
        res = thisArg.fn()
    }
    delete thisArg.fn
    return res
}
print.myapply(null, [1, 2]) // undefined 3
print.myapply({ name: 'test' }, [1, 2]) // test 3
```

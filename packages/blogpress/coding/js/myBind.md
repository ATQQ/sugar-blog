---
sidebar:
 title: 简单-实现bind
 step: 1
isTimeLine: true
title: 实现bind
date: 2020-09-01
tags:
 - 手撕代码
 - javascript
categories:
 - 手撕代码
---
# 实现bind

面试非常高频率的题
## bind简介
* 改变this指向
* 返回一个新的函数
* 如果对返回的函数使用new则生成一个新的实例
* 多次bind只有第一次bind有效
* 第一个参数为新的this，不设置则默认globalThis
* 第二个及之后的参数作为其参数传入

## 使用
```js
function print() {
    console.log(this.name);
}
print() // undefined

const print1 = print.bind({ name: 'print1' })
print1() // print1

const print2 = print.bind({ name: 'print2' }).bind({ name: 'print22' })
print2() // print2
```

## 简单实现
不考各种边界情况
```js
Function.prototype.mybind = function (thisArg) {
    thisArg = thisArg || window
    thisArg.fn = this
    const args = [...arguments].slice(1)
    return function F() {
        const bindArgs = args.concat(...arguments)
        if (this instanceof F) {
            return new thisArg.fn(...bindArgs)
        }
        return thisArg.fn(...bindArgs)
    }
}

const print1 = print.mybind({ name: 'print1' })
print1() // print1
const print2 = print.mybind({ name: 'print2' }).mybind({ name: 'print22' })
print2() // print2
```


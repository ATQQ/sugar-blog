---
sidebar:
 title: 参数按值传递
 step: 22
isTimeLine: true
title: 参数按值传递
date: 2020-04-14
tags:
 - 大前端
 - javascript
categories:
 - 大前端
---
# 参数按值传递
## 定义
>ECMAScript中所有函数的参数都是按值传递的。

>把函数外部的值复制给函数内部的参数，就和把值从一个变量复制到另一个变量

## 值传递
值传递是从原来的value上拷贝了一份新的_value 
```js
var v = 1
function f(value){
    value++
    console.log(value) // 2
}
f(v)
console.log(v) // 1
```

## 引用传递
引用传递，就是传递对象的引用，函数内部对参数的任何改变都会影响该对象的值，因为两者引用的是同一个对象。

**引用传递是传递对象的引用**
```js
let obj = {
    a:1
}
function fn(o){
    o.a=2
}
fn(obj)
console.log(obj) // {a:2}
```
## 共享传递
**共享传递是传递对象的引用的副本**
```js
let obj = {
    a:1
}
function fn(o){
    o = 0
}
fn(obj)
console.log(obj) // {a:1}
```

## 总结
* 基本类型按**值传递**
* 引用类型按**共享传递**
* 拷贝副本也是一种值的拷贝


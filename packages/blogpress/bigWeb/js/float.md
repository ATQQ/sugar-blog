---
sidebar:
 title: 浮点数
 step: 24
isTimeLine: true
title: 浮点数
date: 2020-04-14
tags:
 - 大前端
 - javascript
categories:
 - 大前端
---
# 浮点数

* ECMAScript 中的 Number 类型使用 IEEE754 标准来表示整数和浮点数值。
  * IEEE754 标准，全称 IEEE 二进制浮点数算术标准，定义了表示浮点数的格式等内容。
  * 在 IEEE754 中，规定了四种表示浮点数值的方式：单精确度（32位）、双精确度（64位）、延伸单精确度、与延伸双精确度。
* ECMAScript 采用的双精确度:即用 64 位字节来储存一个浮点数。
  * 第一位用来表示符号
  * 接下去的 11 位用来表示指数
  * 剩下的52位,表示有效位
## 为什么 0.1 + 0.2 != 0.3
* JS采用IEEE 754双精度版本,计算机采用二进制存储数据
* ``0.1`` 在计算机中表示是无限循环
* JS会裁剪掉数字的一部分导致精度丢失
```js
// 0011无限循环
0.1 = 0.00011(0011) = 2^-4 * 1.1(0011)

// 因此
0.100000000000000002 === 0.1 // true
0.200000000000000002 === 0.2 // true
0.1 + 0.2 = 0.300000000000000004 !==0.3
```

## 如何正确判断
1. Number.EPSILON的精度是2^-52，所以只要丢失精度小于Number.EPSILON基本可以确认相等。
```js
function compareNum(num1,num2){
    return Math.abs(num1-num2)<Number.EPSILON
}
console.log(compareNum(0.1+0.2,0.3)) // true
```
2. 使用toFixed 比较指定的精确位数
```js
function compareNum(num1,num2){
    return num1.toFixed(10) === num2.toFixed(10)
}
console.log(compareNum(0.1+0.2,0.3)) // true
```
:::tip 参考
[JavaScript 深入之浮点数精度](https://github.com/mqyqingfeng/Blog/issues/155)
:::


---
isTimeLine: true
title: 为什么0.1+0.2!=0.3
date: 2020-04-14
tags:
 - 面试
 - javascript
categories:
 - 面试
---
# 为什么0.1+0.2!=0.3

1. JS采用IEEE 754双精度版本表示数字
2. 计算机采用二进制存储数据
3. ``0.1``在计算机中表示会出现无限循环
4. 转换为10进制计算时会裁剪掉一部分导致精度丢失

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


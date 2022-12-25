---
sidebar:
 title: 简单-闭包调用
 step: 8
isTimeLine: true
title: 闭包调用
date: 2020-10-18
tags:
 - 手撕代码
 - javascript
categories:
 - 手撕代码
---
# 闭包调用

## 问题描述
实现调用闭包函数，使每调用一次返回值都会加1

```js
const func = (function () {
// TODO 请实现对应代码逻辑

})();
console.log(func()); // -> 1
console.log(func()); // -> 2
console.log(func()); // -> 3
```

## 题解
```js
const func = (function () {
    let count = 0
    return () => {
        return ++count
    }
})();
console.log(func()); // -> 1
console.log(func()); // -> 2
console.log(func()); // -> 3
```


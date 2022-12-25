---
sidebar:
 title: 简单-instanceof实现
 step: 6
isTimeLine: true
title: 实现instanceOf
date: 2020-10-13
tags:
 - 手撕代码
 - javascript
categories:
 - 手撕代码
---
# 实现instanceOf

## instanceof作用
检测构造函数的原型是否在实例的原型链上

## 原型链

![](https://img.cdn.sugarat.top/mdImg/MTU4NDM2MzA5ODkyOA==584363098928)

## instanceOf实现

### 迭代

```js
/**
 * 检测构造函数的原型是否在实例的原型链上
 * @param {object} a 
 * @param {Object} b 
 */
function instanceOf(a, b) {
    const prototype = b.prototype
    let __proto__ = a.__proto__
    while (1) {
        if (__proto__ === prototype) {
            return true
        }

        if (!__proto__) {
            return false
        }
        __proto__ = __proto__.__proto__
    }
}
```

### 递归
```js
/**
 * 检测构造函数的原型是否在实例的原型链上
 * @param {object} a 
 * @param {Object} b 
 */
function instanceOf(a, b) {
    return a !== null && (a.__proto__ == b.prototype || instanceOf(a.__proto__, b))
}
```

### 测试代码
```js
console.log(instanceOf([], Array));
console.log(instanceOf({}, Object));
console.log(instanceOf(/^$/, RegExp));
console.log(instanceOf(function () { }, Function));
console.log(instanceOf([], Function));
```


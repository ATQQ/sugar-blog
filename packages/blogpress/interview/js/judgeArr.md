---
isTimeLine: true
title: 如何判断数组
date: 2020-09-05
tags:
 - 面试
 - javascript
categories:
 - 面试
---
# 如何判断数组
## 1.Array.isArray
```js
console.log(Array.isArray([])) // true
```
## 2.instanceof
```js
console.log([] instanceof Array)
```
## 3.constructor
```js
function isArray(arr) {
    if (!(arr instanceof Object)) {
        return false
    }
    return arr.constructor === Array
}
console.log(isArray([]))
```
## 4.Object.prototype.toString
```js
function isArray(arr) {
    return Object.prototype.toString.call(arr) === '[object Array]'
}
console.log(isArray([]))
```
## 5.正则+JSON.stringify
```js
function isArray(arr) {
    try {
        return /^\[.*\]$/.test(JSON.stringify(arr))
    } catch (err) {
        return false
    }
}
console.log(isArray([]))
```

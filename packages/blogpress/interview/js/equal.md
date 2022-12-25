---
isTimeLine: true
title: ==和===有什么区别
date: 2020-04-14
tags:
 - 面试
 - javascript
categories:
 - 面试
---
# == 和 === 有什么区别

## ==
1. 首先会判断两者类型是否相同。相同的话就直接进行比较
2. 如果对比双方的类型不一样的话，就会进行类型转换
3. null 与 undefined : true
4. string 与 number : string->number
5. 其中一方为 boolean:boolean -> number
6. object 与 string、number、symbol : object -> 原始值类型

**示例**
```js
[] == ![] 
[] == !true
[] == false
[] == 0
'' == 0
 0 == 0 // true
```

## ===
判断两者类型和值是否相同

**示例**
```js
true==='true' // false 类型不同

true == 'true'
1 == 'true'
1 == NaN // false
```

:::tip 更多参考
[JS中的类型转换](./../../bigWeb/js/typeConvert.md)
:::


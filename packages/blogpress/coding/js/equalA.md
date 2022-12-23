---
sidebar:
 title: 简单-a同时等于多个值
 step: 7
isTimeLine: true
title: 如何实现变量a同时等于多个值
date: 2020-09-11
tags:
 - 手撕代码
 - javascript
categories:
 - 手撕代码
---
# 如何实现变量a同时等于多个值

通过重新定义对象的隐式转换行为实现

如对隐式转换不了解，推荐阅读[类型转换](./../../bigWeb/js/typeConvert.md)
```js
if(a==1&&a==2){
    console.log('yes')
}
```

## 定义[ToPrimitive]
```js
let a = {
    v:1,
    [Symbol.toPrimitive](){
        return this.v++
    }
}
```

## 定义valueOf
```js
let a = {
    v:1,
    valueOf(){
        return this.v++
    }
}
```

## 定义toString
```js
let a = {
    v:1,
    toString(){
        return this.v++
    }
}
```



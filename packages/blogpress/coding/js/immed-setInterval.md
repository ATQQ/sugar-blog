---
sidebar:
 title: 简单-立即执行的定时器
 step: 9
title: 实现调用就执行一次的定时器
date: 2021-08-29
tags:
 - 手撕代码
 - javascript
categories:
 - 手撕代码
---
# 实现调用就执行一次的定时器

## 问题描述
部分场景需要使用定时器延迟或者循环执行

通常在循环场景下又希望首次调用的时候立即执行一次

当然这个处理，也是比较简单的，但是看上去总觉得不太优雅
```js
function fn(){}

fn()
const timer = setTimeout(fn,timeout)
```

咱的目的是整个优雅的`setImmTimeout`和`setImmInterval`，即在调用够会立即执行一次回掉函数

>关于实现较准时的setTimeout，可以进一步阅读[这篇文章](https://mp.weixin.qq.com/s/JYfm8oiQmomkNnJIFWDkrQ),本文不涉及定时器的实现

## 前置知识
定时器的参数构成:
1. func：被调用的函数
2. delay：延迟的时间
3. (可选)arg1-argN：传递给被调用函数的参数

返回值：一个标识目标计时器的非零数字，用于清楚目标计数器

参数构成如下，`[]`中包含的是可选的参数，并不是传递一个数组
```js
(func, delay, [arg1, arg2, ...]);
```

## setImmX
朴素的实现方法如下，延迟执行前调用一次
```js
function setImmTimeout(func, delay = 0, ...args) {
    if (typeof func !== 'function') throw new TypeError('func is not function')
    func.apply(this, args)
    return setTimeout(func, delay, ...args)
}

function setImmInterval(func, delay = 0, ...args){
    if (typeof func !== 'function') throw new TypeError('func is not function')
    func.apply(this, args)
    return setInterval(func, delay, ...args)
}
```



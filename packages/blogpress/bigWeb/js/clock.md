---
sidebar:
 title: 定时器
 step: 14
isTimeLine: true
title: 定时器
date: 2020-04-14
tags:
 - 大前端
 - javascript
categories:
 - 大前端
---
# 定时器
## setTimeout
``setTimeout(fn,delay,params)``
指定函数在指定``delay``ms之后执行一次

## setInterval
``setInterval(fn,delay,params)``
指定函数每隔``delay``ms执行一次

因为js是单线程,如果前面的代码影响了性能，就会导致 setTimeout/setInterval等不会按期执行(具体查看[event loop](./eventloop.md))


## requestAnimationFrame
由系统决定回调函数的执行时机,每次刷新的间隔中会执行一次回调函数，不会引起丢帧，不会卡顿

通常为60Hz的刷新率,即16.6ms执行一次

``requestAnimationFrame`` 自带函数节流功能，基本可以保证在 16.6 毫秒内只执行一次（不掉帧的情况下）


## 差异
* 使用setTimeout/setInterval，当页面被隐藏或最小化时,仍然在后台执行任务
* ``requestAnimationFrame``则完全不同，当页面处理未激活的状态下，该页面的屏幕刷新任务也会被系统暂停


:::tip 参考
[从setTimeout/setInterval看JS线程](https://palmer.arkstack.cn/2017/12/%E4%BB%8EsetTimeout-setInterval%E7%9C%8BJS%E7%BA%BF%E7%A8%8B/)
:::

**下面介绍使用requestAnimationFrame实现定时器的方式**

## mySetTimeout
```js
function mySetTimout(callback, delay) {
    let timer,
        start = Date.now();
    const loop = () => {
        if (start + delay > Date.now()) {
            timer = requestAnimationFrame(loop)
        } else {
            callback(timer)
        }
    }
    timer = requestAnimationFrame(loop)
    return timer
}
```
**使用**
```js
mySetTimout(timer => {
    console.log('over' + timer)
}, 1500)
```
## mySetInterVal
```js
function mySetInterval(callback, delay) {
    let timer,
        start = Date.now();
    const loop = () => {
        timer = requestAnimationFrame(loop)
        if (start + delay <= Date.now()) {
            callback(timer)
            start = Date.now()
        }
    }
    timer = requestAnimationFrame(loop)
    return timer
}
```

**使用**
```js
let a = 1;
mySetInterval(timer => {
    a++;
    console.log(a, timer)
    if (a === 3) {
        cancelAnimationFrame(timer)
    }
}, 1000)
```


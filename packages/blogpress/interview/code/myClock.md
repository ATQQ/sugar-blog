---
isTimeLine: true
title: 定时器实现
date: 2020-05-03
tags:
 - 面试
 - 手撕代码
categories:
 - 面试
---
# 定时器实现
>借助requestAnimationFrame实现,精度更高
## mySetTimeout
```js
function mySetTimeout(callback, delay) {
    let timer, start = Date.now()
    const loop = () => {
        if (start + delay > Date.now()) {
            timer = requestAnimationFrame(loop)
        } else {
            callback(timer)
        }
    }
    loop()
    return timer
}
```

## mySetInterval
```js
function mySetInterval(callback, delay) {
    let timer, start = Date.now()
    const loop = () => {
        if (start + delay <= Date.now()) {
            callback(timer)
            start = Date.now()
        }
        timer = requestAnimationFrame(loop)
    }
    loop()
    return timer
}
```


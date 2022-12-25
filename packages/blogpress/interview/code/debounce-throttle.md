---
isTimeLine: true
title: 防抖与节流实现
date: 2020-05-03
tags:
 - 面试
 - 手撕代码
categories:
 - 面试
---
# 防抖与节流实现

## 防抖
>对于短时间内连续触发的事件（上面的滚动事件），防抖的含义就是让某个时间期限内，事件处理函数只执行一次

```js
function debounce(fn,delay){
    let timer
    return function(){
        if(timer){
            clearTimeout(timer)
        }
        timer = setTimeout(fn,delay,...arguments)
    }
}
```

## 节流
>如果短时间内大量触发同一事件，那么在函数执行一次之后，该函数在指定的时间期限内不再工作，直至过了这段时间才重新生效

*就好比打游戏释放技能后会有CD(冷却时间)*

**标志位与定时器实现**
```js
function throttle(fn, delay) {
    let flag = false
    return function () {
        if (flag) {
            return
        }
        flag = true
        fn.apply(this, arguments)
        setTimeout(() => {
            flag = false
        }, delay)
    }
}
```

**使用时间戳**
```js
function throttle(fn, delay) {
    let now = 0
    return function () {
        if (now + delay > Date.now()) {
            return
        }
        fn.apply(this, arguments)
        now = Date.now()
    }
}
```

## 节流与防抖相结合
>解决:操作频繁的场景,每次操作完都等不到debounce的delay就开始了下一次操作

```js
function superThrottle(fn, delay) {
    let start = Date.now(), timer = null
    return function () {
        let end = Date.now()
        let context = this;
        let args = arguments
        if (start + delay > end) {
            if (timer) {
                clearTimeout(timer)
            }
            timer = setTimeout(() => {
                start = end
                fn.apply(context, args)
            }, delay)
        } else {
            start = end
            fn.apply(context, args)
            clearTimeout(timer)
        }
    }
}
```


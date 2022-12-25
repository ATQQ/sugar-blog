---
sidebar:
 title: 节流与防抖
 step: 9
isTimeLine: true
title: 节流与防抖
date: 2020-04-14
tags:
 - 大前端
 - javascript
categories:
 - 大前端
---
# 节流与防抖

## 滚动监听例子
常见功能:返回顶部按钮
* 这个按钮只会在滚动到距离顶部一定位置之后才出现

### 简单实现
```js
window.onscroll = () => {
    let top = document.body.scrollTop || document.documentElement.scrollTop
    console.log(top);
}
```
运行的时候会发现存在一个问题,这个函数的**默认执行频率，太高了**,只按一次键盘上的``↓``就执行了9次

![图片](https://img.cdn.sugarat.top/mdImg/MTU4Mjg1OTQ3NTYzMQ==582859475631)

实际是不需要这么高的执行频率的,会消耗浏览器的性能

## 防抖
:::tip 定义
对于短时间内连续触发的事件（上面的滚动事件），防抖的含义就是让某个时间期限内，事件处理函数只执行一次。
:::

基于上述场景，一种优化的思路：在第一次触发事件时，不立即执行函数，而是给出一个期限值比如200ms,如果:
* 200ms内没有再次触发事件,那么就执行函数
* 200ms内触发了就重新计时
  
使用setTimeout实现的思路
```js
let timer = null
window.onscroll = () => {
    if (timer) {
        clearTimeout(timer)
    }
    timer = setTimeout(() => {
        let top = document.body.scrollTop || document.documentElement.scrollTop
        console.log(top);
    }, 200)
}
```

加入闭包避免污染全局作用域
```js
function debounce(fn, delay) {
    let timer = null
    return function () {
        if (timer) {
            clearTimeout(timer)
        }
        timer = setTimeout(fn, delay)
    }
}

window.onscroll = debounce(() => {
    let top = document.body.scrollTop || document.documentElement.scrollTop
    console.log(top);
}, 200)
```

## 节流
:::tip 定义
如果短时间内大量触发同一事件，那么在函数执行一次之后，该函数在指定的时间期限内不再工作，直至过了这段时间才重新生效
:::

* 如果需要不断拖动滚动条，也能在某个时间间隔之后给出反馈

1. 使用标志位与setTimeout
```js
function throttle(fn, delay) {
    let flag = true
    return function () {
        if (!flag) {
            return false
        }
        flag = false
        setTimeout(() => {
            fn()
            flag = true
        }, delay)
    }
}
window.onscroll = throttle(() => {
    let top = document.body.scrollTop || document.documentElement.scrollTop
    console.log(top);
}, 200)
```

2. 使用时间戳
```js
function throttle(fn, delay) {
    let start = Date.now()
    return function () {
        if (start + delay >= Date.now()) {
            return
        }
        start = Date.now()
        fn()
    }
}
window.onscroll = throttle(() => {
    let top = document.body.scrollTop || document.documentElement.scrollTop
    console.log(top);
}, 200)
```

## 业务场景
* 搜索框input事件，实时搜索可以使用节流方案
* 需要做页面适配的时候。需要根据最终呈现的页面情况进行dom渲染一般使用防抖


## 带参数
### 防抖
```js
function debounce(fn, delay) {
    let timer = null
    return function () {
        if (timer) {
            clearTimeout(timer)
        }
        fn = fn.bind(this, ...arguments)
        timer = setTimeout(fn, delay)
    }
}
```
### 节流
```js
function throttle(fn,delay){
    let start = Date.now()
    return function(){
        if(start+delay>=Date.now()){
            return
        }
        start = Date.now()
        fn.apply(this,arguments)
    }
}
```


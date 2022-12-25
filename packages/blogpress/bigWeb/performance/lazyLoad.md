---
isTimeLine: true
title: 懒加载与执行
date: 2020-04-14
tags:
 - 大前端
 - 性能优化
categories:
 - 大前端
---
# 懒加载与执行
## 懒执行
将某些逻辑延迟到使用时再计算。

可以用于首屏优化，对于某些耗时逻辑并不需要在首屏就使用，就可以使用懒执行。

懒执行需要唤醒，可以通过定时器或者事件的调用来唤醒。

## 懒加载
懒加载就是将不关键的资源延后加载。

懒加载的原理就是只加载自定义区域（通常是可视区域，也可以是即将进入可视区域的资源）内需要加载的资源。

对于图片来说，先设置图片标签的 src 属性为一张占位图，将真实的图片资源放入一个自定义属性中，当进入自定义区域时，就将自定义属性替换为 src 属性，这样图片就会去下载资源，实现了图片懒加载。

懒加载不仅可以用于图片，也可以使用在别的资源上。比如进入可视区域才开始播放视频等等。

**简单实现**
```js
let doc = document.createDocumentFragment()

// 屏幕可见高度 
const screenHeight = window.innerHeight || document.documentElement.clientHeight
/**
* 节流函数
*/
function throttle(fn, delay) {
    let start = Date.now()
    return function () {
        if (start + delay >= Date.now()) {
            return
        }
        start = Date.now()
        fn.apply(this, [...arguments])
    }
}

// 加载真实图片
function loadImg() {
    let imgs = Array.from(document.querySelectorAll('img[lazy]'))
    for (img of imgs) {
        let { top, bottom } = img.getBoundingClientRect()
        // 如果默认图片还没加载完成就等一会儿在判断
        if (top === bottom) {
            setTimeout(() => {
                loadImg()
            }, 100)
            return
        }
        if ((top >= 0 && top < screenHeight) || (bottom >= 0 && bottom < screenHeight)) {
            img.src = img.getAttribute('lazy')
            img.removeAttribute('lazy')
        }
    }
}
// 生成测试数据
function init() {
    let i = 100
    while (i--) {
        let img = document.createElement('img')
        img.src = 'https://img.cdn.sugarat.top/mdImg/MTU4MzM5NzA0NzA5OA==583397047098'
        img.setAttribute('lazy', 'https://img.cdn.sugarat.top/mdImg/MTU4MzM5NzEyNTYzOA==583397125638')
        doc.appendChild(img)
    }
    document.body.append(doc)
}
init()
document.onscroll = throttle(loadImg, 200)
```

[CodePen:示例](https://codepen.io/sugarInSoup/pen/WNvZEap)


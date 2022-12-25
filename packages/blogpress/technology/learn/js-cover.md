---
title: 向页面注入js实现为图片和文字元素添加透明蒙层
date: 2021-07-29
tags:
 - 技术笔记
 - 技术教程
categories:
 - 技术笔记
---
# 向页面注入js实现为图片和文字元素添加透明蒙层

## 背景
最近在做一个操作Dom的小工具（做完再接着分享这个工具是什么）

从中拆解出了一个小练习：
1. 高亮页面中所有的图片元素
2. 高亮页面中所有的文字元素
3. 页面触发显示/隐藏时，转换文字/图片高亮的颜色

最终效果如下:

![图片](https://img.cdn.sugarat.top/mdImg/MTYyNzQ4NDc4NzUzMA==627484787530)

## 注入js
向第三方页面注入js的方法有很多

这里demo使用DevTools的控制台进行注入

简单代码如下
```js
var a=document.createElement('script');
a.src="http://127.0.0.1:8080/index.js";
window.document.head.append(a)
```

## 图片高亮
常规的图片展示有两种方式:
1. 使用`<img>`标签
2. 设置元素的`background`或者`background-image`属性

### 情况一
**思路：**使用`<div>`标签将其包裹，然后再添加一个`<div>`作为蒙层

```html
<div>
    <img src="url">
</div>
```

添加蒙层后结构

```html
<div>
    <div style="position:relative">
        <img src="url">
        <div class="cover"></div>
    </div>
</div>
```

添加蒙层的代码如下：
```js
    function addImgCover(img, bgc = 'rgba(255,0,0,0.2)') {
        // 如果有蒙层，则直接新的颜色
        if (img.getAttribute('cover')) {
            img.nextElementSibling.style.backgroundColor = bgc
            return
        }

        // 标记已经添加过蒙层
        img.setAttribute('cover', '1')

        const divParent = document.createElement('div')
        divParent.style.position = 'relative'

        const divChild = document.createElement('div')
        divChild.style.position = 'absolute'
        divChild.style.top = '0'
        divChild.style.width = '100%'
        divChild.style.height = '100%'
        divChild.style.backgroundColor = bgc

        divParent.appendChild(img.cloneNode())
        divParent.appendChild(divChild)

        img.replaceWith(divParent)
    }
```

![图片](https://img.cdn.sugarat.top/mdImg/MTYyNzU2OTg1NDM3NA==627569854374)

### 情况二
**思路：** 由于是背景图片，可直接为其添加一个子元素`<div>`作为蒙层即可

```html
<div>
    <div style="background-image:url(xxxx)"></div>
</div>
```

添加蒙层后结构

```html
<div>
    <div style="background-image:url(xxxx)">
        <div class="cover"></div>
    </div>
</div>
```

添加蒙层的代码如下：

```js
    function addBgImgCover(bgImg, bgc = 'rgba(255,0,0,0.2)') {
        // 如果有蒙层，则直接新的颜色
        if (bgImg.getAttribute('cover')) {
            bgImg.children[0].style.backgroundColor = bgc
            return
        }

        // 标记已经添加过蒙层
        bgImg.setAttribute('cover', '1')

        const divChild = document.createElement('div')
        divChild.style.width = '100%'
        divChild.style.height = '100%'
        divChild.style.backgroundColor = bgc
        bgImg.appendChild(divChild)
    }
```

## 文字高亮
文字就比较简单，可以直接设置`background-color`实现

```js
function addTextCover(textEl, bgc = 'rgba(255,0,0,0.2)') {
    textEl.style.backgroundColor = bgc
}
```

## 获取所有图片元素
使用`querySelectorAll`获取`img`元素

简单的递归方法获取使用`background-image`属性的元素

实现如下
```js
    function judgeBgImgEl(el) {
        return el && !!el.style.backgroundImage
    }
    function getAllImgEls() {
        // 常规的
        const imgs = document.querySelectorAll('img')

        // 递归获取非常规的
        const getBgIms = (el = document.body) => {
            const res = []
            if (el.childElementCount > 0) {
                Array.from(el.children).forEach(v => {
                    res.push(...getBgIms(v))
                })
            }
            if (judgeBgImgEl(el)) {
                res.push(el)
            }
            return res
        }
        const bgImgs = getBgIms()
        return {
            imgs,
            bgImgs
        }
    }
```

## 获取所有文本元素

思路跟递归获取图片一致，条件略有区别
1. 通过`textContent`可以获取元素的文本内容（包含子孙元素的）
2. 通过`childElementCount`可以获取子元素的个数
3. 当无子元素且内容不为空的元素即为目标元素

实现如下

```js
function getAllTextEls() {
    // 递归获取
    const getTextEls = (el = document.body) => {
        const res = []
        if (el.childElementCount === 0) {
            el.textContent.trim().length !== 0 && res.push(el)
        } else {
            Array.from(el.children).forEach(e => {
                res.push(...getTextEls(e))
            })
        }
        return res
    }
    return getTextEls()
}
```

## 监听页面显/隐
这个就比较简单了，直接调用原生监听事件（`visibilitychange`）即可：

```js
    let theme = 'red'

    // 主题切换
    window.addEventListener('visibilitychange', (e) => {
        if (document.hidden) {
            theme = theme === 'red' ? 'blue' : 'red'
            changeTheme(theme)
        }
    })
```

## 最后
本文只是简单的抛砖，做了一个简单的demo

上述方式肯定还有考虑不周到的地方，留给感兴趣的同学继续探索

[完整源码地址](https://github.com/ATQQ/demos/blob/main/test-script/index.js)


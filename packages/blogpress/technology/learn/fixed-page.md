---
title: 移动端阻止弹窗下层页面被滑动
date: 2022-01-22
tags:
 - 技术笔记
 - 技术教程
 - 移动端开发
categories:
 - 技术笔记
 - 移动端开发
---

# 移动端阻止弹窗下层页面被滑动

在做H5开发时，很多场景下都需要弹窗

当出现弹窗时，大部分场景下是期望弹窗下层页面不能被滑动的

当然也不期望弹窗被滑动

近期肝页面又碰到了这个问题

下面介绍几种最常用的方式，以及一些边界情况与应对策略

## overflow:hidden
流传最广的方式就是 给元素设置 `overflow:hidden`

给`body`设置，就能达到阻止页面滑动的目的
```js
document.body.style.overflow = 'hidden'
document.body.style.overflow = 'visible'
```

大部分情况下这个是能有效果的

但在`部分机器上，这个是不生效的`:

## 弹窗遮罩
还有一种情况如下，`页面部分元素有局部滑动`
```html
<body style="overflow:hidden;">
  <div style="overflow:scroll;height:100%;">
    <!-- more element -->
  </div>
</body>
```
当前情况给`body`设置 `overflow:hidden`依旧是无效果的

此时给弹窗加上遮罩如下，正常情况下，下层元素就不会收到`touchmove`事件

```html
<body style="overflow:hidden;">
  <div style="overflow:scroll;height:100%;">
    <!-- more element -->
  </div>

  <!-- dialog -->
  <div class="dialog">
    <!-- 遮罩 -->
    <div class="mask" style="position:fixed;inset:0;"></div>
    <div class="content"></div>
  </div>
</body>
```
其中[inset](https://developer.mozilla.org/en-US/docs/Web/CSS/inset)属性是`left,top,right,bottom`的简写

但在部分机型下，下层元素仍然会收到`touchmove`事件，因此会跟着滑动

于是需要祭出下面的方法
## prevent touchmove
阻止触摸滑动事件`touchmove`的默认行为

```js
const touchHandle = function(e) {
  e.preventDefault()
}

// 弹窗的事件
{
  onShow(){
    document.body.addEventListener('touchmove', preventDefault, {
      passive: false,
    });
  },
  onHide(){
    document.body.removeEventListener('touchmove', preventDefault);
  }
}
```
在弹窗打开时直接阻止目标元素的滑动事件的默认行为

弹窗内容是不可滑动的话，那么这种方法是最省事高效的

如果弹窗中有可滑动的内容，且滑动的内容比较复杂

那么通过`touchmove`去细力度的控制阻止滑动事件时就很麻烦

## position:fixed
还有一种常用的就是`position:fixed`

在弹窗打开时，将目标元素进行固定，在关闭时恢复

由于定位会改变元素在页面上的位置，所以需要再`fixed`前记录元素的位置

取消`fixed`之后将元素又滚动到原来的位置
```js
// 弹窗的事件
{
  onShow(){
    document.body.style.top = `${
      document.body.getClientRects()[0].top
    }px`;
    document.body.style.position = 'fixed';
    document.body.style.left = '0';
    document.body.style.right = '0';
  },
  onHide(){
    document.body.style.position = 'visible';
    window.scrollTo(
      0,
      Math.abs(+document.body.style.top.replace('px', ''))
    );
  }
}
```

## 使用class代替style
这个也是碰巧发现的，在`iOS`低端机将上述方式都尝试后

仍发现一个问题，现象如下（TODO：补图）

下层页面不会被滑动了，但遮罩和弹窗整体还能被下拉

弹窗是一个下拉列表弹窗，其出现的位置需要动态的计算，如下结构

```html
<body style="overflow:hidden;">
  <!-- dialog -->
  <div class="dialog" style="top:88px;">
    <!-- 遮罩 -->
    <div class="mask" style="position:fixed;inset:0;"></div>
    <!-- 内容 -->
    <div class="content"></div>
  </div>
</body>
```

最终发现是由于`style`与`class`设置的样式在这个机型上展示虽然一致

但实际交互起来的表现却不一致

修复后的`html`结构如下,在元素里插入了一个`style`标签，使用`class`选择器与`!important`重载这个距离的样式
```html
<body style="overflow:hidden;">
  <!-- dialog -->
  <div class="dialog" style="top:88px;">
    <!-- 遮罩 -->
    <div class="mask" style="position:fixed;inset:0;"></div>
    <!-- 内容 -->
    <div class="content"></div>
    <style>
      .dialog{
        top:88px !important;
      }
    </style>
  </div>
</body>
```
代码如下
```ts
{
  onShow(){
    setTimeout(() => {
      const dialogEl = document.querySelector<HTMLElement>('.dialog')
      if (!dialogEl) {
        return
      }
      const style = document.createElement('style')
      style.textContent = `
      .dialog{
        top:${dialogEl.style.top} !important;
      }
      `
      dialogEl.append(style)
    }, 200)
  }
}
```
非常令人迷惑的一个操作，但就是解决了问题

## 小结
针对移动端弹窗下层页面可被滑动的异常场景

本文介绍了`4种常见`解决方法，与`1种"谜之操作"`

## demo演示
![图片](https://img.cdn.sugarat.top/mdImg/MTY0MjkzODA2NTUyNA==642938065524)

* [demo地址](https://test-demo-6gd4lnn3e3ca39f5-1256505457.tcloudbaseapp.com/dialog-h5-fixed-case/)
* PC扫码体验
  * ![图片](https://img.cdn.sugarat.top/mdImg/MTY0MjkzODExOTA1MQ==642938119051)
* [demo源码地址](https://stackblitz.com/edit/vitejs-vite-xgqbt6?file=src%2Fmain.ts&terminal=dev)

 

---
isTimeLine: true
title: window.onload与document.ready执行顺序
date: 2020-05-03
tags:
 - 面试
 - javascript
categories:
 - 面试
---
# window.onload与document.ready执行顺序

## onload
>方法用于在网页加载完毕后立刻执行的操作，即当 HTML 文档加载完毕后，立刻执行某个方法

指示页面包含图片等文件在内的所有元素都加载完成

## ready
>在DOM完全就绪时就可以被调用

表示文档结构已经加载完成(不包含图片等非文字媒体文件)


**结论**
先执行document.ready,后执行window.onload

:::tip 参考
[博客园:细说document.ready和window.onload](https://www.cnblogs.com/shcrk/p/9256308.html)
:::


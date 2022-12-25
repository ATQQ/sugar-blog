---
isTimeLine: true
title: 几种隐藏元素的方式比较
date: 2020-05-03
tags:
 - 面试
 - CSS
categories:
 - 面试
---
# 几种隐藏元素的方式比较
* display
* opacity
* visibility

## display
>display:none

* 元素将不再占据页面空间,变为"不可见"节点
* 触发回流,进而触发重绘

## visibility
>visibility:hidden

* 直接隐藏元素,但仍占据页面空间
* 触发重绘
* 绑定的事件不能被触发

## opacity
>opacity:0

* 使元素变为透明,仍占据页面空间
* 触发重绘
* 绑定的事件仍然能被触发


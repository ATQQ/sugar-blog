---
isTimeLine: true
title: CSS中哪些属性不能被继承
date: 2020-05-03
tags:
 - 面试
 - CSS
categories:
 - 面试
---
# CSS中哪些属性不能被继承

## 概念
>在css中，每个CSS 属性定义的概述都指出了这个属性是默认继承的("Inherited: Yes") 还是默认不继承的("Inherited: no")

当元素的一个继承属性没有指定值时，则取父元素的同属性的计算值

以下只列举常见的↓
## 不能被继承的属性
* display
* width
* height
* margin
* border
* padding
* background
* position

## 能被继承的属性
* color
* cursor
* font-(style|weight|size|family)
* line-height
* text-align


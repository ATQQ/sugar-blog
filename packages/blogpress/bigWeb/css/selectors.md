---
sidebar:
 title: 选择器
 step: 2
isTimeLine: true
title: css选择器
date: 2020-09-05
tags:
 - 大前端
 - CSS
categories:
 - 大前端
---
# css选择器
## 基本选择器
1. 通配符(通用选择器):`*`
2. 标签选择器(类型选择器):`sapn`,`a`,`p`等等
3. 类选择器:`.class`
4. id选择器:`#id`
5. 属性选择器:`[attr]`,`[attr=value]`等等

## 分组选择器
1. `,` : `span,div`同时匹配 这两个

## 组合器
1. 后代组合：`.A .B` 匹配位于`.A`中的`.B`元素
2. 直接后代：`.A > .B`匹配位于`.A`中直接后代`.B`元素
3. 一般兄弟组合：`.A ~ .B`匹配同一父元素下`.A`元素后的所有`.B`元素
4. 紧邻兄弟组合：`.A + .B`匹配同一父元素下紧邻`.A`元素的`.B`元素

## 伪选择器
1. 伪类：添加到选择器的关键字，指定要选择的元素的特殊状态
2. 伪元素：附加至选择器末的关键词，允许你对被选择元素的特定部分修改样式

## 参考
>1.[MDN:CSS选择器](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Selectors)<br>
2.[MDN:CSS伪类](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Pseudo-classes)<br>
3.[MDN:CSS伪元素](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Pseudo-elements)


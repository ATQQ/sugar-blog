---
sidebar:
 title: v-show 与 v-if
 step: 8
isTimeLine: true
title: v-show与v-if
date: 2020-04-14
tags:
 - 大前端
 - vue
categories:
 - 大前端
---
# v-show 与 v-if

## v-show
* ``v-show`` 只是在 display: none 和 display: block|inline-block|flex ... 之间切换。无论初始条件是什么都会被渲染出来
* 初始渲染时有更高的开销
  * 切换开销很小，适合于频繁切换的场景

## v-if
* 属性初始为 false 时，组件就不会被渲染
* 条件为 true时渲染出来，并且切换条件时会触发销毁/挂载组件
  * 切换时开销更高
  * 适合不经常切换的场景。


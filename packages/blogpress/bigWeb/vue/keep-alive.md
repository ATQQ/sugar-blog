---
sidebar:
 title: keep-alive
 step: 7
isTimeLine: true
title: keep-alive
date: 2020-04-14
tags:
 - 大前端
 - vue
categories:
 - 大前端
---
# keep-alive

需要在组件切换的时候，保存一些组件的状态防止多次渲染，就可以使用 keep-alive 组件包裹需要保存的组件

keep-alive 组件拥有两个独有的生命周期钩子函数:
* activated:命中缓存渲染后会执行 actived 钩子函数
* deactivated:用 keep-alive 包裹的组件在切换时不会进行销毁，而是缓存到内存中并执行 deactivated

## 示例
[CodePen:动态组件](https://codepen.io/sugarInSoup/pen/mdJpeqB)


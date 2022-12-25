---
sidebar:
 title: 伪类
 step: 1
isTimeLine: true
title: 伪类
date: 2020-09-05
tags:
 - 大前端
 - CSS
categories:
 - 大前端
---
# 伪类
>伪类是添加到选择器的关键字，指定要选择的元素的特殊状态

## 语法
```css
selector:pseudo-class {
  property: value;
}
```

## 常用的一些伪类
|  名称   |           作用           |       场景举例       |
| :-----: | :----------------------: | :------------------: |
| active  |  作用于被用户激活的元素  |   单选框激活时变色   |
|  hover  |     鼠标悬停时的元素     |    文字hover变色     |
|  link   |  选中所有尚未访问的链接  | 定义未访问链接的颜色 |
| visited | 表示用户已经访问过的链接 | 定义访问过链接的颜色 |
|  focus  |      元素获取焦点时      | 输入框获取焦点时变色 |

<codepen title="pseudo-classes" src="https://codepen.io/sugarInSoup/embed/JjXOgVw?height=310&theme-id=dark&default-tab=css,result"></codepen>

其它更多的伪类 [MDN:CSS伪类](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Pseudo-classes)


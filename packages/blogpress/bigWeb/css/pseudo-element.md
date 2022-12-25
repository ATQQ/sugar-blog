---
sidebar:
 title: 伪元素
 step: 0
isTimeLine: true
title: 伪元素
date: 2020-09-05
tags:
 - 大前端
 - CSS
categories:
 - 大前端
---
# 伪元素
>伪元素是一个附加至选择器末的关键词，允许你对被选择元素的特定部分修改样式

## 语法
```css
selector::pseudo-element {
  property: value;
}
```

## 常用的一些伪元素
|     名称     |             作用             |   场景举例    |
| :----------: | :--------------------------: | :-----------: |
|    after     | 作为指定元素的最后一个子元素 | input框的单位 |
|    before    |  作为指定元素的第一个子元素  |  🔥超链接地址  |
|  first-line  |    改变段落首行文字的样式    | 文章首行加粗  |
| first-letter |     改变段落的首字母样式     | 每段首行大写  |

<codepen title="fake-element" src="https://codepen.io/sugarInSoup/embed/poydMpe?height=265&theme-id=dark&default-tab=css,result"></codepen>

其它更多的伪元素 [MDN:CSS伪元素](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Pseudo-elements)


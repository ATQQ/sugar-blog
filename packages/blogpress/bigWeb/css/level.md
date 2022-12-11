---
sidebar:
 title: CSS层级关系
 step: 8
isTimeLine: true
title: CSS层级关系
date: 2020-04-14
tags:
 - 大前端
 - CSS
categories:
 - 大前端
---
# CSS层级关系

>如果同个元素有两个或以上冲突的CSS规则，浏览器有一些基本的规则来决定哪一个非常特殊而胜出

1. 选择器一样的情况下后面的会覆盖前面的属性
```css
p{
    color:red;
}
p{
    color:black;
}
/* 最终黑色 */
```
2. 一个选择器越多特性，样式冲突的时候将显示它的样式
* tag(标签选择器):1
* class(类选择器):10
* id(id选择器):100
* tag行内样式:1000

**示例**
* ``body #container .active p``:1+100+10+1 = 112
* ``div p.active``:1+1+10 = 12
* ``div p``:1+1 = 2
```html
<div><p>文字显示为蓝色</p></div>
```
```css
p{
    color:green;
}
/* 1 */
div p{
    color:blue;
}
/* 1+1 = 2 */
```
**总结**
1. 继承不如指定:继承的样式永远没有指定的样式优先
2. id>class>tag>*
3. 越具体越大
4. tag#id>#id,tag.class>.class

```html
<style>
.class1 p#id2 .class3{font-size:25px}

div .class2 span#id3{font-size:18px}

#id1 .class3{font-size:14px}

.class1 #id2 .class3{font-size:12px}

#id1 #id2{font-size:10px}
</style>

<div id="id1" class="class1">
    <p id="id2" class="class2">
        <span id="id3" class="class3">我是多大字号？</span> 
        <!--  25px -->
    </p>
</div>
```


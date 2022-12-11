---
sidebar:
 title: 获取dom元素的方式
 step: 28
isTimeLine: true
title: 获取dom元素的几种方式
date: 2020-09-06
tags:
 - 大前端
 - javascript
categories:
 - 大前端
---
# 获取dom元素的几种方式
* 按使用频率排序
* 低版本浏览器 === < IE8
## 1.document.getElementById
### 简介
通过元素的`id`获取
* 存在 -- 则返回这个元素
* 不存在 -- 返回`null`

### 特点
* 如果文档中存在多个相同的id，则获取第一个
* 在一些低版本浏览器会把元素的name当做id获取
* 上下文只能是`document`

## 2.document.getElementsByClassName
### 简介
通过元素的类名获取
* 存在 -- 返回由目标元素组成的`HTMLCollectio`
* 不存在 -- 返回一个空的`HTMLCollectio`
  * `HTMLCollectio`是类数组

### 特点
* 获取的结果是一个`类数组`
* 上下文可以是`任意元素`(document或其它dom元素)
* 在一些低版本浏览器不支持

## 3.document.querySelector
### 简介
通过选择器获取`一个元素`

### 特点
* 上下文可以是`任意元素`(document或其它dom元素)
* 低版本浏览器不兼容
* 返回值是类数组

## 4.document.querySelectorAll
### 简介
通过选择器获取`一组元素`

### 特点
* 同querySelector

## 5.document.getElementsByTagName
### 简介
通过标签名获取

### 特点
* 上下文可以是`任意元素`(document或其它dom元素)
* 返回值是类数组
* 参数是标签名，不区分大小写

## 6.document.getElementsByName
### 简介
通过元素的`name`属性获取

### 特点
* 上下文只能是`document`
* 返回值是类数组
* 在IE浏览器中只能获取到表单元素，当然我们一般也只用它获取表单元素，从ie10开始可以不只是表单元素

## 7.document.body
获取`body`这个元素

## 8.document.documentElement
获取`html`这个元素

## 9.document.getElementsByTagNameNS
返回带有指定名称和命名空间的所有元素的 NodeList
```js
nodeList = document.getElementsByTagNameNS(namespace, name)
```
说实话，这个API目前在我的学习/工作中还没找到落地之处:cry::cry:

## 元素之间的继承关系

![图片](https://img.cdn.sugarat.top/mdImg/MTU5OTM2MTM2NDk5NA==599361364994)

每个元素都有对应的类，因此每个类都提供了一些方法来操作元素本身

通过类之间的继承关系，丰富元素的可操作性

由于`getElementById`与`getElementsByName`方法是在`Document`类上，于是普通元素的实例对象是没有这两方法的，所以这两方法的上下文只能是`document`

## 总结
1. 上下文只能是`document`的方法
   * getElementById
   * getElementsByName
2. 上下文为`任意元素`的方法
   * getElementsByClassName
   * getElementById
   * querySelectorAll
   * getElementsByTagName
   * getElementsByTagNameNS
3. 查询效率最高的是
   * getElementById：由于id在正常情况下是独一无二的，所以查询是很高效的
4. 返回值
   * 只有`getElementById`与`getElementById`返回对象本身
   * 其余查询方法均返回一个类数组`HTMLCollectio`


:::tip 参考 
[简书-JS获取HTML DOM元素的8种方法](https://www.jianshu.com/p/6fefda57b51f)

[MDN-Document.getElementsByTagNameNS](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/getElementsByTagNameNS)

[CSDN-HTML元素之间的继承关系](https://blog.csdn.net/ppwwp/article/details/88169145)
:::

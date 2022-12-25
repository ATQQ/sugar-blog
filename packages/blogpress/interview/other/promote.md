---
isTimeLine: true
title: 什么是提升？什么是暂时性死区？var、let及const区别？
date: 2020-03-10
tags:
 - 面试
 - 其它
categories:
 - 面试
---
# 什么是提升？什么是暂时性死区？var、let 及 const 区别？
## 什么是提升？
* 使用 var 声明的变量会被提升到作用域的顶部
* 函数也会被提升，并且优先于变量提升。
* 提升存在的根本原因就是为了解决函数间互相调用的情况

## 什么是暂时性死区？
* 不能在声明前就使用变量

## var、let 及 const 区别？
* 全局作用域下:
  * 使用 var 声明的变量会被挂载到window上
  * 使用 let 和 const 声明的变量，不会被挂载到 window 上
* var定义变量会提升,let,const不会
* 同一作用域中var允许重复声明,let,const不可以
* const 声明必须赋初值,且声明后不能改变


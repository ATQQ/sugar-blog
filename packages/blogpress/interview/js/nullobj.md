---
isTimeLine: true
title: null是对象吗
date: 2020-04-14
tags:
 - 面试
 - javascript
categories:
 - 面试
---
# null是对象吗

**null不是对象**

>虽然 typeof null 会输出 object，但是这只是 JS 存在的一个悠久 Bug。在 JS 的最初版本中使用的是 32 位系统，为了性能考虑使用低位存储变量的类型信息，000 开头代表是对象，然而 null 表示为全零，所以将它错误的判断为 object


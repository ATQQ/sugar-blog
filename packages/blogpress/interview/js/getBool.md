---
isTimeLine: true
title: 将任意类型转为Boolean的方案
date: 2020-09-11
tags:
 - 面试
 - javascript
categories:
 - 面试
---
# 将任意类型转为Boolean的方案

## 1.Boolean函数
```js
Boolean('') // false
Boolean(1) // true
```

## 2.取反两次
```js
!!'' // false
```


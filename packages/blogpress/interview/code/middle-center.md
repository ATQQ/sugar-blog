---
isTimeLine: true
title: 居中
date: 2020-05-03
tags:
 - 面试
 - 手撕代码
categories:
 - 面试
---
# 居中

**测试示例**
```html
<div class='parent'>
  <div class='child'></div>
</div>
```
```css
.parent {
  width: 200px;
  height: 100px;
  background: red;
}

.child {
  width: 20px;
  height: 20px;
  background: yellow;
}
```

## 水平居中
* 方案1
```css
.child {
  margin: 0 auto;
}
```
* 方案2
```css
.parent{
  text-align:center;
}

.child{
  display:inline-block;
}
```
* 方案3
```css
.parent{
  position:relative;
}

.child{
  position:absolute;
  left:50%;
  transform:translateX(-50%)
}
```
* 方案4
```css
.parent{
  display:flex;
  justify-content:center;
}
```
## 垂直居中
* 方法1
```css
.parent {
  position: relative;
}
.child {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}
```
* 方法2
```css
.parent {
  display:flex;
  align-items:center;
}
```
## 水平垂直居中
* 方案1
```css
.parent {
  display: flex;
  justify-content: center;
  align-items: center;
}
```
* 方案2
```css
.parent {
  position: relative;
}
.child {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
```


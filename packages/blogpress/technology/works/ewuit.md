---
title: 实现一个Web UI检测(视觉走查)工具ing
date: 2022-07-05
tags:
 - 技术笔记
 - 个人作品
categories:
 - 技术笔记
---
# 实现一个Web UI检测(视觉走查)工具ing

## 演示
废话不多先看效果，目前支持元素的测距，属性查看这两个功能

| H5                                                                                             | PC                                                                                             |
| ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| <img src="https://img.cdn.sugarat.top/mdImg/MTY0OTA4NDk4MDg4Nw==ewuit-h5.gif" width="200px" /> | <img src="https://img.cdn.sugarat.top/mdImg/MTY0OTA4MzcwNTUzNQ==ewuit-pc.gif" width="300px" /> |

## 快速体验
### 方式1
打开一个网站在控制台中执行
```js
(function () {
    var url = '//unpkg.com/ewuit@latest/dist/index.min.js'
    var script = document.createElement('script');
    script.src = url;
    document.body.appendChild(script);
    script.onload = function () { 
        const ewuit = new Ewuit()
        // open a ui tool
        ewuit.openUI()
    }
})();
```

### 方式2
在你的页面模板中加入如下脚本
```html
<script>
(function () {
    var url = '//unpkg.com/ewuit@latest/dist/index.min.js'
    var script = document.createElement('script');
    script.src = url;
    document.body.appendChild(script);
    script.onload = function () { 
        const ewuit = new Ewuit()
        // open a ui tool
        ewuit.openUI()
    }
})();
</script>
```
### 其它方式
参考 Github 上的[README](https://github.com/ATQQ/ewuit)

## 能做什么

## 背景

## 功能实现

## 其它


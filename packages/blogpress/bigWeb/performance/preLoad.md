---
isTimeLine: true
title: 资源预加载
date: 2020-04-14
tags:
 - 大前端
 - 性能优化
categories:
 - 大前端
---
# 资源预加载
某些资源不需要马上用到，但是希望尽早获取，这时候就可以使用预加载。

浏览器会将所需的资源提前请求加载到本地，后面在需要用到时就直接从缓存中读取资源。

## 使用场景
如果网页在加载完成之前,会长时间的展现为一片空白,此时可以对对一些主要内容进行加载，以提供给用户更好的体验，减少等待的时间。其它资源使用预加载技术。

## 可行的方式
### 1.link
```html
<link rel="preload" href="sourceName.suffix">
```

### 2.display:none
```html
<img src="xxx.png" style="display:none"/>
```
加载完成后通过js脚本展示


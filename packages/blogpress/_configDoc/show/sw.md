---
isTimeLine: true
title: 🤔为什么需要手动刷新本站点
date: 2020-11-28
tags:
 - 大前端
categories:
 - 其它
# sticky: 6
---

# 🤔为什么需要手动刷新本站点

当你访问站点时，如发现页面右下角有这个小窗时，请记得点一下
<div>
    <img width="400px;" src ="https://img.cdn.sugarat.top/mdImg/MTYwNjU0NzUyMDQwNg==606547520406" alt="示例"/>
</div>

## 为什么🤔
网站接入了资源离线化方案 [ServiceWorker](https://developer.mozilla.org/zh-CN/docs/Web/API/Service_Worker_API) 

通俗讲就是首次联网访问后，浏览器会把资源文件都缓存起来，用户断网后仍能访问本站点（需要用户的浏览器支持 ServiceWorker）

能提升用户的阅读体验，利用缓存也能大幅提高页面加载速率

## 如何查看是否支持🤪
1. 通过[CAN I USE](https://caniuse.com/?search=serviceworker)查询自己的终端是否支持

2. 可在DevTools(开发者调试工具) 中的 Application 面板的 ServiceWorkers的侧边栏中 看到如下内容

![图片](https://img.cdn.sugarat.top/mdImg/MTYwNjU0OTYzNDg5NQ==606549634895)

* 绿色的表示是目前正在使用的sw.js(缓存控制文件)版本
* 橙色表示已经就绪的新版本内容，等待被载入使用

💡1. 用户可以通过弹窗的引导，主动载入最新的内容

💡2. **完全**退出浏览器，重新访问本站点

以上两种方式都可实现最新内容的加载


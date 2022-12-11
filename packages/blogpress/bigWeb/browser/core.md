---
sidebar:
 title: 内核
 step: 0
isTimeLine: true
title: 浏览器-内核
date: 2020-10-26
tags:
 - 大前端
 - 浏览器
categories:
 - 大前端
---
# 内核

## 简介
浏览器最重要或者说核心的部分。

通常还有“**Rendering Engine-页面渲染引擎**”,“**Layout Engine-排版引擎**”,“**Browser Engine-浏览器引擎**”等其它叫法。

**浏览器内核**决定了浏览器如何显示网页的内容以及页面的格式信息

主要负责对网页语法（HTML，JS，CSS）的解释，标记，整理，并将排版后的发送至输出设备（显示器，打印机等）。

不同浏览器的内核实现有所差异，导致对网页编写语法的解释也有不同，因此同一网页在不同的内核的浏览器里的渲染结果也可能不同，这就抛出了常见的 “**浏览器兼容性问题**”

## 常见浏览器内核
这里不过多赘述内核的发展史，读者可以在文末的参考文章中进行拓展阅读

| 浏览器名称 |         内核         |                              补充                               |
| :--------: | :------------------: | :-------------------------------------------------------------: |
|     IE     |       Trident        |             主要包含在 window操作系统的 IE浏览器中              |
|  firefox   |        Gecko         |        Gecko的特点是代码完全公开，因此，其可开发程度很高        |
|   Safari   |        webkit        | 苹果公司自己的内核，包含WebCore排版引擎及JavaScriptCore解析引擎 |
|   chrome   | Chromium/Blink/webkit |          Blink是开源引擎WebKit中WebCore组件的一个分支           |
|   Opera    | blink/Webkit/Presto  |               现在跟随chrome的步伐，同时参与开发                |


**发展时间线**

![图片](https://img.cdn.sugarat.top/mdImg/MTYwMzYxMjcwNTI2MQ==603612705261)

**内核之间的关系**

![图片](https://img.cdn.sugarat.top/mdImg/MTYwNzc4MTYxNDEzMw==607781614133)
## 浏览器内核构成
>最开始渲染引擎和JS引擎并没有明确区分，随着不断的迭代，JS引擎越来越独立，内核更就倾向于只指渲染引擎

核心的部分是“渲染引擎”，主要包括以下线程：
### 1. GUI渲染线程
* HTML Parser 解析HTML
* CSS Parser 解析Style数据
* Layout过程，为每个可见节点的几何信息
* Painting过程，遍历Render Tree，调用UI接口绘制每个节点

### 2. JavaScript 引擎线程
负责解析Javascript脚本，运行代码

### 3. 定时触发器线程
浏览器定时计数器并不是由 JavaScript 引擎计数的, 因为 JavaScript 引擎是单线程的, 如果处于阻塞线程状态就会影响记计时的准确, 因此通过单独线程来计时并触发定时


### 4. 事件触发线程
当一个事件被触发时该线程会把事件添加到待处理队列的队尾，等待 JavaScript 引擎的处理

### 5. 异步http请求线程
XMLHttpRequest 请求会在浏览器中新开一个线程请求， 将检测到状态变更时，如果设置有回调函数，异步线程就产生状态变更事件放到 JavaScript 引擎的处理队列中

## 移动端内核
主要有：
* webkit: IOS内置浏览器，Android4.4之前
* chromium：Android4.4之后内置
* blink
* trident：~~Windows Phone 8 这个玩意儿感觉不用关注了~~
* u3: UC打造 -> UC浏览器
* x5: 腾讯打造 -> QQ浏览器，腾讯系App内置webview


## 总结
### 兼容问题
正由于内核的 `"多彩缤纷"`, 前端开发者最头疼的问题莫过于此

#### PC

最头痛的就是兼容IE,尽管js能力可以通过polyfill支持一部分，但部分样式能力的缺失是无法弥补的

#### 移动端

最头痛的就是在使用跨端开发框架时（uni-app,React Native等）样式在双端的差异有时比较大

尤其是在低版本的Android机上，需要花费大量的去做兼容测试与视图适配

**浏览器内核能力的统一，还有很长的路要走，需要一个契机**

### 现状
* google、opera拥抱的blink
* IOS拥抱webkit
* Firefox拥抱Gecko
* 微软新版Edge已经采用Chromium内核，旧版为EdgeHTML


:::tip 参考
* [维基百科-浏览器引擎](https://zh.wikipedia.org/wiki/%E6%B5%8F%E8%A7%88%E5%99%A8%E5%BC%95%E6%93%8E)
* [百度百科-浏览器内核](https://baike.baidu.com/item/%E6%B5%8F%E8%A7%88%E5%99%A8%E5%86%85%E6%A0%B8)
* [腾讯云+社区-一文看透浏览器架构](https://segmentfault.com/a/1190000018277184)
* [简书-全面了解浏览器（内核）发展史](https://www.jianshu.com/p/db1b230e3415)
:::


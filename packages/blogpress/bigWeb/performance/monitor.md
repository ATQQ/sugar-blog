---
isTimeLine: true
title: 监控
date: 2020-04-14
tags:
 - 大前端
 - 性能优化
categories:
 - 大前端
---
# 监控
一般分为三种:
* 页面埋点
* 性能监控
* 异常监控


## 页面埋点
* [PV / UV](https://blog.csdn.net/baidu_35901646/article/details/81612422)
  * ``page view`` 与 ``unique visitor``,用户访问的数量与独立访客数
* 停留时长
* 流量来源
* 用户交互

### 手写埋点
自主选择需要监控的数据然后在相应的地方写入代码。

**缺点**

工作量较大，每个需要监控的地方都得插入代码
### 无埋点
统计所有发生的事件并定时上报,然后服务端对数据进行过滤得出需要的数据

可以采用事件代理的方式监听页面中所需的事件

## 性能监控
使用[Performance API](https://developer.mozilla.org/zh-CN/docs/Web/API/Performance)来实现

**关键时间节点:** ``performance.timing`` 或者 ``performance.getEntriesByType('navigation')``

通过时间节点之间的差值,得出某个过程所花费的时间

![图片](https://img.cdn.sugarat.top/mdImg/MTU4MzgxMjk2MzI3Ng==583812963276)

|          名称          |               计算                |
| :--------------------: | :-------------------------------: |
|      DNS查询耗时       | domainLookupEnd-domainLookupStart |
|      TCP连接耗时       |      connectEnd-connectStart      |
|      内容加载耗时      |     responseEnd-connectStart      |
|        首包时间        |  responseStart-domainLookupStart  |
| 白屏时间(首次渲染时间) |      responseEnd-fetchStart       |
|     首次可交互时间     |     domInteractive-fetchStart     |
|      HTML加载完成      |   domContentLoaded - fetchStart   |
|      页面完全加载      |     loadEventStart-fetchStart     |


## 异常监控
### 代码报错
使用 ``window.onerror`` 拦截报错,可以拦截大部分详细报错信息

**特殊**
* 跨域代码显示:Script error,可以通过为script添加的crossorigin 属性解决

### 接口异常上报
* 可以通过img 标签的 src 发起一个请求


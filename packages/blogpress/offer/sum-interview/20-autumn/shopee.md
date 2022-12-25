---
isTimeLine: true
title: shopee-供应链
date: 2020-10-23
tags:
 - 备战春秋
 - 2020秋招
categories:
 - 备战春秋
---
# shopee-供应链

## 一面
### 代码题
1. 页面几乎同时发出请求，向同一个接口发出的请求，模块1是`api/list?id=1`,2是`api/list?id=2`，n是`api/list?id=n`，针对这种情况，设计一个request方法，将多次请求合并，智慧向后端发出一个请求`api/list?id=1,2,...n`
```js
const res1 = await requestUser(1)
const res2 = await requestUser(2)
const res3 = await requestUser(3)
// 我感觉这题出得有问题，用了await异步代码变同步，后两个执行 要等第一个执行完才开始

// 我觉得 当时面试官的意思是这样，因为我是按下面的理解给的解法
requestUser(1).then(res1=>{})
requestUser(2).then(res2=>{})
requestUser(3).then(res3=>{})
```

2. setTimeout(fn1,0),process.nextTick(fn2),Promise.resolve().then().then(fn3) 执行顺序
3. setTimeout(fn1,0),setImmediate(fn2)谁先执行


### 性能优化
1. 如何计算/查看页面首次可交互时间
2. 如何优化静态资源加载，有哪些方案

### JS
1. js的异步机制
2. 说一下event loop
3. 有哪些微任务
4. process.nextTick是微任务吗
5. 什么是提升，有什么作用
6. 什么是暂时性死区
7. 如果我在声明前使用let的变量会有什么问题

### Vue
1. 数据双向绑定实现原理
2. 如何监听的数组的变动
3. 事件绑定实现的原理

### 其它
1. 对MVVM，MVC，MVP架构的认识


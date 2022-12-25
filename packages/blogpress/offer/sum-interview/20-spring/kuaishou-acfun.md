---
isTimeLine: true
title: 快手-Acfun
date: 2020-10-23
tags:
 - 备战春秋
 - 2020春招
categories:
 - 备战春秋
---
# 快手-Acfun
## 一面
### 操作系统
1. 进程与线程的概念
2. 什么是死锁
3. 造成死锁的原因是什么
4. 如何解决死锁的问题
5. 如何防止死锁产生

### 计算机网络
1. OSI七层模型
2. TCP/IP参考模型
3. TCP的特性,为什么建立链接需要三次握手,断开4次挥手
4. 什么是Https
5. 简单说说TLS协议的工作流程
6. 客户端如何判断服务端下发的公钥是没有被中间人篡改的

### 数据结构
1. 如何判断两个单链表是否相交,返回相交的第一个节点,否则返回null

### JS
1. 阅读代码

**题目1**
```js
var a = 1
var obj = {
    fun:function(){
        console.log(a)
    },
    a:2
}
obj.fun() // ?
```

```js
var a = 1
function foo(){
    console.log(a) 
}
function bar(){
    var a = 2
    foo()
}
bar() // ?
```

**题目2**
```js
function foo(){}
const bar = new foo()
bar.__proto__ === // ?
foo.__proto__ === // ?
foo.prototype.constructor === // ?
```

2. 实现一个instanceOf(a,b)效果跟instanceof一样
3. 事件触发的几个阶段是什么
4. 什么是事件代理,他有什么优势
5. 什么情况下使用冒泡,或者说为什么通常在冒泡阶段执行事件
6. currentTarget与target的区别
7. 实现一个demo
html结构
```html
<ul id='list'>
    <li data-id>
        <!-- 很多子节点,但不包含li -->
    </li>
</ul>
```
要求点击li或者li中的任意子节点都能取到li上的data-id如何实现
```js
// 实现代码
```

### Vue
1. 如何实现数据双向绑定的
2. 组件之间通信有哪些方式
3. 如何监听到数组的操作的
4. 数组的哪些操作无法被监听到

### Webpack
1. 了解entry,loader,plugin的概念吗,分别做什么的
2. 用过哪些loader,plugin
3. 开发过loader,plugin吗

### Node
1. node了解吗,学过哪些相关的
2. 了解node的多进程吗,如何实现


## 二面
### 综合
1. 一个复杂的web工程，内部有很多的静态资源代码，js，css，html，image，用哪种数据结构可以准确描述所有静态资源之间的依赖关系
2. 浏览器输入URL到页面展示整个阶段发生了什么

### 手撕代码
1. 问题1
```js
斐波那契数列示例： 
1，1，2，3，5，8，13，21，34 。。。。
实现这样一个函数，得到指定位置上数列的值。
函数签名：function fib(index: number): number;
调用效果：
fib(2) => 1
fib(4) => 3

使用迭代实现
```

2. 问题2
```js
如果问题1中的参数和返回值调换一下，比如输入8得到该值在数列中的位置6，不存在则返回-1。
函数签名：function getFibIndex(value: number): number; 假定参数value大于1。
调用效果：
getFibIndex(4) => -1
getFibIndex(21) => 8
```

### 浏览器
阅读代码,10秒内用户能看到什么,并说明原因
1. 示例1
```html
<head>
    <link rel="stylesheet" href="xxx.css"> 加载耗费10s
</head>
<body>
    <p> 1 </p>
    <p> 2 </p>
</body>
```
#### 示例2
```html
<head>
</head>
<body>
    <p> 1 </p>
        <script src='xxx.js'></script> 加载耗费10s
    <p> 2 </p>
</body>
```

2. 示例2
```html
<head>
</head>
<body>
    <p> 1 </p>
        <script>
            ...code,执行了10s
        </script> 
    <p> 2 </p>
</body>
```


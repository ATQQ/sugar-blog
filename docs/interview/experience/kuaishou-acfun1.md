# 快手A站一面
## 操作系统
### 进程与线程的概念
### 什么是死锁
### 造成死锁的原因是什么
### 如何解决死锁的问题
### 如何防止死锁产生

## 计算机网络
### OSI七层模型
### TCP/IP参考模型
### TCP的特性,为什么建立链接需要三次握手,断开4次挥手
### 什么是Https
### 简单说说TLS协议的工作流程
### 客户端如何判断服务端下发的公钥是没有被中间人篡改的

## 数据结构
### 如何判断两个单链表是否相交,返回相交的第一个节点,否则返回null

## JS
### 阅读代码
#### 题1
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
#### 题目2
```js
function foo(){}
const bar = new foo()
bar.__proto__ === // ?
foo.__proto__ === // ?
foo.prototype.constructor === // ?
```

### 实现一个instanceOf(a,b)效果跟instanceof一样
### 事件触发的几个阶段是什么
### 什么是事件代理,他有什么优势
### 什么情况下使用冒泡,或者说为什么通常在冒泡阶段执行事件
### currentTarget与target的区别
### 实现一个demo
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

## Vue
### 如何实现数据双向绑定的
### 组件之间通信有哪些方式
### 如何监听到数组的操作的
### 数组的哪些操作无法被监听到

## Webpack
### 了解entry,loader,plugin的概念吗,分别做什么的
### 用过哪些loader,plugin
### 开发过loader,plugin吗

## Node
### node了解吗,学过哪些相关的
### 了解node的多进程吗,如何实现

<comment/>
<tongji/>
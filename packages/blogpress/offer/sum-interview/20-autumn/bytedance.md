---
isTimeLine: true
title: 字节跳动-商业变现-广告
date: 2020-10-23
tags:
 - 备战春秋
 - 2020秋招
categories:
 - 备战春秋
---
# 字节跳动-商业变现-广告

## 一面
### 代码题
1. 链表的插入，删除，长度计算
2. 求解最长公共子串
```js
let list = ['acccs', 'acaaa', 'ac']
// ac
```
1. [实现一个promise.All](./../../../coding/js/promiseAll.md)
```js
// 要求：必须等全部都resolved或这reject才返回
// 有一个reject就走catch
// 返回数组:（包括每一个resolved/reject的内容）
function waitAll(promises){

}
```
4. [实现bind](./../../../coding/js/myBind.md)
5. [深拷贝的有哪些实现方式,递归实现一个深拷贝](./../../../coding/js/deepClone.md)
6. 下面代码哪些if是真
```js
if([])
if({})
if([]==false)
if({}==false)
```
7. [实现一个单例模式](./../../../computerBase/design/single.md)
8. [使用ES5实现一个继承](./../../../coding/js/inherit.md)

### 计网
1. TCP、UDP的区别
2. OSI七层模型
3. 物理层传输的单位是什么
4. http1与http2的区别
5. https与http的区别
6. ajax与http的关系
5. 在浏览器中输入url发出的请求与ajax的区别
6. http包是如何到达服务器的
7. TLS工作原理
8. 客户端如何知道服务端下发的CA证书是没有被劫持篡改过的
9. 客户端如何验证CA证书是合法的
10. 我没有去主动安装这些证书，浏览器是怎么验证的
11. GET与POST区别
12. URL长度限制是多长
13. 常用请求方法
14. GET是否可以在body中放内容
15. http请求body是否有大小限制
16. 什么情况下请求方法是options

### 操作系统
1. 进程与线程的区别
2. 进程怎么并行

### 浏览器
1. [如何设置浏览器缓存](./../../../bigWeb/browser/cache.md#强缓存)
2. [什么是强缓存/协商缓存](./../../../bigWeb/browser/cache.md#缓存策略)
3. [XSS是什么？如何预防？](./../../../bigWeb/browser/safe.md#xss)

### js/css
1. [原始值类型有哪些](./../../../interview/js/primitiveType.md)
2. [如何判断变量类型](./../../../bigWeb/js/p4.md)
3. [如何判断数组](./../../../interview/js/judgeArr.md)
4. [null是对象吗，为什么](./../../../interview/js/nullobj.md)
5. [forof与forin区别](./../../../interview/js/diff-for-in-of.md)
6. [forof 与 forin在遍历顺序上是否有区别](./../../../interview/js/diff-for-in-of.md)
7. [call,bind,apply区别](./../../../bigWeb/js/apply.md)
8. [伪类](./../../../bigWeb/css/pseudo-class.md)与[伪元素](./../../../bigWeb/css/pseudo-element.md)的区别，举例用过的伪类与伪元素，以及它们的使用场景
9. [css选择器](./../../../bigWeb/css/selectors.md)用过哪些，都有什么作用
10. [如何获取一个dom对象，这几种方式哪个效率最高，为什么](./../../../bigWeb/js/getElement.md)
11. 什么是事件委托？优点是什么？
12. 如何获取指定dom的指定属性
13. 如何获取指定dom的指定样式
14. 如何获取指定dom的生效样式
15. 简述一下CSS盒模型，可以手动去改变吗

### vue
1. slot的常见用法有哪些
2. 什么是slot，他有什么作用
3. 为什么会有slot这个玩意儿

### 其它
1. TS将属相分为哪两大类
2. 你认为TS有什么优点
3. 如何在项目中引入TS，成本大吗
4. js项目迁移TS成本大吗

## 二面
### 代码
1. 实现一个深拷贝考虑对象原有的特性
```js
let a = {age:18}
let old = {p1:a,p2:a,p3:{p:a}}
function deepclone(){}
let b = deepclone(old)
// 这里原有的特性指拷贝出来的b
// 他的p1,p2,p3.p指向的是同一个对象
// 即效果
b.p1.age=10
console.log(b.p2.age) // 10
```
2. 代码阅读
```js
function a(){
    this.b = 3
}
var b = 5
var c = new a()
a.prototype.b = 4
console.log(c.b) // ?
```

3. 代码阅读
```js
for(var i = 0;i<2;i++){
    setTimeout(()=>{
        for(var j = 0;j<3;j++){
            setTimeout(()=>{
                console.log(i*j)
            },0)
        }        
    },0)
}
// 输出结果是多少？为什么
// var 变为 let 结果又是多少？为什么
```
4. 实现一个onclik事件,每点击一次造成一次内存泄露

### js/css
1. 什么是闭包？它的使用场景有哪些？举个例子（代码）
2. 内存泄漏指什么?为什么会出现？举个内存泄漏的例子（代码）
3. js的垃圾回收机制是什么？如何工作的
4. node中的js与浏览器中的js区别
5. 用node.js写服务端与用js写web 你觉得有哪些差异
6. 什么是媒体查询？使用场景
7. 混合开发APP与H5样式层面遇到过哪些差异之处说说看

### 其它
1. webpack的loader与plugin的区别是什么？为什么会有plugin，只用loader不行吗
2. 根据自己的理解，描述一下webpack是什么，（向一个不知道什么是webpack的人陈述）

## 三面
### cookie
背景：页面在a.com/index.html下，加载了一个b.com/js/demo.js脚本
1. 获取脚本的请求会附带a.com下的cookie吗
2. 这个脚本如果执行document.cookie获取到的cookie是哪个域名下
3. 如果在脚本中向b.com发送ajax请求会携带a.com下的cookie吗，为什么
4. 将a.com下的cookie发送到b.com下有哪些方案
5. 如何防止外部脚本嵌入
6. 如果需要在页面中嵌入外部的脚本，如何防止其获取到cookie
7. 说一下samesite属性的作用，他有哪些值
8. HttpOnly的作用
9. 让跨域请求携带当前域下的cookie有哪几种方式
10. 解决跨域的手段有哪些
11. 说一下jsonp的原理，如何配置
12. CROS如何配置，客户端还是服务端做配置

### http
1. http1与http2的区别
2. http2有哪些新特性
3. 多路复用如何工作的
4. 知道帧id吗？他有什么作用
5. 如果一个请求服务器要处理很久才能响应，有哪些办法在服务端处理完后,客户端能第一时间接收到
7. 知道pwa吗
8. 请求超时时间可以设置为24h吗

### 文件上传
1. 如何实现分片上传
2. 如何实现断点续传
3. 如何计算文件的md5（md5的算法）
4. 服务端如何处理上传完的分片

### 场景题
实现：一个select下拉框选择不同的选项，在其下方展示不同的内容(单个组件，组件嵌套组件等)
1. 可能有很多选项，每个选项对应的渲染内容又不一致
2. 选项与展示内容的关联关系，很可能发生变动，如何避免硬编码


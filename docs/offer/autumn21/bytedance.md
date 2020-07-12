# 字节跳动-广告-面经

## 一面
### 代码题
1. 链表的插入，删除，长度计算
2. 求解最长公共字串
```js
let list = ['acccs', 'acaaa', 'ac']
// ac
```
3. 实现一个promise.All
```js
// 要求：必须等全部都resolved或这reject才返回
// 有一个reject就走catch
// 返回数组:（包括每一个resolved/reject的内容）
function waitAll(promises){

}
```
4. 实现bind
5. 深拷贝的有哪些实现方式,递归实现一个深拷贝
6. 下面代码哪些if是真
```js
if([])
if({})
if([]==false)
if({}==false)
```
7. 实现一个单例模式
8. 使用ES5实现一个继承

### 计网
1. TCP、UDP的区别
2. OSI七层模型
3. 物理层传输的单位是什么
4. http1与http2的区别
5. https与http的区别
6. ajax与http的关系
5. 在浏览器中输入url放出的请求与ajax的区别
6. http包是如何到达服务器的
7. TLS工作原理
8.  客户端如何知道服务端下发的CA证书是没有被劫持篡改过的
9.  客户端如何验证CA证书是合法的
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
1. 如何设置浏览器缓存
2. 什么是强缓存/协商缓存
3. XSS是什么？如何预防？

### js/css
1. 原始值类型与那些
2. 如何判断变量类型
3. 如何判断数组
4. null是对象吗，为什么
5. forof与forin区别
6. forof 与 forin在遍历顺序上是否有区别
7. call,bind,apply区别
8. 伪类与伪元素的区别，举例用过的伪类与伪元素，以及它们的使用场景
9. css选择器用过哪些，都有什么作用
11. 如何获取一个dom对象，这几种方式哪个效率最高，为什么
12. 什么是事件委托？优点是什么？
13. 如何获取指定dom的指定属性
14. 如何获取指定dom的指定样式
15. 如何获取指定dom的生效样式
16. 简述一下CSS盒模型，可以手动去改变吗

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
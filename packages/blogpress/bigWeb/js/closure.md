---
sidebar:
 title: 闭包
 step: 6
isTimeLine: true
title: 闭包
date: 2020-04-14
tags:
 - 大前端
 - javascript
categories:
 - 大前端
---
# 闭包

## 定义
* 简单定义:函数 A 内部有一个函数 B，函数 B 可以访问到函数 A 中的参数与变量,那么函数 B 就是闭包
* MDN定义(理论上)
>闭包是指那些能够访问自由变量(在函数中使用的，但既不是函数参数也不是函数的局部变量的变量)的函数。
* 实践
>使创建它的上下文已经销毁，它仍然存在,在代码中引用了自由变量
垃圾回收机制没有把当前变量和参数回收掉，这样的操作带来了内存泄漏的影响

通常就是通过闭包间接访问函数内部的变量,也就是说``闭包``就是能够读取其它函数内部变量的函数
>
```js
function A() {
    let a = 1
    windos.B = function() {
        console.log(a)
    }
}
A()
B() // 1
```
```js
function a() {
    let i = 0;
    return function b(){
        console.log(++i)
    }
}
let fn = a()
fn() // 1
fn() // 2
fn() // 3
```

## 使用时期
需要重用一个变量,又要保护变量不会被污染

## 特点
* 参数与变量不会被垃圾回收机制回收

## 与作用域相比较
* 全局变量
  * 优:可重用
  * 缺:容易污染
* 局部变量
  * 优:不会被污染,仅函数内部可用
  * 缺:不可重用

## 缺点
* 比普通函数占用更多的内存。
  * 释放:将引用内层函数对象的变量赋值为null
  * 内存泄漏的影响，当内存泄漏到一定程度会影响你的项目运行变得卡顿等等问题

**内存泄露**
>指程序中己动态分配的堆内存由于某种原因程序未释放或无法释放，造成系统内存的浪费，导致程序运行速度减慢甚至系统崩溃等严重后果

## 用途
* 将一个变量长期驻扎在内存当中可用于循环取值
* 私有变量计数器,外部无法访问,避免全局变量额污染
* 重用一个变量，又保护变量不被污染的一种机制。

## 经典例题
```js
// 本意输出1 2 3 4 5
for (var i = 1; i <= 5; i++) {
  setTimeout(function timer() {
    console.log(i)
  }, i * 1000)
}
// 错误输出 6 6 6 6 6
```

* 1. 闭包解决----IIFE(立即执行函数)
```js
for (var i = 1; i <= 5; i++) {
    (function (j) {
        setTimeout(function timer() {
            console.log(j)
        }, j * 1000)
    })(i)
}
```
* 1. 闭包解决----函数嵌套
```js
for (var i = 1; i <= 5; i++) {
    function b(j){
        setTimeout(function timer() {
            console.log(j)
        }, j * 1000)
    }
    b(i)
}
```
* 2. setTimeout的第三个参数
```js
for (var i = 1; i <= 5; i++) {
    setTimeout(function timer(j) {
        console.log(j)
    }, i * 1000, i)
}
```
* 3. 使用let定义i
```js
for (let i = 1; i <= 5; i++) {
    setTimeout(function timer() {
        console.log(i)
    }, i * 1000)
}
```

## 结合[作用域链](./scopeLink.md)
```js
var data = [];
for (var i = 0; i < 3; i++) {
  data[i] = function () {
    console.log(i);
  };
}
data[0](); // 3
data[1](); // 3
data[2](); // 3
```
1. 执行到 ``data[0]`` 时
```js
globalContext = {
    VO:{
        data:[...],
        i:3
    }
}
```
2. 执行data[0]
```js
data[0]Context = {
    AO:{
        arguments:{
            length:0
        }
    },
    Scope:[AO,globalContext.VO]
}
```
3. 因为data[0]的AO中没有i,所以从 globalContext.VO 中去查找
4. data[1],data[2] 同理

**使用匿名函数包裹形成闭包**
```js
var data = [];
for (var i = 0; i < 3; i++) {
  data[i] = (function (i) {
        return function(){
            console.log(i);
        }
  })(i);
}
data[0](); // 0
data[1](); // 1
data[2](); // 2
```
1. 在执行到 ``data[0]``时
```js
globalContext = {
    VO:{
        data:[...],
        i:3
    }
}
```
2. 执行``data[0]``时
```js
data[0]Context = {
    AO:{
        arguments:{
            length:0
        }
    },
    Scope:[AO,匿名函数Context.AO,globalContext.VO]
}
匿名函数Context= {
    AO:{
        arguments:{
            0:0,
            length:1
        },
        i:0
    }
}
```
3. data[0]沿着作用域链找到了匿名函数Context.AO上的``i``,此时就不会再继续查找了
4. data[1],data[2] 同理


:::tip 参考
[JavaScript深入之闭包](https://github.com/mqyqingfeng/Blog/issues/9)
:::


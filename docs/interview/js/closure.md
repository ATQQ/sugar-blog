#  什么是闭包
## 简单定义
函数 A 内部有一个函数 B，函数 B 可以访问到函数 A 中的参数与变量,那么函数 B 就是闭包

垃圾回收机制没有把当前变量和参数回收掉，这样的操作带来了内存泄漏的影响
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

通常就是通过闭包间接访问函数内部的变量,也就是说``闭包``就是能够读取其它函数内部变量的函数

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

<comment/>
<tongji/>
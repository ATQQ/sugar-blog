---
sidebar:
 title: 简单-new实现
 step: 5
isTimeLine: true
title: 实现一下new
date: 2020-09-05
tags:
 - 手撕代码
 - javascript
categories:
 - 手撕代码
---
# 实现一下new
## new命令原理
使用new命令时，它后面的函数依次执行下面的步骤
1. <font color="#3eaf7c" weight="bold">**创建空对象**</font>：创建一个空对象，作为将要返回的对象实例
2. <font color="#3eaf7c">**连接原型**</font>：将这个空对象的原型，指向构造函数的prototype属性
3. <font color="#3eaf7c">**绑定 this**</font>：将这个空对象赋值给函数内部的this关键字
4. <font color="#3eaf7c">**返回新对象**</font>：开始执行构造函数内部的代码

## 特性
* 如果构造函数内部有return语句，而且return后面跟着一个对象，new命令会返回return语句指定的对象，否则返回这个创建的对象
* 对于普通函数（内部没有使用this关键字）则会返回一个空对象

示例
```js
function a(name){
    this.name = name
}
const d1 = new a('xm') // { name : "xm" }
d1 instanceof a // true

function b(name){
    this.name = name
    return {
        name:'abc'
    }
}
const d2 = new b('xm') // { name : "abc" }
d2 instanceof b // false

function c(){
    return 'hello world'
}

const d3 = new c() // { }
d3 instanceof c    // true
```

**按照上面的思路实现**

## myNew
```js
function myNew() {
    // 获得构造函数
    var constructor = [].shift.call(arguments)
    // 创建一个空对象，并继承构造函数的 prototype 属性
    var context = Object.create(constructor.prototype);
    // 绑定this
    var res = constructor.apply(context, arguments);
    // 如果返回结果是对象，就直接返回
    // 否则返回 context 对象
    return res instanceof Object ? res : context;
}
```
测试，得到一致的结果
```js
function a(name) {
    this.name = name
}
const d1 = myNew(a, 'xm') // { name : "xm" }
d1 instanceof a // true

function b(name) {
    this.name = name
    return {
        name: 'abc'
    }
}
const d2 = myNew(b, 'xm') // { name : "abc" }
d2 instanceof b // false

function c() {
    return 'hello world'
}

const d3 = myNew(c) // { }
d3 instanceof c    // true
```

其余写法的实现方案
```js
function myNew() {
    // 创建空对象
    let o = {}
    // 获取构造函数
    let fn = [].shift.call(arguments)
    // 连接原型
    o.__proto__ = fn.prototype
    // 绑定this
    let res = fn.apply(o, arguments)
    return res instanceof Object ? res : o
}
```

## 拓展延伸
### \__proto__属性
* 每一个js对象有一个``__proto__``属性
* ``__proto__``指向该对象的原型
* ``__proto__`` 绝大部分浏览器都支持这个非标准的方法访问原型，然而它并不存在于 xx.prototype 中，实际上，它是来自于 Object.prototype ，与其说是一个属性，不如说是一个 getter/setter，当使用 ``obj.__proto__`` 时，可以理解成返回了 `Object.getPrototypeOf(obj)`
  * 而`Object.getPrototypeOf`方法的作用是返回指定对象的原型

### Object.create
作用：创建一个新对象，使用现有的对象来提供新创建的对象的__proto__

于是可以得出下面的结论
```js
// 构造函数
function fn(){

}
const a1 = Object.create(fn.prototype)
// 等价于
const a2 = new Object()
a2.__proto__ = fn.prototype

a1.__proto__ === a2.__proto__ // true
```

### 通过new的方式创建对象与通过字面量创建的区别
* `new Object()` 方式创建对象本质上是方法调用，涉及到在原型链中查找该方法，当找到该方法后，又会生产方法调用必须的堆栈信息，方法调用结束后，还要释放该堆栈，性能不如字面量的方式
* 通过对象字面量定义对象时，不会调用Object的构造函数

**小结:** 使用字面量的方式创建对象`性能上`更好，`可读性`更高

:::tip 参考
[网道JavaScript-new 命令的原理](https://wangdoc.com/javascript/oop/new.html#new-%E5%91%BD%E4%BB%A4%E7%9A%84%E5%8E%9F%E7%90%86)
:::

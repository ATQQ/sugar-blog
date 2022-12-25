---
sidebar:
 title: 变量对象
 step: 18
isTimeLine: true
title: 变量对象
date: 2020-04-14
tags:
 - 大前端
 - javascript
categories:
 - 大前端
---
# 变量对象
每个执行上下文，都有三个重要属性：
* 变量对象(Variable object，VO)
* 作用域链(Scope chain)
* this

## 什么是变量对象?
变量对象是与执行上下文相关的数据作用域，存储了在上下文中定义的变量和函数声明。

### 全局上下文
**全局对象**
>全局对象是预定义的对象，作为 JavaScript 的全局函数和全局属性的占位符。通过使用全局对象，可以访问所有其他所有预定义的对象、函数和属性。

>在顶层 JavaScript 代码中，可以用关键字 this 引用全局对象。因为全局对象是作用域链的头，这意味着所有非限定性的变量和函数名都会作为该对象的属性来查询。

>例如，当JavaScript 代码引用 parseInt() 函数时，它引用的是全局对象的 parseInt 属性。全局对象是作用域链的头，还意味着在顶层 JavaScript 代码中声明的所有变量都将成为全局对象的属性。

**示例**
1. 客户端 js 中，全局对象就是 Window 对象
```js
console.log(this===window) // true
```
2. 全局对象是由 Object 构造函数实例化的一个对象
```js
console.log(window instanceof Object) // true
```
3. 预定义了许多函数和属性。
```js
console.log(Math.max(1,2)) // 2
console.log(this.Math.max(1,2)) // 2
```
4. window作为全局变量的宿组
```js
var a = '2'
console.log(this.a) // 2
console.log(window.a) // 2
```
5. 客户端 js 中，全局对象 window 属性指向自身。
```js
var a = 1
console.log(this.a) // 1
console.log(window.a) // 1
console.log(this.window.a) // 1
```

**总结**

全局上下文中的变量对象就是全局对象

### 函数上下文

函数上下文中使用活动对象来表示变量对象

>活动对象和变量对象本质是一个东西，只是变量对象是引擎上实现的，不可在 js 环境中访问

>当进入一个执行上下文中，这个执行上下文的变量对象才会被激活，因此被叫做活动对象，只有被激活的变量对象，即活动对象上的各种属性才能被访问。

>活动对象是在进入函数上下文时刻被创建的，它通过函数的 arguments 属性初始化。arguments 属性值是 Arguments 对象。

### 执行过程
* 分析:进入执行上下文
* 执行:代码执行

**进入执行上下文**

变量对象:

1. 函数的所有形参(函数上下文)
   * 创建一个由**名称和对应值组成的变量对象** 的属性
   * 没有实参,属性值为undefined
2. 函数声明
   * 创建一个由**名称和对应值(function-object)组成的变量对象** 的属性
   * 如果变量对象已存在相同的属性名称,则完全替换这个属性
3. 变量声明
   * 创建一个由 **名称和对应值(undefined)组成的变量对象** 的属性
   * 如果变量名跟已经声明的``形式参数``或``函数``相同，则变量声明不会干扰已经存在的这类属性

**例子**
```js
function foo(a) {
  var b = 2;
  function c() {}
  var d = function() {};
  b = 3;
}
foo(1);
```
在进入执行上下文后,此时的AO(活动对象)是
```js
AO = {
    arguments:{
        0:1,
        length:1
    },
    b:undefined,
    c:reference to function c(){},
    d:undefined
}
```

**代码执行**

在代码执行阶段，会顺序执行代码，根据代码，修改变量对象的值

---

执行完成后的结果
```js
AO = {
    arguments:{
        0:1,
        length:1
    },
    b:3,
    c:reference to function c(){},
    d:reference to FunctionExpression "d"
}
```

**总结**
* 全局上下文的变量对象初始化的是全局对象
* 函数上下文的变量对象初始化只包括``arguments``
* 在**进入执行上下文**时会给变量对象创建形参、函数声明、变量声明等初始的属性值
* 在**代码执行**阶段会再次修改变量的值
* 未进入执行阶段之前，变量对象(VO)中的属性都不能访问！但是进入执行阶段之后，变量对象(VO)转变为了活动对象(AO)，里面的属性都能被访问了，然后开始进行执行阶段的操作。


### 例子
**例1**
```js
function foo() {
    console.log(a);
    a = 1;
}
foo(); // Uncaught ReferenceError: a is not defined
function bar() {
    a = 1;
    console.log(a);
}
bar(); // 1
```
1. 进入foo中后的执行上下文,因为a没有使用``var``,所以不会出现在AO的属性上:
```js
AO = {
    arguments:{
        length:0
    }
}
```
2. 然后去全局找也没有``a``,所以会报错
3. 进入bar中后的执行上下文,``a``会出现在全局对象的属性上
4. 此时可以在全局对象的属性上找到``a``,所以输出1

**例2**
```js
console.log(foo);
function foo(){
    console.log("foo");
}
var foo = 1;
```
1. 函数提升会优先于变量提升
2. 如果变量名跟已经声明的``形式参数``或``函数``相同，则变量声明不会干扰已经存在的这类属性
3. 所以这里输出 ƒ foo(){console.log("foo");}


:::tip 参考
[JavaScript深入之变量对象](https://github.com/mqyqingfeng/Blog/issues/5)
:::


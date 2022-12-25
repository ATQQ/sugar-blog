---
sidebar:
 title: 执行上下文栈
 step: 17
isTimeLine: true
title: 执行上下文栈
date: 2020-04-14
tags:
 - 大前端
 - javascript
categories:
 - 大前端
---
# 执行上下文栈
JavaScript 引擎并非一行一行地分析和执行程序，而是一段一段地分析执行。当执行一段代码的时候，会进行一个“准备工作”(执行上下文)

**变量提升**
```js
var foo = function () {
    console.log('foo1');
}
foo();  // foo1
var foo = function () {
    console.log('foo2');
}
foo(); // foo2
```
**函数提升**
```js
function foo() {
    console.log('foo1');
}
foo();  // foo2
function foo() {
    console.log('foo2');
}
foo(); // foo2
```

## 可执行代码
* 全局代码
* 函数代码
* eval代码

## [执行上下文栈?](./eventloop.md#什么是执行栈)


## 例子
### 例子1
```js
var scope = "global scope";
function checkscope(){
    var scope = "local scope";
    function f(){
        return scope;
    }
    return f();
}
checkscope();
```
**模拟结果**
```js
stack.push(checkscope)
stack.push(f)
stack.pop() // f()
stack.pop() // checkscope()
```

### 例子2
```js
var scope = "global scope";
function checkscope(){
    var scope = "local scope";
    function f(){
        return scope;
    }
    return f;
}
checkscope()();
```
**模拟结果**
```js
stack.push(checkscope)
stack.pop() // checkscope()
stack.push(f)
stack.pop() // f()
```
:::tip 参考
[JavaScript深入之执行上下文栈](https://github.com/mqyqingfeng/Blog/issues/4)
:::


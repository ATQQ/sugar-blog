---
sidebar:
 title: 作用域链
 step: 19
isTimeLine: true
title: 作用域链
date: 2020-04-14
tags:
 - 大前端
 - javascript
categories:
 - 大前端
---
# 作用域链

>当查找变量的时候，会先从当前上下文的变量对象中查找，如果没有找到，就会从父级(词法层面上的父级)执行上下文的变量对象中查找，一直找到全局上下文的变量对象(全局对象)。这样由多个执行上下文的变量对象构成的链表就叫做**作用域链**。

## 函数创建
[**函数的作用域在函数定义的时候决定的**](./scope.md)

函数有一个内部属性 ``[[scope]]``，当函数被创建时，会保存所有父变量对象到其中，可以理解 ``[[scope]]`` 就是所有父变量对象的层级链
:::warning 提示
``[[scope]]`` 并不代表完整的作用域链！
:::

### 例子
```js
function foo() {
    function bar() {
        // ...code
    }
}
```
函数创建时各自的``[[scope]]``
```js
foo.[[scope]] = [
    globalContext.VO
]
bar.[[scope]] = [
    fooContext.AO,
    globalContext.VO
]
```

## 函数激活
当函数激活时，进入函数上下文，创建 VO/AO 后，就会将活动对象添加到作用链的前端。

这时候执行上下文的作用域链,命名为 Scope
```js
Scope = [AO].concat([[Scope]]);
```
然后,作用域链创建完毕了。

## 用于总结的例子
```js
var scope = "global scope";
function checkscope(){
    var scope2 = 'local scope';
    return scope2;
}
checkscope();
```
**执行过程**
1. 创建checkscope函数,保存作用域链到内部属性``[[scope]]``
```js
checkscope.[[scope]] = {
    globalContext.VO
}
```
2. 执行checkscope函数,创建checkscope函数的执行上下文
```js
ECstack = [
    checkscopeContext,
    globalcontext
]
```
3. 准备 checkscopeContext ,复制``[[scope]]``属性创建作用域链
```js
checkscopeContext = {
    Scope:checkscope.[[scope]]
}
```
4. 用 arguments 创建活动对象，然后初始化活动对象，``加入形参``、``函数声明``、``变量声明``
```js
checkscopeContext = {
    AO:{
        arguments:{
            length:0
        },
        scope2:undefined
    },
    Scope:checkscope.[[scope]]
}
```
5. 将活动对象压入作用域链顶端
```js
checkscopeContext = {
    AO:{
        arguments:{
            length:0
        },
        scope2:undefined
    },
    Scope:[AO,[[scope]]]
}
```
6. 完成准备,执行函数,修改AO的值
```js
checkscopeContext = {
    AO:{
        arguments:{
            length:0
        },
        scope2:'local scope'
    },
    Scope:[AO,[[scope]]]
}
```
7. 返回查找到scope2的值,函数执行完毕,弹出执行上下文栈
```js
ECstack = [
    globalcontext
]
```


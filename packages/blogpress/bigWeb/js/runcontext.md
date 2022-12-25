---
sidebar:
 title: 执行上下文
 step: 21
isTimeLine: true
title: 执行上下文
date: 2020-04-14
tags:
 - 大前端
 - javascript
categories:
 - 大前端
---
# 执行上下文

## 例1分析
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
1. 执行代码,创建全局执行的上下文,然后压入执行栈
```js
ECstack = [
    globalContext
]
```
2. 初始化全局上下文
```js
globalContext = {
    VO:[global],
    Scope:[globalContext.VO],
    this:[globalContext.VO]
}
```
3. 创建 checkscope 函数,保存作用域链 到函数的``[[scope]]``属性
```js
checkscope.[[scope]] =[
    globalContext.Vo
]
```
4. 执行 checkscope 函数,创建checkscope函数的执行上下文,然后压入 执行栈
```js
ECstack = [
    checkscopeContext,
    globalContext
]
```
5. 初始化checkscopeContext
   1. 复制作用域链``[[scope]]``
   2. 使用``arguments``对象创建活动对象
   3. 初始化活动对象
   4. 将活动对象压入作用域链顶部
```js
checkscopeContext = {
    AO:{
        arguments:{
            length:0
        },
        scope:undefined,
        f:reference to function f(){}
    },
    Scope:[AO,globalContext.Vo]
    this:undefined
}
```
6. 执行f函数,创建 f 函数的执行上下文,然后压入执行栈
```js
ECstack = [
    fContext,
    checkscopeContext,
    globalContext
]
```
7. 初始化fContext
```js
fContext = {
    AO:{
        arguments:{
            length:0
        }
    },
    Scope:[AO,checkscopeContext.VO,globalContext.VO],
    this:undefined
}
```
8. 执行f函数,沿着作用域链查找到scope,然后返回其值
9. f执行完毕,弹出执行栈
```js
ECstack = [
    checkscopeContext,
    globalContext
]
```
10. checkscope执行完毕,弹出执行栈
```js
ECStack = [
    globalContext
];
```

## 例2分析
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
1. ...未完待续


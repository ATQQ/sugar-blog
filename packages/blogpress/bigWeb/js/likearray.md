---
sidebar:
 title: 类数组与arguments
 step: 23
isTimeLine: true
title: 类数组与arguments
date: 2020-04-14
tags:
 - 大前端
 - javascript
categories:
 - 大前端
---
# 类数组与arguments
## 类数组
>拥有一个 length 属性和若干索引属性的对象

**示例**
```js
let arraylike = {
    0:1,
    1:'aaa',
    2:'ddd',
    length:3
}
```
### 读写
```js
arraylike[1] = 'abc'
console.log(arraylike[0]) // 1
console.log(arraylike[1]) // abc
console.log(arraylike.length) // 3
```
### 遍历
```js
for(let i = 0;i<arraylike.length;i++){
    console.log(arraylike[i])
}
```
### 调用数组方法
```js
Array.prototype.slice.call(arraylike,0) // [1,'aaa','ddd']
Array.prototype.join.call(arraylike,',') // 1,'aaa','ddd'
Array.prototype.map.call(arraylike,(a)=>{
    return typeof a
}) // ['number','string','string']
```
### 转数组
```js
Array.prototype.slice.call(arraylike,0)
Array.prototype.splice.call(arraylike,0)
Array.from(arraylike)
Array.prototype.concat.call([],arraylike)
```

## arguments
函数体中的Arguments对象,包括了函数的参数和其他属性
```js
function fn(a,b){
    console.log(arguments) // {0:a,1,b,length:2}
}
```
### length属性
表示**实参**的长度
```js
function fn(a,b,c){
    console.log(arguments.length)
}
fn(1) // 1
```

### callee属性
通过它可以调用函数自身。
```js
function fn(){
    console.log(arguments.callee === fn) // true
}
fn()
```
### arguments绑定对应的参数
```js
function fn(a,b,c){
    // 改变形参
    console.log(arguments[0]) // 666
    a = 1
    console.log(arguments[0]) // 1

    // 改变arguments
    console.log(b) // 555
    arguments[1] = 2
    console.log(b,arguments[1]) // 2 2

    // 未传入的值
    console.log(c) // undefined
    arguments[2] = 3
    console.log(c,arguments[2]) // undefined 3
}
fn(666,555)
```
**总结**
* 传入的参数，实参和 arguments 的值会共享
* 没有传入时，实参与 arguments 值不会共享

### 传递参数
```js
function foo(){
    return bar.apply(this,arguments)
}
function bar(a,b){
    return a+b;
}
console.log(foo(1,2)) // 3
```
:::tip 参考
[JavaScript深入之类数组对象与arguments](https://github.com/mqyqingfeng/Blog/issues/14)
:::


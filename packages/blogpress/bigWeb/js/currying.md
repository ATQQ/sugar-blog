---
sidebar:
 title: 柯里化
 step: 5
isTimeLine: true
title: 柯里化(Currying)
date: 2020-04-14
tags:
 - 大前端
 - javascript
categories:
 - 大前端
---
# 柯里化(Currying)

## 高阶函数
将函数作为参数或者返回值是函数的**函数**

* 例如

简单的分步加法函数
```js
function add(a){
    return function(b){
        return a+b
    }
}
let add1 = add(1)
add1(2) === 1+2 // true
```
``es6``写法
```js
let add = a => b => a + b
```
* 再例如
```js
function strTools(fn){
    return function(str){
        return fn(str)
    }
}
```

## 柯里化
把一个接受多个参数的函数变换成接受一个单一参数（最初函数的第一个参数）的函数，并且返回(接受剩下的参数而且返回结果的)新函数的技术。

上面的add例子就是**柯里化**的一个应用

柯里化后的函数,将第一个参数变量通过``闭包``存在了函数里面,然后原来需要``n``个参数的函数变成只需要``n-1``个参数的函数了

* 经典的栗子
```js
let add = (a, b) => a + b
console.log(add(2,3));//5
console.log(add(2,4));//6
console.log(add(2,5));//7
```
柯里化后
```js
function add(a){
    return function(b){
        return a+b
    }
}
// es6
let add = a => b => a + b

let add2 = add(2)
console.log(add2(3)) // 5
console.log(add2(4)) // 6
console.log(add2(5)) // 7
```
es6写法中n个连续箭头组成的函数实际上就是柯里化了n-1次

也就是连续箭头函数就是多次柯里化函数的es6写法

```js
let test = x => y => z => k => x + y + z + k
console.log(test(1)(2)(3)(4))//10
```

## 总结柯里化的功能
* 惰性求值
* 可以提前传递部分参数
* 参数复用

:::tip 参考
[1.js 中的多个连续的箭头函数与柯里化](https://www.zhihu.com/tardis/sogou/art/26794822)<br>
[2.详解js柯里化](https://www.jianshu.com/p/2975c25e4d71)
:::

## 一个通用的封装方法
```js
function curry(fn, ...args) {
    return fn.length > args.length ? (...args2) => curry(fn, ...args, ...args2) : fn(...args)
}

function fn(a, b, c, d) {
    console.log(a + b + c + d)
}

fn = curry(fn)
fn(1)(2)(3, 4) // 10
```


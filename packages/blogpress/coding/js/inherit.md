---
sidebar:
 title: 简单-继承实现
 step: 4
isTimeLine: true
title: 继承实现
date: 2020-09-05
tags:
 - 手撕代码
 - javascript
categories:
 - 手撕代码
---
# 继承实现

## ES6
### class

JS 中并不存在类，class 只是语法糖，本质还是函数
```js
class A{
    constructor(name){
        this.name = name
    }
    printName(){
        console.log(this.name)
    }
}

class B extends A{
    constructor(name,age){
        super(name) // A 的构造函数
        this.age = age
    }
}

let a = new B('123',0)
a.printName() // 123
```
## ES5

### 组合继承
```js
function A(name) {
    this.name = name
}
A.prototype.printName = function () {
    console.log(this.name)
}

function B(name, age) {
    A.call(this, name)
    this.age = age
}
B.prototype = new A()
B.prototype.constructor = B

let a = new B('123', 0)
a.printName() // 123
```

### 寄生组合继承
1. 
```js
function A(name) {
    this.name = name
}
A.prototype.printName = function () {
    console.log(this.name)
}

function B(name, age) {
    A.call(this, name)
    this.age = age
}
B.prototype = Object.create(A.prototype, {
    constructor: {
        value: B,
        enumerable: false,
        writable: true,
        configurable: true
    }
})

let a = new B('123', 0)
a.printName() // 123
```

2. 
```js
function A(name) {
    this.name = name
}
A.prototype.printName = function () {
    console.log(this.name)
}

function B(name, age) {
    A.call(this, name)
    this.age = age
}

function extends(child, parent) {
    const fn = function () { }
    fn.prototype = parent.prototype
    const temp = new fn()
    child.prototype = temp
    temp.constructor = child
}
extends(B, A)
let a = new B('123', 0)
a.printName() // 123
```


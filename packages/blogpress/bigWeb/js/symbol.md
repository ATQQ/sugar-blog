---
sidebar:
 title: Symbol的用法
 step: 25
isTimeLine: true
title: Symbol的用法
date: 2020-04-14
tags:
 - 大前端
 - javascript
categories:
 - 大前端
---
# Symbol 的用法

>ES6 引入的一种新的原始数据类型，表示独一无二的值。从根本上解决对象属性太多导致属性名冲突覆盖的问题

* 不能参与运算
* Symbol 值可以显式转为字符串
## 简单使用
```js
let a = Symbol()
console.log(a) // Symbol()
console.log(typeof a) // symbol
```

## 传入参数
接受一个字符串作为参数,对 Symbol 实例的描述
```js
let a = Symbol('1')
let b = Symbol('2')
console.log(a) // Symbol(1)
console.log(b) // Symbol(2)
```
相同参数的 Symbol 函数的返回值是不相等的。
```js
let a = Symbol('1')
let b = Symbol('1')
console.log(a===b) // false
```

## Stmbol.for
接受一个字符串作为参数，然后搜索有没有以该参数作为名称的 Symbol 值。如果有，就返回这个 Symbol 值，否则就新建并返回一个以该字符串为名称的 Symbol 值。

```js
let a = Symbol.for('a')
let aa = Symbol.for('a')
console.log(a === aa) // true
```

## Symbol.keyFor
返回一个已登记的 Symbol 类型值的 key
```js
let a = Symbol.for('a')
console.log(Symbol.keyFor(a)) // a

let b = Symbol('b')
console.log(Symbol.keyFor(b)) // undefined
```

## 用途
1. 作为标识符,对象属性名称
```js
let apple = Symbol()
// 第一种
let a = {}
a[apple] = 'apple'

// 第二种
let a = {
    [apple]:"apple"
}

let a = {}
Object.defineProperty(a,apple,{value:'apple'})
console.log(a[apple]) // apple
```
Symbol 作为属性名:
* 不会出现在 for...in、for...of 循环中
* 不会被 Object.keys()、Object.getOwnPropertyNames()、JSON.stringify() 返回
* 不是私有属性:Object.getOwnPropertySymbols 方法，可以获取指定对象的所有 Symbol 属性名

2. 常量
```js
let APPLE = Symbol()
let ORANGE = Symbol()
let BANANA = Symbol()
```
3. 单例模式中运用
Phone.js
```js
class Phone {
    constructor() {
        this.name = '小米'
        this.price = '1999'
    }
}

let key = Symbol.for('Phone')

if (!global[key]) {
    global[key] = new Phone()
}

module.exports = global[key]
```
test.js
```js
const p1 = require('./Phone')
const p2 = require('./Phone')
console.log(p1 === p2) // true
```

4. class里面实现私有方法/变量
User.js
```js
const AGE = Symbol()
const GET_AGE = Symbol()
class User {
    constructor(name, sex, age) {
        this.name = name
        this.sex = sex
        this[AGE] = age
        this[GET_AGE] = function () {
            return this[AGE]
        }
    }
    printAge() {
        console.log(this[GET_AGE]())
    }

}
module.exports = User
```
test.js
```js
let User = require('./User')

let u1 = new User('xm', 'M', 18)

console.log(u1.name) // xm
console.log(u1.age) // undefined
u1.printAge() // 18
```


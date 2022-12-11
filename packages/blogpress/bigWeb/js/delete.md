---
sidebar:
 title: delete
 step: 7
isTimeLine: true
title: delete
date: 2020-04-14
tags:
 - 大前端
 - javascript
categories:
 - 大前端
---
# delete
delete命令用于删除对象的属性，删除成功后返回true。

```js
let a = { key: 123 }
console.log(delete a.key) // true
console.log(a) // {}
```

delete不能删除原型链上的属性
```js
function fun() { }
fun.prototype.age = 18
let a = new fun() 
console.log(delete a.age) // true
console.log(a.age) // 18  
```

删除不存在的键
```js
let a = {}
console.log(delete a['id']);    // true
console.log(a); // {}
```

非严格模式下删除不可配置的属性
```js
let a = {}
Object.defineProperty(a, 'key', {
    value: 666,
    configurable: false
})
console.log(a.key); // 666 
console.log(delete a.key); // false
console.log(a.key); // 666
```

:::tip
* 如果你试图删除的属性不存在，那么delete将不会起任何作用，但仍会返回true
* 对于所有情况都是true，除非属性是一个自己不可配置的属性，在这种情况下，非严格模式返回 false
* delete操作不能删除任何在全局作用域中的函数（无论这个函数是来自于函数声明或函数表达式
* 在对象(object)中的函数是能够用delete操作删除的
* var 声明的属性不能从全局作用域或函数的作用域中删除
* let或const声明的属性不能够从它被声明的作用域中删除
* 不可设置的(Non-configurable)属性不能被移除
:::

## 示例
1. 自身与原型链上的具有同名属性
```js
function fn(){
    this.name = 'abc'
}
fn.prototype.name = '123'
let a = new fn()
console.log(a.name) // abc
delete a.name
console.log(a.name) // 123
delete fn.prototype.name
console.log(a.name) // undefined
```

:::tip 参考
[MDN-delete](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/delete)
:::


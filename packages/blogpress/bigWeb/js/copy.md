---
sidebar:
 title: 浅拷贝与深拷贝
 step: 29
isTimeLine: true
title: 浅拷贝与深拷贝
date: 2020-10-02
tags:
 - 大前端
 - javascript
categories:
 - 大前端
---
# 浅拷贝与深拷贝

对象类型在赋值的过程中其实是复制了地址，从而会导致改变了一方其他也都被改变的情况,解决这种问题的方法就是利用深/浅拷贝

## 什么是浅拷贝

针对对象拷贝的场景，只拷贝了第一层,深层次（大于一层）只能拷贝到对象的引用

即深层次的对象发生了变动，会影响原来的对象与被拷贝出来的新对象

```js
/**
 * 浅拷贝
 * @param {object} obj 
 */
function shallowCopy(obj) {
    // ...省略实现
}

const a = {
    name: 'xm', info: {
        age: 18
    }
}

const a1 = shallowCopy(a)
a1.name = 'a1'
a1.info.age = 20

console.log(a1.name === a.name) // false
console.log(a1.info.age === a.info.age) // true
```

### 局限性
浅拷贝只解决了第一层的问题，如果接下去的值中还有对象的话,拷贝的仍是引用

在大多数情况下，我们的对象的层级都是超过一层的

### 实现浅拷贝的方案
#### 1. Object.assign
```js
let a = { name:'xm' }
let a1 = Object.assign({},a)
a.name = 'a1'
console.log(a1.name === a.name) // false
```
#### 2. 展开运算符
```js
let a = { name: 'xm' }
let a1 = {...a}
a.name = 'a1'
console.log(a1.name === a.name) // false
```

**针对数组还有**
#### 3. Array.prototype.slice
```js
let arr = [1, 2, { name: 'xm' }]
let arr1 = Array.prototype.slice.call(arr)
```
#### 4. Array.prototype.concat
```js
let arr = [1, 2, { name: 'xm' }]
let arr1 = Array.prototype.concat.call(arr)
```

## 什么是深拷贝
* 浅拷贝只解决了第一层的问题，如果接下去的值中还有对象的话。要解决这个问题，我们就得使用深拷贝了。

### 实现深拷贝方案
#### 1. JSON.parse(JSON.stringify(object))
能应付大多数业务场景

局限：
* 忽略undefined
* 忽略symbol
* 原型链上的属性无法拷贝
* 不能处理RegExp
* 不能正确处理Date
* 不能序列化函数
* 不能处理循环引用的对象

#### 2. MessageChannel
* 异步方法
* 不能处理函数
* 可以处理undefined与循环引用

```js
function deepClone1(obj) {
    return new Promise(resolve => {
        let { port1, port2 } = new MessageChannel()
        port2.onmessage = ev => {
            resolve(ev.data)
        }
        port1.postMessage(obj)
    })
}
(async function () {
    let a = { a: 1, b: undefined, c: { d: 1 } }
    // 添加循环引用
    a.c.d = a.c
    let b = await deepClone1(a)
    console.log(b)
})()
```

#### 3. 手动实现一个较完整的深拷贝

戳→ [实现深拷贝](./../../coding/js/deepClone.md) ←文章


---
sidebar:
 title: 中等-实现深拷贝
 step: 12
isTimeLine: true
title: 实现深拷贝
date: 2020-09-01
tags:
 - 手撕代码
 - javascript
categories:
 - 手撕代码
---
# 实现深拷贝

## 简介
对象类型在赋值的过程中其实是复制了地址，从而会导致改变了一方其他也都被改变的情况,解决这种问题的方法就是利用深/浅拷贝

浅拷贝可以直接使用扩展运算符(...)或者Object.assign直接处理

而深拷贝就没有现成的函数了

在业务开发中通常使用 `JSON.parse(JSON.stringify(data))` 应付大多数的深拷贝场景

但面试就一般考察使用递归去实现一个深拷贝

## 常见边界问题
* `循环引用`
* `函数`
* `正则`
* `日期`
* `symbol`
* `多个键值引用了同一个对象，保持拷贝后的特性一致`
* ...

## 1. 简单递归实现
不考虑边界问题,元素只有 值类型，obj，arr

```js
function deepClone(obj) {
    if (!isObject(obj)) return obj
    if (Array.isArray(obj)) {
        const newObj = []
        for (const v of obj) {
            newObj.push(isObject(v) ? deepClone(v) : v)
        }
        return newObj
    }
    if (isObject(obj)) {
        const newObj = {}
        Object.keys(obj).forEach(k => {
            const v = obj[k]
            newObj[k] = isObject(v) ? deepClone(v) : v
        })
        return newObj
    }
}

const a = {
    name: 'xiaoming', id: 123131, info: {
        bd: '2020-01-01',
        cards: [{
            q: 'q',
            w: [1, 2, 3],
            e: { c: 'c' }
        }]
    }
}

console.log(JSON.stringify(deepClone(a)));
```

## 2. 解决循环引用
众所周知 使用JSON进行深拷贝是无法解决对象的循环引用,如果出现了会直接报错

可以使用哈希表来解决此问题，将已存在的对象记录下来

对上面的deepclone稍加改动

```js
function deepClone(obj) {
    const map = new WeakMap()

    const dp = (obj) => {
        if (!isObject(obj)) return obj
        // 解决循环引用
        if (map.has(obj)) return map.get(obj)
        map.set(obj, Array.isArray(obj) ? [] : {})

        if (Array.isArray(obj)) {
            const newObj = []
            for (const v of obj) {
                newObj.push(isObject(v) ? dp(v) : v)
            }
            return newObj
        }
        if (isObject(obj)) {
            const newObj = {}
            Object.keys(obj).forEach(k => {
                const v = obj[k]
                newObj[k] = isObject(v) ? dp(v) : v
            })
            return newObj
        }
    }
    return dp(obj)
}

const b = {}, c = {}
b.next = c
c.next = b

console.log(deepClone(b)); // { next: { next: {} } }
```

## 3. 保持原对象的引用的特性
```js
function deepClone(obj) {
    const map = new WeakMap()

    const dp = (obj) => {
        if (!isObject(obj)) return obj
        // 已经clone过的对象直接返回
        if (map.has(obj)) return map.get(obj)
        // 解决循环引用
        map.set(obj, Array.isArray(obj) ? [] : {})

        if (Array.isArray(obj)) {
            const newObj = []
            for (const v of obj) {
                newObj.push(isObject(v) ? dp(v) : v)
            }
            // 将已拷贝后的对象存储起来
            map.set(obj, newObj)
            return newObj
        }
        if (isObject(obj)) {
            const newObj = {}
            Object.keys(obj).forEach(k => {
                const v = obj[k]
                newObj[k] = isObject(v) ? dp(v) : v
            })
            // 将已拷贝后的对象存储起来
            map.set(obj, newObj)
            return newObj
        }
    }
    return dp(obj)
}

const obj = { a: 1 }
const t3 = { a: obj, d: obj, f: { g: obj } }
const tt3 = deepClone(t3)
console.log(tt3); // { a: { a: 1 }, d: { a: 1 }, f: { g: { a: 1 } } }
console.log(tt3.a === tt3.d); // true
console.log(tt3.a === tt3.f.g); // true
```

## 4. 拷贝Symbol
这里最主要的是如何获取到到对象的Symbol键

获取对象的键的方案有以下几种
* `Reflect.ownKeys(target)`: 方法返回一个由目标对象自身的属性键组成的数组(`包含普通键与Symbol键`)
* `Object.getOwnPropertySymbols(target)`：返回一个给定对象自身的`所有 Symbol 属性`的数组
* `Object.getOwnPropertyNames(target)`：返回一个由指定对象的所有自身属性的属性名（`包括不可枚举属性`但`不包括Symbol值作为名称的属性`）组成的数组
* `Object.keys()`：返回一个由一个给定对象的`自身可枚举属性`组成的数组，数组中属性名的排列顺序和正常循环遍历该对象时返回的顺序一致

综上

```js
Reflect.ownKeys(target) 
// 等价于
Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target))
```

再稍加改动一下我们的deepClone方法，这里我们直接采用`Reflect.ownKeys(target)`替代原来的`Object.keys(targer)`

```js
function deepClone(obj) {
    const map = new WeakMap()

    const dp = (obj) => {
        if (!isObject(obj)) return obj
        // 已经clone过的对象直接返回
        if (map.has(obj)) return map.get(obj)
        // 解决循环引用
        map.set(obj, Array.isArray(obj) ? [] : {})

        if (Array.isArray(obj)) {
            const newObj = []
            for (const v of obj) {
                newObj.push(isObject(v) ? dp(v) : v)
            }
            // 将已拷贝后的对象存储起来
            map.set(obj, newObj)
            return newObj
        }
        if (isObject(obj)) {
            const newObj = {}
            // 使用Reflect.ownKeys替换
            Reflect.ownKeys(obj).forEach(k => {
                const v = obj[k]
                newObj[k] = isObject(v) ? dp(v) : v
            })
            // 将已拷贝后的对象存储起来
            map.set(obj, newObj)
            return newObj
        }
    }
    return dp(obj)
}
const s1 = Symbol.for('s1')
const s2 = Symbol.for('s2')

const data = {
    [s1]: {
        name: 's1',
        age: 19
    },
    [s2]: [1, 2, 'string', {
        title: s1
    }]
}
console.log(deepClone(data));
// { [Symbol(s1)]: { name: 's1', age: 19 },
//   [Symbol(s2)]: [ 1, 2, 'string', { title: Symbol(s1) } ] }
```


## 5. 拷贝特殊对象Date/RegExp

对于特殊的对象，我们可以通过以下几步去处理
* 获取对象的构造函数
* 判断是否是指定的特殊对象
* 调用构造函数生成一个新的对象

实例化的对象可以通过`.constructor`获取到其构造函数

我们修改上面的clone方法

```js

function deepClone(obj) {
    const map = new WeakMap()

    const dp = (obj) => {
        if (!isObject(obj)) return obj
        // 已经clone过的对象直接返回
        if (map.has(obj)) return map.get(obj)
        // 解决循环引用
        map.set(obj, Array.isArray(obj) ? [] : {})
        // 获取对象的构造函数
        const fn = obj.constructor
        // 如果是正则
        if (fn === RegExp) {
            return new RegExp(obj)
        }
        // 如果是日期
        if (fn === Date) {
            return new Date(obj.getTime())
        }

        if (Array.isArray(obj)) {
            const newObj = []
            for (const v of obj) {
                newObj.push(isObject(v) ? dp(v) : v)
            }
            // 将已拷贝后的对象存储起来
            map.set(obj, newObj)
            return newObj
        }
        if (isObject(obj)) {
            const newObj = {}
            // 使用Reflect.ownKeys替换
            Reflect.ownKeys(obj).forEach(k => {
                const v = obj[k]
                newObj[k] = isObject(v) ? dp(v) : v
            })
            // 将已拷贝后的对象存储起来
            map.set(obj, newObj)
            return newObj
        }
    }
    return dp(obj)
}

const data = {
    today: new Date(),
    reg: /^abc$/ig
}
console.log(deepClone(data)); // { today: 2020-09-01T08:45:26.907Z, reg: /^abc$/gi }
```

## 拷贝函数

函数拷贝的方案在网上收集了一下五花八门，各种奇淫技巧，下面给大家列举一下哈哈

1. 使用eval：
   * eval(fn.toString())：只支持箭头函数
   * new Function(‘return’+fn.toString())():不能将函数及其原始作用域一起克隆
2. fn.bind()：返回的新函数无法再通过bind去改变this指向

```js
// 我这里就简单的使用.bind

function deepClone(obj) {
    const map = new WeakMap()

    const dp = (obj) => {
        if (!isObject(obj)) return obj
        // 已经clone过的对象直接返回
        if (map.has(obj)) return map.get(obj)
        // 解决循环引用
        map.set(obj, Array.isArray(obj) ? [] : {})
        // 获取对象的构造函数
        const fn = obj.constructor
        // 如果是正则
        if (fn === RegExp) {
            return new RegExp(obj)
        }
        // 如果是日期
        if (fn === Date) {
            return new Date(obj.getTime())
        }
        // 如果是函数
        if (fn === Function) {
            return obj.bind({})
        }
        if (Array.isArray(obj)) {
            const newObj = []
            for (const v of obj) {
                newObj.push(isObject(v) ? dp(v) : v)
            }
            // 将已拷贝后的对象存储起来
            map.set(obj, newObj)
            return newObj
        }
        if (isObject(obj)) {
            const newObj = {}
            // 使用Reflect.ownKeys替换
            Reflect.ownKeys(obj).forEach(k => {
                const v = obj[k]
                newObj[k] = isObject(v) ? dp(v) : v
            })
            // 将已拷贝后的对象存储起来
            map.set(obj, newObj)
            return newObj
        }
    }
    return dp(obj)
}

const data = {
    today: new Date(),
    reg: /^abc$/ig,
    fn1: (a, b) => {
        console.log(this.today);
        console.log(a + b);
    },
    fn2: function (a, b) {
        console.log(this.reg);
        console.log(a + b);
    }
}

const newData = deepClone(data)
newData.fn1(1, 2) // undefined 3
newData.fn1.call({ today: '666' }, 1, 2) // undefined 3
newData.fn2(3, 4) // /^abc$/gi  7
newData.fn2.call({ reg: 123 }, 3, 4) // 123 7
const fn2 = newData.fn2
fn2.call({ reg: 'fn2Call' }, 2, 3) // fn2Call 5
const fn3 = fn2.bind({ reg: 'string' })
fn3(2, 3) // string 5
```

更详细的内容大家可以细品一下这篇[文章](https://stackoverflow.com/questions/1833588/javascript-clone-a-function)

关于深拷贝完整实现 可以研究一下 [lodash.cloneDeep](https://www.lodashjs.com/docs/lodash.cloneDeep)，[源码](https://github.com/lodash/lodash/blob/master/.internal/baseClone.js)


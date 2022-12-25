---
sidebar:
 title: 响应式基本原理
 step: 0
isTimeLine: true
title: 响应式的基本原理
date: 2020-04-14
tags:
 - 大前端
 - vue
categories:
 - 大前端
---
# 响应式的基本原理
Vue3.0 中将会通过 Proxy 来替换原本的 Object.defineProperty 来实现数据响应式

## vue2.x版本
使用``Object.defineProperty`` 来实现数据响应式

通过定义对象的get与set行为来实现的
### 使用示例
```html
    <h1 id="test1">0</h1>
    <button id="add">add</button>
```
```js
let obj = {
    value: 0
}
let v = obj.value;
let test1 = document.getElementById('test1')
Object.defineProperty(obj, 'value', {
    get: function () {
        return v
    },
    set: function (value) {
        v = value
        test1.textContent = value
    }
})
document.querySelector('#add').addEventListener('click', function () {
    obj.value++;
})
```
### 封装成watch方法
```js
function watch(obj, key, callback) {
    let v = obj[key]
    Object.defineProperty(obj, key, {
        get: function () {
            return v
        },
        set: function (newValue) {
            v = newValue
            callback(v)
        }
    })
}
```
```html
    <h1 id="test1">0</h1>
    <h1 id="test2">0</h1>
    <button id="add">add</button>
```
```js
let obj = {
    value1: 0,
    value2: 2
}
let test1 = document.getElementById('test1')
let test2 = document.getElementById('test2')
watch(obj, 'value1', (res) => {
    test1.textContent = res
})
watch(obj, 'value2', (res) => {
    test2.textContent = res
})
document.querySelector('#add').addEventListener('click', function () {
    obj.value1++;
    obj.value2 *= 2;
})
```

### 模拟实现observe
将普通对象转化为响应式对象
```js
// 重定义数组的常规方法
const originProto = Array.prototype
const newArrayProto = Object.create(originProto)

    ;['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach(method => {
        newArrayProto[method] = function () {
            // 先执行本来的操作
            originProto[method].apply(this, arguments)
            // 新数据也变为响应式
            for (const v of arguments) {
                observe(v)
            }
            // 通知更新视图
            notifyUpdate()
        }
    })
/**
 * 将普通对象变为响应式对象
 * @param {object} obj 
 */
function observe(obj) {
    // 如果不是对象直接返回
    if (obj === null || typeof obj !== 'object') {
        return obj
    }

    // 如果是数组替换其原型
    if (Array.isArray(obj)) {
        Object.setPrototypeOf(obj, newArrayProto)
        for (const v of obj) {
            observe(v)
        }
    } else {
        // 定义每个属性的get与set方法
        const keys = Object.keys(obj)
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            // 对每个key都进行拦截
            defineReactive(obj, key, obj[key])
        }
    }
}

/**
 * 定义指定key的get与set
 * @param {object} obj 
 * @param {string} key 
 * @param {any} val 
 */
function defineReactive(obj, key, val) {
    // 递归遍历
    // val可能也是对象
    observe(val)
    Object.defineProperty(obj, key, {
        get() {
            // 进行依赖搜集
            return val
        },
        set(newVal) {
            // 新的值可能也是对像
            observe(newVal)
            // 通知更新视图
            notifyUpdate()
        }
    })
}

/**
 * 通知视图更新
 */
function notifyUpdate() {
    // ...code
    console.log('更新视图')
    // ...code
}
```

### 测试
```js
// ------testCode-------
const data = {
    name: 'xm',
    info: {
        age: 18,
        id: 23
    },
    children: [
        { name: 'a', age: 18 },
        { name: 'b', age: 20 }
    ]
}
// 变为响应式对象
observe(data)

data.name = 'xxmm' // 更新视图
data.info.age = 20 // 更新视图
data.info = { // 更新视图
    age: 30,
    id: 32
}
data.children[0].name = 'aa' // 更新视图
data.children.push({ name: 'c', age: 17 }) // 更新视图
data.children[2].name = 'cc' // 更新视图

data.children[1] = { // 不更新
    name: 'ccc',
    age: 38
}
data.children[3] = { // 不更新
    name: 'ee',
    age: 33
}
```
### 存在的问题
1. 需要响应的数据较大时，递归存在性能问题
2. 新增或者删除属性无法被监听
```js
data.newKey = {
    a:1
}
delete data.name
```
3. 数组
   1. 响应需要额外的实现
   2. 修改有语法限制，不能通过下标索引直接进行新增与修改

## vue3.x
使用``defineProperty``只能定义属性的``get``与``set``等行为

``es6``提供了``proxy``(代理),可以自定义更多的行为(13种),可以参考[es6相关电子书籍](https://es6.ruanyifeng.com/#docs/proxy#Proxy-%E5%AE%9E%E4%BE%8B%E7%9A%84%E6%96%B9%E6%B3%95)
### 简单使用
```html
 <h1 id="title1">0</h1>
<button id="add">add</button>
```
```js
let obj = {
    num: 0
}
let p = new Proxy(obj, {
    set(target, property, value) {
        target[property] = value;
        if (property === 'num') {
            document.getElementById('title1').textContent = value
        }
    }
})

document.getElementById('add').addEventListener('click', function () {
    p.num++;
})
```

### 封装成watch方法
```js
function watch(obj, callback) {
    return new Proxy(obj, {
        set(target, key, value) {
            target[key] = value
            callback(key, value)
        },
        get(target, key) {
            return target[key]
        }
    })
}
```

```html
<h1 id="title1">0</h1>
<button id="add">add</button>
```
```js
let obj = {
    num: 0
}
let p = watch(obj, (key, value) => {
    if (key === 'num') {
        document.getElementById('title1').textContent = value
    }
})
document.getElementById('add').addEventListener('click', function () {
    p.num++;
})
```

### 模拟实现reactive
```js
function isObject(obj) {
    return typeof obj === 'object' && obj !== null
}
// 用于缓存
const toProxy = new WeakMap()
const toRaw = new WeakMap()

// 依赖收集：建立target.key和响应函数之间对应关系 
const effectStack = []

// 映射关系表 target->key->[fn1,fn2,...]
const targetsMap = new WeakMap()

/**
 * 依赖搜集
 * @param {object} target 
 * @param {string} key 
 */
function track(target, key) {
    // 从栈中取出响应函数
    const activeEffect = effectStack[effectStack.length - 1]
    if (activeEffect) {
        // 获取target的依赖列表
        let depsMap = targetsMap.get(target)
        if (!depsMap) { // 不存在则创建
            targetsMap.set(target, (depsMap = new Map()))
        }
        // 获取key对应的响应函数列表
        let dep = depsMap.get(key)
        if (!dep) { // 不存在则创建
            depsMap.set(key, (dep = new Set()))
        }
        // 不存在则将新的响应函数加入对应的集合
        if (!dep.has(activeEffect)) {
            dep.add(activeEffect)
        }
    }
}

/**
 * 触发响应函数
 * @param {object} target 
 * @param {string} type 
 * @param {String} key 
 */
function trigger(target, type, key) {
    // 获取依赖列表
    const depsMap = targetsMap.get(target)
    if (depsMap) {
        // 获取响应函数集合
        const deps = depsMap.get(key)
        const effects = new Set()
        if (deps) {
            // 添加所有的响应函数到一个新的集合
            deps.forEach(effect => {
                effects.add(effect)
            })
        }

        // 特殊处理数组元素的新增与删除
        if (type === 'ADD' || type === 'DELETE') {
            if (Array.isArray(target)) {
                const deps = depsMap.get('length')
                if (deps) {
                    deps.forEach(effect => {
                        effects.add(effect)
                    })
                }
            }
        }

        // 执行effects
        effects.forEach(effect => effect())
    }
}

/**
 * 将普通对象转换成响应式对象
 * @param {object} obj 
 */
function reactive(obj) {
    if (!isObject(obj)) {
        return obj
    }
    // 取出缓存
    if (toProxy.has(obj)) {
        return toProxy.get(obj)
    }
    if (toRaw.has(obj)) {
        return obj
    }

    const observed = new Proxy(obj, {
        get(target, key, receiver) {
            const v = Reflect.get(target, key, receiver)
            // console.log(`获取${key}:${target[key]}`);
            // 依赖收集
            track(target, key)
            return isObject(v) ? reactive(v) : v
        },
        set(target, key, value, receiver) {
            const isOwnProperty = target.hasOwnProperty(key)
            const oldVal = target[key]
            const v = Reflect.set(target, key, value, receiver)
            // console.log(`设置${key}:${value}`);

            if (!isOwnProperty) {
                console.log(`新增${key}:${value}`);
                trigger(target, 'ADD', key)
            } else if (oldVal !== value) {
                console.log(`设置${key}:${value}`);
                trigger(target, 'SET', key)
            }
            return v
        },
        deleteProperty(target, key) {
            const isOwnProperty = target.hasOwnProperty(key)
            const v = Reflect.deleteProperty(target, key)
            if (v && isOwnProperty) {
                console.log(`删除${key}属性`);
                trigger(target, 'DELETE', key)
            }
            return v
        }
    })

    // 缓存
    toProxy.set(obj, observed)
    toRaw.set(observed, obj)

    return observed
}

```
### 模拟effect
```js
/**
 * 模拟effect任务
 * @param {function} fn 
 */
function effect(fn) {
    const wapperEffect = function (...args) {
        return run(wapperEffect, fn, args)
    }
    wapperEffect()

    return wapperEffect
}

/**
 * 执行包装函数
 * @param {function} effect 
 * @param {function} fn 
 * @param {any[]} args 
 */
function run(effect, fn, args) {
    try {
        effectStack.push(effect)
        // 收集依赖
        return fn(...args)
    } finally {
        effectStack.pop()
    }
}
```
### 测试
```js
// --------testReactive-----------
const data = {
    name: 'xm',
    info: {
        age: 18,
        id: 23
    },
    children: [
        { name: 'a', age: 18 },
        { name: 'b', age: 20 }
    ]
}

const rData = reactive(data)
// --------testEffect--------
effect(() => {
    // afterUpdate
    console.log('info age 发生了变化', rData.info.age);
    // ...more code
})

rData.info.age = 100

// -------------testResponsive----------
console.log(rData === reactive(rData));// true

// 更新已存在属性
rData.name = 'xxmm'
rData.children.push({ name: 'c', age: 22 })
rData.children[0].age = 20
rData.info.age = 20
rData.info = { age: 20, id: 999 }
rData.info.id = 0

// 新增不存在的属性
rData.name2 = 'name22222'

// 删除指定的属性
delete rData.name
```

:::tip 参考
[冴羽大大:ES6 系列之 defineProperty 与 proxy](https://github.com/mqyqingfeng/Blog/issues/107)<br>
[阮一峰:ECMAScript 6 入门](https://es6.ruanyifeng.com/#docs/proxy#Proxy-%E5%AE%9E%E4%BE%8B%E7%9A%84%E6%96%B9%E6%B3%95)
[vue-next:reactive.ts](https://github.com/vuejs/vue-next/blob/master/packages/reactivity/src/reactive.ts)
:::


# Vue中的数据绑定
Vue3.0 中将会通过 Proxy 来替换原本的 Object.defineProperty 来实现数据响应式

## vue2.x版本
使用``Object.defineProperty`` 来实现数据响应式
### 简单使用
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
### 封装一个通用一点的watch函数
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

### 封装成通用的watch
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

:::tip 参考
[冴羽大大:ES6 系列之 defineProperty 与 proxy](https://github.com/mqyqingfeng/Blog/issues/107)<br>
[阮一峰:ECMAScript 6 入门](https://es6.ruanyifeng.com/#docs/proxy#Proxy-%E5%AE%9E%E4%BE%8B%E7%9A%84%E6%96%B9%E6%B3%95)
:::

<comment/>
<tongji/>
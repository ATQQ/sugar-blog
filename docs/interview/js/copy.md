# 浅拷贝与深拷贝

对象类型在赋值的过程中其实是复制了地址，从而会导致改变了一方其他也都被改变的情况,解决这种问题的方法就是利用深/浅拷贝
## 什么是浅拷贝?
* 拷贝一层,深层次只能拷贝对象的引用
* 浅拷贝只解决了第一层的问题，如果接下去的值中还有对象的话,拷贝的仍是引用

## 如何实现浅拷贝?
* ``Object.assign``
* 展开运算符``...``

**针对数组还有**
* Array.prototype.slice
* Array.prototype.concat

```js
let a ={p:666}
let b = {...a}
let c = Object.assign({},a)
b.p=111
c.p=222
console.log(a,b,c)

let arr1 = [1, 2, { name: 'xm' }]
let arr2 = [...arr1]
let arr3 = Object.assign([], arr1)
let arr4 = Array.prototype.slice.call(arr1)
let arr5 = Array.prototype.concat.call(arr1)
```

## 什么是深拷贝?
* 浅拷贝只解决了第一层的问题，如果接下去的值中还有对象的话。要解决这个问题，我们就得使用深拷贝了。

## 如何实现深拷贝?
### JSON.parse(JSON.stringify(object))
>能应付大多数业务场景

* 忽略undefined
* 忽略symbol
* 原型链上的属性无法拷贝
* 不能处理RegExp
* 不能正确处理Date
* 不能序列化函数
* 不能处理循环引用的对象

### MessageChannel
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

### 递归实现一个简单的deepClone
```js
function isObject(obj) {
    return obj && (typeof obj === 'object' || typeof obj === 'function')
}

function deepClone(obj) {
    let newObj = obj
    if(Array.isArray(obj)){
        newObj = []
        for(let v of obj){
            newObj.push(isObject(v)?deepClone(obj):v)
        }
    }else if(isObject(obj)){
        newObj = {}
        Object.keys(obj).forEach(key=>{
            newObj[key] = isObject(obj[key]) ? deepClone(obj[key]) : obj[key]
        })
    }
    return newObj
}

let a = { b: 1, d: { e: 0 }, h: [1, 2, { i: 3 }] }

let b = deepClone(a)
console.log(b)
```

<comment/>
<tongji/>